import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import Dashboard from "../pages/Dashboard";
import EmpSidebar from "../components/sidebar/EmpSidebar";
import EmpSidebarItem from "../components/sidebar/EmpSidebarItem";
import CalendarGrid from "../components/calendar/CalendarGrid";
import WeeklyStatusChart from "../components/WeeklyStatusChart";
import Calendar from "../components/calendar/Calendar";
import EmployeePopup from "../components/calendar/EmployeePopup";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "../router/ProtectedRoute";
import CheckOutDialog from "../components/CheckOutDialog";
import LeaveRequestForm from "../pages/LeaveRequestForm";
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
import StaffEdit from "../components/staff/StaffEdit";
import StaffList from "../components/staff/StaffList";
import StaffTable from "../components/staff/StaffTable";
import NewEmpPayroll from "../components/NewEmpPayroll";
import PayRoll from "../components/payslip/PayRoll";
import StaffDasboard from "../components/staff/StaffDasboard";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound"; // ⭐ ADD THIS
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
        <Route path={ROUTES.FORGETPASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESETPASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.SIDEBAR} element={<EmpSidebar />} />
          <Route path={ROUTES.SIDEBARITEM} element={<EmpSidebarItem />} />
          <Route path={ROUTES.CALENDAR} element={<Calendar />} />
          <Route path={ROUTES.CALENDARGRID} element={<CalendarGrid />} />
          <Route path={ROUTES.EMPLOYEEPOPUP} element={<EmployeePopup />} />
          <Route
            path={ROUTES.WEEKLYSTATUSCHART}
            element={<WeeklyStatusChart />}
          />
          <Route path={ROUTES.CHECKOUT} element={<CheckOutDialog />} />
          <Route
            path={ROUTES.LEAVEREQUESTFORM}
            element={<LeaveRequestForm />}
          />
          <Route
            path={ROUTES.PERMISSIONREQUESTFORM}
            element={<PermissionRequestForm />}
          />
          <Route path={ROUTES.BALANCECHECK} element={<BalanceCheck />} />
          <Route path={ROUTES.LEAVEDASHBOARD} element={<LeaveDashboard />} />
          <Route path={ROUTES.APPROVED} element={<Approved />} />
          <Route
            path={ROUTES.PERMISSIONDASHBOARD}
            element={<PermissionDashboard />}
          />
          <Route
            path={ROUTES.PERMISSIONRECORDS}
            element={<PermissionRecords />}
          />
          <Route path={ROUTES.ADMINDASHBOARD} element={<AdminDashboard />} />
          <Route
            path={ROUTES.PAYROLL_DASHBOARD}
            element={<PayrollDashboard />}
          />
          <Route path={ROUTES.PAYROLL_GENERATE} element={<GeneratePayslip />} />
          <Route path={ROUTES.PAYSLIPFORM} element={<PayslipForm />} />
          <Route path={ROUTES.PAYROLL} element={<PayRoll />} />
          <Route path={ROUTES.STAFF_FORM} element={<StaffForm />} />
          <Route path={ROUTES.STAFF_EDIT} element={<StaffEdit />} />
          <Route path={ROUTES.STAFF_LIST} element={<StaffList />} />
          <Route path={ROUTES.STAFF_TABLE} element={<StaffTable />} />
          <Route path={ROUTES.STAFF_DASHBOARD} element={<StaffDasboard />} />
          <Route path={ROUTES.NEW_EMP_PAY} element={<NewEmpPayroll />} />
        </Route>

        {/* ⭐ MUST BE LAST — 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
