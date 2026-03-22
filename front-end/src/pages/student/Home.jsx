export default function Home() {
  return (
    <div>
      <section className="bg-white rounded-lg shadow p-8 mb-6">
        <h1 className="text-2xl font-bold mb-2">Chào mừng tân sinh viên PTIT</h1>
        <p className="text-gray-600 mb-4">Tổng hợp hướng dẫn nhập học, học vụ, FAQ và hỗ trợ trực tiếp từ các cố vấn.</p>
        <div class="flex gap-3">
          <a class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" href="/qna" data-discover="true">Hỏi đáp ngay</a>
          <a class="border border-red-600 text-red-600 hover:text-red-700 px-4 py-2 rounded" href="/faq" data-discover="true">Xem FAQ</a>
        </div>

      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <article key={i} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Tiêu đề bài viết mẫu {i + 1}</h3>
            <p className="text-sm text-gray-600 mb-3">Tóm tắt nội dung bài viết, hướng dẫn, hoặc thông báo quan trọng.</p>
            <div className="text-sm text-gray-500">Ngày đăng: 2026-03-21</div>
          </article>
        ))}
      </section>
    </div>
  );
}
