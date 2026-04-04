import Link from "next/link";
import { getArticles } from "@/actions/articles";
import { DeleteArticleButton } from "@/components/articles/DeleteArticleButton";
import { StatusBadge } from "@/components/articles/StatusBadge";
import type { ArticleStatus } from "@/types";

export const dynamic = "force-dynamic";

type FilterTab = "ALL" | ArticleStatus;

const filterTabs: { value: FilterTab; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "PUBLISHED", label: "발행" },
  { value: "DRAFT", label: "임시저장" },
  { value: "SCHEDULED", label: "예약" },
];

type SearchParams = Promise<{ status?: string; page?: string }>;

export default async function ArticlesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const activeTab = (params.status as FilterTab) || "ALL";
  const page = Number(params.page) || 0;
  const status = activeTab === "ALL" ? undefined : (activeTab as ArticleStatus);

  const articles = await getArticles(status, page);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">글 목록</h1>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {filterTabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "ALL" ? "/articles" : `/articles?status=${tab.value}`}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {articles.content.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          작성된 글이 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">제목</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">상태</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">작성일</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.content.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/articles/${article.id}`} className="text-blue-600 hover:underline">
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/articles/${article.id}/edit`}
                        className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                      >
                        수정
                      </Link>
                      <DeleteArticleButton articleId={article.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {articles.totalPages > 1 && (
            <div className="px-6 py-4 border-t flex justify-center gap-2">
              {Array.from({ length: articles.totalPages }, (_, i) => (
                <Link
                  key={i}
                  href={`/articles?${status ? `status=${status}&` : ""}page=${i}`}
                  className={`px-3 py-1 rounded text-sm ${
                    i === articles.number
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
