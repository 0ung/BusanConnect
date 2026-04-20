import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Eye, Loader2, PenLine, Save, User } from "lucide-react";
import { SacredGeometryBackground } from "@/components/SacredGeometry";

type Lang = "ko" | "ja" | "zh" | "en";

export default function Profile() {
  const { t, language, setLanguage } = useLanguage();
  const { user, isAuthenticated, loading } = useAuth();

  const { data: profile, refetch: refetchProfile } = api.profile.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: myPosts } = api.profile.myPosts.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [prefLang, setPrefLang] = useState<Lang>(language as Lang);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || "");
      setBio(profile.bio || "");
      setPrefLang((profile.preferredLanguage as Lang) || "ko");
    }
  }, [profile]);

  const upsertProfile = api.profile.upsert.useMutation({
    onSuccess: () => {
      refetchProfile();
      setLanguage(prefLang);
      toast.success(t("profile.saved"));
      setIsSaving(false);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to save profile.");
      setIsSaving(false);
    },
  });

  function handleSave() {
    setIsSaving(true);
    upsertProfile.mutate({ nickname, bio, preferredLanguage: prefLang });
  }

  const categoryLabels: Record<string, string> = {
    review: t("community.category.review"),
    question: t("community.category.question"),
    tip: t("community.category.tip"),
    general: t("community.category.general"),
  };

  function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString(
      language === "ko" ? "ko-KR" : language === "ja" ? "ja-JP" : language === "zh" ? "zh-CN" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }
    );
  }

  if (loading) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ocean" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-ocean opacity-50" />
          <h2 className="font-display text-2xl font-bold text-navy mb-2">{t("common.login_to_continue")}</h2>
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

  return (
    <div className="page-shell min-h-screen">
      {/* Header */}
      <section className="section-brand relative py-16 overflow-hidden">
        <SacredGeometryBackground />
        <div className="container relative z-10">
          <div className="flex items-center gap-5">
            <div className="avatar-shell-brand flex h-20 w-20 items-center justify-center rounded-full border border-white/20">
              <span className="font-display text-3xl font-bold">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-contrast">
                {profile?.nickname || user?.name || t("profile.title")}
              </h1>
              <p className="text-white/70 text-sm mt-1">
                {user?.email || user?.openId}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-10 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Edit */}
          <div className="lg:col-span-1">
            <div className="surface-card rounded-2xl p-6">
              <h2 className="font-display font-bold text-navy text-lg mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-ocean" />
                {t("profile.title")}
              </h2>

              <div className="space-y-5">
                {/* Nickname */}
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">{t("profile.nickname")}</label>
                  <Input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder={user?.name || ""}
                    className="h-11 px-3"
                  />
                </div>

                {/* Preferred Language */}
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">{t("profile.preferred_language")}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setPrefLang(lang.code as Lang)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                          prefLang === lang.code
                            ? "soft-pill soft-pill-active"
                            : "soft-pill"
                        }`}
                      >
                        {lang.flag} {lang.nativeLabel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">{t("profile.bio")}</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={language === "ko" ? "자기소개를 입력하세요..." : "Write a short bio..."}
                    rows={4}
                    className="min-h-28 px-3 py-2.5"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="brand-button w-full gap-2 font-semibold"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {t("profile.save")}
                </Button>
              </div>
            </div>
          </div>

          {/* My Posts */}
          <div className="lg:col-span-2">
            <div className="surface-card overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-border p-6">
                <h2 className="font-display font-bold text-navy text-lg flex items-center gap-2">
                  <PenLine className="w-5 h-5 text-ocean" />
                  {t("profile.my_posts")} ({myPosts?.length ?? 0})
                </h2>
                <Link href="/community/new">
                  <Button
                    size="sm"
                    className="brand-button gap-1.5 text-xs"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    {t("community.write")}
                  </Button>
                </Link>
              </div>

              {myPosts && myPosts.length > 0 ? (
                <div className="divide-y divide-border/60">
                  {myPosts.map((post) => (
                    <Link key={post.id} href={`/community/${post.id}`}>
                      <div className="cursor-pointer p-5 transition-colors group hover:bg-background/60">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs font-medium text-ocean-dark">
                                {categoryLabels[post.category]}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-navy group-hover:text-ocean-dark transition-colors line-clamp-1">
                              {post.title}
                            </h3>
                            <p className="text-muted mt-1 line-clamp-1 text-xs">
                              {post.content}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-subtle text-xs">{formatDate(post.createdAt)}</p>
                            <div className="text-subtle mt-1 flex items-center justify-end gap-1 text-xs">
                              <Eye className="w-3 h-3" />
                              <span>{post.viewCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <PenLine className="w-12 h-12 mx-auto mb-3 text-[oklch(72%_0.12_75)] opacity-30" />
                  <p className="text-muted mb-4 text-sm">{t("community.empty")}</p>
                  <Link href="/community/new">
                    <Button size="sm" className="brand-button">
                      {t("community.write")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
