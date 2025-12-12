import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("lgs_user");
    
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    
    // Check if user has admin privileges
    if (user.role === "Admin" || user.role === "Dispatch Manager") {
      setIsAuthorized(true);
    } else {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page. Admin or Manager role required.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
    
    setIsChecking(false);
  }, [navigate, toast]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;
