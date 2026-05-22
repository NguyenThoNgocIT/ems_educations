'use client';

import { studentPortalApi } from '@/api/student-portal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeaturePlaceholder } from '@/components/dashboard/FeaturePlaceholder';
import type { StudentAnnouncement } from '@/types/student-portal';
import { Bell, BookOpen, CreditCard, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const documents = [
  { id: 'web-lab', title: 'Bài thực hành Web tuần 6', course: 'WEB302', type: 'PDF', updatedAt: '20/05/2026' },
  { id: 'db-slide', title: 'Slide chuẩn hóa dữ liệu', course: 'DBS201', type: 'PPTX', updatedAt: '18/05/2026' },
  { id: 'se-rubric', title: 'Rubric đồ án nhóm', course: 'SWE301', type: 'DOCX', updatedAt: '15/05/2026' },
];

export default function StudentFeaturePage() {
  const pathname = usePathname();

  if (pathname.endsWith('/notifications')) return <NotificationsPage />;
  if (pathname.endsWith('/documents')) return <DocumentsPage />;
  if (pathname.endsWith('/tuition')) return <TuitionPage />;

  return <FeaturePlaceholder homeHref="/dashboard/student" roleLabel="Sinh viên" />;
}

function NotificationsPage() {
  const [items, setItems] = useState<StudentAnnouncement[]>([]);

  useEffect(() => {
    studentPortalApi.getAnnouncements().then((payload) => setItems(payload.data));
  }, []);

  return (
    <StudentSection
      title="Thông báo học vụ"
      description="Các thông báo cần theo dõi trong kỳ học."
      icon={Bell}
      sourceLabel="Dữ liệu mẫu"
    >
      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id} size="sm">
            <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{item.type}</Badge>
                  <span className="text-xs text-slate-400">{item.date}</span>
                </div>
                <p className="mt-2 font-semibold text-slate-950 dark:text-white">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.sender}</p>
              </div>
              <Button variant="outline" size="sm">Đã xem</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </StudentSection>
  );
}

function DocumentsPage() {
  return (
    <StudentSection
      title="Tài liệu học tập"
      description="Tài liệu gắn với các học phần đang theo học."
      icon={BookOpen}
      sourceLabel="Dữ liệu mẫu"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {documents.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-200">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <Badge variant="secondary">{item.course}</Badge>
                <p className="mt-2 min-h-12 font-semibold text-slate-950 dark:text-white">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.type} · Cập nhật {item.updatedAt}</p>
              </div>
              <Button variant="outline" disabled className="w-full"><Download />Chờ tệp từ API</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </StudentSection>
  );
}

function TuitionPage() {
  return (
    <StudentSection
      title="Học phí"
      description="Theo dõi công nợ học kỳ và chứng từ thanh toán."
      icon={CreditCard}
      sourceLabel="Dữ liệu mẫu"
    >
      <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
        <Card>
          <CardHeader>
            <CardTitle>Công nợ kỳ hiện tại</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold text-slate-950 dark:text-white">4.850.000 VND</p>
            <Badge variant="outline">Hạn đối chiếu 31/05/2026</Badge>
            <p className="text-sm leading-6 text-slate-500">Số tiền này là mẫu giao diện để chuẩn bị nối dữ liệu hóa đơn.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Khoản thu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <TuitionRow label="Học phí học phần đăng ký" value="4.500.000 VND" />
            <TuitionRow label="Phí thực hành phòng lab" value="350.000 VND" />
            <TuitionRow label="Đã thanh toán" value="0 VND" />
            <Button disabled>Thanh toán khi API sẵn sàng</Button>
          </CardContent>
        </Card>
      </div>
    </StudentSection>
  );
}

function StudentSection({
  title,
  description,
  icon: Icon,
  sourceLabel,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  sourceLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-5 pb-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
            <Icon className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">{title}</h1>
          <Badge variant="outline">{sourceLabel}</Badge>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </header>
      {children}
      <Link href="/dashboard/student" className="w-fit text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
        Quay lại bảng điều khiển
      </Link>
    </div>
  );
}

function TuitionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-950 dark:text-white">{value}</span>
    </div>
  );
}
