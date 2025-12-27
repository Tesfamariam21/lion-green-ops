import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, LogIn, Zap } from "lucide-react";

const COMPANY_DOMAIN = "liongreensolution.com";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate company email
    const emailLower = email.trim().toLowerCase();
    if (!emailLower.endsWith(`@${COMPANY_DOMAIN}`)) {
      toast({
        title: "Invalid Email",
        description: `Please use your company email (@${COMPANY_DOMAIN}).`,
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signIn(emailLower, password);

    if (error) {
      const isInvalidCreds = /invalid login credentials/i.test(error.message);

      toast({
        title: "Login Failed",
        description: isInvalidCreds
          ? "Account not found or password incorrect. If this is your first time, ask an admin to create your account, then click Reset password to set your own password."
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    const emailLower = email.trim().toLowerCase();
    if (!emailLower.endsWith(`@${COMPANY_DOMAIN}`)) {
      toast({
        title: "Invalid Email",
        description: `Please enter your company email (@${COMPANY_DOMAIN}) first.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(emailLower, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "We sent a password reset link to your inbox.",
      });
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-hero-pattern flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-lion-green to-lion-green-light relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

        {/* Animated Elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-40 right-20 w-60 h-60 bg-foreground/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
          <div className="mb-8">
            <Logo size="xl" showTagline />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Lion Green Solution
          </h2>
          <p className="text-foreground/80 text-lg max-w-md">
            Powering sustainable transportation with electric tricycles. Manage your fleet
            operations efficiently.
          </p>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-2 gap-6 w-full max-w-md">
            {["Dispatch Management", "Quality Control", "Fleet Tracking", "Analytics"].map(
              (feature, i) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-foreground/70 animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Zap className="h-4 w-4 text-accent" />
                  <span className="text-sm">{feature}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Logo size="lg" showTagline />
          </div>

          <div className="glass-card p-8 animate-fade-in">
            <div className="text-center mb-6">
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Staff Login
              </h1>
              <p className="text-muted-foreground">
                Sign in with your company email
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Company Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={`you@${COMPANY_DOMAIN}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                  onClick={handleResetPassword}
                >
                  Reset password
                </Button>
              </div>

              <Button type="submit" variant="brand" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Contact your administrator if you need an account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
