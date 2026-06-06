import CourseDetailClient from './CourseDetailClient';

const apiBaseUrl = (
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://apiems.ryon.website'
).replace(/\/$/, '');

const toArray = (value: any) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.content)) return value.data.content;
  if (Array.isArray(value?.content)) return value.content;
  return [];
};

export const dynamicParams = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/courses`);
    const payload = await response.json();
    return toArray(payload)
      .map((course: any) => course.courseId || course.id)
      .filter(Boolean)
      .map((id: string) => ({ id: String(id) }));
  } catch {
    return [];
  }
}

export default function CourseDetailPage() {
  return <CourseDetailClient />;
}
