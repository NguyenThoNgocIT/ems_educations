"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeOff as EyeCloseIcon, Eye as EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { authLogin } from "@/api/auth";
import CherryBlossoms from "../animations/CherryBlossoms";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      const data: any = await authLogin({ username: username.trim(), password });

      if (!data?.success) throw new Error(data?.message || "Login failed");

      const authData = data.data;
      if (authData.accessToken) {
        localStorage.setItem("access_token", authData.accessToken);
        if (authData.refreshToken) localStorage.setItem("refresh_token", authData.refreshToken);

        let userRole = (authData.roles?.[0] || "student").toLowerCase().replace("role_", "");
        
        const maxAge = isChecked ? 604800 : 86400;
        document.cookie = `user-token=${authData.accessToken}; path=/; max-age=${maxAge}`;
        document.cookie = `user-role=${userRole}; path=/; max-age=${maxAge}`;

        const roleMap: Record<string, string> = {
          admin: "/dashboard/admin",
          "branch-management": "/dashboard/branch-management",
          teacher: "/dashboard/teacher",
          student: "/dashboard/student",
          consultant: "/dashboard/consultant",
          parents: "/dashboard/parents",
        };

        router.push(roleMap[userRole] || `/dashboard/${userRole}`);
      }
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf5f0] flex items-center justify-center p-4 lg:p-6 overflow-hidden relative">
      
      {/* Hiệu ứng hoa anh đào */}
      <CherryBlossoms />

      <div className="w-full max-w-[1450px] h-[92vh] bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden flex z-10">

        {/* Bên trái: Hình ảnh */}
        <div className="hidden lg:block w-1/2 relative bg-[#f7faf8] overflow-hidden">
          <img src="/images/logo/nen-login.jpg" alt="Đại học Đông Á" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute top-10 left-10 z-20">
            <img src="/images/logo/logo-sidebar-admin-big.png" alt="Logo" className="w-[220px] object-contain drop-shadow-2xl" />
          </div>
          <div className="absolute bottom-20 left-10 z-20 text-white">
            <p className="text-[38px] leading-[42px] font-bold drop-shadow-2xl italic tracking-tight">Tạo dựng con đường<br />thành công</p>
            <p className="mt-5 text-[16px] font-medium opacity-95 drop-shadow-md">Hệ thống quản lý giáo dục (EMS)</p>
            <p className="text-[16px] font-semibold drop-shadow-md">Đại học Đông Á</p>
          </div>
          <div className="absolute -bottom-12 -right-10 z-20">
            <img src="/images/logo/logo-sidebar-admin-small.png" alt="Hoa" className="w-[280px] h-[280px] opacity-90 drop-shadow-2xl rotate-[-22deg] hover:rotate-[-8deg] transition-transform duration-700 ease-out" />
          </div>
        </div>

        {/* Bên phải: Form */}
        <div className="w-full lg:w-1/2 h-full relative flex flex-col justify-center bg-white px-8 lg:px-20 py-6 overflow-hidden">
          <div className="absolute top-6 right-8 z-20">
            <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1.5 bg-white hover:bg-gray-50 transition">
              <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-5 h-4 rounded-sm" />
              <span className="text-xs font-semibold text-gray-700">Tiếng Việt</span>
              <span className="text-gray-400 text-[10px]">▼</span>
            </button>
          </div>

          <div className="w-full max-w-[420px] mx-auto flex flex-col justify-center">
            <div className="flex justify-center mb-4">
              <img src="/images/logo/logo-sidebar-admin-Normal.png" alt="Logo" className="w-[80px] h-[80px] object-contain" />
            </div>
            <div className="text-center mb-6">
              <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight">Đăng nhập hệ thống</h1>
              <p className="mt-1.5 text-[14px] text-gray-400">Đăng nhập để truy cập hệ thống EMS</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label className="block mb-1.5 text-[13px] font-semibold text-gray-700">Tên đăng nhập</Label>
                <Input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="h-[52px] rounded-xl border border-gray-200 bg-white px-4 text-[14px] shadow-none focus:border-[#009640] outline-none w-full"
                />
              </div>
              <div>
                <Label className="block mb-1.5 text-[13px] font-semibold text-gray-700">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-[52px] rounded-xl border border-gray-200 bg-white px-4 pr-12 text-[14px] shadow-none focus:border-[#009640] outline-none w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeIcon size={18} /> : <EyeCloseIcon size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="text-xs text-gray-500 font-medium select-none">Ghi nhớ đăng nhập</span>
                </div>
                <Link href="#" className="text-xs font-semibold text-[#009640] hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[52px] rounded-xl bg-[#009640] text-white text-[15px] font-semibold hover:bg-[#008137] transition-all duration-200 shadow-none mt-2"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[11px] text-gray-400">hoặc đăng nhập với</span>
              </div>
            </div>
            <button className="w-full h-[48px] rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition flex items-center justify-center gap-2 text-[13px] font-medium text-gray-600">
              <img
                src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                alt="Google"
                className="w-4 h-4"
              />
              Đăng nhập với Google
            </button>
          </div>
          <p className="text-center text-[11px] text-gray-400 mt-8">© 2024 Đại học Đông Á. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}