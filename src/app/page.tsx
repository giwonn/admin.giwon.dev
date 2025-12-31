import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Blog Admin</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
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
        </div>
      </main>
    </div>
  );
}
