import React, { useState, useEffect, useRef, useMemo } from "react";
import { fetchApi } from "../../services/ApiService";
import InputText from "../ui/InputText";
import InputSelect from "../ui/InputSelect";
import InputSelectMulti from "../ui/InputSelectMulti";
import JoditEditor from "jodit-react";
import { useToast } from "../../context/ToastContext";

function AddTaskModal({
  isOpen,
  onClose,
  mode,
  task,
  programId,
  activeSieId,
  taskStatuses,
  onSuccess,
}) {
  const { showToast, showConfirmToast } = useToast();
  const [formData, setFormData] = useState({
    id: null,
    id_program: programId,
    id_sie: activeSieId,
    id_task_status: "",
    title: "",
    description: "",
    due_date: "",
    id_user: [],
    urgency: "",
    expenses: [],
  });

  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("details");

  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Masukkan deskripsi tugas...",
      minHeight: 200,
      toolbarButtonSize: "small",
      enableDragAndDropFileToEditor: true,
      uploader: {
        insertImageAsBase64URI: true,
      },
    }),
    [],
  );

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
          urgency: task.urgency || "",
          expenses: task.expenses
            ? typeof task.expenses === "string"
              ? JSON.parse(task.expenses)
              : task.expenses
            : [],
        });
      } else {
        setFormData({
          id: null,
          id_program: programId,
          id_sie: activeSieId,
          id_task_status: task?.id_task_status || "",
          title: "",
          description: "",
          due_date: "",
          id_user: [],
          urgency: "",
          expenses: [],
        });
      }
      setErrors({});
      setActiveTab("details");
    }
  }, [isOpen, mode, task, programId, activeSieId]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
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

  const handleAddExpense = () => {
    setFormData({
      ...formData,
      expenses: [
        ...formData.expenses,
        { item: "", description: "", amount: "", proof: null },
      ],
    });
  };

  const handleRemoveExpense = (index) => {
    const newExpenses = formData.expenses.filter((_, i) => i !== index);
    setFormData({ ...formData, expenses: newExpenses });
  };

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...formData.expenses];
    newExpenses[index][field] = value;
    setFormData({ ...formData, expenses: newExpenses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        expenses: JSON.stringify(formData.expenses),
      };

      let response;
      if (mode === "add") {
        response = await fetchApi.postApi("/tasks", submitData);
      } else {
        response = await fetchApi.putApi(`/tasks/${formData.id}`, submitData);
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
      }
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  const handleDelete = async () => {
    showConfirmToast(
      "Apakah Anda yakin ingin menghapus tugas ini?",
      async () => {
        try {
          const response = await fetchApi.deleteApi(`/tasks/${formData.id}`);
          if (response && response.success) {
            onSuccess("Tugas berhasil dihapus");
            onClose();
          } else {
            showToast(response?.message || "Gagal menghapus tugas", "error");
          }
        } catch (error) {
          console.error("Error deleting task:", error);
          showToast("Terjadi kesalahan sistem", "error");
        }
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-[#f4f5f7] rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex justify-between items-start mb-1">
            <div className="flex-1 mr-4">
              <input
                type="text"
                className="w-full text-xl font-bold text-gray-800 bg-transparent border-none focus:ring-2 focus:ring-purple-200 rounded px-1 -ml-1 transition-all"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Judul Tugas..."
              />
              <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <i className="far fa-clock"></i>
                  Modified: {task?.updated_at || "-"}
                </span>
                <span className="flex items-center gap-1">
                  <i className="far fa-calendar-plus"></i>
                  Created: {task?.created_at || "-"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Hapus Tugas"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mt-4 border-b border-gray-100">
            {[
              { id: "details", label: "Details", icon: "fa-home" },
              { id: "attachments", label: "Attachments", icon: "fa-paperclip" },
              { id: "comments", label: "Comments", icon: "fa-comment" },
              { id: "activity", label: "Activity", icon: "fa-bolt" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-1 flex items-center gap-2 text-xs font-bold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "text-purple-600 border-purple-600"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                <i className={`fas ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto no-scrollbar bg-[#f4f5f7]"
        >
          <div className="p-6">
            {activeTab === "details" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Urgency */}
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">
                      Urgensi
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        {
                          id: "low",
                          label: "Low",
                          color: "bg-green-100 text-green-700 border-green-200",
                        },
                        {
                          id: "medium",
                          label: "Medium",
                          color:
                            "bg-yellow-100 text-yellow-700 border-yellow-200",
                        },
                        {
                          id: "high",
                          label: "High",
                          color:
                            "bg-orange-100 text-orange-700 border-orange-200",
                        },
                        {
                          id: "critical",
                          label: "Critical",
                          color: "bg-red-100 text-red-700 border-red-200",
                        },
                      ].map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, urgency: u.id })
                          }
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                            formData.urgency === u.id
                              ? u.color +
                                " ring-2 ring-offset-1 ring-purple-200"
                              : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {u.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">
                      Tenggat Waktu
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                        value={formData.due_date}
                        onChange={(e) =>
                          setFormData({ ...formData, due_date: e.target.value })
                        }
                      />
                      {formData.due_date && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, due_date: "" })
                          }
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <i className="fas fa-times-circle"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assignees */}
                <div>
                  <InputSelectMulti
                    label="Penanggung Jawab"
                    name="id_user"
                    data={users}
                    value={formData.id_user}
                    onChange={(val) =>
                      setFormData({ ...formData, id_user: val })
                    }
                    error={errors}
                    inputCol
                    placeholder={
                      isLoadingUsers
                        ? "Memuat users..."
                        : "Pilih penanggung jawab..."
                    }
                    disabled={isLoadingUsers}
                  />
                </div>

                {/* Expenses Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
                      <i className="fas fa-money-bill-wave text-purple-500"></i>
                      Pengeluaran
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddExpense}
                      className="text-[10px] font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-2 py-1 rounded transition-colors"
                    >
                      + Tambah Baris
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="bg-gray-50/50 text-gray-400 font-bold border-b border-gray-100">
                          <th className="px-4 py-2">Nama Barang</th>
                          <th className="px-4 py-2">Deskripsi</th>
                          <th className="px-4 py-2">Jumlah</th>
                          <th className="px-4 py-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {formData.expenses.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-4 py-6 text-center text-gray-400 italic font-medium"
                            >
                              Belum ada data pengeluaran.
                            </td>
                          </tr>
                        ) : (
                          formData.expenses.map((exp, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-2 py-2">
                                <input
                                  type="text"
                                  className="w-full bg-transparent border-none focus:ring-0 font-medium px-2"
                                  placeholder="..."
                                  value={exp.item}
                                  onChange={(e) =>
                                    handleExpenseChange(
                                      idx,
                                      "item",
                                      e.target.value,
                                    )
                                  }
                                />
                              </td>
                              <td className="px-2 py-2">
                                <input
                                  type="text"
                                  className="w-full bg-transparent border-none focus:ring-0 text-gray-500"
                                  placeholder="..."
                                  value={exp.description}
                                  onChange={(e) =>
                                    handleExpenseChange(
                                      idx,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                />
                              </td>
                              <td className="px-2 py-2">
                                <input
                                  type="number"
                                  className="w-full bg-transparent border-none focus:ring-0 font-bold text-purple-600"
                                  placeholder="0"
                                  value={exp.amount}
                                  onChange={(e) =>
                                    handleExpenseChange(
                                      idx,
                                      "amount",
                                      e.target.value,
                                    )
                                  }
                                />
                              </td>
                              <td className="px-2 py-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExpense(idx)}
                                  className="text-gray-300 hover:text-red-500 px-2 transition-colors"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">
                    Deskripsi
                  </label>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <JoditEditor
                      ref={editor}
                      value={formData.description}
                      config={config}
                      onBlur={(newContent) =>
                        setFormData({ ...formData, description: newContent })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <i className="fas fa-tools text-4xl mb-4 opacity-20"></i>
                <p className="font-bold text-sm">Fitur ini belum tersedia</p>
                <p className="text-[11px]">Sedang dalam pengembangan</p>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <i className="fas fa-save"></i>
            Simpan Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;
