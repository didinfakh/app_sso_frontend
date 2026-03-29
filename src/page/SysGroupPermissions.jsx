import React, { useEffect, useState } from "react";
import { fetchApi } from "../services/ApiService";
import PermissionTree from "../components/sys-group-permissions/PermissionTree";
import AddActionModal from "../components/sys-group-permissions/AddActionModal";

function SysGroupPermissions() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [permissionsTree, setPermissionsTree] = useState([]);
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // States for Add Action Modal
  const [sysPermissions, setSysPermissions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionFormData, setActionFormData] = useState({
    code: "",
    description: "",
  });
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isAddingAction, setIsAddingAction] = useState(false);
  const [isRemovingAction, setIsRemovingAction] = useState(null);

  useEffect(() => {
    fetchGroups();
    fetchSysPermissions();
  }, []);

  const fetchSysPermissions = async () => {
    const response = await fetchApi.getApi("/sys-permissions");
    if (response) {
      setSysPermissions(response.data || []);
    }
  };

  const fetchGroups = async () => {
    setIsLoadingGroups(true);
    const response = await fetchApi.getApi("/sys-groups");
    if (response) {
      setGroups(response.data || []);
    }
    setIsLoadingGroups(false);
  };

  const fetchPermissions = async (groupId) => {
    setIsLoadingPermissions(true);
    const response = await fetchApi.getApi(
      `/sys-group-permissions/${groupId}/mapping`,
    );
    if (response) {
      setPermissionsTree(response.data || []);

      // Initialize checked state from the tree
      const newCheckedSet = new Set();
      const traverse = (nodes) => {
        nodes.forEach((node) => {
          if (node.permissions) {
            node.permissions.forEach((perm) => {
              if (perm.checked) {
                newCheckedSet.add(perm.id_sys_menu_permission);
              }
            });
          }
          if (node.children) {
            traverse(node.children);
          }
        });
      };
      traverse(response.data || []);
      setCheckedIds(newCheckedSet);
    }
    setIsLoadingPermissions(false);
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    fetchPermissions(group.id_sys_group);
  };

  const handleCheckboxChange = (permissionId) => {
    const newCheckedIds = new Set(checkedIds);
    if (newCheckedIds.has(permissionId)) {
      newCheckedIds.delete(permissionId);
    } else {
      newCheckedIds.add(permissionId);
    }
    setCheckedIds(newCheckedIds);
  };

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleSave = async () => {
    if (!selectedGroup) return;
    setIsSaving(true);
    try {
      const payload = {
        permissions: Array.from(checkedIds),
      };
      await fetchApi.postApi(
        `/sys-group-permissions/${selectedGroup.id_sys_group}/sync`,
        payload,
      );
      alert("Hak akses berhasil disimpan");
    } catch (error) {
      console.error("Failed to save permissions", error);
      alert("Gagal menyimpan hak akses");
    }
    setIsSaving(false);
  };

  const openAddModal = (menuId, e) => {
    e.stopPropagation();
    setActiveMenuId(menuId);
    setActionFormData({ code: "", description: "" });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setActiveMenuId(null);
  };

  const handleActionFormChange = (updates) => {
    setActionFormData((prev) => ({ ...prev, ...updates }));
  };

  const submitAddAction = async (e) => {
    e.preventDefault();
    if (!selectedGroup || !activeMenuId) return;

    setIsAddingAction(true);
    try {
      const payload = {
        id_sys_group: selectedGroup.id_sys_group,
        id_sys_menu: activeMenuId,
        code: actionFormData.code,
        description: actionFormData.description,
      };

      const response = await fetchApi.postApi(
        "/sys-group-permissions/add-action",
        payload,
      );
      if (response) {
        closeAddModal();
        fetchPermissions(selectedGroup.id_sys_group);
      }
    } catch (error) {
      console.error("Gagal menambah custom action", error);
      alert("Gagal menambah action baru.");
    }
    setIsAddingAction(false);
  };

  const handleRemoveAction = async (permId, e) => {
    e.stopPropagation();
    if (!window.confirm("Apakah Anda yakin ingin menghapus action ini?"))
      return;

    setIsRemovingAction(permId);
    try {
      const payload = {
        id_sys_menu_permission: permId,
      };
      const response = await fetchApi.postApi(
        "/sys-group-permissions/remove-action",
        payload,
      );
      if (response) {
        fetchPermissions(selectedGroup.id_sys_group);
      }
    } catch (error) {
      console.error("Gagal menghapus action", error);
      alert("Gagal menghapus action.");
    }
    setIsRemovingAction(null);
  };

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left Panel: Groups */}
        <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 self-start h-auto xl:sticky xl:top-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <i className="fas fa-users-cog text-purple-600"></i> Grup Pengguna
          </h2>
          {isLoadingGroups ? (
            <div className="flex justify-center p-8 text-gray-400">
              <i className="fas fa-spinner fa-spin text-2xl text-purple-500"></i>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {groups.map((group) => (
                <button
                  key={group.id_sys_group}
                  onClick={() => handleGroupSelect(group)}
                  className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${
                    selectedGroup?.id_sys_group === group.id_sys_group
                      ? "bg-purple-100 text-purple-700 border border-purple-200 shadow-sm"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                  }`}
                >
                  {group.name}
                </button>
              ))}
              {groups.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  Belum ada grup yang tersedia.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: Permissions Tree */}
        <div className="w-full md:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-shield-alt text-purple-600"></i> Hak Akses
                Menu
              </h2>
              {selectedGroup ? (
                <p className="text-sm text-gray-500 mt-1">
                  Mengatur hak akses menu untuk grup:{" "}
                  <span className="font-semibold text-purple-600">
                    {selectedGroup.name}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  Pilih grup pengguna terlebih dahulu.
                </p>
              )}
            </div>

            {selectedGroup && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-purple-400 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-save"></i>
                )}
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            )}
          </div>

          <div className="rounded-lg">
            {!selectedGroup ? (
              <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                  <i className="fas fa-mouse-pointer text-2xl text-gray-300"></i>
                </div>
                <p>
                  Silakan pilih grup pengguna di panel sebelah kiri
                  <br />
                  untuk melihat dan mengatur hak akses menu.
                </p>
              </div>
            ) : isLoadingPermissions ? (
              <div className="flex flex-col items-center justify-center p-20 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-100">
                <i className="fas fa-spinner fa-spin text-3xl text-purple-500 mb-4"></i>
                <p>Memuat struktur menu dan hak akses...</p>
              </div>
            ) : permissionsTree.length === 0 ? (
              <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                  <i className="fas fa-folder-open text-2xl text-gray-300"></i>
                </div>
                <p>Tidak ada konfigurasi menu yang ditemukan.</p>
              </div>
            ) : (
              <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <PermissionTree
                  nodes={permissionsTree}
                  expandedNodes={expandedNodes}
                  checkedIds={checkedIds}
                  selectedGroup={selectedGroup}
                  isRemovingAction={isRemovingAction}
                  onToggleNode={toggleNode}
                  onOpenAddModal={openAddModal}
                  onCheckboxChange={handleCheckboxChange}
                  onRemoveAction={handleRemoveAction}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Tambah Action */}
      <AddActionModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={submitAddAction}
        formData={actionFormData}
        onFormChange={handleActionFormChange}
        isAdding={isAddingAction}
        sysPermissions={sysPermissions}
      />
    </div>
  );
}

export default SysGroupPermissions;
