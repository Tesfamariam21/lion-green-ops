import { Zap } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
}

const Logo = ({ size = "md", showTagline = false }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-5xl",
  };

  const taglineSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 bg-accent/30 rounded-xl blur-lg animate-pulse-slow" />
        <div className="relative bg-gradient-to-br from-lion-green to-lion-green-light rounded-xl p-2 flex items-center justify-center h-full w-full border border-accent/30">
          <Zap className="text-foreground fill-current" style={{ width: '60%', height: '60%' }} />
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`font-display font-bold ${textSizes[size]} tracking-wider text-foreground`}>
          LGs
        </span>
        {showTagline && (
          <span className={`${taglineSizes[size]} text-accent font-medium tracking-wide`}>
            Energy Is Free!
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
