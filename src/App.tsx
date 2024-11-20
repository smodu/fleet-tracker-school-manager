import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import FleetManagement from './pages/FleetManagement'
import StudentManagement from './pages/StudentManagement'
import Settings from './pages/Settings'
import { Messages } from './pages/Messages'
import Notifications from './pages/Notifications'
import Students from './components/Students'
import Drivers from './components/Drivers'
import Parents from './components/Parents'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="fleet-management" element={<FleetManagement />} />
          <Route path="fleet-management/drivers" element={<Drivers />} />
          <Route path="student-management" element={<StudentManagement />} />
          <Route path="student-management/students" element={<Students />} />
          <Route path="student-management/parents" element={<Parents />} />
          <Route path="settings" element={<Settings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
