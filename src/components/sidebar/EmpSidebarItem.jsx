export default function EmpSidebarItem({ icon, label, onClick, active }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 mx-2 mt-2 rounded-lg cursor-pointer text-white font-semibold hover:bg-[#023e8a] transition ${
        active ? "bg-[#023e8a] font-bold" : ""
      }`}
    >
      {icon} <span>{label}</span>
    </div>
  );
}
