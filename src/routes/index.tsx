import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Key,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  User
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#5E6AD2] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-1 bg-[#5E6AD2]"></div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-[#5E6AD2] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <LayoutDashboard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Please sign in to access your dashboard
              </p>
              <button
                type="button"
                onClick={() => navigate({ to: "/sign-in/$" })}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5E6AD2] hover:bg-[#4C58B8] text-white rounded-md font-medium transition-colors"
              >
                Go to Login
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Navigation Bar - Linear Style */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#5E6AD2] rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || "User"}
                  </p>
                  <p className="text-xs text-gray-500">Signed in</p>
                </div>
                <div className="w-10 h-10 bg-[#5E6AD2] rounded-full flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/sign-in/$" });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Welcome back, {user?.fullName?.split(' ')[0] || "there"}! 👋
          </h2>
          <p className="text-gray-500 text-sm">
            Here's an overview of your account
          </p>
        </div>

        {/* Account Information Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">Account Information</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center py-2">
                <div className="flex items-center gap-2 w-32">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">Email</span>
                </div>
                <span className="text-gray-900 text-sm mt-1 sm:mt-0">
                  {user?.primaryEmailAddress?.emailAddress || "Not available"}
                </span>
              </div>
              
              
              <div className="flex flex-col sm:flex-row sm:items-center py-2">
                <div className="flex items-center gap-2 w-32">
                  <Key className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">User ID</span>
                </div>
                <span className="text-gray-600 font-mono text-xs mt-1 sm:mt-0">
                  {user?.id?.slice(0, 24)}...
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center py-2">
                <div className="flex items-center gap-2 w-32">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">Status</span>
                </div>
                <span className="inline-flex items-center gap-2 mt-1 sm:mt-0">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 text-sm font-medium">Active Session</span>
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}