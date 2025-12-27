import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const COMPANY_DOMAIN = "liongreensolution.com";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "Reset Password | Lion Green Solution";

    // The recovery link should establish a session automatically; this checks if we have one.
    supabase.auth.getSession().then(({ data }) => {
      setLoading(false);

      // If there's no session, user likely opened this page directly.
      if (!data.session) return;

      const email = (data.session.user.email || "").toLowerCase();
      if (email && !email.endsWith(`@${COMPANY_DOMAIN}`)) {
        // Safety: prevent non-company accounts from using this page.
        supabase.auth.signOut();
        toast({
          title: "Invalid account",
          description: `Please use a @${COMPANY_DOMAIN} account.`,
          variant: "destructive",
        });
        navigate("/login");
      }
    });
  }, [navigate, toast]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please re-enter the same password.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    toast({
      title: "Password updated",
      description: "You can now sign in with your new password.",
    });

    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-hero-pattern flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" showTagline />
        </div>

        <div className="glass-card p-8 animate-fade-in">
          <header className="text-center mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Reset Password
            </h1>
            <p className="text-muted-foreground">
              Opened from the reset email link.
            </p>
          </header>

          <main>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" variant="brand" size="lg" className="w-full" disabled={saving}>
                {saving ? "Saving..." : "Update password"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Back to login
              </Button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
