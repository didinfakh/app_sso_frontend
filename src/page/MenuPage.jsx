import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useLocation } from "react-router";
import { fetchApi } from "../services/ApiService";
import { hasAccess } from "../services/Utils";
import { useToast } from "../context/ToastContext";

function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const location = useLocation();
  const currentPath = location.pathname;
  const { showToast, showConfirmToast } = useToast();

  // Cek akses permissions
  const canAdd = hasAccess(currentPath, "add");
  const canEdit = hasAccess(currentPath, "edit");
  const canDelete = hasAccess(currentPath, "delete");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"

  // Form state
  const [formData, setFormData] = useState({
    id_sys_menu: null,
    name: "",
    url: "",
    icon: "",
    order: 0,
    id_menu_parent: "",
  });

  const getMenus = async () => {
    setIsLoading(true);
    const response = await fetchApi.getApi("/sys-menus/tree");
    if (response) {
      setMenus(response.data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getMenus();
  }, []);

  const flattenTree = (nodes, depth = 0, isVisible = true) => {
    let result = [];
    nodes.forEach((node) => {
      if (!isVisible) return;
      result.push({ ...node, depth });
      const isExpanded = expandedIds.has(node.id_sys_menu || node.id);
      if (node.children && node.children.length > 0) {
        result = [
          ...result,
          ...flattenTree(node.children, depth + 1, isExpanded),
        ];
      }
    });
    return result;
  };

  const toggleExpand = (id, e) => {
    if (e) e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const flattenedMenus = flattenTree(menus);

  const openModal = (mode, menu = null) => {
    setModalMode(mode);
    if (mode === "edit" && menu) {
      setFormData({
        id_sys_menu: menu.id_sys_menu || menu.id,
        name: menu.name || "",
        url: menu.url || "",
        icon: menu.icon || "",
        order: menu.order || 0,
        id_menu_parent: menu.id_menu_parent || "",
      });
    } else {
      setFormData({
        id_sys_menu: null,
        name: "",
        url: "",
        icon: "",
        order: 0,
        id_menu_parent: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (modalMode === "add") {
        response = await fetchApi.postApi("/sys-menus", formData);
      } else {
        response = await fetchApi.putApi(
          `/sys-menus/${formData.id_sys_menu}`,
          formData,
        );
      }

      if (response && (response.success || response.status === "success")) {
        showToast(
          modalMode === "add"
            ? "Menu berhasil ditambahkan"
            : "Menu berhasil diperbarui",
          "success",
        );
        closeModal();
        getMenus();
      } else if (response && response.errors) {
        // Handle validation errors
        const errorMessages = Object.values(response.errors).flat().join(", ");
        showToast(errorMessages || "Terjadi kesalahan validasi", "error");
      } else {
        showToast(response?.message || "Terjadi kesalahan sistem", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan koneksi", "error");
    }
  };

  const handleDelete = async (id) => {
    showConfirmToast(
      "Apakah Anda yakin ingin menghapus menu ini?",
      async () => {
        try {
          const response = await fetchApi.deleteApi(`/sys-menus/${id}`);
          if (response && (response.success || response.status === "success")) {
            showToast("Menu berhasil dihapus", "success");
            getMenus();
          } else {
            showToast(response?.message || "Gagal menghapus menu", "error");
          }
        } catch (error) {
          showToast("Terjadi kesalahan koneksi", "error");
        }
      },
    );
  };

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          </div>
          {canAdd && (
            <button
              onClick={() => openModal("add")}
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium transition-all shadow-sm flex items-center gap-2"
            >
              <i className="fas fa-plus text-xs"></i> Tambah Menu
            </button>
          )}
        </div>

        {/* Table Content */}
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium border-b border-gray-100">
                  name
                </th>
                <th className="px-6 py-4 font-medium border-b border-gray-100">
                  URL
                </th>
                <th className="px-6 py-4 font-medium border-b border-gray-100 text-center">
                  Icon
                </th>
                <th className="px-6 py-4 font-medium border-b border-gray-100 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    <i className="fas fa-spinner fa-spin text-2xl mb-2 text-purple-500"></i>
                    <p>Memuat data...</p>
                  </td>
                </tr>
              ) : menus.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-400 text-sm"
                  >
                    Tidak ada data menu
                  </td>
                </tr>
              ) : (
                flattenedMenus.map((item, index) => (
                  <tr
                    key={item.id_sys_menu || item.id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${item.depth * 1.5}rem` }}
                      >
                        {item.children && item.children.length > 0 ? (
                          <button
                            onClick={(e) =>
                              toggleExpand(item.id_sys_menu || item.id, e)
                            }
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                          >
                            <i
                              className={`fas fa-chevron-${expandedIds.has(item.id_sys_menu || item.id) ? "down" : "right"} text-[10px]`}
                            ></i>
                          </button>
                        ) : (
                          <span className="w-5 flex justify-center">
                            {item.depth > 0 && (
                              <span className="text-gray-300">
                                <i className="fas fa-level-up-alt rotate-90 scale-y-[-1]"></i>
                              </span>
                            )}
                          </span>
                        )}
                        <div className="font-medium text-gray-800">
                          {item.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-mono">
                        {item.url || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.icon ? (
                        <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-sm border border-purple-100">
                          <i className={`${item.icon} text-sm`}></i>
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {canEdit && (
                          <button
                            onClick={() => openModal("edit", item)}
                            className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-colors flex items-center justify-center cursor-pointer"
                            title="Edit"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() =>
                              handleDelete(item.id_sys_menu || item.id)
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
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 transition-opacity"
            onClick={closeModal}
          ></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative z-10 animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-semibold text-gray-800">
                {modalMode === "add" ? "Tambah Menu Baru" : "Edit Menu"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors relative z-20"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Menu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                    placeholder="Contoh: Dashboard"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL / Route{" "}
                    <span className="text-gray-400 text-xs font-normal">
                      (Opsional)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-mono text-sm outline-none"
                    placeholder="Contoh: /dashboard"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Icon{" "}
                    <span className="text-gray-400 text-xs font-normal">
                      (Opsional)
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <i className={formData.icon || "far fa-circle"}></i>
                    </div>
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-mono text-sm outline-none"
                      placeholder="Contoh: fas fa-home"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Gunakan class FontAwesome (ex: fas fa-user)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Index
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Menu
                    </label>
                    <Select
                      options={[
                        { value: "", label: "-- Tidak Ada (Root) --" },
                        ...flattenedMenus.map((m) => {
                          const menuId = m.id_sys_menu || m.id;
                          return {
                            value: menuId,
                            label: `${"--- ".repeat(m.depth)}${m.name}`,
                            isDisabled: formData.id_sys_menu === menuId,
                          };
                        }),
                      ]}
                      value={
                        [
                          { value: "", label: "-- Tidak Ada (Root) --" },
                          ...flattenedMenus.map((m) => {
                            const menuId = m.id_sys_menu || m.id;
                            return {
                              value: menuId,
                              label: `${"--- ".repeat(m.depth)}${m.name}`,
                            };
                          }),
                        ].find(
                          (opt) => opt.value == (formData.id_menu_parent || ""),
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        handleInputChange({
                          target: {
                            name: "id_menu_parent",
                            value: selectedOption ? selectedOption.value : "",
                          },
                        });
                      }}
                      placeholder="Pilih Parent Menu..."
                      isClearable
                      className="text-sm"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: state.isFocused ? "#a855f7" : "#E5E7EB",
                          boxShadow: state.isFocused
                            ? "0 0 0 1px #a855f7"
                            : "none",
                          padding: "1px",
                          minHeight: "42px",
                          borderRadius: "0.5rem",
                          "&:hover": {
                            borderColor: state.isFocused
                              ? "#a855f7"
                              : "#D1D5DB",
                          },
                        }),
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPortalTarget={document.body}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <i className="fas fa-save"></i>
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuPage;
