# Real Time Employee Attrition Monitoring and Recommendation System


[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.3.0-orange?logo=firebase)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)

<img width="3372" height="1820" alt="Image" src="https://github.com/user-attachments/assets/484b1e40-5a40-432f-9a49-545ec1bcf57b" />

## 🔍 Overview
A comprehensive employee attrition survey and analytics platform that helps organizations:
- 📝 Collect employee feedback through structured surveys
- 🤖 Predict attrition risk using AI
- 📈 Visualize key HR metrics
- 💡 Get actionable recommendations to improve employee retention

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 📋 Multi-step Survey | Comprehensive form with progress tracking |
| 🔐 Secure Authentication | Firebase authentication |
| 📊 Real-time Dashboard | Analytics with Recharts visualizations |
| 🧠 AI Recommendations | Employee Retention improvement suggestions |
| 🔍 Employee Search | Find and assess individual risks |
| 📱 Responsive Design | Works on all devices |

## 🛠 Tech Stack
- **Frontend**: ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) 19, ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=tailwind-css&logoColor=white)
- **Charts**: ![Recharts](https://img.shields.io/badge/-Recharts-FF6384?logo=chart.js&logoColor=white)
- **Backend**: ![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?logo=firebase&logoColor=black) (Auth, Firestore)
- **AI**: ![OpenAI](https://img.shields.io/badge/-OpenAI-412991?logo=openai&logoColor=white) GPT-4
- **Build**: ![Create React App](https://img.shields.io/badge/-CRA-09D3AC?logo=create-react-app&logoColor=white)

## 🚀 Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/employee-attrition.git
cd employee-attrition

# 2. Install dependencies
npm install

# 3. Set up Firebase (see Configuration section)

# 4. Start the development server
npm start
```

## ⚙️ Configuration
Create `.env.local` with your Firebase config:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=your-openai-key
```

## 📖 Usage
1. **Survey** - Employees complete the multi-step form
2. **Dashboard** - HR views real-time analytics
3. **Insights** - Get AI-powered retention strategies

## ⚙️ Key Components
- **Firebase Authentication**: Securely manages employee login and access control
- **Firestore Database**: Stores all survey responses with real-time updates
- **React Survey Form**: Dynamic multi-step questionnaire with progress tracking
- **OpenAI API**: Analyzes responses and generates retention recommendations
- **Recharts**: Visualizes employee metrics with interactive dashboards
- **React Context**: Manages application state across all components

## 📸 Screenshots
<img width="2532" height="2668" alt="Image" src="https://github.com/user-attachments/assets/cfe4aa63-b46d-45d1-85b1-9125e6ca026f" />
<img width="666" height="301" alt="Image" src="https://github.com/user-attachments/assets/66244b1c-c824-4109-a240-353666c4587a" />
<img width="671" height="355" alt="Image" src="https://github.com/user-attachments/assets/4652811c-fa2f-491f-afbb-ca50640bb4b9" />
