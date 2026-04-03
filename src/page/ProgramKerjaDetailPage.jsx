import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchApi } from "../services/ApiService";
import { useToast } from "../context/ToastContext";
import InputText from "../components/ui/InputText";

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Integrated Header and Body Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Local Sidebar for Sie - Matching the Sleek Design */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-extrabold text-gray-900 tracking-tight">
                  Navigasi Sie
                </h2>
                <button
                  onClick={() => openModal("add")}
                  className="w-8 h-8 bg-purple-600 rounded-xl text-white flex items-center justify-center hover:bg-purple-700 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <i className="fas fa-plus text-[10px]"></i>
                </button>
              </div>
              <div className="space-y-3">
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
                      className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
                        activeSieId === sie.id_sie
                          ? "bg-purple-50 border-purple-100 shadow-sm"
                          : "hover:bg-gray-50 border-transparent hover:border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                            activeSieId === sie.id_sie
                              ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                              : "bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-purple-600 group-hover:shadow-md"
                          }`}
                        >
                          <i className="fas fa-users-cog text-xs"></i>
                        </div>
                        <span
                          className={`text-sm font-bold truncate ${
                            activeSieId === sie.id_sie
                              ? "text-purple-900"
                              : "text-gray-600 group-hover:text-purple-700"
                          }`}
                        >
                          {sie.sie_name}
                        </span>
                      </div>
                      <i
                        className={`fas fa-chevron-right text-[10px] transition-all ${
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

          {/* Main Area: Context Header + Kanban Board */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Context Header - Detailed & Compact */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-4 max-w-2xl">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">
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
                    <p className="text-gray-500 font-medium leading-relaxed">
                      {program.description ||
                        "Tidak ada deskripsi program kerja."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-purple-600 shrink-0">
                        <i className="fas fa-user-shield text-xs"></i>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-bold text-gray-400 tracking-tighter">
                          Leader ID
                        </p>
                        <p className="text-xs font-black text-gray-800 leading-tight">
                          {program.id_auth_user_leader || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-purple-600 shrink-0">
                        <i className="far fa-calendar-alt text-xs"></i>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-bold text-gray-400 tracking-tighter">
                          Periode
                        </p>
                        <p className="text-xs font-black text-gray-800 leading-tight">
                          {program.start_date} - {program.end_date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-purple-600 shrink-0">
                        <i className="fas fa-layer-group text-xs"></i>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-bold text-gray-400 tracking-tighter">
                          Total Sie
                        </p>
                        <p className="text-xs font-black text-gray-800 leading-tight">
                          {sieList.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col items-center lg:items-end gap-3 flex-shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                      ID: {program.id}
                    </span>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm shadow-emerald-50 border border-emerald-200">
                      AKTIF
                    </span>
                  </div>
                  {activeSieId && (
                    <div className="flex gap-2 lg:mt-4">
                      <button
                        onClick={() =>
                          openModal(
                            "edit",
                            sieList.find((s) => s.id_sie === activeSieId),
                          )
                        }
                        className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all flex items-center justify-center shadow-sm"
                      >
                        <i className="fas fa-edit text-sm"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(activeSieId)}
                        className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center justify-center shadow-sm"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Kanban Board Placeholder */}
            {activeSieId ? (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black rounded-xl transition-all shadow-sm border border-gray-200 flex items-center gap-2 tracking-tight">
                    <i className="fas fa-file-export"></i> Generate LPJ
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Column: TO DO */}
                  <div className="bg-gray-100/60 rounded-3xl p-5 border border-gray-200/50 min-h-[600px] flex flex-col">
                    <div className="flex justify-between items-center mb-5 px-1">
                      <h3 className="text-sm font-black text-gray-900 tracking-tight">
                        TO DO
                      </h3>
                      <span className="w-5 h-5 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-500">
                        2
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Placeholder Card */}
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
                        <h4 className="text-sm font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                          Buat rundown acara
                        </h4>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-2 py-1 bg-gray-100 text-[9px] font-bold text-gray-500 rounded-lg">
                            19-06-26
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-3 text-gray-400 text-[10px] font-bold">
                            <span className="flex items-center gap-1">
                              <i className="far fa-check-square"></i> 10
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="far fa-file-alt"></i> 10
                            </span>
                          </div>
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white"></div>
                            <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-white"></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer border-dashed flex items-center justify-center py-8 text-gray-300">
                        <i className="fas fa-plus"></i>
                      </div>
                    </div>
                  </div>

                  {/* Column: DOING */}
                  <div className="bg-gray-100/60 rounded-3xl p-5 border-2 border-blue-400/50 min-h-[600px] flex flex-col shadow-lg shadow-blue-400/5">
                    <div className="flex justify-between items-center mb-5 px-1">
                      <h3 className="text-sm font-black text-gray-900 tracking-tight">
                        DOING
                      </h3>
                      <span className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-blue-600">
                        1
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-2xl shadow-md border border-blue-100 hover:shadow-lg transition-all cursor-pointer group scale-[1.02]">
                        <h4 className="text-sm font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                          Buat rundown acara
                        </h4>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-2 py-1 bg-blue-50 text-[9px] font-bold text-blue-500 rounded-lg">
                            19-06-26
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-3 text-gray-400 text-[10px] font-bold">
                            <span className="flex items-center gap-1 text-blue-400">
                              <i className="far fa-check-square"></i> 10
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="far fa-file-alt"></i> 10
                            </span>
                          </div>
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-orange-400 border-2 border-white shadow-sm"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column: DONE */}
                  <div className="bg-gray-100/60 rounded-3xl p-5 border border-gray-200/50 min-h-[600px] flex flex-col">
                    <div className="flex justify-between items-center mb-5 px-1">
                      <h3 className="text-sm font-black text-gray-900 tracking-tight">
                        DONE
                      </h3>
                      <span className="w-5 h-5 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-500">
                        0
                      </span>
                    </div>
                    <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 opacity-40">
                      <i className="fas fa-check-circle text-gray-300 text-3xl mb-2"></i>
                      <p className="text-[10px] font-bold text-gray-400">
                        Belum ada tugas selesai
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
                  <i className="fas fa-mouse-pointer text-3xl animate-pulse"></i>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">
                  Siap Memulai?
                </h3>
                <p className="text-sm text-gray-400 max-w-xs font-medium leading-relaxed">
                  Pilih salah satu <b>Seksi (Sie)</b> di navigasi kiri untuk
                  melihat papan tugas dan progres pekerjaan tim Anda.
                </p>
              </div>
            )}
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
