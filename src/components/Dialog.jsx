import React from "react";

const DialogBox = ({ icon, title, message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1c1f24] text-white p-6 rounded-md shadow-lg max-w-md w-full">
        <div className="flex items-center mb-4 text-center">
          {icon && <span className="mr-3">{icon}</span>}
          <h2 className="text-lg w-full font-semibold">{title}</h2>
        </div>
        <p className="mb-6 text-center">{message}</p>
        <div className="flex w-full items-center justify-center">
          <button
            onClick={onClose}
            className="bg-[#14697e] text-white px-4 py-2 rounded"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
