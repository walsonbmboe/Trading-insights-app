import { Authenticator, useAuthenticator, View } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";

export default function AuthPage() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const navigate = useNavigate();

  // Redirect to sentiments page after successful authentication
  useEffect(() => {
    if (authStatus === "authenticated") {
      navigate("/sentiments");
    }
  }, [authStatus, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px] animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px] animate-pulse delay-1000" />

      <View className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-400">Sign in to access your trading insights</p>
        </div>

        {/* Custom styled Authenticator */}
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-xl p-8 shadow-2xl">
          <Authenticator
            socialProviders={[]}
            formFields={{
              signUp: {
                email: {
                  order: 1,
                  placeholder: "Enter your email",
                  isRequired: true,
                },
                password: {
                  order: 2,
                  placeholder: "Create a password",
                  isRequired: true,
                },
                confirm_password: {
                  order: 3,
                  placeholder: "Confirm your password",
                  isRequired: true,
                },
              },
            }}
          />
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </View>
    </div>
  );
}