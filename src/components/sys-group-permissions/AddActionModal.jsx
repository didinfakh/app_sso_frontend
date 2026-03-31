import React from "react";
import CreatableSelect from "react-select/creatable";

const AddActionModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  isAdding,
  sysPermissions = [],
}) => {
  if (!isOpen) return null;

  const options = sysPermissions.map((perm) => ({
    value: perm.code || perm.name,
    label: perm.name || perm.code,
    description: perm.description || "",
  }));

  const selectedOption =
    options.find((opt) => opt.value === formData.code) ||
    (formData.code ? { value: formData.code, label: formData.code } : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative z-10 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-lg font-semibold text-gray-800">
            Tambah Action Baru
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Action <span className="text-red-500">*</span>
              </label>
              <CreatableSelect
                isClearable
                options={options}
                placeholder="Pilih atau ketik action baru..."
                value={selectedOption}
                onChange={(newValue, actionMeta) => {
                  if (
                    actionMeta.action === "select-option" ||
                    actionMeta.action === "create-option"
                  ) {
                    onFormChange({
                      code: newValue.value,
                      description: newValue.__isNew__
                        ? ""
                        : newValue.description || "",
                    });
                  } else if (actionMeta.action === "clear") {
                    onFormChange({ code: "", description: "" });
                  }
                }}
                className="text-sm"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: state.isFocused ? "#a855f7" : "#E5E7EB",
                    boxShadow: state.isFocused ? "0 0 0 1px #a855f7" : "none",
                    minHeight: "42px",
                    borderRadius: state.menuIsOpen
                      ? "0.5rem 0.5rem 0 0"
                      : "0.5rem",
                    "&:hover": {
                      borderColor: state.isFocused ? "#a855f7" : "#D1D5DB",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    marginTop: 0,
                    borderRadius: "0 0 0.5rem 0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #E5E7EB",
                    borderTop: "none",
                    zIndex: 9999,
                  }),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Gunakan format lowercase dan underscore (tanpa spasi).
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Action <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="description"
                value={formData.description || ""}
                onChange={(e) => onFormChange({ description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                placeholder="Contoh: Export Data User ke PDF"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isAdding}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 disabled:bg-purple-400"
            >
              {isAdding ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-save"></i>
              )}
              {isAdding ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActionModal;
