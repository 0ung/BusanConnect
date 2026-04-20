import { useAuth } from "@/_core/hooks/useAuth";
import { SocialLoginButtons } from "@/components/SocialLoginButtons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Login() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const loginMutation = api.auth.login.useMutation({
    onSuccess: () => {
      setLocation("/");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Mock login failed.";
      toast.error(message);
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleLogin = (provider: "google" | "line" | "wechat" | "facebook") => {
    loginMutation.mutate({ provider });
  };

  return (
    <div className="page-shell min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="surface-card shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-ocean-dark">
              BusanConnect
            </CardTitle>
            <CardDescription className="text-base">
              {t("nav.tagline")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Sign in to the mock app
              </h2>
              <p className="text-sm text-muted-foreground">
                Pick any provider below. A local demo account will be used and no backend call will be made.
              </p>
            </div>

            <SocialLoginButtons
              onGoogleClick={() => handleLogin("google")}
              onLineClick={() => handleLogin("line")}
              onWechatClick={() => handleLogin("wechat")}
              onFacebookClick={() => handleLogin("facebook")}
              isLoading={loginMutation.isPending}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card text-muted px-2">mock mode</span>
              </div>
            </div>

            <div className="info-panel rounded-lg p-4">
              <p className="text-subtle text-sm">
                <strong>Frontend only</strong> Community posts, comments, profile edits, and guide data are all stored in local mock storage for this browser session.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
