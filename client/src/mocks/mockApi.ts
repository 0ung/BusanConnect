import {
  defaultMockDatabase,
  type MockComment,
  type MockDatabase,
  type MockGuideSpot,
  type MockLanguage,
  type MockPost,
  type MockPostCategory,
  type MockProfile,
  type MockProvider,
  type MockTranslationResult,
  type MockUser,
} from "@/mocks/mockData";

const STORAGE_KEY = "busan-visited.mock-db";
const NETWORK_DELAY_MS = 120;

type ListPostsInput = {
  limit?: number;
  offset?: number;
  category?: MockPostCategory;
};

type GetPostByIdInput = {
  id: number;
};

type CreatePostInput = {
  title: string;
  content: string;
  category: MockPostCategory;
  originalLanguage: MockLanguage;
};

type ListCommentsInput = {
  postId: number;
};

type CreateCommentInput = {
  postId: number;
  content: string;
  originalLanguage: MockLanguage;
};

type ListGuidesInput = {
  category?: MockGuideSpot["category"];
};

type UpsertProfileInput = {
  nickname: string;
  bio: string;
  preferredLanguage: MockLanguage;
};

type TranslateTextInput = {
  text: string;
  sourceLanguage: MockLanguage;
  targetLanguage: MockLanguage;
};

type LoginInput = {
  provider: MockProvider;
};

export class MockApiError extends Error {
  code: string;

  constructor(message: string, code = "BAD_REQUEST") {
    super(message);
    this.name = "MockApiError";
    this.code = code;
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function delay(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function loadDatabase(): MockDatabase {
  if (typeof window === "undefined") {
    return clone(defaultMockDatabase);
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = clone(defaultMockDatabase);
    saveDatabase(seeded);
    return seeded;
  }

  try {
    return JSON.parse(raw) as MockDatabase;
  } catch {
    const seeded = clone(defaultMockDatabase);
    saveDatabase(seeded);
    return seeded;
  }
}

function saveDatabase(database: MockDatabase) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
}

function withDatabase<T>(updater: (database: MockDatabase) => T): T {
  const database = loadDatabase();
  const result = updater(database);
  saveDatabase(database);
  return result;
}

function getCurrentUserRecord(database: MockDatabase): MockUser | null {
  if (!database.currentUserId) {
    return null;
  }

  return database.users.find((user) => user.id === database.currentUserId) ?? null;
}

function requireCurrentUser(database: MockDatabase): MockUser {
  const user = getCurrentUserRecord(database);

  if (!user) {
    throw new MockApiError("Please login to continue.", "UNAUTHORIZED");
  }

  return user;
}

function ensureProfile(database: MockDatabase, user: MockUser): MockProfile {
  const existing = database.profiles[user.id];

  if (existing) {
    return existing;
  }

  const profile: MockProfile = {
    userId: user.id,
    nickname: user.name,
    bio: "Local mock profile for frontend-only development.",
    preferredLanguage: user.preferredLanguage,
  };

  database.profiles[user.id] = profile;
  return profile;
}

function normalizePost(database: MockDatabase, post: MockPost): MockPost {
  const commentCount = database.comments.filter((comment) => comment.postId === post.id).length;

  return {
    ...post,
    author: post.authorName,
    views: post.viewCount,
    commentCount,
  };
}

function getNextId(items: Array<{ id: number }>) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

export async function getCurrentUser() {
  await delay();
  const database = loadDatabase();
  return clone(getCurrentUserRecord(database));
}

export async function login(input: LoginInput) {
  await delay();

  return withDatabase((database) => {
    const user = database.users.find((candidate) => candidate.provider === input.provider);

    if (!user) {
      throw new MockApiError("Mock user not found.", "NOT_FOUND");
    }

    database.currentUserId = user.id;
    ensureProfile(database, user);
    return clone(user);
  });
}

export async function logout(_input?: void) {
  await delay();

  return withDatabase((database) => {
    database.currentUserId = null;
    return { success: true as const };
  });
}

export async function listPosts(input: ListPostsInput = {}) {
  await delay();
  const database = loadDatabase();

  const filtered = database.posts
    .filter((post) => (input.category ? post.category === input.category : true))
    .sort((left, right) => {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });

  const offset = input.offset ?? 0;
  const limit = input.limit ?? filtered.length;

  return filtered.slice(offset, offset + limit).map((post) => clone(normalizePost(database, post)));
}

export async function getPostById(input: GetPostByIdInput) {
  await delay();
  const database = loadDatabase();
  const post = database.posts.find((candidate) => candidate.id === input.id);

  if (!post) {
    return null;
  }

  return clone(normalizePost(database, post));
}

export async function createPost(input: CreatePostInput) {
  await delay();

  return withDatabase((database) => {
    const user = requireCurrentUser(database);
    const profile = ensureProfile(database, user);
    const displayName = profile.nickname.trim() || user.name;
    const nextId = getNextId(database.posts);

    const post: MockPost = {
      id: nextId,
      title: input.title.trim(),
      content: input.content.trim(),
      category: input.category,
      originalLanguage: input.originalLanguage,
      language: input.originalLanguage,
      authorId: user.id,
      author: displayName,
      authorName: displayName,
      createdAt: new Date().toISOString(),
      viewCount: 0,
      views: 0,
      commentCount: 0,
      tags: [],
    };

    database.posts.unshift(post);
    return clone(normalizePost(database, post));
  });
}

export async function listCommentsByPost(input: ListCommentsInput) {
  await delay();
  const database = loadDatabase();

  return database.comments
    .filter((comment) => comment.postId === input.postId)
    .sort((left, right) => {
      return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
    })
    .map((comment) => clone(comment));
}

export async function createComment(input: CreateCommentInput) {
  await delay();

  return withDatabase((database) => {
    const user = requireCurrentUser(database);
    const profile = ensureProfile(database, user);
    const nextId = getNextId(database.comments);
    const comment: MockComment = {
      id: nextId,
      postId: input.postId,
      authorId: user.id,
      authorName: profile.nickname.trim() || user.name,
      content: input.content.trim(),
      originalLanguage: input.originalLanguage,
      createdAt: new Date().toISOString(),
    };

    database.comments.push(comment);
    return clone(comment);
  });
}

export async function listGuides(input: ListGuidesInput = {}) {
  await delay();
  const database = loadDatabase();

  return database.guideSpots
    .filter((spot) => (input.category ? spot.category === input.category : true))
    .map((spot) => clone(spot));
}

export async function getProfile() {
  await delay();

  return withDatabase((database) => {
    const user = requireCurrentUser(database);
    return clone(ensureProfile(database, user));
  });
}

export async function listMyPosts() {
  await delay();

  return withDatabase((database) => {
    const user = requireCurrentUser(database);

    return database.posts
      .filter((post) => post.authorId === user.id)
      .sort((left, right) => {
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      })
      .map((post) => clone(normalizePost(database, post)));
  });
}

export async function upsertProfile(input: UpsertProfileInput) {
  await delay();

  return withDatabase((database) => {
    const user = requireCurrentUser(database);
    const nickname = input.nickname.trim() || user.name;

    database.profiles[user.id] = {
      userId: user.id,
      nickname,
      bio: input.bio.trim(),
      preferredLanguage: input.preferredLanguage,
    };

    database.users = database.users.map((candidate) => {
      if (candidate.id !== user.id) {
        return candidate;
      }

      return {
        ...candidate,
        name: nickname,
        preferredLanguage: input.preferredLanguage,
      };
    });

    database.posts = database.posts.map((post) => {
      if (post.authorId !== user.id) {
        return post;
      }

      return {
        ...post,
        author: nickname,
        authorName: nickname,
      };
    });

    database.comments = database.comments.map((comment) => {
      if (comment.authorId !== user.id) {
        return comment;
      }

      return {
        ...comment,
        authorName: nickname,
      };
    });

    return clone(database.profiles[user.id]);
  });
}

export async function translateText(input: TranslateTextInput): Promise<MockTranslationResult> {
  await delay();

  if (input.sourceLanguage === input.targetLanguage) {
    return { translated: input.text };
  }

  const labelByLanguage: Record<MockLanguage, string> = {
    ko: "Korean",
    ja: "Japanese",
    zh: "Chinese",
    en: "English",
  };

  return {
    translated: `[Mock ${labelByLanguage[input.targetLanguage]}] ${input.text}`,
  };
}

export function resetMockDatabase() {
  saveDatabase(clone(defaultMockDatabase));
}
