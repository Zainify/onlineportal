import { Outlet, Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import Switch from '@mui/material/Switch'
import { Home, BookOpen, GraduationCap, FileText, BarChart3, Users, Settings, LogOut, Menu, X, ChevronDown, User, Video, Edit3, Eye, TrendingUp, Award, Database, Shield, Bell, Search, Sun, Moon, ArrowRight, Layers, Bot } from 'lucide-react'
import Footer from './Footer'

import api from '../lib/api'
import { AnimatePresence, motion } from 'framer-motion'

export default function Layout() {
  const { user, logout } = useAuth()
  const [dark, setDark] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/me')
      setNotifications(res.data.data || [])
      setUnreadCount(res.data.data.filter(n => !n.is_read).length)
    } catch (error) {
      console.error('Failed to fetch notifications', error)
    }
  }

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications(notifications.map(n => n._id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read', error)
      // Still update UI optimistically
      setNotifications(notifications.map(n => n._id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()
      // Poll every minute
      const interval = setInterval(fetchNotifications, 60000)
      return () => clearInterval(interval)
    }
  }, [user])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)


  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  if (!user) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <PublicNavbar dark={dark} setDark={setDark} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:transform-none border-r border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} h-screen overflow-hidden`}>
        <div className="h-full flex flex-col max-h-screen">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl tracking-tight">Concept Master</div>
                  <div className="text-xs opacity-60 capitalize">{user?.role} Portal</div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{user?.name}</div>
                <div className="text-xs opacity-60 capitalize">{user?.role}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <NavLinks role={user?.role} />
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-72">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl px-4 lg:px-6 flex-shrink-0 z-40 md:z-[60] relative">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Bar */}
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 w-64 lg:w-80">
              <Search className="w-4 h-4 opacity-60" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-[100] overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full font-medium">
                            {unreadCount} new
                          </span>
                        )}
                      </div>

                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {notifications.map((notification) => (
                              <div
                                key={notification._id || notification.id}
                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${!notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                onClick={() => !notification.is_read && markAsRead(notification._id || notification.id)}
                              >
                                <div className="flex gap-3">
                                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.is_read ? 'bg-blue-500' : 'bg-transparent'}`} />
                                  <div className="flex-1 space-y-1">
                                    <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                      {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <div className="hidden sm:flex items-center gap-2 text-xs opacity-80">
              <span>Light</span>
              <Switch size="small" checked={dark} onChange={(e) => setDark(e.target.checked)} />
              <span>Dark</span>
            </div>

            {/* User Avatar */}
            <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-medium hidden lg:block">{user?.name}</div>
              <ChevronDown className="w-4 h-4 opacity-60" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function NavLinks({ role }) {
  const getNavItems = () => {
    const baseItems = [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: <Home className="w-5 h-5" />
      }
    ]

    const roleItems = {
      student: [
        { title: 'My Notes', href: '/student/notes', icon: <FileText className="w-5 h-5" /> },
        { title: 'Lectures', href: '/student/lectures', icon: <Video className="w-5 h-5" /> },
        { title: 'Quizzes', href: '/student/quizzes', icon: <Edit3 className="w-5 h-5" /> },
        { title: 'Results', href: '/student/results', icon: <Award className="w-5 h-5" /> },
        { title: 'Performance', href: '/student/performance', icon: <TrendingUp className="w-5 h-5" /> }
      ],
      teacher: [
        { title: 'Upload Notes', href: '/teacher/upload-notes', icon: <FileText className="w-5 h-5" /> },
        { title: 'Upload Lectures', href: '/teacher/upload-lectures', icon: <Video className="w-5 h-5" /> },
        { title: 'Create Quiz', href: '/teacher/create-quiz', icon: <Edit3 className="w-5 h-5" /> },
        { title: 'Manage Quizzes', href: '/teacher/manage-quizzes', icon: <Database className="w-5 h-5" /> },
        { title: 'Student Attempts', href: '/teacher/student-attempts', icon: <Eye className="w-5 h-5" /> },
        { title: 'Analytics', href: '/teacher/analytics', icon: <BarChart3 className="w-5 h-5" /> }
      ],
      parent: [
        { title: 'Child Dashboard', href: '/parent/dashboard', icon: <Users className="w-5 h-5" /> }
      ],
      admin: [
        { title: 'Manage Users', href: '/admin/manage-users', icon: <Users className="w-5 h-5" /> },
        { title: 'Manage Subjects', href: '/admin/manage-subjects', icon: <BookOpen className="w-5 h-5" /> },
        { title: 'Manage Chapters', href: '/admin/manage-chapters', icon: <Layers className="w-5 h-5" /> },
        { title: 'Manage Notes', href: '/admin/manage-notes', icon: <FileText className="w-5 h-5" /> },
        { title: 'Manage Classes', href: '/admin/manage-classes', icon: <GraduationCap className="w-5 h-5" /> },
        { title: 'Teacher Requests', href: '/admin/teacher-requests', icon: <Shield className="w-5 h-5" /> },
        { title: 'Approve Content', href: '/admin/approve-content', icon: <Shield className="w-5 h-5" /> },
        { title: 'System Overview', href: '/admin/system-overview', icon: <Database className="w-5 h-5" /> }
      ]
    }

    return [...baseItems, ...(roleItems[role] || [])]
  }

  const navItems = getNavItems()

  return (
    <nav className="space-y-1">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.href}
          className={({ isActive }) =>
            `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`
          }
        >
          <span className={`${({ isActive }) => isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {item.icon}
          </span>
          <span className="flex-1">{item.title}</span>
          {!item.href.startsWith('/dashboard') && (
            <ChevronDown className="w-4 h-4 opacity-60 rotate-90" />
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function PublicNavbar({ dark, setDark }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-2xl supports-[backdrop-filter]:backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-md">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white block leading-none">
              Concept Master
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">Learn • Grow • Excel</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-2">
          {[
            { to: '/', label: 'Home', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
            { to: '/books', label: 'Books', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
            { to: '/notes', label: 'Notes', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 flex-1 lg:flex-none">
          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-sm">
            <form action="/books" className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              <input
                name="q"
                placeholder="Search books, classes, notes..."
                className="w-full pl-12 pr-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500/20 border border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600 transition-all duration-200 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-750 shadow-sm focus:shadow-md"
              />
            </form>
          </div>

          {/* Theme Toggle & Login */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <Sun className="w-4 h-4 text-yellow-500" />
              <Switch size="small" checked={dark} onChange={(e) => setDark(e.target.checked)} className="scale-90" />
              <Moon className="w-4 h-4 text-blue-500" />
            </div>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all duration-200 shadow-md text-sm"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
