import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchApi } from "../services/ApiService";
import { useToast } from "../context/ToastContext";
import InputText from "../components/ui/InputText";
import InputSelect from "../components/ui/InputSelect";

function ProgramSieDetailPage() {
  const { programId, sieId } = useParams();
  const navigate = useNavigate();
  const { showToast, showConfirmToast } = useToast();

  const [program, setProgram] = useState(null);
  const [sie, setSie] = useState(null);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMemberLoading, setIsMemberLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Modal for Member
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id: null,
    id_sie: sieId,
    id_user: "", // Renamed and empty by default
    role: "",
  });

  const getDetails = async () => {
    setIsLoading(true);
    try {
      const [progRes, sieRes] = await Promise.all([
        fetchApi.getApi(`/program-kerja/${programId}`),
        fetchApi.getApi(`/program-sie/${sieId}`),
      ]);
      if (progRes && progRes.data) setProgram(progRes.data);
      if (sieRes && sieRes.data) setSie(sieRes.data);
    } catch (error) {
      console.error("Failed to fetch details:", error);
    }
    setIsLoading(false);
  };

  const getMembers = async () => {
    setIsMemberLoading(true);
    try {
      const response = await fetchApi.getApi(
        `/program-sie-member?id_sie=${sieId}`,
      );
      if (response && response.data) {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        const filtered = data.filter((m) => String(m.id_sie) === String(sieId));
        setMembers(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
    setIsMemberLoading(false);
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetchApi.getApi("/sys-user");
      if (response && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const userOptions = useMemo(() => {
    return users.map((u) => ({
      value: u.id_sys_user || u.id,
      label: u.name || u.username,
    }));
  }, [users]);

  useEffect(() => {
    getDetails();
    getMembers();
    fetchUsers();
  }, [programId, sieId]);

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setErrors({});
    if (mode === "edit" && item) {
      setFormData({
        id: item.id,
        id_sie: sieId,
        id_user: item.id_user || item.id_auth_user || "",
        role: item.role || "",
      });
    } else {
      setFormData({
        id: null,
        id_sie: sieId,
        id_user: "",
        role: "",
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
        response = await fetchApi.postApi("/program-sie-member", formData);
      } else {
        response = await fetchApi.putApi(
          `/program-sie-member/${formData.id}`,
          formData,
        );
      }

      if (response && (response.success || response.status === "success")) {
        showToast(
          modalMode === "add"
            ? "Anggota berhasil ditambahkan"
            : "Anggota berhasil diperbarui",
          "success",
        );
        closeModal();
        getMembers();
      } else if (response && response.errors) {
        setErrors(response.errors);
        const errorMessages = Object.values(response.errors).flat().join(", ");
        showToast(errorMessages || "Terjadi kesalahan validasi", "error");
      } else {
        showToast(response?.message || "Terjadi kesalahan sistem", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan koneksi", "error");
    }
  };

  const handleDelete = async (memberId) => {
    showConfirmToast(
      "Apakah Anda yakin ingin menghapus anggota ini?",
      async () => {
        try {
          const response = await fetchApi.deleteApi(
            `/program-sie-member/${memberId}`,
          );
          if (response && (response.success || response.status === "success")) {
            showToast("Anggota berhasil dihapus", "success");
            getMembers();
          } else {
            showToast(response?.message || "Gagal menghapus anggota", "error");
          }
        } catch (error) {
          showToast("Terjadi kesalahan koneksi", "error");
        }
      },
    );
  };

  const getUserName = (member) => {
    if (member.user && member.user.name) return member.user.name;
    const userId = member.id_user || member.id_auth_user;
    const found = users.find(
      (u) => String(u.id_sys_user || u.id) === String(userId),
    );
    return found ? found.name || found.username : `User #${userId}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <i className="fas fa-spinner fa-spin text-3xl text-purple-600"></i>
      </div>
    );
  }

  if (!sie) {
    return (
      <div className="p-6 text-center text-gray-500">Sie tidak ditemukan.</div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <button
            onClick={() => navigate("/program-kerja")}
            className="hover:text-purple-600"
          >
            Program Kerja
          </button>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <button
            onClick={() => navigate(`/program-kerja/${programId}`)}
            className="hover:text-purple-600"
          >
            {program?.name || "Program Detail"}
          </button>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-gray-800 font-medium">{sie.sie_name}</span>
        </div>

        {/* Sie Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {sie.sie_name}
              </h1>
              <p className="text-gray-600">
                {sie.description || "Tidak ada deskripsi."}
              </p>
            </div>
            <div className="bg-purple-600 px-6 py-3 rounded-xl text-white shadow-lg shadow-purple-200 flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-2xl font-bold">{members.length}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                Anggota
              </span>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-users text-purple-600"></i>
              Daftar Anggota Sie
            </h2>
            <button
              onClick={() => openModal("add")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2"
            >
              <i className="fas fa-plus text-[10px]"></i>
              Tambah Anggota
            </button>
          </div>

          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4 border-b border-gray-100">User</th>
                  <th className="px-6 py-4 border-b border-gray-100">
                    Role / Jabatan
                  </th>
                  <th className="px-6 py-4 border-b border-gray-100 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {isMemberLoading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      <i className="fas fa-spinner fa-spin mr-2"></i> Memuat
                      anggota...
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-12 text-center text-gray-400 italic"
                    >
                      Belum ada anggota di Sie ini.
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-[10px]">
                            {getUserName(member).substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-700">
                            {getUserName(member)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 italic">
                        {member.role || "Anggota"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openModal("edit", member)}
                            className="w-8 h-8 rounded bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="w-8 h-8 rounded bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40"
            onClick={closeModal}
          ></div>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative z-10 animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-semibold text-gray-800">
                {modalMode === "add" ? "Tambah Anggota Baru" : "Edit Anggota"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors relative z-20"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <InputSelect
                  name="Pilih User"
                  label="User"
                  data={userOptions}
                  value={formData.id_user}
                  onChange={(val) => setFormData({ ...formData, id_user: val })}
                  error={errors}
                  inputCol
                  placeholder={
                    isLoadingUsers ? "Memuat users..." : "Pilih User..."
                  }
                  disabled={isLoadingUsers}
                />

                <InputText
                  placeholder="Role / Jabatan"
                  name="role"
                  value={formData.role}
                  onChange={(val) => setFormData({ ...formData, role: val })}
                  error={errors}
                  inputCol
                  disabled={false}
                />
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
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramSieDetailPage;
