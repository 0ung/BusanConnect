import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
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
  Users,
  Share2,
  Copy,
  Check,
  UserPlus,
  Trash,
} from "lucide-react";
import { toast } from "sonner";

interface Collaborator {
  id: string;
  name: string;
  email?: string;
  role: "owner" | "editor" | "viewer";
  joinedAt: Date;
  avatar?: string;
}

interface Activity {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  editedBy?: string;
  editedAt?: Date;
}

interface ItineraryDay {
  date: string;
  activities: Activity[];
}

interface CollaborativeItinerary {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
  createdAt: Date;
  createdBy: string;
  collaborators: Collaborator[];
  inviteCode: string;
  inviteUrl: string;
  isPublic: boolean;
  shareUrl?: string;
}

export default function CollaborativeItinerary() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, params] = useRoute("/itinerary/:id/collaborate");
  const [, setLocation] = useLocation();
  const [itinerary, setItinerary] = useState<CollaborativeItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<{
    dayIndex: number;
    activityIndex: number;
  } | null>(null);
  const [editingActivityData, setEditingActivityData] = useState<Activity | null>(null);
  const [newActivityDay, setNewActivityDay] = useState<number | null>(null);
  const [newActivityData, setNewActivityData] = useState<Activity>({
    id: "",
    time: "",
    title: "",
    location: "",
    description: "",
  });
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor");
  const [copiedInviteCode, setCopiedInviteCode] = useState(false);

  const isOwner = String(user?.id) === itinerary?.createdBy;
  const isEditor = itinerary?.collaborators.some(
    (c) => c.id === String(user?.id) && (c.role === "owner" || c.role === "editor")
  );

  useEffect(() => {
    const itineraryId = params?.id;
    if (itineraryId) {
      setTimeout(() => {
        const savedItineraries = JSON.parse(
          localStorage.getItem("busanconnect_collaborative_itineraries") || "{}"
        );
        if (savedItineraries[itineraryId]) {
          const saved = savedItineraries[itineraryId];
          setItinerary({
            ...saved,
            createdAt: new Date(saved.createdAt),
            collaborators: saved.collaborators.map((c: any) => ({
              ...c,
              joinedAt: new Date(c.joinedAt),
            })),
          });
        } else {
          // 새 협업 일정 생성
          const newItinerary: CollaborativeItinerary = {
            id: itineraryId,
            title: "새로운 협업 일정",
            description: "",
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
            days: [
              {
                date: new Date().toISOString().split("T")[0],
                activities: [],
              },
            ],
            createdAt: new Date(),
            createdBy: String(user?.id) || "unknown",
            collaborators: [
              {
                id: String(user?.id) || "unknown",
                name: user?.name || "나",
                role: "owner",
                joinedAt: new Date(),
                avatar: "👤",
              },
            ],
            inviteCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
            inviteUrl: `${window.location.origin}/itinerary/${itineraryId}/join`,
            isPublic: false,
          };
          setItinerary(newItinerary);
        }
        setLoading(false);
      }, 300);
    }
  }, [params?.id, user?.id, user?.name]);

  const handleSaveItinerary = () => {
    if (!itinerary) return;

    const savedItineraries = JSON.parse(
      localStorage.getItem("busanconnect_collaborative_itineraries") || "{}"
    );
    savedItineraries[itinerary.id] = itinerary;
    localStorage.setItem(
      "busanconnect_collaborative_itineraries",
      JSON.stringify(savedItineraries)
    );

    toast.success("일정이 저장되었습니다");
  };

  const handleInviteCollaborator = () => {
    if (!itinerary || !inviteEmail) {
      toast.error("이메일을 입력해주세요");
      return;
    }

    const newCollaborator: Collaborator = {
      id: Math.random().toString(36).substring(2, 9),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      joinedAt: new Date(),
      avatar: "👥",
    };

    setItinerary({
      ...itinerary,
      collaborators: [...itinerary.collaborators, newCollaborator],
    });

    setInviteEmail("");
    toast.success(`${inviteEmail}을(를) ${inviteRole === "editor" ? "편집자" : "뷰어"}로 초대했습니다`);
  };

  const handleRemoveCollaborator = (collaboratorId: string) => {
    if (!itinerary) return;

    if (collaboratorId === itinerary.createdBy) {
      toast.error("소유자는 제거할 수 없습니다");
      return;
    }

    setItinerary({
      ...itinerary,
      collaborators: itinerary.collaborators.filter((c) => c.id !== collaboratorId),
    });

    toast.success("협업자가 제거되었습니다");
  };

  const handleChangeRole = (collaboratorId: string, newRole: "editor" | "viewer") => {
    if (!itinerary || !isOwner) {
      toast.error("권한이 없습니다");
      return;
    }

    setItinerary({
      ...itinerary,
      collaborators: itinerary.collaborators.map((c) =>
        c.id === collaboratorId ? { ...c, role: newRole } : c
      ),
    });

    toast.success("권한이 변경되었습니다");
  };

  const handleCopyInviteCode = () => {
    if (!itinerary) return;
    navigator.clipboard.writeText(itinerary.inviteCode);
    setCopiedInviteCode(true);
    setTimeout(() => setCopiedInviteCode(false), 2000);
    toast.success("초대 코드가 복사되었습니다");
  };

  const handleAddActivity = (dayIndex: number) => {
    if (!isEditor) {
      toast.error("편집 권한이 없습니다");
      return;
    }

    if (!itinerary || !newActivityData.time || !newActivityData.title) {
      toast.error("필수 정보를 입력해주세요");
      return;
    }

    const newDays = [...itinerary.days];
    newDays[dayIndex].activities.push({
      ...newActivityData,
      id: Date.now().toString(),
      editedBy: user?.name || "익명",
      editedAt: new Date(),
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
    if (!isEditor) {
      toast.error("편집 권한이 없습니다");
      return;
    }

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
    newDays[editingActivity.dayIndex].activities[editingActivity.activityIndex] = {
      ...editingActivityData,
      editedBy: user?.name || "익명",
      editedAt: new Date(),
    };

    setItinerary({
      ...itinerary,
      days: newDays,
    });

    setEditingActivity(null);
    setEditingActivityData(null);

    toast.success("활동이 수정되었습니다");
  };

  const handleDeleteActivity = (dayIndex: number, activityIndex: number) => {
    if (!isEditor) {
      toast.error("편집 권한이 없습니다");
      return;
    }

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
        <Card className="w-full max-w-md border-0 shadow-lg">
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
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader>
            <CardTitle>일정을 찾을 수 없습니다</CardTitle>
            <CardDescription>요청하신 일정이 존재하지 않습니다.</CardDescription>
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex-1">
            <Button
              onClick={() => setLocation("/itinerary")}
              variant="outline"
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              돌아가기
            </Button>
            <h1 className="text-4xl font-bold text-ocean-dark">
              {itinerary.title} (협업)
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Days */}
            {itinerary.days.map((day, dayIndex) => (
              <Card key={day.date} className="border-0 shadow-lg">
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
                    disabled={!isEditor}
                  />
                </div>
                <div>
                                <label className="text-sm font-medium text-subtle">
                    제목 *
                  </label>
                  <Input
                    type="text"
                    value={editingActivityData?.title || ""}
                    onChange={(e) =>
                      setEditingActivityData({
                        ...editingActivityData!,
                        title: e.target.value,
                      })
                    }
                    placeholder="활동 제목"
                    className="mt-1"
                    disabled={!isEditor}
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
                                disabled={!isEditor}
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
                                disabled={!isEditor}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={handleSaveEditActivity}
                                className="flex-1"
                                disabled={!isEditor}
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
                                <p className="text-sm text-subtle bg-background/70 rounded p-2 mb-2">
                                  {activity.description}
                                </p>
                              )}
                              {activity.editedBy && (
                                <p className="text-xs text-muted">
                                  {activity.editedBy}가 편집함
                                </p>
                              )}
                            </div>
                            {isEditor && (
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
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Activity */}
                  {isEditor && (
                    <>
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
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar - Collaborators */}
          <div className="space-y-6">
            {/* Collaborators Card */}
            <Card className="border-0 shadow-lg sticky top-4">
              <CardHeader className="panel-header-soft">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  협업자 ({itinerary.collaborators.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3 mb-4">
                  {itinerary.collaborators.map((collab) => (
                    <div
                      key={collab.id}
                      className="flex items-center justify-between rounded-lg bg-background/70 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{collab.avatar || "👤"}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-navy">
                            {collab.name}
                          </p>
                          <p className="text-xs text-muted">{collab.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOwner && collab.role !== "owner" && (
                          <select
                            value={collab.role}
                            onChange={(e) =>
                              handleChangeRole(
                                collab.id,
                                e.target.value as "editor" | "viewer"
                              )
                            }
                            className="ui-input-chrome rounded px-2 py-1 text-xs"
                          >
                            <option value="editor">편집</option>
                            <option value="viewer">보기</option>
                          </select>
                        )}
                        {collab.role === "owner" && (
                          <Badge className="text-xs">
                            소유자
                          </Badge>
                        )}
                        {isOwner && collab.role !== "owner" && (
                          <Button
                            onClick={() => handleRemoveCollaborator(collab.id)}
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                          >
                            <Trash className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {isOwner && (
                  <Button
                    onClick={() => setShowInviteModal(true)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    협업자 초대
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Invite Code Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  초대 코드
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="info-panel rounded-lg p-3">
                  <p className="text-xs text-muted mb-2">초대 코드</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono font-bold text-lg text-ocean-dark">
                      {itinerary.inviteCode}
                    </code>
                    <Button
                      onClick={handleCopyInviteCode}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      {copiedInviteCode ? (
                        <>
                          <Check className="w-4 h-4" />
                          복사됨
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          복사
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted">
                  이 코드를 친구와 공유하면 협업 일정에 참여할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md border-0 shadow-2xl">
              <CardHeader>
                <CardTitle>협업자 초대</CardTitle>
                <CardDescription>
                  이메일로 협업자를 초대하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                              <label className="text-sm font-medium text-subtle">
                    이메일 주소 *
                  </label>
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-subtle">
                    권한
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) =>
                      setInviteRole(e.target.value as "editor" | "viewer")
                    }
                    className="ui-input-chrome mt-1 w-full rounded-lg px-3 py-2"
                  >
                    <option value="editor">편집자 (편집 가능)</option>
                    <option value="viewer">뷰어 (보기만 가능)</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleInviteCollaborator}
                    className="flex-1"
                  >
                    초대
                  </Button>
                  <Button
                    onClick={() => setShowInviteModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
