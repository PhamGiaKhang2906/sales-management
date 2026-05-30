export default function SalesDashboardPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tong quan nhan vien ban hang</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-gray-500">Don hom nay</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">8 don</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-gray-500">Doanh thu hom nay</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">3,200,000 đ</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-gray-500">Don thang nay</p>
          <p className="text-2xl font-bold text-violet-600 mt-1">62 don</p>
        </div>
      </div>
    </div>
  );
}
