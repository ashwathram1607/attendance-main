export default function LogoutDialog({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center rounded-2xl  bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[320px] text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Confirm Logout
        </h2>
        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md"
          >
            Yes, Logout
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
