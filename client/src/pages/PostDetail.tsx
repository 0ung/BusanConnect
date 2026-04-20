import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Eye, Languages, Loader2, MessageSquare, Send } from "lucide-react";

type Lang = "ko" | "ja" | "zh" | "en";

export default function PostDetail() {
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const params = useParams<{ id: string }>();
  const postId = parseInt(params.id || "0");

  const [commentText, setCommentText] = useState("");
  const [commentLang, setCommentLang] = useState<Lang>(language as Lang);

  // Translation state
  const [translatedPost, setTranslatedPost] = useState<{ title: string; content: string } | null>(null);
  const [isTranslatingPost, setIsTranslatingPost] = useState(false);
  const [showOriginalPost, setShowOriginalPost] = useState(false);
  const [translatedComments, setTranslatedComments] = useState<Record<number, string>>({});
  const [translatingCommentId, setTranslatingCommentId] = useState<number | null>(null);

  const { data: post, isLoading: postLoading } = api.posts.getById.useQuery(
    { id: postId },
    { enabled: postId > 0 }
  );
  const { data: comments, refetch: refetchComments } = api.comments.listByPost.useQuery(
    { postId },
    { enabled: postId > 0 }
  );

  const translateMutation = api.translate.text.useMutation();
  const createComment = api.comments.create.useMutation({
    onSuccess: () => {
      setCommentText("");
      refetchComments();
      toast.success(language === "ko" ? "댓글이 등록되었습니다!" : "Comment posted!");
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Failed to post comment."),
  });

  const langFlags: Record<string, string> = { ko: "🇰🇷", ja: "🇯🇵", zh: "🇨🇳", en: "🇺🇸" };

  async function translatePost() {
    if (!post) return;
    if (translatedPost && !showOriginalPost) {
      setShowOriginalPost(false);
      return;
    }
    setIsTranslatingPost(true);
    try {
      const [titleResult, contentResult] = await Promise.all([
        translateMutation.mutateAsync({
          text: post.title,
          targetLanguage: language as Lang,
          sourceLanguage: post.originalLanguage as Lang,
        }),
        translateMutation.mutateAsync({
          text: post.content,
          targetLanguage: language as Lang,
          sourceLanguage: post.originalLanguage as Lang,
        }),
      ]);
      setTranslatedPost({ title: titleResult.translated, content: contentResult.translated });
      setShowOriginalPost(false);
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsTranslatingPost(false);
    }
  }

  async function translateComment(commentId: number, content: string, sourceLang: string) {
    if (translatedComments[commentId]) {
      setTranslatedComments((prev) => {
        const next = { ...prev };
        delete next[commentId];
        return next;
      });
      return;
    }
    setTranslatingCommentId(commentId);
    try {
      const result = await translateMutation.mutateAsync({
        text: content,
        targetLanguage: language as Lang,
        sourceLanguage: sourceLang as Lang,
      });
      setTranslatedComments((prev) => ({ ...prev, [commentId]: result.translated }));
    } catch {
      toast.error(t("common.error"));
    } finally {
      setTranslatingCommentId(null);
    }
  }

  function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString(
      language === "ko" ? "ko-KR" : language === "ja" ? "ja-JP" : language === "zh" ? "zh-CN" : "en-US",
      { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    );
  }

  if (postLoading) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ocean" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[oklch(52%_0.04_245)]">게시글을 찾을 수 없습니다.</p>
          <Link href="/community">
            <Button className="mt-4">{t("common.back")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayTitle = translatedPost && !showOriginalPost ? translatedPost.title : post.title;
  const displayContent = translatedPost && !showOriginalPost ? translatedPost.content : post.content;
  const isTranslated = translatedPost && !showOriginalPost;
  const canTranslate = post.originalLanguage !== language;

  return (
    <div className="page-shell min-h-screen py-10">
      <div className="container max-w-3xl">
        {/* Back */}
        <Link href="/community">
          <button className="text-muted hover:text-ocean-dark mb-6 flex items-center gap-2 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </button>
        </Link>

        {/* Post Card */}
        <article className="surface-card mb-6 overflow-hidden rounded-2xl">
          {/* Post Header */}
          <div className="border-b border-border p-8">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="badge-soft rounded-full px-3 py-1 text-xs font-semibold">
                {t(`community.category.${post.category}`)}
              </span>
              <span className="text-sm">{langFlags[post.originalLanguage] || "🌐"}</span>
              {isTranslated && (
                <span className="tag-pill rounded-full px-2 py-0.5 text-xs">
                  {t("post.translated")} → {langFlags[language]}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl font-bold text-navy mb-4 leading-tight">
              {displayTitle}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="text-muted flex items-center gap-3 text-sm">
                <span className="font-medium text-navy">{post.authorName || "익명"}</span>
                <span>·</span>
                <span>{formatDate(post.createdAt)}</span>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{post.viewCount}</span>
                </div>
              </div>

              {/* Translation button */}
              {canTranslate && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={isTranslated ? () => setShowOriginalPost(true) : translatePost}
                  disabled={isTranslatingPost}
                  className="secondary-button gap-1.5 text-xs"
                >
                  {isTranslatingPost ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Languages className="w-3.5 h-3.5" />
                  )}
                  {isTranslated ? t("post.original") : isTranslatingPost ? t("post.translating") : t("post.translate")}
                </Button>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="p-8">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-subtle leading-relaxed dark:prose-invert">
              {displayContent}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="surface-card overflow-hidden rounded-2xl">
          <div className="border-b border-border p-6">
            <h2 className="font-semibold text-navy flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-ocean" />
              {t("community.comments")} ({comments?.length ?? 0})
            </h2>
          </div>

          {/* Comment List */}
          <div className="divide-y divide-border/60">
            {comments && comments.length > 0 ? (
              comments.map((comment) => {
                const translatedContent = translatedComments[comment.id];
                const isCommentTranslated = !!translatedContent;
                const canTranslateComment = comment.originalLanguage !== language;
                return (
                  <div key={comment.id} className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="avatar-shell-brand flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
                          {(comment.authorName || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-navy">{comment.authorName || "익명"}</span>
                        <span className="text-subtle text-xs">
                          {langFlags[comment.originalLanguage]}
                        </span>
                        {isCommentTranslated && (
                          <span className="text-xs text-ocean-dark">({t("post.translated")})</span>
                        )}
                      </div>
                      {canTranslateComment && (
                        <button
                          onClick={() => translateComment(comment.id, comment.content, comment.originalLanguage)}
                          disabled={translatingCommentId === comment.id}
                          className="text-subtle hover:text-ocean-dark flex items-center gap-1 text-xs transition-colors"
                        >
                          {translatingCommentId === comment.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Languages className="w-3 h-3" />
                          )}
                          {isCommentTranslated ? t("post.original") : t("post.translate")}
                        </button>
                      )}
                    </div>
                    <p className="text-subtle whitespace-pre-wrap text-sm leading-relaxed">
                      {isCommentTranslated ? translatedContent : comment.content}
                    </p>
                    <p className="text-subtle mt-2 text-xs">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-subtle p-10 text-center text-sm">
                {t("post.comment.placeholder")}
              </div>
            )}
          </div>

          {/* Comment Input */}
          <div className="soft-section border-t border-border p-6">
            {isAuthenticated ? (
              <div className="space-y-3">
                {/* Language selector for comment */}
                <div className="flex gap-2 flex-wrap">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setCommentLang(lang.code as Lang)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                        commentLang === lang.code
                          ? "soft-pill soft-pill-active"
                          : "soft-pill"
                      }`}
                    >
                      {lang.flag} {lang.nativeLabel}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={t("post.comment.placeholder")}
                    rows={3}
                    className="flex-1 px-4 py-3"
                  />
                  <Button
                    onClick={() =>
                      createComment.mutate({
                        postId,
                        content: commentText,
                        originalLanguage: commentLang,
                      })
                    }
                    disabled={!commentText.trim() || createComment.isPending}
                    className="brand-button self-end gap-2 px-5"
                  >
                    {createComment.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {t("post.comment.submit")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted mb-3 text-sm">{t("post.comment.login")}</p>
                <Button
                  size="sm"
                  className="brand-button"
                  onClick={() => (window.location.href = getLoginUrl())}
                >
                  {t("nav.login")}
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
