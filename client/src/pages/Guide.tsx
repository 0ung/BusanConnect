import { useLanguage } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";
import { SacredGeometryBackground } from "@/components/SacredGeometry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MapPin, Star, ExternalLink, Search, X } from "lucide-react";
import { Link } from "wouter";

type Category = "all" | "attraction" | "restaurant" | "accommodation" | "shopping" | "culture";

export default function Guide() {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = ["해변", "역사", "음식", "쇼핑", "야경", "가족", "힐링", "액티비티", "전시", "카페"];

  const { data: spots, isLoading } = api.guides.list.useQuery({
    category: activeCategory === "all" ? undefined : activeCategory,
  });

  // 검색 및 필터링 로직
  const filteredSpots = spots?.filter((spot: any) => {
    const spotName = getSpotName(spot);
    const spotDesc = getSpotDesc(spot);

    const matchesKeyword =
      searchKeyword === "" ||
      spotName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      spotDesc.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag: string) => spot.tags?.includes(tag));

    return matchesKeyword && matchesTags;
  }) || [];

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: t("guide.category.all") },
    { key: "attraction", label: t("guide.category.attraction") },
    { key: "restaurant", label: t("guide.category.restaurant") },
    { key: "accommodation", label: t("guide.category.accommodation") },
    { key: "shopping", label: t("guide.category.shopping") },
    { key: "culture", label: t("guide.category.culture") },
  ];

  const categoryColors: Record<string, string> = {
    attraction: "guide-attraction",
    restaurant: "guide-restaurant",
    accommodation: "guide-accommodation",
    shopping: "guide-shopping",
    culture: "guide-culture",
  };

  function getSpotName(spot: Record<string, unknown>) {
    const key = `name${language.charAt(0).toUpperCase() + language.slice(1)}` as string;
    return (spot[key] as string) || (spot["nameKo"] as string) || "";
  }

  function getSpotDesc(spot: Record<string, unknown>) {
    const key = `description${language.charAt(0).toUpperCase() + language.slice(1)}` as string;
    return (spot[key] as string) || (spot["descriptionKo"] as string) || "";
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
                <span className="text-xs font-semibold uppercase tracking-widest text-white/70">Local Guide</span>
              </div>
              <h1 className="font-display text-5xl font-bold text-contrast mb-2">
                {t("guide.title")}
              </h1>
              <p className="text-lg font-display italic text-white/80">{t("guide.subtitle")}</p>
            </div>
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
              placeholder="명소 검색..."
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
                  className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-1"
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
              검색 결과: <strong>{filteredSpots.length}</strong>개 명소
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

      {/* Spots Grid */}
      <div className="container pb-20">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-muted animate-pulse">로딩 중...</div>
          </div>
        ) : filteredSpots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted text-lg">
              {searchKeyword || selectedTags.length > 0 ? "검색 결과가 없습니다" : "명소가 없습니다"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map((spot: any) => (
              <div
                key={spot.id}
                className="surface-card surface-card-hover overflow-hidden rounded-lg"
              >
                {/* Image */}
                {spot.image && (
                  <div className="w-full h-48 overflow-hidden bg-muted/40">
                    <img src={spot.image} alt={getSpotName(spot)} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="p-6">
                  {/* Category Badge */}
                  <Badge className={`${categoryColors[spot.category] || categoryColors.attraction} border mb-3`}>
                    {spot.category}
                  </Badge>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-navy mb-2">{getSpotName(spot)}</h3>

                  {/* Description */}
                  <p className="text-muted text-sm line-clamp-2 mb-3">{getSpotDesc(spot)}</p>

                  {/* Tags */}
                  {spot.tags && spot.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {spot.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="tag-pill inline-block rounded px-2 py-1 text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Location & Rating */}
                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="text-subtle flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-ocean-dark" />
                      <span className="text-sm">{spot.address || "주소 미등록"}</span>
                    </div>
                    {spot.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(spot.rating)
                                  ? "fill-ocean text-ocean"
                                  : "text-muted/50"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-subtle text-sm font-medium">{spot.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {spot.url && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full mt-4 gap-2"
                    >
                      <a href={spot.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        자세히 보기
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
