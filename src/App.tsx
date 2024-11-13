import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import FleetManagement from './pages/FleetManagement'
import StudentManagement from './pages/StudentManagement'
import Settings from './pages/Settings'
import { Messages } from './pages/Messages'
import Notifications from './pages/Notifications'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="fleet-management" element={<FleetManagement />} />
          <Route path="student-management" element={<StudentManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
