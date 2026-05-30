export default function WarehouseDashboardPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tong quan nhan vien kho</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-gray-500">Tong ton kho</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">1,630</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-gray-500">Nhap kho thang nay</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">445</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-gray-500">Canh bao ton thap</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">3</p>
        </div>
      </div>
    </div>
  );
}
