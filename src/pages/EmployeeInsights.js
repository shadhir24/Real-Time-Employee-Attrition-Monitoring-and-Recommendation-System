import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Firebase setup
import { collection, getDocs,addDoc } from "firebase/firestore";
import { AiOutlineReload } from "react-icons/ai"; 


const EmployeeInsights = () => {
  const [employees, setEmployees] = useState([]);
  const [overallRecommendation, setOverallRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "employee_surveys"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData();
    fetchRecommendationHistory()
  }, []);

  const fetchRecommendationHistory = async () => {
    const querySnapshot = await getDocs(collection(db, "recommendations"));
    const recommendations = querySnapshot.docs.map(doc => doc.data());
    setOverallRecommendation(recommendations[0]?.text || "No recommendation available.");
  };

  const scoreMapping = {
    "Always": 5, "Most of the time": 4, "Sometimes": 3, "Rarely": 2, "Never": 1,
    "Excellent": 5, "Good": 4, "Fair": 3, "Poor": 2, "Very poor": 1,
    "Very good": 5, "Good": 4, "Fair": 3, "Poor": 2, "Very poor": 1,
    "Always": 1, "Often": 2, "Sometimes": 3, "Rarely": 4, "Never": 5,
    "Less than 40 hours": 5, "40–50 hours": 4, "50–60 hours": 3, "More than 60 hours": 1,
    "Very satisfied": 5, "Satisfied": 4, "Neutral": 3, "Dissatisfied": 2, "Very dissatisfied": 1,
    "Strongly agree": 5, "Agree": 4, "Neutral": 3, "Disagree": 2, "Strongly disagree": 1,
    "Very satisfied": 5, "Satisfied": 4, "Neutral": 3, "Dissatisfied": 2, "Very dissatisfied": 1
  };

  const computeScores = (employee) => {
    const satisfactionFields = [
      "workValue", "communication", "workLifeBalance", "salarySatisfaction",
      "competitiveCompensation", "careerGrowth", "professionalDevelopment",
      "companyMission", "workCulture", "managerSupport", "leadership",
      "roleAlignment", "roleSatisfaction"
    ];
  
    const workLifeBalanceFields = ["workLifeBalance", "workHours", "stress"];
    const attritionRiskFields = ["careerGrowth", "salarySatisfaction", "workCulture", "managerSupport", "workLifeBalance"];
    const companyEngagementFields = ["companyMission", "workCulture", "managerSupport"];
    const careerGrowthFields = ["careerGrowth", "professionalDevelopment", "roleAlignment"];
    const managementSupportFields = ["managerSupport", "leadership", "communication"];      
  
    const sumFields = (fields) =>
      fields.reduce((sum, field) => sum + (scoreMapping[employee[field]] || 0), 0);
  
    return {
      satisfactionScore: sumFields(satisfactionFields),
      workLifeBalanceScore: sumFields(workLifeBalanceFields),
      attritionRiskScore: sumFields(attritionRiskFields),
      companyEngagementScore: sumFields(companyEngagementFields),
      careerGrowthScore: sumFields(careerGrowthFields),
      managementSupportScore: sumFields(managementSupportFields)
    };
  };

  const classifyAttritionRisk = (scores) => {
    if (scores.attritionRiskScore < 10 || scores.workLifeBalanceScore < 8) {
      return "High Risk";
    } else if (scores.satisfactionScore > 50 && scores.attritionRiskScore > 15) {
      return "Low Risk";
    }
    return "Medium Risk";
  };
  
  const generateOverallRecommendation = async (employees) => {
    const processedData = employees.map(emp => {
      const scores = computeScores(emp);
      return {
        name: emp.name,
        designation: emp.designation,
        organization: emp.organization,
        experience: emp.experience,
        attritionRisk: classifyAttritionRisk(scores),
        satisfactionScore: scores.satisfactionScore,
        workLifeBalanceScore: scores.workLifeBalanceScore,
        attritionRiskScore: scores.attritionRiskScore,
        companyEngagementScore: scores.companyEngagementScore,
        careerGrowthScore: scores.careerGrowthScore,
        managementSupportScore: scores.managementSupportScore
      };
    });
  
    const prompt = `Based on the summarized employee data below, provide a general recommendation to improve retention:
    ${JSON.stringify(processedData)}
    Keep it concise.`;
  
    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
                    "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 256,
          stream: false,
        }),
      });
  
      const result = await response.json();
      const newRecommendation = result.choices[0]?.message?.content || "No recommendation available.";
      await addDoc(collection(db, "recommendations"), { text: newRecommendation, timestamp: new Date() });
      setOverallRecommendation(newRecommendation);
      return result.choices[0]?.message?.content || "No recommendation available.";
    } catch (error) {
      console.error("Error generating AI recommendation:", error);
    }
  };

  const fetchNewRecommendation = async () => {
    setLoading(true);
    const newRecommendation = await generateOverallRecommendation(employees);
    setLoading(false);
}

const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Employee Insights Dashboard
            </h2>
            <button
              onClick={fetchNewRecommendation}
              className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <AiOutlineReload 
                className={`w-6 h-6 ${loading ? "animate-spin" : ""}`} 
              />
            </button>
          </div>

          {/* Recommendation Section */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              AI-Powered Recommendation
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {overallRecommendation || "Generating recommendation..."}
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <div 
                  key={employee.id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {employee.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        employee.attrition === "High Risk" 
                          ? "bg-red-100 text-red-800" 
                          : employee.attrition === "Medium Risk"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {employee.attrition}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-gray-600 flex items-center">
                        <span className="font-medium mr-2">Role:</span>
                        {employee.designation}
                      </p>
                      <div className="border-t border-gray-100 my-4"></div>
                      <p className="text-gray-600">
                        <span className="font-medium">Recommendation:</span>
                        <span className="block mt-1 text-sm">
                          {employee.aiRecommendation}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-12">
                <p className="text-gray-500 text-lg">No employees found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
 

export default EmployeeInsights;
