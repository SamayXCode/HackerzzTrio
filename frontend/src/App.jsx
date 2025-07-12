import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import QuestionPage from './pages/QuestionPage'
import AskQuestionPage from './pages/AskQuestionPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/questions/:id" element={<QuestionPage />} />
          <Route path="/ask" element={<AskQuestionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App