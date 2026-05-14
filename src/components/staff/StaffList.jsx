import React, { useEffect, useState } from "react";
import StaffTable from "./StaffTable";
import { ROUTES } from "../../constants/routes";

export default function StaffList({ setActivePage }) {
  const [staff, setStaff] = useState([]);
  const [deleteId, setDeleteId] = useState(null); // dialog state

  const fetchStaff = async () => {
    try {
      const res = await fetch(
        "https://attendance-backend-mlct.onrender.com/staff",
      );
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(
        `https://attendance-backend-1-pzsj.onrender.com/staff/${deleteId}`,
        { method: "DELETE" },
      );
      setDeleteId(null);
      fetchStaff();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (staff) => {
    localStorage.setItem("editStaffId", staff.id);
    setActivePage(ROUTES.STAFF_EDIT);
  };

  const handleAdd = () => {
    setActivePage(ROUTES.STAFF_FORM);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Staff Records
      </h2>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => setActivePage(ROUTES.STAFF_DASHBOARD)}
          className=" bg-gray-500 text-white px-2 py-3 rounded-xl hover:bg-gray-600 transition"
        >
          Back
        </button>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add Staff
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6">
        <StaffTable
          data={staff}
          onEdit={handleEdit}
          onDelete={setDeleteId} // open dialog instead of delete directly
        />
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[350px] text-center">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete this staff?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Yes, Delete
              </button>

              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
