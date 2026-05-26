import { useState, useEffect } from "react";
import { useAttendanceStore } from "../store/attendanceStore";
import EmployeeDetails from "../components/EmployeeDetails";
import TodaySummary from "../components/TodaySummary";
import BreakTime from "../components/BreakTime";
import Navbar from "../components/Navbar";
import EmpSidebar from "../components/sidebar/EmpSidebar";
import WeeklyStatusChart from "../components/WeeklyStatusChart";
import { ROUTES } from "../constants/routes";
import CalendarGrid from "../components/calendar/CalendarGrid";

import LeaveRequestForm from "./LeaveRequestForm";
import PermissionRequestForm from "../components/permission/PermissionRequestForm";
import BalanceCheck from "../components/leave/BalanceCheck";
import LeaveDashboard from "../components/leave/LeaveDashboard";
import Approved from "../components/leave/Approved";
import PermissionDashboard from "../components/permission/PermissionDashboard";
import PermissionRecords from "../components/permission/PermissionRecords";
import AdminDashboard from "../components/admin/AdminDashboard";
import PayrollDashboard from "../components/payslip/PayrollDashboard";
import GeneratePayslip from "../components/payslip/GeneratePayslip";
import PayslipForm from "../components/payslip/PayslipForm";
import StaffForm from "../components/staff/StaffForm";
import StaffTable from "../components/staff/StaffTable";
import StaffList from "../components/staff/StaffList";
import StaffEdit from "../components/staff/StaffEdit";
import NewEmpPayroll from "../components/NewEmpPayroll";
import PayRoll from "../components/payslip/PayRoll";
import StaffDasboard from "../components/staff/StaffDasboard";
import Signup from "./Signup";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState(ROUTES.DASHBOARD);
  const resumeTimer = useAttendanceStore((state) => state.resumeTimer);

  useEffect(() => {
    resumeTimer();
  }, [resumeTimer]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="w-full fixed top-0 left-0 z-50 shadow-md bg-white">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </header>

      <div className="flex pt-[70px] relative">
        {/* Sidebar Overlay */}
        <EmpSidebar
          isOpen={isSidebarOpen}
          onNavigate={setActivePage}
          activePage={activePage}
        />

        {/* Optional overlay to close sidebar on click */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div
          className={`transition-all duration-300 ${
            isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
          }`}
        >
          <main className="relative p-3 sm:p-6 md:p-8 overflow-y-auto origin-top scale-100 md:scale-[0.95] lg:scale-[0.95] xl:scale-[0.95]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4 sm:gap-6">
              {activePage === ROUTES.DASHBOARD && (
                <>
                  <div className="col-span-1 sm:col-span-2 bg-white p-4 rounded-xl shadow-md flex flex-col">
                    <EmployeeDetails />
                  </div>
                  <div className="col-span-1 sm:col-span-2 bg-white p-4 rounded-xl shadow-md flex flex-col">
                    <BreakTime />
                  </div>
                  <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-white p-6 rounded-xl shadow-md flex flex-col">
                    <TodaySummary />
                  </div>
                  <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-white p-6 rounded-xl shadow-md flex flex-col">
                    <WeeklyStatusChart />
                  </div>
                  <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-white p-6 rounded-xl shadow-md flex flex-col pointer-events-none">
                    <CalendarGrid />
                  </div>
                </>
              )}

              {/* Other Pages */}
              {activePage === ROUTES.CALENDARGRID && (
                <div className="col-span-1 lg:col-span-8 bg-white p-4 sm:p-6 rounded-xl shadow-md">
                  <CalendarGrid setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.ADMIN && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <AdminDashboard setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.LEAVEDASHBOARD && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <LeaveDashboard setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.PERMISSIONREQUESTFORM && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <PermissionRequestForm setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.BALANCECHECK && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <BalanceCheck setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.LEAVEREQUESTFORM && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <LeaveRequestForm setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.APPROVED && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <Approved setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.PERMISSIONDASHBOARD && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <PermissionDashboard setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.PERMISSIONRECORDS && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <PermissionRecords setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.ADMINDASHBOARD && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <AdminDashboard setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.PAYROLL_DASHBOARD && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <PayrollDashboard setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.PAYSLIPFORM && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <PayslipForm setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.PAYROLL && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <PayRoll setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.STAFF_FORM && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <StaffForm setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.STAFF_TABLE && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <StaffTable setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.STAFF_LIST && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <StaffList setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.STAFF_EDIT && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <StaffEdit setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.STAFF_DASHBOARD && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <StaffDasboard setActivePage={setActivePage} />
                </div>
              )}

              {activePage === ROUTES.NEW_EMP_PAY && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl">
                  <NewEmpPayroll setActivePage={setActivePage} />
                </div>
              )}
              {activePage === ROUTES.SIGNUP && (
                <div className="col-span-1 lg:col-span-8 p-4 sm:p-6 rounded-xl shadow-md">
                  <Signup setActivePage={setActivePage} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
