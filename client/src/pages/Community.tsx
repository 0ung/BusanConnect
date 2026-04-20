import { useLanguage } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";
import { SacredGeometryBackground } from "@/components/SacredGeometry";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { Link } from "wouter";
import { Eye, MessageSquare, PenLine, Plus, Search, X } from "lucide-react";

type Category = "all" | "review" | "question" | "tip" | "general";

export default function Community() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = ["부산", "해운대", "감천", "자갈치", "맛집", "카페", "숙소", "해변", "야경", "쇼핑"];

  const { data: posts, isLoading } = api.posts.list.useQuery({
    limit: 20,
    offset: 0,
    category: activeCategory === "all" ? undefined : activeCategory,
  });

  // 검색 및 필터링 로직
  const filteredPosts = posts?.filter((post: any) => {
    const matchesKeyword =
      searchKeyword === "" ||
      post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      post.content.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag: string) => post.tags?.includes(tag));

    return matchesKeyword && matchesTags;
  }) || [];

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: t("community.category.all") },
    { key: "review", label: t("community.category.review") },
    { key: "question", label: t("community.category.question") },
    { key: "tip", label: t("community.category.tip") },
    { key: "general", label: t("community.category.general") },
  ];

  const categoryBadgeStyle: Record<string, string> = {
    review: "category-review",
    question: "category-question",
    tip: "category-tip",
    general: "category-general",
  };

  const langFlags: Record<string, string> = {
    ko: "🇰🇷",
    ja: "🇯🇵",
    zh: "🇨🇳",
    en: "🇺🇸",
  };

  function formatDate(date: Date | string) {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  }

  return (
    <div className="page-shell min-h-screen">
      {/* Header */}
      <section className="section-brand relative py-20 overflow-hidden">
        <SacredGeometryBackground />
        <div className="container relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-white/20" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/70">Community</span>
              </div>
              <h1 className="font-display text-5xl font-bold text-contrast mb-2">
                {t("community.title")}
              </h1>
              <p className="text-lg font-display italic text-white/80">
                {t("community.subtitle")}
              </p>
            </div>
            {isAuthenticated ? (
              <Link href="/community/new">
                <Button className="gap-2 font-semibold">
                  <Plus className="w-5 h-5" />
                  {t("community.newPost")}
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                {t("community.newPost")}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="surface-panel sticky top-16 z-40">
        <div className="container py-4 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="text-muted absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
            <Input
              type="text"
              placeholder="게시글 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full rounded-lg border-input bg-background/60 py-2 pl-10 pr-4"
            />
          </div>

          {/* Tag Filter */}
          <div className="space-y-2">
            <p className="text-subtle text-sm font-medium">태그로 필터링:</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? "soft-pill soft-pill-active"
                      : "soft-pill"
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="danger-soft-button px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                  초기화
                </button>
              )}
            </div>
          </div>

          {/* Search Results Info */}
          {(searchKeyword || selectedTags.length > 0) && (
            <p className="text-muted text-sm">
              검색 결과: <strong>{filteredPosts.length}</strong>개 게시글
              {searchKeyword && ` (키워드: "${searchKeyword}")`}
              {selectedTags.length > 0 && ` (태그: ${selectedTags.join(", ")})`}
            </p>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="container py-8">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.key
                  ? "soft-pill soft-pill-active shadow-md"
                  : "soft-pill"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="container pb-20">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-muted animate-pulse">로딩 중...</div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted text-lg">
              {searchKeyword || selectedTags.length > 0
                ? "검색 결과가 없습니다"
                : "게시글이 없습니다"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post: any) => (
              <Link key={post.id} href={`/community/${post.id}`}>
                <div className="surface-card surface-card-hover cursor-pointer rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${categoryBadgeStyle[post.category] || categoryBadgeStyle.general} border`}
                      >
                        {post.category}
                      </Badge>
                      <span className="text-muted text-sm">{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="text-muted flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.commentCount || 0}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-navy mb-2">{post.title}</h3>
                  <p className="text-muted line-clamp-2 mb-3">{post.content}</p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="tag-pill inline-block rounded px-2 py-1 text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-subtle text-sm font-medium">{post.author}</span>
                      <span className="text-lg">{langFlags[post.language] || "🌐"}</span>
                    </div>
                    <PenLine className="text-muted w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
