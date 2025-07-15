import React, { useState, useRef, useEffect } from "react";

const Navbar = () => {
  // State untuk menu burger mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State untuk dropdown profil
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Ref untuk mendeteksi klik di luar dropdown profil
  const profileMenuRef = useRef(null);

  // Hook untuk menutup dropdown profil jika klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenu_ref.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    // Tambahkan event listener saat komponen dimuat
    document.addEventListener("mousedown", handleClickOutside);
    // Hapus event listener saat komponen akan di-unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b-4 border-blue-500 relative">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {/* Tombol Burger - Muncul hanya di mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-black focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                )}
              </svg>
            </button>
          </div>

          {/* Navigasi Kiri (Desktop) - Tersembunyi di mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-black font-medium">
              Subscription
            </a>
            <a href="#" className="text-gray-700 hover:text-black font-medium">
              History
            </a>
            <a href="#" className="text-gray-700 hover:text-black font-medium">
              Our Product
            </a>
          </div>
        </div>

        {/* Judul Aplikasi di Tengah */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-3xl font-extrabold text-black">AXIOS APP</h1>
        </div>

        {/* Navigasi Kanan */}
        <div className="flex items-center space-x-6">
          {/* Tombol Logout lama sudah dihapus dari sini */}

          {/* Kontainer Dropdown Profil */}
          <div className="relative" ref={profileMenuRef}>
            {/* Tombol Pemicu Dropdown */}
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center bg-black rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full text-white font-bold text-sm">
                FK
              </div>
              <span className="hidden sm:block ml-2 mr-3 text-white font-medium text-sm">
                Fakhruddin
              </span>
            </button>

            {/* Menu Dropdown Profil */}
            <div
              className={`
                ${isProfileOpen ? "block" : "hidden"}
                absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-10
              `}
            >
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Menu Mobile */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden bg-white border-t`}
      >
        <a href="#" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
          Subscription
        </a>
        <a href="#" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
          History
        </a>
        <a href="#" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
          Our Product
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
