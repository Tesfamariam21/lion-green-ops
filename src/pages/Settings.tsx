import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { User, Bell, Shield, Save } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading, signOut } = useAuth();
  
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    notifications: {
      email: true,
      dispatch: true,
      reports: false,
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
    
    if (profile) {
      setSettings((prev) => ({
        ...prev,
        name: profile.name || "",
        email: profile.email || "",
      }));
    }
  }, [user, loading, profile, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleSave = async () => {
    if (!profile?.id) return;
    
    const { error } = await supabase
      .from("profiles")
      .update({
        name: settings.name,
        email: settings.email,
      })
      .eq("id", profile.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const userInfo = {
    name: profile?.name || user.email?.split("@")[0] || "User",
    role: profile?.role || "quality_inspector",
  };

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account and preferences"
      user={userInfo}
      onLogout={handleLogout}
    >
      <div className="max-w-3xl space-y-8">
        {/* Profile Section */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <User className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Profile Settings
              </h3>
              <p className="text-sm text-muted-foreground">
                Update your personal information
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={profile?.role || "User"} disabled className="opacity-60" />
            </div>
            <div className="space-y-2">
              <Label>Account Status</Label>
              <Input value={profile?.is_active ? "Active" : "Inactive"} disabled className="opacity-60" />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Notifications
              </h3>
              <p className="text-sm text-muted-foreground">
                Configure how you receive updates
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, email: checked },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Dispatch Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about new dispatches
                </p>
              </div>
              <Switch
                checked={settings.notifications.dispatch}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, dispatch: checked },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-foreground">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">
                  Receive weekly summary reports
                </p>
              </div>
              <Switch
                checked={settings.notifications.reports}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, reports: checked },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Security
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage your account security
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Enable Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              Deactivate Account
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button variant="brand" size="lg" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
