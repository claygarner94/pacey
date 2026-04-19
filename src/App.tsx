import { Routes, Route } from 'react-router-dom'
import Landing from './components/landing/Landing'
import Wizard from './components/wizard/Wizard'
import PlanPage from './components/plan/PlanPage'
import About from './components/about/About'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/wizard" element={<Wizard />} />
      <Route path="/plan" element={<PlanPage />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}
