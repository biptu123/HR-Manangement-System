import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
// import EmployeesPage from "../pages/dashboard/EmployeesPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/sign-in" replace />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            {/* <Route path="/dashboard/employees" element={<EmployeesPage />} /> */}
        </Routes>
    );
};

export default AppRoutes;
