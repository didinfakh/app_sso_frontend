import React, { useEffect, useState } from "react";
import { fetchApi } from "../services/ApiService";
import { getStorage, setStorage } from "../services/Utils";
import { useToast } from "../context/ToastContext";
import InputText from "../components/ui/InputText";
import BtnSubmit from "../components/ui/BtnSubmit";

function ProfilePage() {
  const [user, setUser] = useState({
    id_user: "",
    name: "",
    email: "",
    telegram_number: "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    const storedUser = getStorage("user");
    if (storedUser) {
      fetchUserData(storedUser.id_user || storedUser.id);
    }
  }, []);

  const fetchUserData = async (userId) => {
    setIsLoading(true);
    try {
      const response = await fetchApi.getApi(`/sys-users/${userId}`);
      if (response && response.data) {
        setUser({
          id_user: response.data.id_user || response.data.id,
          name: response.data.name || "",
          email: response.data.email || "",
          telegram_number: response.data.telegram_number || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      showToast("Gagal memuat data profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      const response = await fetchApi.putApi(`/sys-users/${user.id_user}`, {
        name: user.name,
        email: user.email,
        telegram_number: user.telegram_number,
      });

      if (response && response.success) {
        showToast("Profile berhasil diperbarui", "success");
        // Update local storage
        const storedUser = getStorage("user");
        setStorage("user", { ...storedUser, ...user });
      } else if (response && response.errors) {
        setErrors(response.errors);
      } else {
        showToast(response?.message || "Gagal memperbarui profile", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Terjadi kesalahan sistem", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setPasswordErrors({});
    try {
      const response = await fetchApi.putApi(
        `/sys-users/${user.id_user}/change-password`,
        passwordData,
      );

      if (response && response.success) {
        showToast("Password berhasil diperbarui", "success");
        setPasswordData({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else if (response && response.errors) {
        setPasswordErrors(response.errors);
      } else {
        showToast(response?.message || "Gagal memperbarui password", "error");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      showToast("Terjadi kesalahan sistem", "error");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <i className="fas fa-user text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Detail Profil</h2>
              <p className="text-xs text-gray-500">
                Kelola informasi pribadi Anda
              </p>
            </div>
          </div>
          <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
            <InputText
              label="Nama Lengkap"
              name="name"
              value={user.name}
              onChange={(val) => setUser({ ...user, name: val })}
              error={errors}
              placeholder="Masukkan nama lengkap"
              inputCol
            />
            <InputText
              label="Alamat Email"
              name="email"
              type="email"
              value={user.email}
              onChange={(val) => setUser({ ...user, email: val })}
              error={errors}
              placeholder="Masukkan alamat email"
              inputCol
            />
            <InputText
              label="Nomor Telegram"
              name="telegram_number"
              value={user.telegram_number}
              onChange={(val) => setUser({ ...user, telegram_number: val })}
              error={errors}
              placeholder="Contoh: 08123456789"
              inputCol
            />
            <div className="flex justify-end pt-4">
              <div className="w-full md:w-1/3">
                <BtnSubmit
                  placeholder="Simpan Profile"
                  isLoading={isLoading}
                  onClick={handleProfileSubmit}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Password Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
              <i className="fas fa-lock text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Ubah Password</h2>
              <p className="text-xs text-gray-500">
                Gunakan password yang kuat untuk keamanan
              </p>
            </div>
          </div>
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
            <InputText
              label="Password Sekarang"
              name="current_password"
              type="password"
              value={passwordData.current_password}
              onChange={(val) =>
                setPasswordData({ ...passwordData, current_password: val })
              }
              error={passwordErrors}
              placeholder="••••••••"
              inputCol
            />
            <InputText
              label="Password Baru"
              name="new_password"
              type="password"
              value={passwordData.new_password}
              onChange={(val) =>
                setPasswordData({ ...passwordData, new_password: val })
              }
              error={passwordErrors}
              placeholder="••••••••"
              inputCol
            />
            <InputText
              label="Konfirmasi Password Baru"
              name="new_password_confirmation"
              type="password"
              value={passwordData.new_password_confirmation}
              onChange={(val) =>
                setPasswordData({
                  ...passwordData,
                  new_password_confirmation: val,
                })
              }
              error={passwordErrors}
              placeholder="••••••••"
              inputCol
            />
            <div className="flex justify-end pt-4">
              <div className="w-full md:w-1/3">
                <BtnSubmit
                  placeholder="Update Password"
                  isLoading={isPasswordLoading}
                  onClick={handlePasswordSubmit}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
