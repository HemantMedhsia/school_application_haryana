const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-[#65FA9E] bg-opacity-20 flex items-center justify-center z-50">
        <div className="bg-[#a49fdd] p-6 rounded-md shadow-lg">
          <h2 className="text-lg text-gray-400 mb-4">{title || "Confirmation"}</h2>
          <p className="text-sm text-gray-600 mb-4">{message || "Are you sure?"}</p>
          <div className="flex justify-end">
            <button
              className="bg-red-500 hover:bg-red-300 text-white px-4 py-2 rounded mr-2"
              onClick={onConfirm}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationModal;
  