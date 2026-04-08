import React from "react";

function TaskCard({ task, onClick, canDrag = true }) {
  const handleDragStart = (e) => {
    if (!canDrag) {
      e.preventDefault();
      return;
    }
    // Use id_task with fallback to id
    e.dataTransfer.setData("taskId", task.id_task || task.id);
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("opacity-50");
  };

  return (
    <div
      draggable={canDrag}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onClick(task)}
      className={`bg-white rounded-2xl p-4 border border-gray-100 shadow-sm transition-all group mb-3 last:mb-0 cursor-pointer ${
        canDrag
          ? "hover:shadow-md hover:border-purple-100"
          : "opacity-90 hover:bg-gray-50 border-dashed"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xs font-bold text-gray-800 break-words line-clamp-2 transition-colors group-hover:text-purple-700">
          {task.title}
        </h4>
        {canDrag ? (
          <i className="fas fa-grip-vertical text-[10px] text-gray-300 group-hover:text-purple-300"></i>
        ) : (
          <i
            className="fas fa-lock text-[10px] text-gray-300"
            title="Anda tidak memiliki akses untuk memindahkan task ini"
          ></i>
        )}
      </div>

      {task.description && (
        <p className="text-[10px] text-gray-400 line-clamp-2 mb-3 font-medium">
          {task.description.replace(/<[^>]+>/g, "")}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-50">
          <i className="far fa-calendar-alt text-purple-400"></i>
          <span>{task.due_date || "-"}</span>
        </div>

        <div className="flex -space-x-2 overflow-hidden">
          {task.assignees && task.assignees.length > 0 ? (
            task.assignees.slice(0, 3).map((user, idx) => (
              <div
                key={idx}
                className="h-6 w-6 rounded-full ring-2 ring-white bg-purple-100 flex items-center justify-center text-[8px] font-black text-purple-600 border border-purple-200 shadow-sm"
                title={user.name || user.username}
              >
                {(user.name || user.username || "?").charAt(0).toUpperCase()}
              </div>
            ))
          ) : (
            <div className="h-6 w-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100">
              <i className="fas fa-user text-[8px]"></i>
            </div>
          )}
          {task.assignees && task.assignees.length > 3 && (
            <div className="h-6 w-6 rounded-full ring-2 ring-white bg-gray-50 flex items-center justify-center text-[8px] font-black text-gray-400 border border-gray-100 shadow-sm">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
