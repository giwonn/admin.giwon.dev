import type { ArticleStatus } from "@/types";

const statusConfig: Record<ArticleStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "임시저장",
    className: "bg-gray-100 text-gray-700",
  },
  SCHEDULED: {
    label: "예약",
    className: "bg-yellow-100 text-yellow-700",
  },
  PUBLISHED: {
    label: "발행",
    className: "bg-green-100 text-green-700",
  },
};

interface StatusBadgeProps {
  status: ArticleStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
