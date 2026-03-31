import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { fetchApi } from "../services/ApiService";
import { useToast } from "../context/ToastContext";
import { hasAccess } from "../services/Utils";
import PermissionTree from "../components/sys-group-permissions/PermissionTree";
import AddActionModal from "../components/sys-group-permissions/AddActionModal";
import AccessDenied from "../components/ui/AccessDenied";

function SysGroupPermissions() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [permissionsTree, setPermissionsTree] = useState([]);
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  // Check permissions
  const canIndex = hasAccess(currentPath, "index");
  const canCreate = hasAccess(currentPath, "create");
  const canUpdate = hasAccess(currentPath, "update");
  const canDelete = hasAccess(currentPath, "delete");

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
  const { showToast, showConfirmToast } = useToast();

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
      const response = await fetchApi.postApi(
        `/sys-group-permissions/${selectedGroup.id_sys_group}/sync`,
        payload,
      );
      if (response && response.success) {
        showToast("Hak akses berhasil disimpan", "success");
      } else {
        showToast("Gagal menyimpan hak akses", "error");
      }
    } catch (error) {
      console.error("Failed to save permissions", error);
      showToast("Terjadi kesalahan koneksi", "error");
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
      if (response && response.success) {
        showToast("Action berhasil ditambahkan", "success");
        closeAddModal();

        // Update tree locally
        const newPermission = response.data;
        setPermissionsTree((prevTree) => {
          const updateNodes = (nodes) => {
            return nodes.map((node) => {
              if (node.id_sys_menu === activeMenuId) {
                return {
                  ...node,
                  permissions: [...(node.permissions || []), newPermission],
                };
              }
              if (node.children) {
                return { ...node, children: updateNodes(node.children) };
              }
              return node;
            });
          };
          return updateNodes(prevTree);
        });

        // Auto-check the new action
        if (newPermission.id_sys_menu_permission) {
          setCheckedIds((prev) =>
            new Set(prev).add(newPermission.id_sys_menu_permission),
          );
        }
      } else {
        showToast("Gagal menambah action baru", "error");
      }
    } catch (error) {
      console.error("Gagal menambah custom action", error);
      showToast("Terjadi kesalahan koneksi", "error");
    }
    setIsAddingAction(false);
  };

  const handleRemoveAction = async (permId, e) => {
    e.stopPropagation();
    showConfirmToast(
      "Apakah Anda yakin ingin menghapus action ini?",
      async () => {
        setIsRemovingAction(permId);
        try {
          const payload = {
            id_sys_menu_permission: permId,
          };
          const response = await fetchApi.postApi(
            "/sys-group-permissions/remove-action",
            payload,
          );
          if (response && response.success) {
            showToast("Action berhasil dihapus", "success");
            // Update tree locally
            setPermissionsTree((prevTree) => {
              const updateNodes = (nodes) => {
                return nodes.map((node) => {
                  if (node.permissions) {
                    const filtered = node.permissions.filter(
                      (p) => p.id_sys_menu_permission !== permId,
                    );
                    if (filtered.length !== node.permissions.length) {
                      return { ...node, permissions: filtered };
                    }
                  }
                  if (node.children) {
                    return { ...node, children: updateNodes(node.children) };
                  }
                  return node;
                });
              };
              return updateNodes(prevTree);
            });

            // Remove from checkedIds
            setCheckedIds((prev) => {
              const next = new Set(prev);
              next.delete(permId);
              return next;
            });
          } else {
            showToast("Gagal menghapus action", "error");
          }
        } catch (error) {
          console.error("Gagal menghapus action", error);
          showToast("Terjadi kesalahan koneksi", "error");
        }
        setIsRemovingAction(null);
      },
    );
  };

  if (!canIndex) {
    return <AccessDenied />;
  }

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left Panel: Groups */}
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-sm border border-gray-200 p-6 self-start h-auto xl:sticky xl:top-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Grup Pengguna
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
                  className={`text-left px-4 py-3 rounded-md font-medium transition-all ${
                    selectedGroup?.id_sys_group === group.id_sys_group
                      ? "bg-purple-50 text-purple-700 border border-purple-100"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
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
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Hak Akses Menu
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

            {selectedGroup && canUpdate && (
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
              <div className="py-20 text-center text-gray-400 bg-gray-50 rounded border border-dashed border-gray-200">
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
              <div className="py-20 text-center text-gray-400 bg-gray-50 rounded border border-dashed border-gray-200">
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
                  canCreate={canCreate}
                  canUpdate={canUpdate}
                  canDelete={canDelete}
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
