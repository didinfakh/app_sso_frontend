import React from "react";

const PermissionTree = ({
  nodes,
  depth = 0,
  expandedNodes,
  checkedIds,
  selectedGroup,
  isRemovingAction,
  onToggleNode,
  onOpenAddModal,
  onCheckboxChange,
  onRemoveAction,
  canCreate,
  canUpdate,
  canDelete,
}) => {
  return nodes.map((node) => {
    const isExpanded = expandedNodes.has(node.id_sys_menu);
    const hasChildren =
      (node.children && node.children.length > 0) ||
      (node.permissions && node.permissions.length > 0);

    return (
      <div
        key={node.id_sys_menu}
        className="border-b border-gray-100 last:border-0"
      >
        <div
          className={`flex items-center justify-between p-3 cursor-pointer hover:bg-purple-50 transition-colors ${
            depth === 0 ? "font-semibold" : "text-sm"
          } text-gray-800`}
          style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}
          onClick={() => hasChildren && onToggleNode(node.id_sys_menu)}
        >
          <div className="flex items-center gap-2">{node.name}</div>
          <div className="flex items-center gap-3">
            {selectedGroup && canCreate && (
              <button
                onClick={(e) => onOpenAddModal(node.id_sys_menu, e)}
                title="Tambah Action Baru"
                className="text-xs bg-purple-100 text-purple-600 hover:bg-purple-200 px-2 py-1 rounded transition-colors flex items-center gap-1.5"
              >
                <i className="fas fa-plus"></i> Action
              </button>
            )}
            {hasChildren && (
              <i
                className={`fas fa-chevron-${
                  isExpanded ? "up" : "down"
                } text-xs text-gray-400`}
              ></i>
            )}
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="bg-gray-50/50">
            {node.permissions && node.permissions.length > 0 && (
              <div
                className="flex flex-wrap gap-4 p-3 bg-white/60 border-y border-gray-50"
                style={{ paddingLeft: `${(depth + 1) * 1.5 + 1}rem` }}
              >
                {node.permissions.map((perm) => (
                  <div
                    key={perm.id_sys_menu_permission}
                    className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checkedIds.has(perm.id_sys_menu_permission)}
                        onChange={() =>
                          onCheckboxChange(perm.id_sys_menu_permission)
                        }
                        disabled={!canUpdate}
                        className={`w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 transition-colors ${!canUpdate ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
                        {perm.code || perm.name}
                      </span>
                    </label>
                    {canDelete && (
                      <button
                        onClick={(e) =>
                          onRemoveAction(perm.id_sys_menu_permission, e)
                        }
                        className="ml-1 text-red-400 hover:text-red-500 transition-colors bg-red-50 hover:bg-red-100 w-6 h-6 flex items-center justify-center rounded"
                        disabled={
                          isRemovingAction === perm.id_sys_menu_permission
                        }
                        title="Hapus Action"
                      >
                        {isRemovingAction === perm.id_sys_menu_permission ? (
                          <i className="fas fa-spinner fa-spin text-[10px]"></i>
                        ) : (
                          <i className="fas fa-times text-[10px]"></i>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {node.children && node.children.length > 0 && (
              <div>
                <PermissionTree
                  nodes={node.children}
                  depth={depth + 1}
                  expandedNodes={expandedNodes}
                  checkedIds={checkedIds}
                  selectedGroup={selectedGroup}
                  isRemovingAction={isRemovingAction}
                  onToggleNode={onToggleNode}
                  onOpenAddModal={onOpenAddModal}
                  onCheckboxChange={onCheckboxChange}
                  onRemoveAction={onRemoveAction}
                  canCreate={canCreate}
                  canUpdate={canUpdate}
                  canDelete={canDelete}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  });
};

export default PermissionTree;
