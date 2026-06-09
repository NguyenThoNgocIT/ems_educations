"use client";

import { useEffect, useMemo, useState } from "react";
import { Lock, RefreshCw, RotateCcw, Search, ShieldOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { userAdminApi, type UserAccount } from "@/api/admin-resources";

function stripEmailDomain(value?: string) {
  if (!value) return "";
  return value.split("@")[0] || value;
}

function emailEduOf(row: UserAccount) {
  return row.email || (row.username?.includes("@") ? row.username : "") || "-";
}

function displayNameOf(row: UserAccount) {
  if (row.fullName) return row.fullName;
  if (row.fullNameNoAccent) return row.fullNameNoAccent;
  if (row.username === "admin") return "Quản trị hệ thống";

  const source = stripEmailDomain(row.email || row.username);
  return source.replace(/(?:sv|gv|nv)?\d+$/i, "") || "Chưa có họ tên";
}

function displayCodeOf(row: UserAccount) {
  if (row.displayCode) return row.displayCode;
  if (row.username === "admin") return "ADMIN";

  const source = stripEmailDomain(row.username || row.email);
  const match = source.match(/((?:sv|gv|nv)?\d+)$/i);
  return match?.[1]?.toUpperCase() || source || "-";
}

function accountTypeLabel(type?: string) {
  if (type === "STUDENT") return "Sinh viên";
  if (type === "INSTRUCTOR") return "Giảng viên";
  if (type === "STAFF") return "Nhân viên";
  if (type === "ADMIN") return "Quản trị viên";
  return "Tài khoản";
}

export default function UsersPage() {
  const [rows, setRows] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      setRows(await userAdminApi.getAll({ keyword: search || undefined, isActive: true }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return rows;

    return rows.filter((row) =>
      [
        row.fullName,
        row.fullNameNoAccent,
        row.username,
        row.email,
        row.displayCode,
        row.accountType,
        row.roles?.join(","),
      ].some((value) => String(value || "").toLowerCase().includes(keyword)),
    );
  }, [rows, search]);

  const runAction = async (message: string, action: () => Promise<void>) => {
    try {
      await action();
      toast.success(message);
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Thao tác thất bại");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tài khoản người dùng</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quản trị tài khoản được tạo tự động cho sinh viên, giảng viên, nhân viên và quản trị viên.
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") load();
              }}
              placeholder="Tìm theo họ tên, email edu, mã số, vai trò..."
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900">
                  <th className="px-4 py-3">Người dùng</th>
                  <th className="px-4 py-3">Mã số / vai trò</th>
                  <th className="px-4 py-3">Bảo mật</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const userId = row.userId || "";
                  const locked = Boolean(row.lockoutEndAt);
                  const displayName = displayNameOf(row);
                  const emailEdu = emailEduOf(row);
                  const displayCode = displayCodeOf(row);

                  return (
                    <tr key={userId} className="border-b hover:bg-slate-50/70 dark:hover:bg-slate-900/50">
                      <td className="px-4 py-3">
                        <div className="flex min-w-[260px] items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold uppercase text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900">
                            {displayName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{displayName}</p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{emailEdu}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-100">{displayCode}</p>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {accountTypeLabel(row.accountType)}
                            </span>
                            {(row.roles || []).map((role) => (
                              <span
                                key={role}
                                className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1 text-xs">
                          <p className={row.emailConfirmed ? "font-medium text-emerald-600" : "font-medium text-amber-600"}>
                            {row.emailConfirmed ? "Email đã xác nhận" : "Email chưa xác nhận"}
                          </p>
                          <p className={row.requirePasswordChange ? "text-amber-600" : "text-slate-500"}>
                            {row.requirePasswordChange ? "Cần đổi mật khẩu" : "Đã đổi mật khẩu"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            !row.isActive
                              ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                              : locked
                                ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          }`}
                        >
                          {row.isActive ? (locked ? "Đang khóa" : "Hoạt động") : "Đã xóa"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {locked ? (
                            <Button variant="ghost" size="sm" onClick={() => runAction("Đã mở khóa tài khoản", () => userAdminApi.unlock(userId))}>
                              <ShieldOff className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => runAction("Đã khóa tài khoản", () => userAdminApi.lock(userId, "Khóa bởi admin"))}>
                              <Lock className="h-4 w-4" />
                            </Button>
                          )}
                          {!row.isActive && (
                            <Button variant="ghost" size="sm" onClick={() => runAction("Đã khôi phục tài khoản", () => userAdminApi.restore(userId))}>
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => runAction("Đã thu hồi phiên đăng nhập", () => userAdminApi.revokeSessions(userId))}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => runAction("Đã xóa tài khoản", () => userAdminApi.delete(userId))}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      Đang tải danh sách tài khoản...
                    </td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      Chưa có tài khoản phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
