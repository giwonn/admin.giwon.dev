import type { Article } from "@/types";

interface StatusBadgeProps {
  article: Article;
}

export function StatusBadge({ article }: StatusBadgeProps) {
  let label: string;
  let className: string;

  if (article.hidden) {
    label = "숨김";
    className = "bg-gray-100 text-gray-700";
  } else if (article.scheduled) {
    label = "예약";
    className = "bg-yellow-100 text-yellow-700";
  } else if (article.published) {
    label = "발행";
    className = "bg-green-100 text-green-700";
  } else {
    label = "발행";
    className = "bg-green-100 text-green-700";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
