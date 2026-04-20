import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as mockApi from "@/mocks/mockApi";

const queryKeys = {
  authMe: ["mock", "auth", "me"] as const,
  posts: ["mock", "posts"] as const,
  postDetail: (id: number) => ["mock", "posts", "detail", id] as const,
  comments: (postId: number) => ["mock", "comments", postId] as const,
  guides: (input?: unknown) => ["mock", "guides", input ?? {}] as const,
  profile: ["mock", "profile"] as const,
  myPosts: ["mock", "profile", "myPosts"] as const,
};

type MutationHandlers<TData, TVariables> = {
  onSuccess?: (data: TData, variables: TVariables, context: unknown) => void | Promise<void>;
  onError?: (error: unknown, variables: TVariables, context: unknown) => void;
};

function createMutationHook<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  invalidate: (queryClient: ReturnType<typeof useQueryClient>) => Promise<void> | void
) {
  return (options?: MutationHandlers<TData, TVariables>) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn,
      onSuccess: async (data, variables, context) => {
        await invalidate(queryClient);
        await options?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        options?.onError?.(error, variables, context);
      },
    });
  };
}

export const api = {
  auth: {
    me: {
      useQuery: (_input?: unknown, options?: Record<string, unknown>) =>
        useQuery({
          queryKey: queryKeys.authMe,
          queryFn: () => mockApi.getCurrentUser(),
          ...(options ?? {}),
        }),
    },
    login: {
      useMutation: createMutationHook(mockApi.login, async (queryClient) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeys.authMe }),
          queryClient.invalidateQueries({ queryKey: queryKeys.profile }),
          queryClient.invalidateQueries({ queryKey: queryKeys.myPosts }),
        ]);
      }),
    },
    logout: {
      useMutation: createMutationHook(mockApi.logout, async (queryClient) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeys.authMe }),
          queryClient.invalidateQueries({ queryKey: queryKeys.profile }),
          queryClient.invalidateQueries({ queryKey: queryKeys.myPosts }),
        ]);
      }),
    },
  },
  posts: {
    list: {
      useQuery: (input?: Parameters<typeof mockApi.listPosts>[0], options?: Record<string, unknown>) =>
        useQuery({
          queryKey: [...queryKeys.posts, input ?? {}],
          queryFn: () => mockApi.listPosts(input),
          ...(options ?? {}),
        }),
    },
    getById: {
      useQuery: (
        input: Parameters<typeof mockApi.getPostById>[0],
        options?: Record<string, unknown>
      ) =>
        useQuery({
          queryKey: queryKeys.postDetail(input.id),
          queryFn: () => mockApi.getPostById(input),
          ...(options ?? {}),
        }),
    },
    create: {
      useMutation: createMutationHook(mockApi.createPost, async (queryClient) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
          queryClient.invalidateQueries({ queryKey: queryKeys.myPosts }),
        ]);
      }),
    },
  },
  comments: {
    listByPost: {
      useQuery: (
        input: Parameters<typeof mockApi.listCommentsByPost>[0],
        options?: Record<string, unknown>
      ) =>
        useQuery({
          queryKey: queryKeys.comments(input.postId),
          queryFn: () => mockApi.listCommentsByPost(input),
          ...(options ?? {}),
        }),
    },
    create: {
      useMutation: createMutationHook(mockApi.createComment, async (queryClient) => {
        await queryClient.invalidateQueries({ queryKey: ["mock", "comments"] });
        await queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      }),
    },
  },
  guides: {
    list: {
      useQuery: (input?: Parameters<typeof mockApi.listGuides>[0], options?: Record<string, unknown>) =>
        useQuery({
          queryKey: queryKeys.guides(input),
          queryFn: () => mockApi.listGuides(input),
          ...(options ?? {}),
        }),
    },
  },
  profile: {
    get: {
      useQuery: (_input?: unknown, options?: Record<string, unknown>) =>
        useQuery({
          queryKey: queryKeys.profile,
          queryFn: () => mockApi.getProfile(),
          ...(options ?? {}),
        }),
    },
    myPosts: {
      useQuery: (_input?: unknown, options?: Record<string, unknown>) =>
        useQuery({
          queryKey: queryKeys.myPosts,
          queryFn: () => mockApi.listMyPosts(),
          ...(options ?? {}),
        }),
    },
    upsert: {
      useMutation: createMutationHook(mockApi.upsertProfile, async (queryClient) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeys.authMe }),
          queryClient.invalidateQueries({ queryKey: queryKeys.profile }),
          queryClient.invalidateQueries({ queryKey: queryKeys.myPosts }),
          queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
          queryClient.invalidateQueries({ queryKey: ["mock", "comments"] }),
        ]);
      }),
    },
  },
  translate: {
    text: {
      useMutation: createMutationHook(mockApi.translateText, async () => undefined),
    },
  },
};
