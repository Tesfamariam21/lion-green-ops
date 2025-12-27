import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { loading: codeLoading, verifyAccessCode } = useAdminAccess();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAccessCodeDialog, setShowAccessCodeDialog] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [accessError, setAccessError] = useState("");

  useEffect(() => {
    if (authLoading || codeLoading) return;
    
    if (!user) {
      navigate("/login");
      return;
    }

    const adminVerified = sessionStorage.getItem("lgs_admin_verified");
    if (adminVerified === "true") {
      setIsAuthorized(true);
    } else {
      setShowAccessCodeDialog(true);
    }
  }, [user, authLoading, codeLoading, navigate]);

  const handleAccessCodeSubmit = () => {
    if (verifyAccessCode(accessCode)) {
      sessionStorage.setItem("lgs_admin_verified", "true");
      setIsAuthorized(true);
      setShowAccessCodeDialog(false);
      toast({ title: "Access Granted", description: "Welcome to the admin area." });
    } else {
      setAccessError("Invalid access code. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowAccessCodeDialog(false);
    navigate("/dashboard");
  };

  if (authLoading || codeLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (showAccessCodeDialog) {
    return (
      <div className="min-h-screen bg-background">
        <Dialog open={showAccessCodeDialog} onOpenChange={(open) => !open && handleCancel()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-accent" />
                Admin Access Verification
              </DialogTitle>
              <DialogDescription>
                Enter the admin access code to continue to this restricted area.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                type="password"
                placeholder="Enter access code"
                value={accessCode}
                onChange={(e) => { setAccessCode(e.target.value); setAccessError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleAccessCodeSubmit()}
              />
              {accessError && <p className="text-sm text-destructive">{accessError}</p>}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleAccessCodeSubmit}>Verify</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return <>{children}</>;
};

export default AdminRoute;
