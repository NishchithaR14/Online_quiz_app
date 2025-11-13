import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AllQuizzes from "./pages/AllQuizzes";import CreateQuiz from "./pages/CreateQuiz";
import AddQuestion from "./pages/AddQuestion";
import AdminUserView from "./pages/AdminUserView";

import Dashboard from "./user/Dashboard";
import QuizPage from "./user/QuizPage";
import ScorePage from "./user/ScorePage";
import Leaderboard from "./user/Leaderboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-quiz" element={<CreateQuiz />} />
        <Route path="/admin/all-quizzes" element={<AllQuizzes />} />
        <Route path="/admin/add-question/:quizId" element={<AddQuestion />} />
        <Route path="/admin/users/:id" element={<AdminUserView />} /> 

                <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
        <Route path="/score/:quizId" element={<ScorePage />} />
        <Route path="/leaderboard/:quizId" element={<Leaderboard />} />

        
      </Routes>
    </Router>
  );
}

export default App;
