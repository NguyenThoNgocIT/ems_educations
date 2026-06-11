import { FeaturePlaceholder } from "@/components/dashboard/FeaturePlaceholder";

export function generateStaticParams() {
  return [
    { feature: ["placeholder"] }
  ];
}

export default function AdminFeaturePlaceholderPage() {
  return <FeaturePlaceholder homeHref="/dashboard/admin" roleLabel="Admin" />;
}

