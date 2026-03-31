import React from "react";

function AccessDenied({
  title = "Akses Ditolak",
  message = "Anda tidak memiliki izin untuk mengakses halaman ini.",
  description = "Silakan hubungi administrator untuk mendapatkan akses yang diperlukan.",
}) {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Message Icon */}
        <div className="h-px bg-gray-100 w-12 mx-auto mb-6"></div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>

        {/* Message */}
        <p className="text-gray-600 mb-2">{message}</p>

        {/* Description */}
        <p className="text-sm text-gray-400">{description}</p>

        {/* Divider */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            <i className="fas fa-arrow-left text-sm"></i>
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;
