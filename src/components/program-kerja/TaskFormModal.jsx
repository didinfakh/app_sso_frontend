import React, { useState, useEffect } from "react";
import { fetchApi } from "../../services/ApiService";
import InputText from "../ui/InputText";
import InputSelect from "../ui/InputSelect";
import InputSelectMulti from "../ui/InputSelectMulti";

function TaskFormModal({
  isOpen,
  onClose,
  mode,
  task,
  programId,
  activeSieId,
  taskStatuses,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    id: null,
    id_program: programId,
    id_sie: activeSieId,
    id_task_status: "",
    title: "",
    description: "",
    due_date: "",
    id_user: [],
  });

  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      if (mode === "edit" && task) {
        setFormData({
          id: task.id_task || task.id,
          id_program: task.id_program || programId,
          id_sie: task.id_sie || activeSieId,
          id_task_status: task.id_task_status || "",
          title: task.title || "",
          description: task.description || "",
          due_date: task.due_date || "",
          id_user: task.assignees
            ? task.assignees.map((u) => u.id_user || u.id)
            : [],
        });
      } else {
        setFormData({
          id: null,
          id_program: programId,
          id_sie: activeSieId,
          id_task_status: task?.id_task_status || "", // Support pre-selecting status from column '+' button
          title: "",
          description: "",
          due_date: "",
          id_user: [],
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, task, programId, activeSieId]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // Changed to /sys-users per user's latest edit
      const response = await fetchApi.getApi("/sys-users");
      if (response && response.data) {
        setUsers(
          response.data.map((u) => ({
            value: u.id_user || u.id,
            label: u.name || u.username,
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (mode === "add") {
        response = await fetchApi.postApi("/tasks", formData);
      } else {
        response = await fetchApi.putApi(`/tasks/${formData.id}`, formData);
      }

      if (response && response.success) {
        onSuccess(
          mode === "add"
            ? "Tugas berhasil ditambahkan"
            : "Tugas berhasil diperbarui",
        );
        onClose();
      } else if (response && response.errors) {
        setErrors(response.errors);
        const errorMessages = Object.values(response.errors).flat().join(", ");
        showToast(errorMessages || "Terjadi kesalahan validasi", "error");
      } else {
        showToast(response?.message || "Terjadi kesalahan sistem", "error");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose}></div>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden relative z-10">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-lg font-semibold text-gray-800">
            {mode === "add" ? "Tambah Tugas Baru" : "Edit Tugas"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <InputText
              label="Judul Tugas"
              name="title"
              placeholder="Masukkan judul tugas..."
              value={formData.title}
              onChange={(val) => setFormData({ ...formData, title: val })}
              error={errors}
              inputCol
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
              <div
                className={`md:text-right font-semibold text-[#333] ${errors.description ? "text-red-500" : ""}`}
              >
                Deskripsi
              </div>
              <div className="col-span-2">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`w-full border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-md focus:border-purple-400 focus:outline-none p-2 text-sm min-h-[80px]`}
                  placeholder="Masukkan deskripsi tugas..."
                ></textarea>
                {errors.description && (
                  <small className="text-red-500 text-xs">
                    {errors.description}
                  </small>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputText
                label="Tenggat Waktu"
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={(val) => setFormData({ ...formData, due_date: val })}
                error={errors}
                inputCol
              />
              {/* Status Select Removed - Handled Automatically */}
            </div>

            <InputSelectMulti
              label="Penanggung Jawab (Bisa Multiple)"
              name="id_user"
              data={users}
              value={formData.id_user}
              onChange={(val) => setFormData({ ...formData, id_user: val })}
              error={errors}
              inputCol
              placeholder={
                isLoadingUsers ? "Memuat users..." : "Pilih satu atau lebih..."
              }
              disabled={isLoadingUsers}
            />
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <i className="fas fa-save text-sm"></i>
              Simpan Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskFormModal;
