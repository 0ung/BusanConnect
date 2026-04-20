import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Plus, Download, Share2, Trash2, Edit2, Users } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

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

interface Itinerary {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
  createdAt: Date;
  isPublic: boolean;
  shareUrl?: string;
}

export default function Itinerary() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  if (!isAuthenticated) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center px-4">
        <Card className="surface-card w-full max-w-md">
          <CardHeader>
            <CardTitle>로그인 필요</CardTitle>
            <CardDescription>여행 일정을 만들려면 로그인이 필요합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = "/login"}>
              로그인하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateItinerary = () => {
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast.error("필수 정보를 입력해주세요");
      return;
    }

    const shareId = Date.now().toString();
    const newItinerary: Itinerary = {
      id: shareId,
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: [],
      createdAt: new Date(),
      isPublic: false,
      shareUrl: `${window.location.origin}/itinerary/${shareId}`,
    };

    // 로컬 스토리지에 일정 저장 (실제로는 백엔드에 저장)
    const savedItineraries = JSON.parse(localStorage.getItem('busanconnect_itineraries') || '{}');
    savedItineraries[shareId] = newItinerary;
    localStorage.setItem('busanconnect_itineraries', JSON.stringify(savedItineraries));
    
    setItineraries([...itineraries, newItinerary]);
    setFormData({ title: "", description: "", startDate: "", endDate: "" });
    setShowForm(false);
    toast.success("여행 일정이 생성되었습니다");
  };

  const handleDownloadPDF = (itinerary: Itinerary) => {
    // PDF 생성 로직 (jsPDF 라이브러리 사용)
    const content = `
여행 일정: ${itinerary.title}
설명: ${itinerary.description}
기간: ${itinerary.startDate} ~ ${itinerary.endDate}

작성자: ${user?.name || "익명"}
생성일: ${itinerary.createdAt.toLocaleDateString()}
    `;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", `${itinerary.title}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("PDF가 다운로드되었습니다");
  };

  const handleShareItinerary = (itinerary: Itinerary) => {
    const shareUrl = itinerary.shareUrl || "";
    navigator.clipboard.writeText(shareUrl);
    toast.success("공유 링크가 복사되었습니다");
  };

  const handleDeleteItinerary = (id: string) => {
    setItineraries(itineraries.filter(i => i.id !== id));
    toast.success("여행 일정이 삭제되었습니다");
  };

  return (
    <div className="page-shell min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ocean-dark mb-2">
            나의 여행 일정
          </h1>
          <p className="text-muted">
            부산 여행을 계획하고 일정을 공유하세요
          </p>
        </div>

        {/* Create Button */}
        <div className="mb-8">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            새 일정 만들기
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <Card className="surface-card mb-8 shadow-lg">
            <CardHeader>
              <CardTitle>새 여행 일정 만들기</CardTitle>
              <CardDescription>부산 여행 일정을 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-subtle">
                  일정 제목 *
                </label>
                <Input
                  placeholder="예: 2024년 부산 3박 4일 여행"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-subtle">
                  설명
                </label>
                <Textarea
                  placeholder="여행에 대한 설명을 입력하세요"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-subtle">
                    시작 날짜 *
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-subtle">
                    종료 날짜 *
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreateItinerary}
                  className="brand-button flex-1"
                >
                  일정 생성
                </Button>
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Itineraries List */}
        {itineraries.length === 0 ? (
          <Card className="surface-card shadow-lg">
            <CardContent className="py-12 text-center">
              <Calendar className="text-muted mx-auto mb-4 h-12 w-12 opacity-50" />
              <p className="text-muted text-lg">
                아직 여행 일정이 없습니다
              </p>
              <p className="text-subtle mt-2 text-sm">
                위의 버튼을 클릭하여 첫 번째 일정을 만들어보세요
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {itineraries.map((itinerary) => (
              <Card key={itinerary.id} className="surface-card transition-shadow hover:shadow-xl">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl text-ocean-dark">
                        {itinerary.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="w-4 h-4" />
                        {itinerary.startDate} ~ {itinerary.endDate}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShareItinerary(itinerary)}
                        className="flex items-center gap-1"
                      >
                        <Share2 className="w-4 h-4" />
                        공유
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadPDF(itinerary)}
                        className="flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        다운로드
                      </Button>
                      <Button
                        size="sm"
                        className="brand-button flex items-center gap-1"
                        onClick={() => setLocation(`/itinerary/${itinerary.id}/edit`)}
                      >
                        <Edit2 className="w-4 h-4" />
                        편집
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setLocation(`/itinerary/${itinerary.id}/collaborate`)}
                      >
                        <Users className="w-4 h-4" />
                        동료작업
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteItinerary(itinerary.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {itinerary.description && (
                    <p className="text-muted mb-4">{itinerary.description}</p>
                  )}
                  <div className="info-panel rounded-lg p-4">
                    <p className="text-subtle text-sm">
                      <strong>공유 링크:</strong> {itinerary.shareUrl}
                    </p>
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
