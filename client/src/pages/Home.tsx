import { useLanguage } from "@/contexts/LanguageContext";
import { SacredGeometryBackground, SacredDivider } from "@/components/SacredGeometry";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Link } from "wouter";
import { ArrowRight, Globe, Map, MessageSquare, Sparkles, Star, Users } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Home() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { data: recentPosts } = api.posts.list.useQuery({ limit: 3, offset: 0 });

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: t("features.translation.title"),
      desc: t("features.translation.desc"),
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t("features.community.title"),
      desc: t("features.community.desc"),
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: t("features.guide.title"),
      desc: t("features.guide.desc"),
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: t("features.map.title"),
      desc: t("features.map.desc"),
    },
  ];

  const langLabels: Record<string, string> = {
    ko: "한국어",
    ja: "日本語",
    zh: "中文",
    en: "English",
  };

  const categoryLabels: Record<string, string> = {
    review: t("community.category.review"),
    question: t("community.category.question"),
    tip: t("community.category.tip"),
    general: t("community.category.general"),
  };

  return (
    <div className="page-shell">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/manus-storage/busan-hero_f8e87803.jpg')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 hero-ocean-overlay" />
        {/* Sacred Geometry overlay */}
        <SacredGeometryBackground />

        <div className="relative z-10 container py-24">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-white/20" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Busan · 부산 · 釜山
              </span>
              <div className="h-px w-12 bg-white/20" />
            </div>

            {/* Main headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-contrast leading-tight mb-6">
              {t("hero.title")}
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl font-display italic mb-4 text-white/80">
              {t("hero.subtitle")}
            </p>

            {/* Description */}
            <p className="text-hero-muted text-base sm:text-lg leading-relaxed mb-10 max-w-2xl">
              {t("hero.description")}
            </p>

            {/* Language badges */}
            <div className="flex flex-wrap gap-2 mb-10">
              {["🇰🇷 한국어", "🇯🇵 日本語", "🇨🇳 中文", "🇺🇸 English"].map((lang, i) => (
                <span
                  key={i}
                  className="hero-chip rounded-full px-3 py-1 text-xs font-semibold"
                >
                  {lang}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/community">
                <Button
                  size="lg"
                  className="hero-button-primary gap-2 px-8 font-semibold"
                >
                  <MessageSquare className="w-5 h-5" />
                  {t("hero.cta.community")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/guide">
                <Button
                  size="lg"
                  variant="outline"
                  className="hero-button-outline gap-2 px-8 font-semibold"
                >
                  <Map className="w-5 h-5" />
                  {t("hero.cta.guide")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 hero-bottom-fade" />
      </section>

      {/* ─── Features Section ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 opacity-5 sacred-pulse">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <circle cx="200" cy="200" r="180" fill="none" stroke="#7ab2ff" strokeWidth="1" />
              <circle cx="200" cy="200" r="120" fill="none" stroke="#7ab2ff" strokeWidth="0.8" />
              <circle cx="200" cy="200" r="60" fill="none" stroke="#7ab2ff" strokeWidth="0.6" />
            </svg>
          </div>
        </div>

        <div className="container">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#4c92ff]" />
              <Star className="w-4 h-4 text-ocean" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#4c92ff]" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-navy mb-4">
              {t("features.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="card-sacred rounded-xl p-6 text-center group"
              >
                <div className="feature-icon-shell mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-navy text-lg mb-2">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SacredDivider />

      {/* ─── Recent Community Posts ─── */}
      <section className="py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px w-8 bg-ocean opacity-70" />
                <span className="text-ocean text-xs font-semibold uppercase tracking-widest">Community</span>
              </div>
              <h2 className="font-display text-4xl font-bold text-navy">
                {t("community.subtitle")}
              </h2>
            </div>
            <Link href="/community">
              <Button variant="ghost" className="text-ocean-dark hover:text-foreground gap-1 font-medium">
                {t("common.more")} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {recentPosts && recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/community/${post.id}`}>
                  <div className="card-sacred rounded-xl p-6 cursor-pointer h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="badge-soft text-xs font-semibold">
                        {categoryLabels[post.category] || post.category}
                      </Badge>
                      <span className="text-xs text-muted">
                        {langLabels[post.originalLanguage] || post.originalLanguage}
                      </span>
                    </div>
                    <h3 className="font-semibold text-navy text-base mb-2 line-clamp-2 flex-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted line-clamp-2 mb-4">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-subtle">
                      <span>{post.authorName || t("common.by")}</span>
                      <span>{post.viewCount} {t("community.views")}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>{t("community.empty")}</p>
              {isAuthenticated ? (
                <Link href="/community/new">
                  <Button className="brand-button mt-4">
                    {t("community.write")}
                  </Button>
                </Link>
              ) : (
                <Button
                  className="brand-button mt-4"
                  onClick={() => (window.location.href = getLoginUrl())}
                >
                  {t("nav.login")}
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="section-brand py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 sacred-pulse">
          <svg viewBox="0 0 1200 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <circle cx="600" cy="150" r="200" fill="none" stroke="#7ab2ff" strokeWidth="1" />
            <circle cx="600" cy="150" r="130" fill="none" stroke="#7ab2ff" strokeWidth="0.8" />
            <circle cx="600" cy="150" r="60" fill="none" stroke="#7ab2ff" strokeWidth="0.6" />
            <circle cx="200" cy="150" r="100" fill="none" stroke="#7ab2ff" strokeWidth="0.5" />
            <circle cx="1000" cy="150" r="100" fill="none" stroke="#7ab2ff" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="container text-center relative z-10">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-contrast mb-4">
            부산을 함께 탐험하세요
          </h2>
          <p className="text-lg mb-8 font-display italic text-white/80">
            Explore Busan · 釜山を探検 · 探索釜山
          </p>
          {!isAuthenticated && (
            <Button
              size="lg"
              className="hero-button-primary gap-2 px-10 font-semibold"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              {t("nav.login")} <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
