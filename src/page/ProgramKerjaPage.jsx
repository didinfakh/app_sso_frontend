import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { fetchApi } from "../services/ApiService";
import { hasAccess } from "../services/Utils";
import { useToast } from "../context/ToastContext";
import InputText from "../components/ui/InputText";
import InputSelect from "../components/ui/InputSelect";
import Pagination from "../components/ui/Pagination";

import AddProgramModal from "../components/program-kerja/AddProgramModal";

function ProgramKerjaPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { showToast, showConfirmToast } = useToast();

  const canAdd = hasAccess(currentPath, "add");
  const canEdit = hasAccess(currentPath, "edit");
  const canDelete = hasAccess(currentPath, "delete");

  const getProgramKerja = async (page = 1, currentPageSize = 10) => {
    setIsLoading(true);
    try {
      const response = await fetchApi.getApi(
        `/program-kerja?page=${page}&pagesize=${currentPageSize}`,
      );
      console.log("ProgramKerja API Response:", response);
      if (response) {
        // Broad pagination detection
        const rawData =
          response.data?.data ||
          response.data ||
          (Array.isArray(response) ? response : []);
        const meta =
          response.data?.meta ||
          response.meta ||
          response.pagination ||
          response ||
          response.data;

        setData(Array.isArray(rawData) ? rawData : []);

        let last =
          meta.last_page ||
          meta.lastPage ||
          meta.total_page ||
          meta.total_pages ||
          meta.totalPages ||
          meta.pages;
        let current = meta.current_page || meta.currentPage || meta.page || 1;

        // Fallback: calculate from total if last_page is missing
        const total = meta.total || meta.total_records || meta.totalRecords;
        const pSize = meta.per_page || meta.pagesize || meta.page_size || 10;

        if (!last && total) {
          last = Math.ceil(total / pSize);
        }

        setTotalPages(Number(last) || 1);
        setCurrentPage(Number(current) || 1);
      }
    } catch (error) {
      console.error("getProgramKerja error:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getProgramKerja(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = async (id) => {
    showConfirmToast(
      "Apakah Anda yakin ingin menghapus program kerja ini?",
      async () => {
        try {
          const response = await fetchApi.deleteApi(`/program-kerja/${id}`);
          if (response && (response.success || response.status === "success")) {
            showToast("Program Kerja berhasil dihapus", "success");
            getProgramKerja(currentPage, pageSize);
          } else {
            showToast(
              response?.message || "Gagal menghapus program kerja",
              "error",
            );
          }
        } catch (error) {
          showToast("Terjadi kesalahan koneksi", "error");
        }
      },
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Program Kerja
            </h1>
            <p className="text-sm text-gray-500">
              Daftar semua program kerja yang sedang berjalan.
            </p>
          </div>
          {canAdd && (
            <button
              onClick={() => openModal("add")}
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
            >
              <i className="fas fa-plus text-xs"></i> Tambah Program Kerja
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <i className="fas fa-spinner fa-spin text-3xl text-purple-600 mb-4"></i>
            <p className="text-gray-500">Memuat data program kerja...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-clipboard-list text-gray-300 text-2xl"></i>
            </div>
            <p className="text-gray-500">
              Belum ada program kerja yang ditambahkan.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/program-kerja/${item.id}`)}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors truncate pr-4">
                      {item.name}
                    </h3>
                    <span className="shrink-0 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Aktif
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
                    {item.description || "Tidak ada deskripsi."}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <i className="far fa-calendar-alt text-purple-400"></i>
                      <span>{item.start_date || "-"}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <i className="far fa-calendar-check text-purple-400"></i>
                      <span>{item.end_date || "-"}</span>
                    </div>
                  </div>
                  <div
                    className="pt-4 border-t border-gray-50 flex justify-end gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {canEdit && (
                      <button
                        onClick={() => openModal("edit", item)}
                        className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors flex items-center justify-center cursor-pointer"
                        title="Edit"
                      >
                        <i className="fas fa-edit text-xs"></i>
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center cursor-pointer"
                        title="Hapus"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Section */}
            <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm px-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => {
                  setPageSize(newPageSize);
                  setCurrentPage(1);
                }}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
      </div>

      <AddProgramModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={() => getProgramKerja(currentPage, pageSize)}
        modalMode={modalMode}
        item={selectedItem}
      />
    </div>
  );
}

export default ProgramKerjaPage;
