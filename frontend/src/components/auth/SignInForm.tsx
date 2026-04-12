"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  User,
  School,
  Headphones,
  Presentation,
  GraduationCap,
  Users,
  Zap,
  X,
} from "lucide-react";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();
  // Captcha state - DISABLED
  // const [captchaId, setCaptchaId] = useState("");
  // const [captchaImg, setCaptchaImg] = useState("");
  // const [verifyCode, setVerifyCode] = useState("");

  // State để lưu thông tin nhập từ Form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const trialRoles = [
    {
      id: "branch-management",
      label: "Quản lý chi nhánh",
      icon: <School size={24} />,
      color:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    },
    {
      id: "consultant",
      label: "Tư vấn viên",
      icon: <Headphones size={24} />,
      color: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    },
    {
      id: "teacher",
      label: "Giáo Viên",
      icon: <Presentation size={24} />,
      color:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    {
      id: "student",
      label: "Học viên",
      icon: <GraduationCap size={24} />,
      color:
        "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    },
    {
      id: "parents",
      label: "Phụ huynh",
      icon: <Users size={24} />,
      color: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
    },
  ];

  const setAuthCookies = (token: string, role: string) => {
    const maxAge = 86400;
    document.cookie = `user-token=${token}; path=/; max-age=${maxAge}`;
    document.cookie = `user-role=${role}; path=/; max-age=${maxAge}`;
  };

  const handleTrialSignIn = () => {
    if (selectedRole) {
      setAuthCookies(`trial-token-${selectedRole}`, selectedRole);
      setIsTrialModalOpen(false);
      router.push(`/dashboard/${selectedRole}`);
      router.refresh();
    }
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      // Gửi request đến backend
      const response = await fetch("http://localhost:8081/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username.trim(),
          password: password,
        }),
      });

      console.log("[DEBUG] Response status:", response.status);
      console.log("[DEBUG] Response headers:", response.headers.get("content-type"));

      // Kiểm tra response content type
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("[DEBUG] Response is not JSON:", text);
        throw new Error(`Invalid response format: ${text.substring(0, 100)}`);
      }

      console.log("[DEBUG] Login response:", data);

      if (!response.ok) {
        throw new Error(data.message || data.error || `Login failed (${response.status})`);
      }

      // Lưu token
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }

        // Lấy role từ response hoặc mặc định là student
        const userRole = (data.role || "student").toLowerCase();

        // Lưu vào cookie
        const maxAge = isChecked ? 7 * 86400 : 86400;
        document.cookie = `user-token=${data.access_token}; path=/; max-age=${maxAge}`;
        document.cookie = `user-role=${userRole}; path=/; max-age=${maxAge}`;

        // Điều hướng dựa vào role
        const roleMap: Record<string, string> = {
          "admin": "/dashboard/admin",
          "manager": "/dashboard/manager",
          "teacher": "/dashboard/teacher",
          "student": "/dashboard/student",
          "consultant": "/dashboard/consultant",
          "parent": "/dashboard/parent",
        };

        const redirectPath = roleMap[userRole] || "/";
        router.push(redirectPath);
        router.refresh();
      } else {
        throw new Error("No access token received");
      }
    } catch (err: any) {
      const errorMsg = err.message || "An error occurred. Please try again.";
      setError(errorMsg);
      console.error("[DEBUG] Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in flex w-full flex-1 flex-col duration-500 lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-8">
          <h1 className="text-title-sm sm:text-title-md mb-2 leading-snug font-bold text-slate-900 dark:text-white">
            Sign In
          </h1>
          <p className="dark:text-slate-4 leading-relaxed00 text-sm leading-relaxed font-medium text-slate-500">
            Enter your email and password to access MONA.
          </p>

          <button
            type="button"
            onClick={() => setIsTrialModalOpen(true)}
            // 1. CONTAINER NGOÀI: Tăng cường shadow tỏa sáng màu vàng
            className="group relative mt-8 flex w-full items-center justify-between overflow-hidden rounded-2xl p-[2.5px] shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-95 dark:shadow-none"
          >
            {/* 2. VIỀN CHẠY SIÊU TỐC: Tốc độ xoay 1.5 giây (cực mạnh) */}
            <span className="absolute inset-[-1000%] animate-[spin_1.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f59e0b_0%,#fff_25%,#fbbf24_50%,#fff_75%,#f59e0b_100%)]" />

            {/* 3. MẶT NÚT MÀU VÀNG ĐƠN SẮC: Nền Amber rực rỡ */}
            <div className="relative z-10 flex h-full w-full items-center justify-between rounded-[13px] bg-amber-400 px-4 py-4 transition-colors group-hover:bg-amber-300">
              {/* 4. HIỆU ỨNG QUÉT SÁNG LIÊN TỤC: Tần suất cao trên nền vàng */}
              <span className="absolute inset-0 block h-full w-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent text-white" />

              <div className="flex items-center gap-3">
                {/* Badge FREE tương phản mạnh */}
                <span className="flex items-center gap-1 rounded-lg bg-slate-950 px-2.5 py-1.5 text-[11px] font-bold text-amber-400 shadow-lg">
                  <Zap
                    size={14}
                    fill="currentColor"
                    className="animate-bounce"
                  />{" "}
                  FREE
                </span>
                {/* Chữ chuyển sang màu đen để nổi bật trên nền vàng */}
                <span className="text-slate-9 leading-relaxed00 text-sm font-bold tracking-normal italic">
                  Dùng thử nhanh các vai trò
                </span>
              </div>

              {/* Icon mũi tên đen bóng */}
              <ChevronLeftIcon className="relative z-10 rotate-180 text-slate-900/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-950" />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
          <button className="dark:text-slate-2 leading-relaxed00 inline-flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-white/5 dark:hover:bg-white/10">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                fill="#4285F4"
              />
              <path
                d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                fill="#34A853"
              />
              <path
                d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                fill="#FBBC05"
              />
              <path
                d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                fill="#EB4335"
              />
            </svg>
            đăng nhập
          </button>
          <button className="dark:text-slate-2 leading-relaxed00 inline-flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-white/5 dark:hover:bg-white/10">
            <svg
              width="21"
              className="fill-current"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
            >
              <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
            </svg>
            đăng nhập
          </button>
        </div>

        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs font-bold tracking-widest text-slate-400">
            <span className="bg-white px-4 dark:bg-slate-900">
              Hoặc tiếp tục với Email
            </span>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
          {/* Error message display */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <Label className="font-bold text-slate-700 dark:text-slate-300">
              Email <span className="text-rose-500">*</span>
            </Label>
            <Input
              placeholder="admin@mona.guide"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label className="font-bold text-slate-700 dark:text-slate-300">
              Password <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-indigo-600"
              >
                {showPassword ? (
                  <EyeIcon size={18} />
                ) : (
                  <EyeCloseIcon size={18} />
                )}
              </span>
            </div>
          </div>
          {/* CAPTCHA DISABLED */}
          {/* <div>
            <Label className="font-bold text-slate-700 dark:text-slate-300">
              Mã xác thực <span className="text-rose-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Nhập mã xác thực"
                type="text"
                required
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                className="w-32"
              />
              {captchaImg && (
                <img
                  src={
                    captchaImg.startsWith("data:")
                      ? captchaImg
                      : `data:image/png;base64,${captchaImg}`
                  }
                  alt="captcha"
                  className="h-10 cursor-pointer rounded border"
                  onClick={fetchCaptcha}
                  title="Click để làm mới mã"
                />
              )}
            </div>
          </div> */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox checked={isChecked} onChange={setIsChecked} disabled={isLoading} />
              <span className="dark:text-slate-4 leading-relaxed00 text-sm font-medium text-slate-600">
                Ghi nhớ tôi
              </span>
            </div>
            <Link
              href="#"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed dark:shadow-none"
            size="sm"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="dark:text-slate-4 leading-relaxed00 text-sm leading-relaxed font-medium text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="ml-1 font-bold text-indigo-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* --- MODAL (TỐI ƯU MÀU SẮC) --- */}
      {isTrialModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md duration-300">
          <div className="animate-in zoom-in relative w-full max-w-2xl rounded-[32px] border border-slate-100 bg-white p-10 shadow-2xl duration-300 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setIsTrialModalOpen(false)}
              className="absolute top-8 right-8 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50"
            >
              <X size={20} />
            </button>
            <h2 className="mb-2 text-center text-2xl leading-snug font-bold text-slate-900 dark:text-white">
              Trải nghiệm hệ thống
            </h2>
            <p className="text-slate-5 leading-relaxed00 mb-10 text-center text-sm leading-relaxed">
              Chọn một vai trò để khám phá giao diện dành riêng.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {trialRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center justify-center gap-4 rounded-[24px] border p-6 transition-all duration-300 ${selectedRole === role.id ? "border-indigo-200 bg-indigo-50 shadow-md ring-2 ring-indigo-500/20" : "border-transparent bg-slate-50 hover:border-slate-200 hover:bg-white dark:bg-slate-800/50"}`}
                >
                  <div
                    className={`rounded-2xl p-4 shadow-sm ${role.color} ${selectedRole === role.id ? "scale-110" : ""} transition-transform`}
                  >
                    {role.icon}
                  </div>
                  <span
                    className={`text-center text-[11px] font-bold tracking-widest ${selectedRole === role.id ? "text-indigo-600" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    {role.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-12">
              <button
                onClick={handleTrialSignIn}
                disabled={!selectedRole}
                className={`w-full rounded-2xl py-4 text-base font-bold shadow-xl transition-all ${selectedRole ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 active:scale-95" : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800"}`}
              >
                Tiếp tục với vai trò{" "}
                {trialRoles.find((r) => r.id === selectedRole)?.label || ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
