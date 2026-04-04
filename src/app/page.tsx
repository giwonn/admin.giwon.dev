import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/articles/new"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">새 글 작성</h2>
          <p className="text-gray-600">마크다운 에디터로 새 글을 작성합니다.</p>
        </Link>

        <Link
          href="/articles"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">글 목록</h2>
          <p className="text-gray-600">작성된 글을 확인하고 관리합니다.</p>
        </Link>

        <Link
          href="/analytics"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold mb-2">분석</h2>
          <p className="text-gray-600">방문자 통계와 인기 페이지를 확인합니다.</p>
        </Link>
      </div>
    </div>
  );
}
