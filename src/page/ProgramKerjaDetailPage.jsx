import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchApi } from "../services/ApiService";
import { useToast } from "../context/ToastContext";
import InputText from "../components/ui/InputText";
import KanbanBoard from "../components/program-kerja/KanbanBoard";

function ProgramKerjaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, showConfirmToast } = useToast();

  const [program, setProgram] = useState(null);
  const [sieList, setSieList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSieLoading, setIsSieLoading] = useState(true);

  // Modal for Sie
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id_sie: null, // Sie PK
    id_program: id, // Proker FK
    sie_name: "",
    description: "",
  });

  const [activeSieId, setActiveSieId] = useState(null);

  const getProgramDetail = async () => {
    setIsLoading(true);
    const response = await fetchApi.getApi(`/program-kerja/${id}`);
    if (response && response.data) {
      setProgram(response.data);
    }
    setIsLoading(false);
  };

  const getSieList = async () => {
    setIsSieLoading(true);
    // Assuming backend supports filtering by id_program or I fetch all and filter
    const response = await fetchApi.getApi(`/program-sie?id_program=${id}`);
    if (response && response.data) {
      // If the API returns all, we filter. If it's already filtered, even better.
      const filtered = Array.isArray(response.data)
        ? response.data.filter((s) => String(s.id_program) === String(id))
        : response.data.data
          ? response.data.data.filter(
              (s) => String(s.id_program) === String(id),
            )
          : [];
      setSieList(filtered);
      // Auto-select first sie
      if (filtered.length > 0 && !activeSieId) {
        setActiveSieId(filtered[0].id_sie);
      }
    }
    setIsSieLoading(false);
  };

  useEffect(() => {
    getProgramDetail();
    getSieList();
  }, [id]);

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setErrors({});
    if (mode === "edit" && item) {
      setFormData({
        id_sie: item.id_sie,
        id_program: id,
        sie_name: item.sie_name || "",
        description: item.description || "",
      });
    } else {
      setFormData({
        id_sie: null,
        id_program: id,
        sie_name: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (modalMode === "add") {
        // When adding, we shouldn't send id_sie if it's null to avoid DB errors
        const { id_sie, ...payload } = formData;
        response = await fetchApi.postApi("/program-sie", payload);
      } else {
        response = await fetchApi.putApi(
          `/program-sie/${formData.id_sie}`,
          formData,
        );
      }

      // Check if response is successful (has id_sie or exists and no errors)
      if (response && !response.errors) {
        showToast(
          modalMode === "add"
            ? "Sie berhasil ditambahkan"
            : "Sie berhasil diperbarui",
          "success",
        );
        closeModal();
        getSieList();
      } else if (response && response.errors) {
        setErrors(response.errors);
      }
    } catch (error) {
      showToast("Terjadi kesalahan koneksi", "error");
    }
  };

  const handleDelete = async (sieId) => {
    showConfirmToast("Apakah Anda yakin ingin menghapus Sie ini?", async () => {
      try {
        const response = await fetchApi.deleteApi(`/program-sie/${sieId}`);
        if (response) {
          showToast("Sie berhasil dihapus", "success");
          getSieList();
        }
      } catch (error) {
        showToast("Terjadi kesalahan koneksi", "error");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <i className="fas fa-spinner fa-spin text-3xl text-purple-600"></i>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Program Kerja tidak ditemukan.</p>
        <button
          onClick={() => navigate("/program-kerja")}
          className="mt-4 text-purple-600 font-medium"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="p-1 lg:p-2 bg-gray-50 min-h-screen">
      <div className="w-full space-y-2">
        {/* Integrated Header and Body Section */}
        <div className="flex flex-col lg:flex-row gap-1">
          {/* Local Sidebar for Sie - Full Height version */}
          <div className="w-full lg:w-60 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 sticky top-2 min-h-[calc(100vh-4rem)]">
              <div className="flex justify-between items-center mb-2 px-1">
                <h2 className="font-black text-gray-900 text-[10px] uppercase tracking-wider">
                  Navigasi Sie
                </h2>
                <button
                  onClick={() => openModal("add")}
                  className="w-6 h-6 bg-purple-600 rounded-lg text-white flex items-center justify-center hover:bg-purple-700 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <i className="fas fa-plus text-[9px]"></i>
                </button>
              </div>
              <div className="space-y-1">
                {isSieLoading ? (
                  <div className="space-y-3 py-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-12 bg-gray-50 rounded-xl animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : sieList.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <i className="fas fa-users-cog text-gray-300 mb-2 block text-xl"></i>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Belum ada Sie
                    </p>
                  </div>
                ) : (
                  sieList.map((sie) => (
                    <div
                      key={sie.id_sie}
                      onClick={() => setActiveSieId(sie.id_sie)}
                      className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${
                        activeSieId === sie.id_sie
                          ? "bg-purple-50 border-purple-100 shadow-sm"
                          : "hover:bg-gray-50 border-transparent hover:border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div
                          className={`w-7 h-7 rounded flex items-center justify-center shrink-0 transition-all ${
                            activeSieId === sie.id_sie
                              ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                              : "bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-purple-600 group-hover:shadow-md"
                          }`}
                        >
                          <i className="fas fa-users-cog text-[10px]"></i>
                        </div>
                        <span
                          className={`text-[11px] font-bold truncate ${
                            activeSieId === sie.id_sie
                              ? "text-purple-900"
                              : "text-gray-600 group-hover:text-purple-700"
                          }`}
                        >
                          {sie.sie_name}
                        </span>
                      </div>
                      <i
                        className={`fas fa-chevron-right text-[8px] transition-all ${
                          activeSieId === sie.id_sie
                            ? "text-purple-400 translate-x-1"
                            : "text-gray-300 opacity-0 group-hover:opacity-100"
                        }`}
                      ></i>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Area: Context Header + Kanban Board - Added left padding for separation */}
          <div className="flex-1 min-w-0 space-y-2 lg:pl-3">
            {/* Context Header - Single Line Efficiency */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 lg:px-6 lg:py-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 flex-1 min-w-0">
                  <h1 className="text-xl font-black text-gray-900 tracking-tight truncate shrink-0">
                    {program.name}{" "}
                    {activeSieId && (
                      <span className="text-purple-600">
                        (
                        {
                          sieList.find((s) => s.id_sie === activeSieId)
                            ?.sie_name
                        }
                        )
                      </span>
                    )}
                  </h1>

                  {/* Compact Info Badges in same row */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100">
                      <i className="fas fa-user-shield text-[10px] text-purple-400"></i>
                      <span className="text-[10px] font-bold text-gray-600">
                        {program.id_auth_user_leader || "-"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100">
                      <i className="far fa-calendar-alt text-[10px] text-purple-400"></i>
                      <span className="text-[10px] font-bold text-gray-600 truncate">
                        {program.start_date}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100">
                      <i className="fas fa-layer-group text-[10px] text-purple-400"></i>
                      <span className="text-[10px] font-bold text-gray-600">
                        {sieList.length} Sie
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                      ID: {program.id}
                    </span>
                    <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-wider border border-emerald-100">
                      AKTIF
                    </span>
                  </div>
                  {activeSieId && (
                    <div className="flex items-center gap-1 border-l border-gray-100 pl-3 shrink-0">
                      <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[10px] font-black rounded-lg transition-all border border-gray-100 flex items-center gap-2 mr-2">
                        <i className="fas fa-file-export"></i> LPJ
                      </button>
                      <button
                        onClick={() =>
                          openModal(
                            "edit",
                            sieList.find((s) => s.id_sie === activeSieId),
                          )
                        }
                        className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all flex items-center justify-center shadow-sm"
                      >
                        <i className="fas fa-edit text-xs"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(activeSieId)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center justify-center shadow-sm"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Kanban Board */}
            <KanbanBoard programId={id} activeSieId={activeSieId} />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40"
            onClick={closeModal}
          ></div>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative z-10">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-semibold text-gray-800">
                {modalMode === "add" ? "Tambah Sie Baru" : "Edit Sie"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <InputText
                  placeholder="Nama Sie"
                  name="sie_name"
                  value={formData.sie_name}
                  onChange={(val) =>
                    setFormData({ ...formData, sie_name: val })
                  }
                  error={errors}
                  inputCol
                  disabled={false}
                />

                <div className="grid grid-cols-1 gap-x-8">
                  <div className={`font-semibold text-[#333]`}>Deskripsi</div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="col-span-2 border border-gray-300 rounded-md focus:border-gray-400 focus:outline focus:outline-gray-400 p-2 text-sm min-h-[80px]"
                    placeholder="Masukkan deskripsi sie..."
                  ></textarea>
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
                  <i className="fas fa-save text-sm"></i>
                  Simpan Sie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramKerjaDetailPage;
