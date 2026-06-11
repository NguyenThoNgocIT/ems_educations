import StudentFeatureClient from "./StudentFeatureClient";

export function generateStaticParams() {
  return [
    { feature: ['notifications'] },
    { feature: ['documents'] },
    { feature: ['tuition'] },
    { feature: ['registrations'] },
    { feature: ['exams'] },
    { feature: ['requests'] }
  ];
}

export default function StudentFeaturePage() {
  return <StudentFeatureClient />;
}
