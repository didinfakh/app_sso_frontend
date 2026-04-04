import React, { useState, useEffect } from "react";
import { fetchApi } from "../../services/ApiService";
import { useToast } from "../../context/ToastContext";
import InputText from "../ui/InputText";

function KanbanBoard({ programId, activeSieId }) {
  const { showToast, showConfirmToast } = useToast();
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [isTaskStatusLoading, setIsTaskStatusLoading] = useState(false);

  // Modal for Task Status
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusModalMode, setStatusModalMode] = useState("add");
  const [errors, setErrors] = useState({});
  const [statusFormData, setStatusFormData] = useState({
    id_task_status: null,
    id_program: programId,
    id_sie: activeSieId,
    nama: "",
  });

  const getTaskStatuses = async (sieId) => {
    setIsTaskStatusLoading(true);
    const sid = sieId || activeSieId;
    const response = await fetchApi.getApi(
      `/task-status?q[id_program]=${programId}${sid ? `&q[id_sie]=${sid}` : ""}`,
    );
    if (response && response.data) {
      setTaskStatuses(response.data);
    }
    setIsTaskStatusLoading(false);
  };

  useEffect(() => {
    if (activeSieId) {
      getTaskStatuses(activeSieId);
    }
    setStatusFormData((prev) => ({ ...prev, id_sie: activeSieId }));
  }, [activeSieId, programId]);

  // Task Status CRUD Handlers
  const openStatusModal = (mode, item = null) => {
    setStatusModalMode(mode);
    setErrors({});
    if (mode === "edit" && item) {
      setStatusFormData({
        id_task_status: item.id_task_status,
        id_program: programId,
        id_sie: activeSieId,
        nama: item.nama || "",
      });
    } else {
      setStatusFormData({
        id_task_status: null,
        id_program: programId,
        id_sie: activeSieId,
        nama: "",
      });
    }
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => setIsStatusModalOpen(false);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (statusModalMode === "add") {
        response = await fetchApi.postApi("/task-status", statusFormData);
      } else {
        response = await fetchApi.putApi(
          `/task-status/${statusFormData.id_task_status}`,
          statusFormData,
        );
      }

      if (response && !response.errors) {
        showToast(
          statusModalMode === "add"
            ? "Status berhasil ditambahkan"
            : "Status berhasil diperbarui",
          "success",
        );
        closeStatusModal();
        getTaskStatuses();
      } else if (response && response.errors) {
        setErrors(response.errors);
      }
    } catch (error) {
      showToast("Terjadi kesalahan koneksi", "error");
    }
  };

  const handleStatusDelete = async (statusId) => {
    showConfirmToast(
      "Apakah Anda yakin ingin menghapus status/kolom ini? Semua tugas di kolom ini mungkin terpengaruh.",
      async () => {
        try {
          const response = await fetchApi.deleteApi(`/task-status/${statusId}`);
          if (response) {
            showToast("Status berhasil dihapus", "success");
            getTaskStatuses();
          }
        } catch (error) {
          showToast("Terjadi kesalahan koneksi", "error");
        }
      },
    );
  };

  if (!activeSieId) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
          <i className="fas fa-mouse-pointer text-3xl animate-pulse"></i>
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">
          Siap Memulai?
        </h3>
        <p className="text-sm text-gray-400 max-w-xs font-medium leading-relaxed">
          Pilih salah satu <b>Seksi (Sie)</b> di navigasi kiri untuk melihat
          papan tugas dan progres pekerjaan tim Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar">
        {isTaskStatusLoading ? (
          <div className="flex gap-6 animate-pulse w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[300px] h-96 bg-gray-100 rounded-3xl"
              ></div>
            ))}
          </div>
        ) : taskStatuses.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
            <i className="fas fa-columns text-gray-300 text-4xl mb-4"></i>
            <p className="text-gray-500 font-bold">Belum ada kolom Kanban.</p>
            <button
              onClick={() => openStatusModal("add")}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-purple-700 transition-all"
            >
              <i className="fas fa-plus mr-2"></i> Tambah Kolom Pertama
            </button>
          </div>
        ) : (
          <>
            {taskStatuses.map((status) => (
              <div
                key={status.id_task_status}
                className="min-w-[300px] max-w-[350px] bg-gray-100/60 rounded-3xl p-5 border border-gray-200/50 min-h-[600px] flex flex-col group/col"
              >
                <div className="flex justify-between items-center mb-5 px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase">
                      {status.nama}
                    </h3>
                    <div className="flex opacity-0 group-hover/col:opacity-100 transition-opacity">
                      <button
                        onClick={() => openStatusModal("edit", status)}
                        className="w-5 h-5 text-[9px] text-amber-600 hover:bg-amber-50 rounded flex items-center justify-center"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() =>
                          handleStatusDelete(status.id_task_status)
                        }
                        className="w-5 h-5 text-[9px] text-red-600 hover:bg-red-50 rounded flex items-center justify-center"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <span className="w-5 h-5 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-500">
                    0
                  </span>
                </div>

                <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 opacity-40">
                  <button className="w-8 h-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm mb-3">
                    <i className="fas fa-plus text-xs"></i>
                  </button>
                  <p className="text-[10px] font-bold text-gray-400">
                    Tambah Tugas
                  </p>
                </div>
              </div>
            ))}

            {/* Add Column Button */}
            <button
              onClick={() => openStatusModal("add")}
              className="min-w-[300px] bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8 hover:bg-white hover:border-purple-300 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4 group-hover:bg-purple-100 group-hover:text-purple-600 transition-all shadow-sm">
                <i className="fas fa-plus text-lg"></i>
              </div>
              <span className="text-sm font-bold text-gray-400 group-hover:text-purple-600">
                Tambah Kolom Baru
              </span>
            </button>
          </>
        )}
      </div>

      {/* Status Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40"
            onClick={closeStatusModal}
          ></div>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden relative z-10">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-semibold text-gray-800">
                {statusModalMode === "add"
                  ? "Tambah Kolom Status"
                  : "Edit Kolom Status"}
              </h3>
              <button
                onClick={closeStatusModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="p-6">
              <div className="space-y-4">
                <InputText
                  placeholder="Nama Kolom (misal: To Do)"
                  name="nama"
                  value={statusFormData.nama}
                  onChange={(val) =>
                    setStatusFormData({ ...statusFormData, nama: val })
                  }
                  error={errors}
                  inputCol
                  disabled={false}
                />
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeStatusModal}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <i className="fas fa-save text-sm"></i>
                  Simpan Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default KanbanBoard;
