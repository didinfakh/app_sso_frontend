import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { fetchApi } from "../services/ApiService";
import { hasAccess } from "../services/Utils";
import { useToast } from "../context/ToastContext";
import AccessDenied from "../components/ui/AccessDenied";
import Pagination from "../components/ui/Pagination";
import AddGroupModal from "../components/sys-group/AddGroupModal";

function SysGroupPage() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const location = useLocation();
  const currentPath = location.pathname;
  const { showToast, showConfirmToast } = useToast();

  // Permissions
  const canIndex = hasAccess(currentPath, "index");
  const canAdd = hasAccess(currentPath, "add");
  const canEdit = hasAccess(currentPath, "edit");
  const canDelete = hasAccess(currentPath, "delete");

  const fetchGroups = async (page = 1, currentPageSize = 10) => {
    setIsLoading(true);
    try {
      const response = await fetchApi.getApi(
        `/sys-groups?page=${page}&pagesize=${currentPageSize}`,
      );
      console.log("SysGroup API Response:", response);
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

        setGroups(Array.isArray(rawData) ? rawData : []);

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
      console.error("fetchGroups error:", error);
      showToast("Gagal memuat data grup", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canIndex) {
      fetchGroups(currentPage, pageSize);
    }
  }, [canIndex, currentPage, pageSize]);

  const openModal = (mode, group = null) => {
    setModalMode(mode);
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  const handleDelete = async (id) => {
    showConfirmToast(
      "Apakah Anda yakin ingin menghapus grup ini?",
      async () => {
        try {
          const response = await fetchApi.deleteApi(`/sys-groups/${id}`);
          if (response && (response.success || response.status === "success")) {
            showToast("Grup berhasil dihapus", "success");
            fetchGroups(currentPage, pageSize);
          } else {
            showToast(response?.message || "Gagal menghapus grup", "error");
          }
        } catch (error) {
          showToast("Terjadi kesalahan koneksi", "error");
        }
      },
    );
  };

  if (!canIndex) {
    return <AccessDenied />;
  }

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-[#333]">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Master Grup</h2>
            <p className="text-sm text-gray-500 mt-1">
              Kelola data grup pengguna dan peran mereka dalam sistem.
            </p>
          </div>
          {canAdd && (
            <button
              onClick={() => openModal("add")}
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
            >
              <i className="fas fa-plus text-xs"></i> Tambah Grup
            </button>
          )}
        </div>

        {/* Table Content */}
        <div className="p-0 overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4 border-b border-gray-100">
                  Nama Grup
                </th>
                <th className="px-6 py-4 border-b border-gray-100">
                  Deskripsi
                </th>
                <th className="px-6 py-4 border-b border-gray-100 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <i className="fas fa-spinner fa-spin text-2xl mb-2 text-purple-500"></i>
                    <p>Memuat data grup...</p>
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-10 text-center text-gray-400 text-sm"
                  >
                    Tidak ada data grup
                  </td>
                </tr>
              ) : (
                groups.map((group) => (
                  <tr
                    key={group.id_sys_group || group.id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold ring-2 ring-purple-50">
                          {group.name?.charAt(0).toUpperCase()}
                        </div>
                        {group.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm italic">
                      {group.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {canEdit && (
                          <button
                            onClick={() => openModal("edit", group)}
                            className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-colors flex items-center justify-center cursor-pointer"
                            title="Edit"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() =>
                              handleDelete(group.id_sys_group || group.id)
                            }
                            className="w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors flex items-center justify-center cursor-pointer"
                            title="Hapus"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {groups.length > 0 && (
          <div className="border-t border-gray-100 bg-white px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => {
                setPageSize(newPageSize);
                setCurrentPage(1); // Reset to page 1 on pagesize change
              }}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      <AddGroupModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={() => fetchGroups(currentPage, pageSize)}
        mode={modalMode}
        group={selectedGroup}
      />
    </div>
  );
}

export default SysGroupPage;
