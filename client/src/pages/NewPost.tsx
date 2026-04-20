import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, PenLine } from "lucide-react";
import { Link } from "wouter";

type PostCategory = "review" | "question" | "tip" | "general";
type Lang = "ko" | "ja" | "zh" | "en";

export default function NewPost() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory>("general");
  const [writingLang, setWritingLang] = useState<Lang>(language as Lang);

  const createPost = api.posts.create.useMutation({
    onSuccess: (data) => {
      toast.success(language === "ko" ? "게시글이 등록되었습니다!" : "Post created!");
      navigate(`/community/${data.id}`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create post.");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center">
        <div className="text-center">
          <PenLine className="w-16 h-16 mx-auto mb-4 text-ocean opacity-50" />
          <h2 className="font-display text-2xl font-bold text-navy mb-2">{t("community.login_required")}</h2>
          <Button
            className="brand-button mt-4"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            {t("nav.login")}
          </Button>
        </div>
      </div>
    );
  }

  const categories: { key: PostCategory; label: string }[] = [
    { key: "review", label: t("community.category.review") },
    { key: "question", label: t("community.category.question") },
    { key: "tip", label: t("community.category.tip") },
    { key: "general", label: t("community.category.general") },
  ];

  return (
    <div className="page-shell min-h-screen py-12">
      <div className="container max-w-2xl">
        {/* Back */}
        <Link href="/community">
          <button className="text-muted hover:text-ocean-dark mb-6 flex items-center gap-2 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </button>
        </Link>

        <div className="surface-card rounded-2xl p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="icon-orb-brand flex h-10 w-10 items-center justify-center rounded-full">
              <PenLine className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-navy">{t("community.write")}</h1>
              <p className="text-muted text-xs">BusanConnect Community</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">{t("post.category")}</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setCategory(cat.key)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      category === cat.key
                        ? "soft-pill soft-pill-active"
                        : "soft-pill"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Writing Language */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">{t("post.language")}</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setWritingLang(lang.code as Lang)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all flex items-center gap-1 ${
                      writingLang === lang.code
                        ? "soft-pill soft-pill-active"
                        : "soft-pill"
                    }`}
                  >
                    {lang.flag} {lang.nativeLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">{t("post.title")}</label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === "ko" ? "제목을 입력하세요" : "Enter title"}
                className="h-12 px-4"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">{t("post.content")}</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={language === "ko" ? "내용을 입력하세요..." : "Write your content..."}
                rows={10}
                className="min-h-40 px-4 py-3"
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#7ab2ff] to-transparent opacity-35" />

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Link href="/community">
                <Button variant="outline" className="secondary-button">
                  {t("post.cancel")}
                </Button>
              </Link>
              <Button
                onClick={() =>
                  createPost.mutate({
                    title,
                    content,
                    category,
                    originalLanguage: writingLang,
                  })
                }
                disabled={!title.trim() || !content.trim() || createPost.isPending}
                className="brand-button gap-2 font-semibold"
              >
                <PenLine className="w-4 h-4" />
                {createPost.isPending ? t("common.loading") : t("post.submit")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
