import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { fetchApi } from "../services/ApiService";
import { hasAccess } from "../services/Utils";
import { useToast } from "../context/ToastContext";
import AccessDenied from "../components/ui/AccessDenied";
import Pagination from "../components/ui/Pagination";
import AddUserModal from "../components/sys-user/AddUserModal";

function SysUserPage() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedUser, setSelectedUser] = useState(null);

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

  const fetchUsers = async (page = 1, currentPageSize = 10) => {
    setIsLoading(true);
    try {
      const response = await fetchApi.getApi(
        `/sys-users?page=${page}&pagesize=${currentPageSize}`,
      );
      console.log("SysUser API Response:", response);
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

        setUsers(Array.isArray(rawData) ? rawData : []);

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
      console.error("fetchUsers error:", error);
      showToast("Gagal memuat data user", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetchApi.getApi("/sys-groups?pagesize=1000");
      if (response && response.data) {
        setGroups(
          response.data.map((g) => ({
            value: String(g.id_sys_group || g.id),
            label: g.name,
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };

  useEffect(() => {
    if (canIndex) {
      fetchUsers(currentPage, pageSize);
      fetchGroups();
    }
  }, [canIndex, currentPage, pageSize]);

  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async (id) => {
    showConfirmToast(
      "Apakah Anda yakin ingin menghapus user ini?",
      async () => {
        try {
          const response = await fetchApi.deleteApi(`/sys-users/${id}`);
          if (response && (response.success || response.status === "success")) {
            showToast("User berhasil dihapus", "success");
            fetchUsers(currentPage, pageSize);
          } else {
            showToast(response?.message || "Gagal menghapus user", "error");
          }
        } catch (error) {
          showToast("Terjadi kesalahan koneksi", "error");
        }
      },
    );
  };

  const getGroupName = (user) => {
    // 1. Try direct group name from backend mapping
    if (user.group_name) return user.group_name;
    if (user.sys_group?.name) return user.sys_group.name;
    if (user.group?.name) return user.group.name;

    // 2. Try to find from groups array (provided by user snippet)
    let groupId = user.id_sys_group || user.id_group || user.group_id;

    if (!groupId && user.groups && user.groups.length > 0) {
      groupId = user.groups[0].id_sys_group || user.groups[0].id_group;
    }

    if (groupId) {
      const groupObj = groups.find((g) => String(g.value) === String(groupId));
      if (groupObj) return groupObj.label;
    }

    return null;
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
            <h2 className="text-xl font-semibold text-gray-800">Master User</h2>
            <p className="text-sm text-gray-500 mt-1">
              Kelola data pengguna dan hak akses mereka.
            </p>
          </div>
          {canAdd && (
            <button
              onClick={() => openModal("add")}
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
            >
              <i className="fas fa-plus text-xs"></i> Tambah User
            </button>
          )}
        </div>

        {/* Table Content */}
        <div className="p-0 overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4 border-b border-gray-100">Nama</th>
                <th className="px-6 py-4 border-b border-gray-100">Email</th>
                <th className="px-6 py-4 border-b border-gray-100 font-bold">
                  Telegram
                </th>
                <th className="px-6 py-4 border-b border-gray-100 font-bold">
                  Grup
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
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <i className="fas fa-spinner fa-spin text-2xl mb-2 text-purple-500"></i>
                    <p>Memuat data user...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-gray-400 text-sm"
                  >
                    Tidak ada data user
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id_user || user.id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold ring-2 ring-purple-50">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {user.telegram_number || (
                        <span className="text-gray-300 italic">
                          Belum diatur
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getGroupName(user) ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-400"}`}
                      >
                        {getGroupName(user) || "Belum ada grup"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {canEdit && (
                          <button
                            onClick={() => openModal("edit", user)}
                            className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-colors flex items-center justify-center cursor-pointer"
                            title="Edit"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() =>
                              handleDelete(user.id_user || user.id)
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
        {users.length > 0 && (
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

      <AddUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={() => fetchUsers(currentPage, pageSize)}
        mode={modalMode}
        user={selectedUser}
        groups={groups}
      />
    </div>
  );
}

export default SysUserPage;
