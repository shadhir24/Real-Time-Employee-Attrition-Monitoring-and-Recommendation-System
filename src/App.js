import React from "react";
import SurveyForm from "./components/SurveyForm";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route,Navigate, Link } from 'react-router-dom';
import EmployeeInsights from "./pages/EmployeeInsights";
import { auth } from "./firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./pages/Login";
import EmployeeTable from "./pages/EmployeeTable";

function PrivateRoute({ element }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  return user ? element : <Navigate to="/" />;
}

export default function App() {
  const [user, loading] = useAuthState(auth);
  return (
    <Router>
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-blue-500 text-white px-6 py-4">
            <div className="flex justify-between items-center">
              <div  className="text-xl font-bold">
              Employee Attrition Survey
              </div>
              <div className="space-x-4">
              {user ? (
                <div className="space-x-4">
                <Link to="/dashboard" className="hover:bg-blue-600 px-4 py-2">Dashboard</Link>
                <Link to="/insights" className="hover:bg-blue-600 px-5 py-2">Insights</Link>
                <Link to="/data" className="hover:bg-blue-600 px-5 py-2">Employee Data</Link>
                <button
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                  onClick={() => auth.signOut()}
                >
                  Logout
                </button>
                </div>
              ):( <Link
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                to="/login">
                Login
              </Link>)}
              </div>
            </div>
          </nav>
      <Routes>
      <Route path="/" element={<SurveyForm />} />
      <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/insights" element={<PrivateRoute element={<EmployeeInsights />} />} />
          <Route path="/data" element={<PrivateRoute element={<EmployeeTable />} />} />
      </Routes>
    </div>
    </Router>
  );
}