import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
// import EmployeesPage from "../pages/dashboard/EmployeesPage";
import EmployeeDashboard from "@/pages/uby/EmployeeDashboard";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/sign-in" replace />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/e-dashboard" element={<EmployeeDashboard/>} />
            {/* <Route path="/dashboard/employees" element={<EmployeesPage />} /> */}
        </Routes>
    );
};

export default AppRoutes;
