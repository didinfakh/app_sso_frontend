import React, { useEffect, useState } from "react";
import { fetchApi } from "../services/ApiService";

function Dashboard() {
  const [stats, setStats] = useState({
    totalMenus: 0,
    totalGroups: 0,
    activeTasks: 12,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const menuRes = await fetchApi.getApi("/sys-menus/tree");
        const groupRes = await fetchApi.getApi("/sys-groups");
        setStats((prev) => ({
          ...prev,
          totalMenus: menuRes?.data?.length || 0,
          totalGroups: groupRes?.data?.length || 0,
        }));
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Selamat datang kembali di sistem ViProk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Menu
            </h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stats.totalMenus}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Grup Pengguna
            </h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stats.totalGroups}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tugas Aktif
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.activeTasks}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">
              Aktivitas Terakhir
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                  <i className="far fa-clock text-xs"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Pembaruan izin akses grup "Admin"
                  </p>
                  <p className="text-xs text-gray-500">
                    2 jam yang lalu oleh Super Admin
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
