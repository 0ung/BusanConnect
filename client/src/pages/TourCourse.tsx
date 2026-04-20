import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Plus, Share2, Trash2, Heart, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Link } from "wouter";

interface TourStop {
  id: string;
  name: string;
  description: string;
  duration: string;
  order: number;
}

interface TourCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "easy" | "medium" | "hard";
  stops: TourStop[];
  author: {
    id: number;
    name: string;
  };
  createdAt: Date;
  likes: number;
  isPublic: boolean;
  shareUrl?: string;
  tags?: string[];
}

export default function TourCourse() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");

  const allTags = ["해변", "문화", "음식", "야경", "가족", "힐링", "액티비티", "쇼핑", "역사", "자연"];

  const [tourCourses, setTourCourses] = useState<TourCourse[]>([
    {
      id: "1",
      title: "해운대 해변 투어",
      description: "해운대 해수욕장과 주변 명소를 둘러보는 하루 투어",
      duration: "4시간",
      difficulty: "easy",
      stops: [
        {
          id: "1",
          name: "해운대 해수욕장",
          description: "부산의 대표 해변",
          duration: "1시간",
          order: 1,
        },
        {
          id: "2",
          name: "해운대 해상케이블카",
          description: "해변 위로 나는 케이블카",
          duration: "1시간",
          order: 2,
        },
      ],
      author: {
        id: 1,
        name: "부산 여행가",
      },
      createdAt: new Date(),
      likes: 24,
      isPublic: true,
      tags: ["해변", "가족"],
    },
    {
      id: "2",
      title: "감천 문화마을 투어",
      description: "감천 문화마을의 골목과 예술 작품을 감상하는 투어",
      duration: "3시간",
      difficulty: "medium",
      stops: [
        {
          id: "3",
          name: "감천 문화마을 입구",
          description: "마을 입구에서 시작",
          duration: "30분",
          order: 1,
        },
        {
          id: "4",
          name: "예술 갤러리",
          description: "지역 예술가 작품 전시",
          duration: "1.5시간",
          order: 2,
        },
      ],
      author: {
        id: 2,
        name: "예술 애호가",
      },
      createdAt: new Date(),
      likes: 18,
      isPublic: true,
      tags: ["문화", "예술"],
    },
    {
      id: "3",
      title: "자갈치 시장 맛집 투어",
      description: "자갈치 시장의 신선한 해산물 맛집을 소개하는 투어",
      duration: "2시간",
      difficulty: "easy",
      stops: [
        {
          id: "5",
          name: "자갈치 시장",
          description: "부산의 대표 시장",
          duration: "1시간",
          order: 1,
        },
        {
          id: "6",
          name: "해산물 식당",
          description: "신선한 회와 해산물",
          duration: "1시간",
          order: 2,
        },
      ],
      author: {
        id: 3,
        name: "미식가",
      },
      createdAt: new Date(),
      likes: 32,
      isPublic: true,
      tags: ["음식", "시장"],
    },
  ]);

  // 검색 및 필터링 로직
  const filteredCourses = tourCourses.filter((course) => {
    const matchesKeyword =
      searchKeyword === "" ||
      course.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      course.description.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag: string) => course.tags?.includes(tag));

    const matchesDifficulty = selectedDifficulty === "all" || course.difficulty === selectedDifficulty;

    return matchesKeyword && matchesTags && matchesDifficulty;
  });

  const difficultyColors: Record<string, string> = {
    easy: "guide-attraction border",
    medium: "guide-culture border",
    hard: "bg-red-100 text-red-700 border border-red-200",
  };

  const difficultyLabels: Record<string, string> = {
    easy: "쉬움",
    medium: "중간",
    hard: "어려움",
  };

  return (
    <div className="page-shell min-h-screen">
      {/* Header */}
      <section className="section-brand relative py-20 overflow-hidden">
        <div className="container relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-white/20" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/70">Tour Course</span>
              </div>
              <h1 className="font-display text-5xl font-bold text-contrast mb-2">투어 코스</h1>
              <p className="text-lg font-display italic text-white/80">부산의 다양한 투어 코스를 둘러보세요</p>
            </div>
            {isAuthenticated && (
              <Link href="/tour/new">
                <Button className="gap-2 font-semibold">
                  <Plus className="w-5 h-5" />
                  새 투어 만들기
                </Button>
              </Link>
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
              placeholder="투어 코스 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full rounded-lg border-input bg-background/60 py-2 pl-10 pr-4"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <p className="text-subtle text-sm font-medium">난이도:</p>
            <div className="flex flex-wrap gap-2">
              {["all", "easy", "medium", "hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedDifficulty === diff
                      ? "soft-pill soft-pill-active"
                      : "soft-pill"
                  }`}
                >
                  {diff === "all" ? "전체" : difficultyLabels[diff]}
                </button>
              ))}
            </div>
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
          {(searchKeyword || selectedTags.length > 0 || selectedDifficulty !== "all") && (
            <p className="text-muted text-sm">
              검색 결과: <strong>{filteredCourses.length}</strong>개 투어 코스
              {searchKeyword && ` (키워드: "${searchKeyword}")`}
              {selectedDifficulty !== "all" && ` (난이도: ${difficultyLabels[selectedDifficulty]})`}
              {selectedTags.length > 0 && ` (태그: ${selectedTags.join(", ")})`}
            </p>
          )}
        </div>
      </div>

      {/* Tour Courses Grid */}
      <div className="container py-12 pb-20">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted text-lg">
              {searchKeyword || selectedTags.length > 0 || selectedDifficulty !== "all"
                ? "검색 결과가 없습니다"
                : "투어 코스가 없습니다"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={difficultyColors[course.difficulty]}>
                      {difficultyLabels[course.difficulty]}
                    </Badge>
                    <div className="flex items-center gap-1 text-red-500">
                      <Heart className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{course.likes}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Tags */}
                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <span key={tag} className="tag-pill inline-block rounded px-2 py-1 text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tour Info */}
                  <div className="text-muted space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{course.stops.length}개 정류장</span>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="border-t border-border pt-3">
                    <p className="text-muted text-sm">
                      <span className="font-medium">작성자:</span> {course.author.name}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1"
                    >
                      <Link href={`/tour/${course.id}`}>
                        상세보기
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const url = `${window.location.origin}/tour/${course.id}`;
                        navigator.clipboard.writeText(url);
                        toast.success("공유 링크 복사됨");
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
