import { useState, type ComponentType } from "react";
import { Link, useLocation } from "wouter";
import { Calendar, Globe, LogOut, Map, MapPin, Menu, MessageSquare, MoonStar, SunMedium, User, Users, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { LANGUAGES, useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type NavLinkItem = {
  href: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
};

function isLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, switchable } = useTheme();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLang = LANGUAGES.find((item) => item.code === language)!;

  const navLinks: NavLinkItem[] = [
    { href: "/", label: t("nav.home") },
    { href: "/community", label: t("nav.community"), icon: MessageSquare },
    { href: "/guide", label: t("nav.guide"), icon: MapPin },
    { href: "/naver-map", label: t("nav.map"), icon: Map },
    { href: "/itinerary", label: "Itinerary", icon: Calendar },
    { href: "/tour", label: "Tour Course", icon: Users },
  ];

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full nav-shell">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex flex-shrink-0 items-center gap-2">
          <div className="relative h-8 w-8">
            <svg viewBox="0 0 32 32" className="h-full w-full">
              <defs>
                <radialGradient id="logoGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#7ab2ff" />
                  <stop offset="100%" stopColor="#0066ff" />
                </radialGradient>
              </defs>
              <circle cx="16" cy="16" r="14" fill="none" stroke="url(#logoGrad)" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="8" fill="none" stroke="url(#logoGrad)" strokeWidth="1" />
              <circle cx="22" cy="16" r="6" fill="none" stroke="url(#logoGrad)" strokeWidth="0.8" opacity="0.7" />
              <circle cx="10" cy="16" r="6" fill="none" stroke="url(#logoGrad)" strokeWidth="0.8" opacity="0.7" />
              <circle cx="16" cy="10" r="6" fill="none" stroke="url(#logoGrad)" strokeWidth="0.8" opacity="0.7" />
              <circle cx="16" cy="22" r="6" fill="none" stroke="url(#logoGrad)" strokeWidth="0.8" opacity="0.7" />
              <circle cx="16" cy="16" r="2" fill="url(#logoGrad)" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-ocean-dark">
              BusanConnect
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-widest text-ocean-dark/80 sm:block">
              {t("nav.tagline")}
            </span>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 px-4 lg:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <span className={isLinkActive(location, href) ? "nav-link nav-link-active text-sm font-medium" : "nav-link text-sm font-medium"}>
                {Icon ? <Icon className="h-4 w-4" /> : null}
                {label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="nav-link gap-1.5 font-medium">
                <Globe className="h-4 w-4" />
                <span className="hidden text-xs sm:inline">{currentLang.flag}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? "font-semibold text-ocean-dark" : ""}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.nativeLabel}
                  {language === lang.code ? <span className="ml-auto text-ocean">OK</span> : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {switchable ? (
            <Button
              variant="ghost"
              size="icon"
              className="theme-toggle"
              onClick={() => toggleTheme?.()}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </Button>
          ) : null}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="nav-link gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="avatar-shell-brand text-xs font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-24 truncate text-sm font-medium sm:inline">
                    {user?.name || t("nav.profile")}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t("nav.profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/itinerary" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Itinerary
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tour" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Tour Course
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              className="font-medium"
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
            >
              {t("nav.login")}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="nav-link h-9 w-9 p-0 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border bg-card/95 backdrop-blur-md lg:hidden">
          <nav className="container flex flex-col gap-1 py-3">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <span
                  className={isLinkActive(location, href) ? "nav-link nav-link-active text-sm font-medium" : "nav-link text-sm font-medium"}
                  onClick={closeMobileMenu}
                >
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  {label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
