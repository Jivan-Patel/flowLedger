import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <TopNav />
      <main className="ml-64 pt-20 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
