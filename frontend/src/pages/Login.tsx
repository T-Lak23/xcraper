import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";

import { useAuthStore } from "../store/auth.store";
import { Loader } from "../components/ui/Loader";

const Login = () => {
  const { login, loginError, isAuthLoding, clearLoginError } = useAuthStore();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      navigate("/chat");
    } catch {
      // Error is already handled inside the auth store.
    }
  };

  const handleChange = (field: "email" | "password", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (loginError) {
      clearLoginError();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-200 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">
          {/* Brand / heading */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-950/30">
              <Sparkles size={25} strokeWidth={1.8} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-100">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Sign in to continue to your account
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-7">
            {/* Error */}
            {loginError && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                <p className="leading-5">{loginError}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <div className="group relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    disabled={isAuthLoding}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>
                </div>

                <div className="group relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={isAuthLoding}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isAuthLoding}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isAuthLoding}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAuthLoding ? (
                  <Loader label="Signing in..." />
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Secure authentication · Your account is protected
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
