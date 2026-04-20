import { Button } from "@/components/ui/button";
import { Chrome, Smartphone, MessageCircle, Facebook } from "lucide-react";

interface SocialLoginButtonsProps {
  onGoogleClick?: () => void;
  onLineClick?: () => void;
  onWechatClick?: () => void;
  onFacebookClick?: () => void;
  isLoading?: boolean;
}

export function SocialLoginButtons({
  onGoogleClick,
  onLineClick,
  onWechatClick,
  onFacebookClick,
  isLoading = false,
}: SocialLoginButtonsProps) {
  return (
    <div className="space-y-3">
      <Button
        onClick={onGoogleClick}
        disabled={isLoading}
        className="secondary-button w-full flex items-center justify-center gap-2"
        variant="outline"
      >
        <Chrome className="w-5 h-5" />
        Google로 로그인
      </Button>

      <Button
        onClick={onLineClick}
        disabled={isLoading}
        className="w-full bg-[#00B900] text-white hover:bg-[#009900] flex items-center justify-center gap-2"
      >
        <Smartphone className="w-5 h-5" />
        LINE으로 로그인
      </Button>

      <Button
        onClick={onWechatClick}
        disabled={isLoading}
        className="w-full bg-[#09B83E] text-white hover:bg-[#07a535] flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-5 h-5" />
        WeChat으로 로그인
      </Button>

      <Button
        onClick={onFacebookClick}
        disabled={isLoading}
        className="w-full bg-[#1877F2] text-white hover:bg-[#0A66C2] flex items-center justify-center gap-2"
      >
        <Facebook className="w-5 h-5" />
        Facebook으로 로그인
      </Button>
    </div>
  );
}
