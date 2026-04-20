import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer-shell">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="h-8 w-8">
                <defs>
                  <radialGradient id="footerLogoGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#7ab2ff" />
                    <stop offset="100%" stopColor="#0066ff" />
                  </radialGradient>
                </defs>
                <circle cx="16" cy="16" r="14" fill="none" stroke="url(#footerLogoGrad)" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="8" fill="none" stroke="url(#footerLogoGrad)" strokeWidth="1" />
                <circle cx="22" cy="16" r="6" fill="none" stroke="url(#footerLogoGrad)" strokeWidth="0.8" opacity="0.7" />
                <circle cx="10" cy="16" r="6" fill="none" stroke="url(#footerLogoGrad)" strokeWidth="0.8" opacity="0.7" />
                <circle cx="16" cy="16" r="2" fill="url(#footerLogoGrad)" />
              </svg>
              <span className="font-display text-xl font-bold text-gradient-ocean">BusanConnect</span>
            </div>
            <p className="footer-copy text-sm leading-relaxed">{t("nav.tagline")}</p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-widest text-ocean-light">Navigation</h4>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/", label: t("nav.home") },
                { href: "/community", label: t("nav.community") },
                { href: "/guide", label: t("nav.guide") },
                { href: "/naver-map", label: t("nav.map") },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="footer-link text-sm">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-widest text-ocean-light">Busan</h4>
            <p className="footer-copy text-sm leading-relaxed">
              Busan Metropolitan City, South Korea.
              <br />
              Local stories, places, and travel plans in one multilingual space.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-ocean animate-pulse" />
              <span className="footer-copy text-xs">35.1796 N / 129.0756 E</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="footer-copy text-xs">2026 BusanConnect. AI-powered multilingual travel community.</p>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-ocean opacity-60" />
            <div className="h-1 w-1 rounded-full bg-ocean opacity-40" />
            <div className="h-1 w-1 rounded-full bg-ocean opacity-20" />
          </div>
        </div>
      </div>
    </footer>
  );
}
