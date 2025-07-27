import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const SurveyForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    organization: "",
    designation: "",
    experience: "",
    education: "",
    gender: "",
    workValue: "",
    communication: "",
    workLifeBalance: "",
    stress: "",
    workHours: "",
    salarySatisfaction: "",
    competitiveCompensation: "",
    careerGrowth: "",
    professionalDevelopment: "",
    companyMission: "",
    workCulture: "",
    managerSupport: "",
    leadership: "",
    roleAlignment: "",
    roleSatisfaction: "",
  });

  const [organizations, setOrganizations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attrition, setAttrition] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const experienceOptions = ["0-2 years", "3-5 years", "6-10 years", "10+ years"];
  const educationOptions = ["High School", "Bachelor's Degree", "Master's Degree", "Ph.D. or Higher"];
  const genderOptions = ["Male", "Female", "Other"];
  const jobTitles = [
    "Software Engineer", "Project Manager", "Data Analyst",
    "HR Manager", "Marketing Specialist", "Sales Executive"
  ];

  const validateForm = (formData) => {
    const errors = {};
    
    // Check each field for empty values
    Object.keys(formData).forEach(key => {
      if (!formData[key] || formData[key].trim() === '') {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    return errors;
  };

  const fetchOrganizations = async (query) => {
    if (!query) return;
    try {
      const response = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`);
      const data = await response.json();
      setOrganizations(data.map(org => org.name));
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === "organization") {
      setOrganizations([]);
      if (value.trim().length > 1) {
        fetchOrganizations(value);
      }
    }
  };

  const handleOrganizationSelect = (org) => {
    setFormData({ ...formData, organization: org });
    setOrganizations([]);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    const validationErrors = validateForm(formData);
  
  if (Object.keys(validationErrors).length > 0) {
    alert("Survey not fully Filled!");
    return;
  }else{
  // If no errors, proceed with form submission
  console.log('Form submitted:', formData);

  setIsSubmitting(true);
    try {
      const prompt = `Say Yes or No and predict employee attrition risk based on the following survey data:\n\n${JSON.stringify(formData, null, 2)}`;

      const response = await fetch("", {
        method: "POST",
        headers: {
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 512,
          stream: false,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || "No response received.";
      const attritionRisk = aiResponse.includes("Yes") ? "Yes" : "No";

      setAttrition(attritionRisk);
      setRecommendation(aiResponse);

      await addDoc(collection(db, "employee_surveys"), {
        ...formData,
        attrition: attritionRisk,
        aiRecommendation: aiResponse,
      });

      alert("Survey submitted successfully!");
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  }
    setFormData({
        name: "",
        age: "",
        organization: "",
        designation: "",
        experience: "",
        education: "",
        gender: "",
        workValue: "",
        communication: "",
        workLifeBalance: "",
        stress: "",
        workHours: "",
        salarySatisfaction: "",
        competitiveCompensation: "",
        careerGrowth: "",
        professionalDevelopment: "",
        companyMission: "",
        workCulture: "",
        managerSupport: "",
        leadership: "",
        roleAlignment: "",
        roleSatisfaction: "",
      });
    setIsSubmitting(false);
    setStep(1);
  };

  const progressWidth = `${(step / 4) * 100}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
            style={{ width: progressWidth }}
          />
        </div>

        <div className="p-8">
          {/* Step Indicators */}
          <div className="flex justify-between mb-8 text-sm">
            {['Basic Info', 'Work Environment', 'Career Growth', 'Review'].map((label, idx) => (
              <div 
                key={label}
                className={`flex flex-col items-center ${idx + 1 <= step ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                  ${idx + 1 <= step ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  {idx + 1}
                </div>
                <span className="hidden sm:block">{label}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Previous Organization</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                    {organizations.length > 0 && (
                      <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto">
                        {organizations.map((org, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition duration-200"
                            onClick={() => handleOrganizationSelect(org)}
                          >
                            {org}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    >
                      <option value="">Select Designation</option>
                      {jobTitles.map((title) => (
                        <option key={title} value={title}>{title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Other dropdowns with same styling */}
                  {[
                    { name: "experience", options: experienceOptions, label: "Experience" },
                    { name: "education", options: educationOptions, label: "Education" },
                    { name: "gender", options: genderOptions, label: "Gender" }
                  ].map(({ name, options, label }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <select
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      >
                        <option value="">Select {label}</option>
                        {options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Work Environment & Satisfaction</h3>
                {[
                  { name: "workValue", label: "Do you feel your work is valued?", options: ["Always", "Most of the time", "Sometimes", "Rarely", "Never"] },
                  { name: "communication", label: "How would you rate team communication?", options: ["Excellent", "Good", "Fair", "Poor", "Very poor"] },
                  { name: "workLifeBalance", label: "How would you rate your work-life balance?", options: ["Very good", "Good", "Fair", "Poor", "Very poor"] },
                  { name: "stress", label: "Do you often feel stressed due to work?", options: ["Always", "Often", "Sometimes", "Rarely", "Never"] },
                  { name: "workHours", label: "How many hours on average do you work per week?", options: ["Less than 40 hours", "40–50 hours", "50–60 hours", "More than 60 hours"] },
                ].map(({ name, label, options }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <select
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    >
                      <option value="">Select</option>
                      {options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Career Growth & Leadership</h3>
                {[
                  { name: "careerGrowth", label: "Do you feel there are opportunities for career advancement?", options: ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"] },
                  { name: "professionalDevelopment", label: "Are you satisfied with the company's professional development resources?", options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"] },
                  { name: "companyMission", label: "Do you feel connected to the company's mission and values?", options: ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"] },
                  { name: "workCulture", label: "How would you describe the company culture?", options: ["Very positive", "Positive", "Neutral", "Negative", "Very negative"] },
                  { name: "managerSupport", label: "Do you feel supported by your manager?", options: ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"] },
                  { name: "leadership", label: "How would you rate the leadership team's decision-making?", options: ["Excellent", "Good", "Fair", "Poor", "Very poor"] },
                  { name: "roleAlignment", label: "Does your role align with your skills and career goals?", options: ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"] },
                  { name: "roleSatisfaction", label: "How satisfied are you with your current role?", options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"] },
                  { name: "salarySatisfaction", label: "Do you feel that your compensation is competitive compared to industry standards?", options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"] },
                  { name: "competitiveCompensation", label: "How satisfied are you with your current salary and benefits?", options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"] },
                ].map(({ name, label, options }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <select
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    >
                      <option value="">Select</option>
                      {options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

        {step === 4 && (
          <div>
            <h3 className="text-xl font-semibold text-green-600">Thanks for your response</h3>
            <p className="text-sm text-gray-700">Please click on submit.</p>
          </div>
        )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center space-x-2"
                >
                  <span>Back</span>
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
                >
                    <span>Next</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`ml-auto px-6 py-2 rounded-lg text-white flex items-center space-x-2 ${
                    isSubmitting 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 transition duration-200'
                  }`}
                >
                  <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;