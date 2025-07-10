import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
const useIdleLogout = (timeout = 60 * 60 * 8 * 1000) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("isLogedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("last_active");
    navigate("/login");
  };

  //   untuk reset timer saat ada aktivitas
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, timeout);
    localStorage.setItem("last_active", Date.now());
  };

  useEffect(() => {
    // Cek saat pertama kali apakah sudah idle
    const last = localStorage.getItem("last_active");
    if (last && Date.now() - last > timeout) {
      logout();
      return;
    }

    // Aktivitas yang dideteksi
    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Set timer ke awal kembali
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
};

export default useIdleLogout;
