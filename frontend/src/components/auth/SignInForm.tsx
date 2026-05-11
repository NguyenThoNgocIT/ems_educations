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

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Invalid response format: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `Login failed (${response.status})`);
      }

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }

        const userRole = (data.role || "student").toLowerCase();
        const maxAge = isChecked ? 7 * 86400 : 86400;
        document.cookie = `user-token=${data.access_token}; path=/; max-age=${maxAge}`;
        document.cookie = `user-role=${userRole}; path=/; max-age=${maxAge}`;

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
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in flex w-full flex-1 flex-col duration-500 lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10 px-4">
        <div className="mb-8">
          <h1 className="text-title-sm sm:text-title-md mb-2 leading-snug font-bold text-slate-900 dark:text-white">
            Sign In
          </h1>
          <p className="dark:text-slate-400 text-sm leading-relaxed font-medium text-slate-500">
            Chào mừng bạn đến với hệ thống quản lý giáo dục EMS.
          </p>

          {/* MỤC FREE GIỮ NGUYÊN */}
          <button
            type="button"
            onClick={() => setIsTrialModalOpen(true)}
            className="group relative mt-8 flex w-full items-center justify-between overflow-hidden rounded-2xl p-[2.5px] shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-95 dark:shadow-none"
          >
            <span className="absolute inset-[-1000%] animate-[spin_1.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f59e0b_0%,#fff_25%,#fbbf24_50%,#fff_75%,#f59e0b_100%)]" />
            <div className="relative z-10 flex h-full w-full items-center justify-between rounded-[13px] bg-amber-400 px-4 py-4 transition-colors group-hover:bg-amber-300">
              <span className="absolute inset-0 block h-full w-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent text-white" />
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 rounded-lg bg-slate-950 px-2.5 py-1.5 text-[11px] font-bold text-amber-400 shadow-lg">
                  <Zap size={14} fill="currentColor" className="animate-bounce" /> FREE
                </span>
                <span className="text-slate-900 text-sm font-bold tracking-normal italic">
                  Dùng thử nhanh các vai trò
                </span>
              </div>
              <ChevronLeftIcon className="relative z-10 rotate-180 text-slate-900/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-950" />
            </div>
          </button>
        </div>

        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs font-bold tracking-widest text-slate-400 uppercase">
            <span className="bg-white px-4 dark:bg-slate-900">
              Hoặc đăng nhập với Email
            </span>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
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
                {showPassword ? <EyeIcon size={18} /> : <EyeCloseIcon size={18} />}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox checked={isChecked} onChange={setIsChecked} disabled={isLoading} />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
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
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </div>

      {/* MODAL TRẢI NGHIỆM - GIỮ NGUYÊN */}
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
            <p className="mb-10 text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Chọn một vai trò để khám phá giao diện dành riêng.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {trialRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center justify-center gap-4 rounded-[24px] border p-6 transition-all duration-300 ${selectedRole === role.id ? "border-indigo-200 bg-indigo-50 shadow-md ring-2 ring-indigo-500/20" : "border-transparent bg-slate-50 hover:border-slate-200 hover:bg-white dark:bg-slate-800/50"}`}
                >
                  <div className={`rounded-2xl p-4 shadow-sm ${role.color} ${selectedRole === role.id ? "scale-110" : ""} transition-transform`}>
                    {role.icon}
                  </div>
                  <span className={`text-center text-[11px] font-bold tracking-widest ${selectedRole === role.id ? "text-indigo-600" : "text-slate-500 dark:text-slate-400"}`}>
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
