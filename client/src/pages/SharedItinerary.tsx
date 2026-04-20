import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Download, Share2, ArrowLeft, User } from "lucide-react";
import { toast } from "sonner";

interface ItineraryDay {
  date: string;
  activities: Array<{
    id: string;
    time: string;
    title: string;
    location: string;
    description: string;
  }>;
}

interface SharedItinerary {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
  createdAt: Date;
  author: {
    name: string;
    avatar?: string;
  };
  shareUrl: string;
}

// 모의 데이터 저장소 (실제로는 백엔드에서 가져옴)
const mockItineraries: Record<string, SharedItinerary> = {
  "1234567890": {
    id: "1234567890",
    title: "부산 3박 4일 완벽 여행",
    description: "해운대, 감천문화마을, 자갈치 시장을 둘러보는 완벽한 부산 여행 코스입니다.",
    startDate: "2024-05-10",
    endDate: "2024-05-13",
    days: [
      {
        date: "2024-05-10",
        activities: [
          {
            id: "1",
            time: "14:00",
            title: "김해공항 도착",
            location: "김해국제공항",
            description: "비행기 도착 후 짐 수령",
          },
          {
            id: "2",
            time: "16:00",
            title: "호텔 체크인",
            location: "해운대 비즈니스 호텔",
            description: "해운대 해수욕장 근처 호텔 체크인",
          },
          {
            id: "3",
            time: "18:00",
            title: "저녁 식사",
            location: "해운대 해변 카페거리",
            description: "해변을 바라보며 저녁 식사",
          },
        ],
      },
      {
        date: "2024-05-11",
        activities: [
          {
            id: "4",
            time: "09:00",
            title: "해운대 해수욕장",
            location: "해운대 해수욕장",
            description: "부산에서 가장 유명한 해수욕장에서 산책 및 사진 촬영",
          },
          {
            id: "5",
            time: "12:00",
            title: "점심 식사",
            location: "해운대 맛집거리",
            description: "해산물 정식 또는 회 먹기",
          },
          {
            id: "6",
            time: "14:00",
            title: "감천문화마을",
            location: "감천문화마을",
            description: "알록달록한 집들과 벽화 감상, 사진 촬영",
          },
          {
            id: "7",
            time: "17:00",
            title: "저녁 식사",
            location: "감천문화마을 카페",
            description: "로컬 카페에서 휴식 및 간식",
          },
        ],
      },
      {
        date: "2024-05-12",
        activities: [
          {
            id: "8",
            time: "08:00",
            title: "아침 식사",
            location: "호텔 식당",
            description: "호텔 조식 이용",
          },
          {
            id: "9",
            time: "10:00",
            title: "자갈치 시장",
            location: "자갈치 시장",
            description: "부산의 대표 수산물 시장 방문, 신선한 회 구매",
          },
          {
            id: "10",
            time: "13:00",
            title: "점심 식사",
            location: "자갈치 시장 식당",
            description: "시장에서 구매한 회로 점심 식사",
          },
          {
            id: "11",
            time: "15:00",
            title: "부산 타워",
            location: "부산 타워",
            description: "전망대에서 부산 전경 감상",
          },
          {
            id: "12",
            time: "18:00",
            title: "저녁 식사",
            location: "중앙동 식당가",
            description: "부산 대표 음식 체험",
          },
        ],
      },
      {
        date: "2024-05-13",
        activities: [
          {
            id: "13",
            time: "09:00",
            title: "호텔 체크아웃",
            location: "해운대 비즈니스 호텔",
            description: "짐 정리 및 체크아웃",
          },
          {
            id: "14",
            time: "11:00",
            title: "광안리 해수욕장",
            location: "광안리 해수욕장",
            description: "광안대교 야경을 볼 수 있는 해변 방문",
          },
          {
            id: "15",
            time: "14:00",
            title: "공항 이동",
            location: "김해국제공항",
            description: "공항으로 이동 및 체크인",
          },
        ],
      },
    ],
    createdAt: new Date("2024-04-15"),
    author: {
      name: "부산 여행 가이드",
      avatar: "🧳",
    },
    shareUrl: "https://busanconnect.com/itinerary/1234567890",
  },
};

export default function SharedItinerary() {
  const { t } = useLanguage();
  const [, params] = useRoute("/itinerary/:shareId");
  const [itinerary, setItinerary] = useState<SharedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  useEffect(() => {
    // 공유 ID로 일정 조회 (실제로는 백엔드 API 호출)
    const shareId = params?.shareId;
    if (shareId && mockItineraries[shareId]) {
      setTimeout(() => {
        setItinerary(mockItineraries[shareId]);
        setLoading(false);
      }, 500);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [params?.shareId]);

  const handleDownloadPDF = () => {
    if (!itinerary) return;

    // PDF 콘텐츠 생성
    const content = `
${itinerary.title}

작성자: ${itinerary.author.name}
기간: ${itinerary.startDate} ~ ${itinerary.endDate}
설명: ${itinerary.description}

---

${itinerary.days
  .map(
    (day) => `
[${day.date}]
${day.activities
  .map(
    (activity) => `
  ${activity.time} - ${activity.title}
  위치: ${activity.location}
  설명: ${activity.description}
`
  )
  .join("\n")}
`
  )
  .join("\n")}
    `;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", `${itinerary.title}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("일정이 다운로드되었습니다");
  };

  const handleShare = () => {
    if (!itinerary) return;
    navigator.clipboard.writeText(itinerary.shareUrl);
    toast.success("공유 링크가 복사되었습니다");
  };

  if (loading) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center px-4">
        <Card className="surface-card w-full max-w-md shadow-lg">
          <CardContent className="py-12 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center px-4">
        <Card className="surface-card w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>일정을 찾을 수 없습니다</CardTitle>
            <CardDescription>
              요청하신 공유 일정이 존재하지 않습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateDays = () => {
    const start = new Date(itinerary.startDate);
    const end = new Date(itinerary.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="page-shell min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Button>

        {/* Header Card */}
        <Card className="surface-card shadow-lg mb-8">
          <CardHeader className="panel-header-brand rounded-t-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">
                  {itinerary.title}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {itinerary.description}
                </CardDescription>
              </div>
              <div className="text-4xl">{itinerary.author.avatar || "🧳"}</div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="info-panel rounded-lg p-4">
                <p className="text-sm text-subtle mb-1">시작일</p>
                <p className="font-semibold text-ocean-dark">
                  {new Date(itinerary.startDate).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <div className="info-panel rounded-lg p-4">
                <p className="text-sm text-subtle mb-1">종료일</p>
                <p className="font-semibold text-ocean-dark">
                  {new Date(itinerary.endDate).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <div className="info-panel rounded-lg p-4">
                <p className="text-sm text-subtle mb-1">여행 기간</p>
                <p className="font-semibold text-ocean-dark">
                  {calculateDays()}일
                </p>
              </div>
              <div className="info-panel rounded-lg p-4">
                <p className="text-sm text-subtle mb-1">작성자</p>
                <p className="font-semibold text-ocean-dark">
                  {itinerary.author.name}
                </p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                공유하기
              </Button>
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                다운로드
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Itinerary */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-ocean-dark mb-6">
            일정 상세
          </h2>

          {itinerary.days.map((day, dayIndex) => (
            <Card
              key={day.date}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <button
                onClick={() =>
                  setExpandedDay(expandedDay === day.date ? null : day.date)
                }
                className="w-full text-left"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Badge>
                        Day {dayIndex + 1}
                      </Badge>
                      <CardTitle className="text-lg">
                        {new Date(day.date).toLocaleDateString("ko-KR", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardTitle>
                    </div>
                    <div className="text-muted">
                      {expandedDay === day.date ? "▼" : "▶"}
                    </div>
                  </div>
                  <p className="text-sm text-muted mt-2">
                    {day.activities.length}개의 활동
                  </p>
                </CardHeader>
              </button>

              {expandedDay === day.date && (
                <CardContent className="pt-0 border-t border-border">
                  <div className="space-y-4 mt-4">
                    {day.activities.map((activity, actIndex) => (
                      <div
                        key={activity.id}
                        className="flex gap-4 pb-4 last:pb-0 last:border-b-0 border-b border-border last:border-b"
                      >
                        {/* Timeline */}
                        <div className="flex flex-col items-center">
                          <div className="timeline-step flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm">
                            {actIndex + 1}
                          </div>
                          {actIndex < day.activities.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-300 mt-2"></div>
                          )}
                        </div>

                        {/* Activity Details */}
                        <div className="flex-1 pt-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-ocean-dark" />
                            <p className="font-semibold text-navy">
                              {activity.time}
                            </p>
                          </div>
                          <h4 className="text-lg font-bold text-navy mb-1">
                            {activity.title}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-muted" />
                            <p className="text-sm text-muted">
                              {activity.location}
                            </p>
                          </div>
                          <p className="text-sm text-subtle bg-background/70 rounded p-2">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <Card className="info-panel shadow-lg mt-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-ocean-dark mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-navy mb-1">
                  {itinerary.author.name}의 여행 일정
                </p>
                <p className="text-sm text-muted">
                  이 일정은 {new Date(itinerary.createdAt).toLocaleDateString(
                    "ko-KR"
                  )}에 공유되었습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
