import React from "react";

const Toast = ({ message, type, onClose, onConfirm }) => {
  const typeStyles = {
    success: {
      bg: "bg-white",
      border: "border-purple-500",
      icon: "fa-check-circle",
      iconColor: "text-purple-500",
    },
    error: {
      bg: "bg-white",
      border: "border-red-500",
      icon: "fa-exclamation-circle",
      iconColor: "text-red-500",
    },
    confirm: {
      bg: "bg-white",
      border: "border-orange-400",
      icon: "fa-question-circle",
      iconColor: "text-orange-400",
    },
    info: {
      bg: "bg-white",
      border: "border-blue-500",
      icon: "fa-info-circle",
      iconColor: "text-blue-500",
    },
  };

  const style = typeStyles[type] || typeStyles.info;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div
      className={`pointer-events-auto flex flex-col gap-3 px-4 py-3 rounded-lg border shadow-lg ${style.bg} ${style.border} min-w-[300px] max-w-md animate-in slide-in-from-top duration-300`}
    >
      <div className="flex items-center gap-3">
        <i
          className={`fas ${style.icon} ${style.iconColor} text-lg flex-shrink-0`}
        ></i>
        <p className="text-sm font-medium text-gray-800 flex-grow">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className="fas fa-times text-sm"></i>
        </button>
      </div>

      {type === "confirm" && (
        <div className="flex justify-end gap-2 ml-7 mt-1">
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded shadow-sm transition-colors"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
};

export default Toast;
