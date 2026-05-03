"use client";


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
  ChevronLeft,    
  Eye,             
  EyeOff,          
} from "lucide-react";
import { authLogin } from "../../api/auth";
import { getCaptchaImg } from "../../api/captcha";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { Button } from "@/components/ui/button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  // Captcha state
  const [captchaId, setCaptchaId] = useState("");
  const [captchaImg, setCaptchaImg] = useState("");
  const [verifyCode, setVerifyCode] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // Lấy captcha
  const fetchCaptcha = async () => {
    try {
      const res = await getCaptchaImg(API_BASE_URL);
      setCaptchaId(res.data.id);
      setCaptchaImg(res.data.img);
    } catch (e) {
      setCaptchaId("");
      setCaptchaImg("");
      console.error("[DEBUG] Captcha API error:", e);
    }
  };

  React.useEffect(() => {
    fetchCaptcha();
  }, [API_BASE_URL]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const trialRoles = [
    { id: "admin", label: "Admin", icon: <User size={24} />, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
    { id: "branch-management", label: "Quản lý chi nhánh", icon: <School size={24} />, color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
    { id: "consultant", label: "Tư vấn viên", icon: <Headphones size={24} />, color: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
    { id: "teacher", label: "Giáo Viên", icon: <Presentation size={24} />, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
    { id: "student", label: "Học viên", icon: <GraduationCap size={24} />, color: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400" },
    { id: "parents", label: "Phụ huynh", icon: <Users size={24} />, color: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400" },
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

    setIsLoading(true);
    try {
      const loginData = {
        username: username.trim(),
        password: password,
        captchaId,
        verifyCode: verifyCode.trim(),
      };

      const response = await authLogin(loginData);

      if (response?.data?.code === 200 && response.data.data?.token) {
        const { token } = response.data;
        const userRole = "admin";
        const maxAge = isChecked ? 7 * 86400 : 86400;

        document.cookie = `user-token=${token}; path=/; max-age=${maxAge}`;
        document.cookie = `user-role=${userRole}; path=/; max-age=${maxAge}`;

        router.push(`/dashboard/${userRole}`);
        router.refresh();
      } else {
        const msg = response?.data?.message || "Tên đăng nhập, mật khẩu hoặc mã xác thực không đúng.";
        alert(msg);
        fetchCaptcha();
      }
    } catch (error) {
      console.error("SignIn API Error:", error);
      alert("Không thể kết nối tới máy chủ. Vui lòng kiểm tra Backend cổng 7001!");
      fetchCaptcha();
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
          <p className="dark:text-slate-400 text-sm font-medium text-slate-500">
            Enter your email and password to access MONA.
          </p>

          {/* Nút Trial */}
          <button
            type="button"
            onClick={() => setIsTrialModalOpen(true)}
            className="group relative mt-8 flex w-full items-center justify-between overflow-hidden rounded-2xl p-[2.5px] shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-95 dark:shadow-none"
          >
            <span className="absolute inset-[-1000%] animate-[spin_1.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f59e0b_0%,#fff_25%,#fbbf24_50%,#fff_75%,#f59e0b_100%)]" />

            <div className="relative z-10 flex h-full w-full items-center justify-between rounded-[13px] bg-amber-400 px-4 py-4 transition-colors group-hover:bg-amber-300">
              <span className="absolute inset-0 block h-full w-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 rounded-lg bg-slate-950 px-2.5 py-1.5 text-[11px] font-bold text-amber-400 shadow-lg">
                  <Zap size={14} fill="currentColor" className="animate-bounce" /> FREE
                </span>
                <span className="text-slate-900 text-sm font-bold tracking-normal italic">
                  Dùng thử nhanh các vai trò
                </span>
              </div>

              <ChevronLeft 
                size={20} 
                className="relative z-10 rotate-180 text-slate-900/70 transition-transform duration-300 group-hover:translate-x-1" 
              />
            </div>
          </button>
        </div>

        {/* ... Phần Google & X giữ nguyên ... */}

        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs font-bold tracking-widest text-slate-400">
            <span className="bg-white px-4 dark:bg-slate-900">Hoặc tiếp tục với Email</span>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
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
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-indigo-600"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </span>
            </div>
          </div>

          {/* Captcha */}
          <div>
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
                  src={captchaImg.startsWith("data:") ? captchaImg : `data:image/png;base64,${captchaImg}`}
                  alt="captcha"
                  className="h-10 cursor-pointer rounded border"
                  onClick={fetchCaptcha}
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Ghi nhớ tôi</span>
            </div>
            <Link href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
              Quên mật khẩu?
            </Link>
          </div>

          <Button className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700" size="sm">
            Sign in
          </Button>
        </form>

        {/* Phần đăng ký */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-indigo-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Modal Trial */}
      {isTrialModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md duration-300">
          <div className="animate-in zoom-in relative w-full max-w-2xl rounded-[32px] border border-slate-100 bg-white p-10 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setIsTrialModalOpen(false)}
              className="absolute top-8 right-8 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={22} />
            </button>

            <h2 className="mb-2 text-center text-2xl font-bold text-slate-900 dark:text-white">
              Trải nghiệm hệ thống
            </h2>
            <p className="mb-10 text-center text-sm text-slate-500 dark:text-slate-400">
              Chọn một vai trò để khám phá giao diện dành riêng.
            </p>

            {/* ... Phần trialRoles giữ nguyên ... */}

            <div className="mt-12">
              <button
                onClick={handleTrialSignIn}
                disabled={!selectedRole}
                className={`w-full rounded-2xl py-4 text-base font-bold shadow-xl transition-all ${
                  selectedRole
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800"
                }`}
              >
                Tiếp tục với vai trò {trialRoles.find((r) => r.id === selectedRole)?.label || ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}