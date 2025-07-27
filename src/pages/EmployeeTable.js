import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const querySnapshot = await getDocs(collection(db, "employee_surveys"));
    setEmployees(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "employee_surveys", id));
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 p-3 rounded-lg w-1/3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-100">
                {[
                  "Name", "Age", "Organization", "Designation", "Experience", 
                  "Education", "Gender", "Work Value", "Communication", 
                  "Work-Life Balance", "Stress", "Work Hours", "Salary Satisfaction",
                  "Competitive Compensation", "Career Growth", "Professional Development",
                  "Company Mission", "Work Culture", "Manager Support", "Leadership",
                  "Role Alignment", "Role Satisfaction", "Recommendation", "Attrition", "Actions"
                ].map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-100">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees
                .filter((emp) => emp.name.toLowerCase().includes(search.toLowerCase()))
                .map((emp) => (
                  <tr 
                    key={emp.id} 
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{emp.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.age}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.organization}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.designation}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.experience}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.education}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.gender}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.workValue}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.communication}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.workLifeBalance}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.stress}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.workHours}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.salarySatisfaction}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.competitiveCompensation}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.careerGrowth}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.professionalDevelopment}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.companyMission}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.workCulture}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.managerSupport}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.leadership}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.roleAlignment}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.roleSatisfaction}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.aiRecommendation.length > 30 ? emp.aiRecommendation.substring(0, 30) + "..." : emp.aiRecommendation}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.attrition}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}