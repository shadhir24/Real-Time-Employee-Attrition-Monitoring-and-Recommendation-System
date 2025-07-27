import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Firebase setup
import { collection, getDocs } from "firebase/firestore";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [surveyData, setSurveyData] = useState([]);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "employee_surveys"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSurveyData(data);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };

    fetchSurveyData();
  }, []);

  // 🔹 Attrition Rate (Pie Chart)
  const attritionCount = surveyData.reduce((acc, entry) => {
    acc[entry.attrition] = (acc[entry.attrition] || 0) + 1;
    return acc;
  }, { Yes: 0, No: 0 });

  const attritionData = [
    { name: "At Risk", value: attritionCount.Yes },
    { name: "Not at Risk", value: attritionCount.No },
  ];
  const COLORS = ["#FF5733", "#33FF57"];

  // 🔹 Work-Life Balance (Bar Chart)
  const workLifeBalanceData = surveyData.reduce((acc, entry) => {
    acc[entry.workLifeBalance] = (acc[entry.workLifeBalance] || 0) + 1;
    return acc;
  }, {});

  const workLifeChartData = Object.entries(workLifeBalanceData).map(([key, value]) => ({
    name: key,
    count: value,
  }));

  // 🔹 Salary Satisfaction (Bar Chart)
  const salarySatisfactionData = surveyData.reduce((acc, entry) => {
    acc[entry.salarySatisfaction] = (acc[entry.salarySatisfaction] || 0) + 1;
    return acc;
  }, {});

  const salaryChartData = Object.entries(salarySatisfactionData).map(([key, value]) => ({
    name: key,
    count: value,
  }));

  // 🔹 Stress Levels (Bar Chart)
  const stressData = surveyData.reduce((acc, entry) => {
    acc[entry.stress] = (acc[entry.stress] || 0) + 1;
    return acc;
  }, {});

  const stressChartData = Object.entries(stressData).map(([key, value]) => ({
    name: key,
    count: value,
  }));

  // 🔹 Career Growth (Stacked Bar Chart)
  const careerGrowthData = surveyData.reduce((acc, entry) => {
    acc[entry.careerGrowth] = (acc[entry.careerGrowth] || 0) + 1;
    return acc;
  }, {});

  const careerGrowthChartData = Object.entries(careerGrowthData).map(([key, value]) => ({
    name: key,
    count: value,
  }));

  // 🔹 Company Mission Alignment (Pie Chart)
  const companyMissionData = surveyData.reduce((acc, entry) => {
    acc[entry.companyMission] = (acc[entry.companyMission] || 0) + 1;
    return acc;
  }, {});

  const companyMissionChartData = Object.entries(companyMissionData).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Employee Analytics Dashboard
            </h2>
            <p className="mt-2 text-gray-600">
              Real-time insights into employee satisfaction and retention metrics
            </p>
          </div>

          {/* Summary Stats Section */}
          <div className="col-span-full m-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-blue-900 font-medium mb-2">Total Responses</h4>
                  <p className="text-2xl font-bold text-blue-600">{surveyData.length}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="text-green-900 font-medium mb-2">Retention Rate</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {((attritionCount.No / surveyData.length) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-6">
                  <h4 className="text-purple-900 font-medium mb-2">At Risk Employees</h4>
                  <p className="text-2xl font-bold text-purple-600">{attritionCount.Yes}</p>
                </div>
              </div>
            </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Attrition Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Attrition Risk Analysis
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={attritionData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    fill="#8884d8" 
                    label
                  >
                    {attritionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Work-Life Balance Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Work-Life Balance Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workLifeChartData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#4B5563' }}
                    fontSize={12}
                  />
                  <YAxis 
                    tick={{ fill: '#4B5563' }}
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px'
                    }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar 
                    dataKey="count" 
                    fill="#60A5FA"
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Additional charts follow the same pattern... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
