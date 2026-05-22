import { redirect } from 'next/navigation';

export default function StudentDashboardPage() {
  redirect('/dashboard/student/notifications');
}
