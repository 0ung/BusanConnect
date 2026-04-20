import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Clock,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

interface Activity {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
}

interface ItineraryDay {
  date: string;
  activities: Activity[];
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

export default function EditItinerary() {
  const { t } = useLanguage();
  const [, params] = useRoute("/itinerary/:id/edit");
  const [, setLocation] = useLocation();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<{
    dayIndex: number;
    activityIndex: number;
  } | null>(null);
  const [editingActivityData, setEditingActivityData] = useState<Activity | null>(
    null
  );
  const [newActivityDay, setNewActivityDay] = useState<number | null>(null);
  const [newActivityData, setNewActivityData] = useState<Activity>({
    id: "",
    time: "",
    title: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    // 로컬 스토리지에서 일정 조회
    const itineraryId = params?.id;
    if (itineraryId) {
      setTimeout(() => {
        const savedItineraries = JSON.parse(
          localStorage.getItem("busanconnect_itineraries") || "{}"
        );
        if (savedItineraries[itineraryId]) {
          const saved = savedItineraries[itineraryId];
          setItinerary({
            ...saved,
            createdAt: new Date(saved.createdAt),
          });
        }
        setLoading(false);
      }, 300);
    }
  }, [params?.id]);

  const handleSaveItinerary = () => {
    if (!itinerary) return;

    const savedItineraries = JSON.parse(
      localStorage.getItem("busanconnect_itineraries") || "{}"
    );
    savedItineraries[itinerary.id] = itinerary;
    localStorage.setItem("busanconnect_itineraries", JSON.stringify(savedItineraries));

    toast.success("일정이 저장되었습니다");
  };

  const handleAddDay = () => {
    if (!itinerary) return;

    const lastDate = new Date(itinerary.endDate);
    const newDate = new Date(lastDate);
    newDate.setDate(newDate.getDate() + 1);

    const newDay: ItineraryDay = {
      date: newDate.toISOString().split("T")[0],
      activities: [],
    };

    setItinerary({
      ...itinerary,
      days: [...itinerary.days, newDay],
      endDate: newDate.toISOString().split("T")[0],
    });

    toast.success("새로운 날짜가 추가되었습니다");
  };

  const handleDeleteDay = (dayIndex: number) => {
    if (!itinerary) return;

    const newDays = itinerary.days.filter((_, i) => i !== dayIndex);
    setItinerary({
      ...itinerary,
      days: newDays,
    });

    toast.success("날짜가 삭제되었습니다");
  };

  const handleAddActivity = (dayIndex: number) => {
    if (!itinerary || !newActivityData.time || !newActivityData.title) {
      toast.error("필수 정보를 입력해주세요");
      return;
    }

    const newDays = [...itinerary.days];
    newDays[dayIndex].activities.push({
      ...newActivityData,
      id: Date.now().toString(),
    });

    setItinerary({
      ...itinerary,
      days: newDays,
    });

    setNewActivityData({
      id: "",
      time: "",
      title: "",
      location: "",
      description: "",
    });
    setNewActivityDay(null);

    toast.success("활동이 추가되었습니다");
  };

  const handleEditActivity = (dayIndex: number, activityIndex: number) => {
    const activity = itinerary?.days[dayIndex].activities[activityIndex];
    if (activity) {
      setEditingActivity({ dayIndex, activityIndex });
      setEditingActivityData({ ...activity });
    }
  };

  const handleSaveEditActivity = () => {
    if (!itinerary || !editingActivity || !editingActivityData) return;

    if (!editingActivityData.time || !editingActivityData.title) {
      toast.error("필수 정보를 입력해주세요");
      return;
    }

    const newDays = [...itinerary.days];
    newDays[editingActivity.dayIndex].activities[editingActivity.activityIndex] =
      editingActivityData;

    setItinerary({
      ...itinerary,
      days: newDays,
    });

    setEditingActivity(null);
    setEditingActivityData(null);

    toast.success("활동이 수정되었습니다");
  };

  const handleDeleteActivity = (dayIndex: number, activityIndex: number) => {
    if (!itinerary) return;

    const newDays = [...itinerary.days];
    newDays[dayIndex].activities = newDays[dayIndex].activities.filter(
      (_, i) => i !== activityIndex
    );

    setItinerary({
      ...itinerary,
      days: newDays,
    });

    toast.success("활동이 삭제되었습니다");
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
              요청하신 일정이 존재하지 않습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setLocation("/itinerary")}
              className="w-full flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              일정 목록으로
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              onClick={() => setLocation("/itinerary")}
              variant="outline"
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              돌아가기
            </Button>
            <h1 className="text-4xl font-bold text-ocean-dark">
              {itinerary.title} 편집
            </h1>
            <p className="text-muted mt-2">{itinerary.description}</p>
          </div>
          <Button
            onClick={handleSaveItinerary}
            className="flex items-center gap-2 h-fit"
          >
            <Save className="w-5 h-5" />
            저장
          </Button>
        </div>

        {/* Days */}
        <div className="space-y-6">
          {itinerary.days.map((day, dayIndex) => (
            <Card key={day.date} className="surface-card shadow-lg">
              <CardHeader className="panel-header-soft">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Badge>
                      Day {dayIndex + 1}
                    </Badge>
                    <CardTitle>
                      {new Date(day.date).toLocaleDateString("ko-KR", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardTitle>
                  </div>
                  {itinerary.days.length > 1 && (
                    <Button
                      onClick={() => handleDeleteDay(dayIndex)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      날짜 삭제
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Activities */}
                <div className="space-y-4 mb-6">
                  {day.activities.map((activity, actIndex) => (
                    <div
                      key={activity.id}
                      className="rounded-lg border border-border bg-background/70 p-4"
                    >
                      {editingActivity?.dayIndex === dayIndex &&
                      editingActivity?.activityIndex === actIndex ? (
                        // Edit Mode
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm font-medium text-subtle">
                                시간 *
                              </label>
                              <Input
                                type="time"
                                value={editingActivityData?.time || ""}
                                onChange={(e) =>
                                  setEditingActivityData({
                                    ...editingActivityData!,
                                    time: e.target.value,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-subtle">
                                제목 *
                              </label>
                              <Input
                                value={editingActivityData?.title || ""}
                                onChange={(e) =>
                                  setEditingActivityData({
                                    ...editingActivityData!,
                                    title: e.target.value,
                                  })
                                }
                                placeholder="활동 제목"
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-subtle">
                              위치
                            </label>
                            <Input
                              value={editingActivityData?.location || ""}
                              onChange={(e) =>
                                setEditingActivityData({
                                  ...editingActivityData!,
                                  location: e.target.value,
                                })
                              }
                              placeholder="위치"
                              className="mt-1"
                            />
                          </div>
                          <div>
                              <label className="text-sm font-medium text-subtle">
                              설명
                            </label>
                            <Textarea
                              value={editingActivityData?.description || ""}
                              onChange={(e) =>
                                setEditingActivityData({
                                  ...editingActivityData!,
                                  description: e.target.value,
                                })
                              }
                              placeholder="활동 설명"
                              className="mt-1"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleSaveEditActivity}
                              className="flex-1"
                            >
                              저장
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingActivity(null);
                                setEditingActivityData(null);
                              }}
                              variant="outline"
                              className="flex-1"
                            >
                              취소
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-ocean-dark" />
                                <p className="font-semibold text-navy">
                                {activity.time}
                              </p>
                            </div>
                              <h4 className="text-lg font-bold text-navy mb-1">
                              {activity.title}
                            </h4>
                            {activity.location && (
                              <div className="flex items-center gap-2 mb-2">
                                  <MapPin className="w-4 h-4 text-muted" />
                                  <p className="text-sm text-muted">
                                  {activity.location}
                                </p>
                              </div>
                            )}
                            {activity.description && (
                                <p className="text-sm text-subtle bg-background/70 rounded p-2">
                                {activity.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() =>
                                handleEditActivity(dayIndex, actIndex)
                              }
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                              수정
                            </Button>
                            <Button
                              onClick={() =>
                                handleDeleteActivity(dayIndex, actIndex)
                              }
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              삭제
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Activity */}
                {newActivityDay === dayIndex ? (
                        <Card className="info-panel">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                                  <label className="text-sm font-medium text-subtle">
                              시간 *
                            </label>
                            <Input
                              type="time"
                              value={newActivityData.time}
                              onChange={(e) =>
                                setNewActivityData({
                                  ...newActivityData,
                                  time: e.target.value,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                                  <label className="text-sm font-medium text-subtle">
                              제목 *
                            </label>
                            <Input
                              value={newActivityData.title}
                              onChange={(e) =>
                                setNewActivityData({
                                  ...newActivityData,
                                  title: e.target.value,
                                })
                              }
                              placeholder="활동 제목"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                                <label className="text-sm font-medium text-subtle">
                            위치
                          </label>
                          <Input
                            value={newActivityData.location}
                            onChange={(e) =>
                              setNewActivityData({
                                ...newActivityData,
                                location: e.target.value,
                              })
                            }
                            placeholder="위치"
                            className="mt-1"
                          />
                        </div>
                        <div>
                                <label className="text-sm font-medium text-subtle">
                            설명
                          </label>
                          <Textarea
                            value={newActivityData.description}
                            onChange={(e) =>
                              setNewActivityData({
                                ...newActivityData,
                                description: e.target.value,
                              })
                            }
                            placeholder="활동 설명"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddActivity(dayIndex)}
                            className="flex-1"
                          >
                            추가
                          </Button>
                          <Button
                            onClick={() => {
                              setNewActivityDay(null);
                              setNewActivityData({
                                id: "",
                                time: "",
                                title: "",
                                location: "",
                                description: "",
                              });
                            }}
                            variant="outline"
                            className="flex-1"
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Button
                    onClick={() => setNewActivityDay(dayIndex)}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    활동 추가
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Day Button */}
        <Button
          onClick={handleAddDay}
          className="w-full mt-6 flex items-center justify-center gap-2 py-6"
        >
          <Plus className="w-5 h-5" />
          새로운 날짜 추가
        </Button>

        {/* Save Button */}
        <Button
          onClick={handleSaveItinerary}
          className="w-full mt-4 flex items-center justify-center gap-2 py-6 text-lg"
        >
          <Save className="w-5 h-5" />
          모든 변경사항 저장
        </Button>
      </div>
    </div>
  );
}
