import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { fetchApi } from "../services/ApiService";
import { hasAccess } from "../services/Utils";

function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

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
    parent_id: "",
  });

  const getMenus = async () => {
    setIsLoading(true);
    const response = await fetchApi.getApi("/sys-menus");
    if (response) {
      setMenus(response.data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getMenus();
  }, []);

  const openModal = (mode, menu = null) => {
    setModalMode(mode);
    if (mode === "edit" && menu) {
      setFormData({
        id_sys_menu: menu.id_sys_menu || menu.id,
        name: menu.name || "",
        url: menu.url || "",
        icon: menu.icon || "",
        order: menu.order || 0,
        parent_id: menu.parent_id || "",
      });
    } else {
      setFormData({
        id_sys_menu: null,
        name: "",
        url: "",
        icon: "",
        order: 0,
        parent_id: "",
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
    if (modalMode === "add") {
      await fetchApi.postApi("/sys-menus", formData);
    } else {
      await fetchApi.putApi(`/sys-menus/${formData.id_sys_menu}`, formData);
    }
    closeModal();
    getMenus();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      await fetchApi.deleteApi(`/sys-menus/${id}`);
      getMenus();
    }
  };

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
              Menu
            </h2>
            {/* <p className="text-sm text-gray-500 mt-1">
              Kelola data menu sistem Anda di sini
            </p> */}
          </div>
          {canAdd && (
            <button
              onClick={() => openModal("add")}
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <i className="fas fa-plus"></i> Tambah Menu
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
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <i className="fas fa-folder-open text-gray-300 text-2xl"></i>
                      </div>
                      <p>Tidak ada data menu</p>
                    </div>
                  </td>
                </tr>
              ) : (
                menus.map((item, index) => (
                  <tr
                    key={item.id_sys_menu || item.id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">
                        {item.name}
                      </div>
                      {item.parent_id && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          Sub-menu
                        </div>
                      )}
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
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in fade-in zoom-in duration-200">
            <div
              className={`px-6 py-4 border-b flex justify-between items-center ${modalMode === "add" ? "bg-purple-600 text-white" : "bg-white border-gray-100"}`}
            >
              <h3
                className={`text-lg font-bold flex items-center gap-2 ${modalMode === "edit" ? "text-gray-800" : ""}`}
              >
                <i
                  className={`fas fa-${modalMode === "add" ? "plus-circle" : "edit"}`}
                ></i>
                {modalMode === "add" ? "Tambah Menu Baru" : "Edit Menu"}
              </h3>
              <button
                onClick={closeModal}
                className={`${modalMode === "add" ? "text-white/80 hover:text-white" : "text-gray-400 hover:text-gray-600"} transition-colors`}
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <name className="block text-sm font-medium text-gray-700 mb-1">
                    name Menu <span className="text-red-500">*</span>
                  </name>
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
                  <name className="block text-sm font-medium text-gray-700 mb-1">
                    URL / Route{" "}
                    <span className="text-gray-400 text-xs font-normal">
                      (Opsional)
                    </span>
                  </name>
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
                  <name className="block text-sm font-medium text-gray-700 mb-1">
                    Class Icon{" "}
                    <span className="text-gray-400 text-xs font-normal">
                      (Opsional)
                    </span>
                  </name>
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
                    <name className="block text-sm font-medium text-gray-700 mb-1">
                      Order Index
                    </name>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <name className="block text-sm font-medium text-gray-700 mb-1">
                      Parent ID
                    </name>
                    <input
                      type="number"
                      name="parent_id"
                      value={formData.parent_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                      placeholder="Kosongkan jika root"
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
