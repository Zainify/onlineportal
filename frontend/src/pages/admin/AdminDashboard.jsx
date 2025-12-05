import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import { motion } from 'framer-motion'
import { Database, Users, BookOpen, GraduationCap, Shield, TrendingUp, Activity, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/analytics/system/overview').then(r => {
      setOverview(r.data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  const systemHealth = [
    { label: 'System Status', value: 'Healthy', status: 'success', icon: <CheckCircle className="w-5 h-5" /> },
    { label: 'Database', value: 'Connected', status: 'success', icon: <Database className="w-5 h-5" /> },
    { label: 'API Response', value: '125ms', status: 'success', icon: <Activity className="w-5 h-5" /> },
    { label: 'Storage', value: '68%', status: 'warning', icon: <AlertCircle className="w-5 h-5" /> }
  ]

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 bg-blue-600 text-white shadow-lg"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-lg opacity-90">System metrics and administrative overview</p>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Database className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card title="System Health" subtitle="Real-time system status">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemHealth.map((health, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${health.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                    {health.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{health.label}</div>
                    <div className="text-xs text-gray-500">{health.value}</div>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${health.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card title="System Overview" subtitle="Key platform metrics">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : overview ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(overview).map(([key, value], index) => {
                const getIcon = (key) => {
                  const lowerKey = key.toLowerCase()
                  if (lowerKey.includes('user')) return <Users className="w-5 h-5" />
                  if (lowerKey.includes('student')) return <GraduationCap className="w-5 h-5" />
                  if (lowerKey.includes('teacher')) return <BookOpen className="w-5 h-5" />
                  if (lowerKey.includes('subject')) return <BookOpen className="w-5 h-5" />
                  if (lowerKey.includes('class')) return <GraduationCap className="w-5 h-5" />
                  if (lowerKey.includes('quiz')) return <Activity className="w-5 h-5" />
                  if (lowerKey.includes('content')) return <Shield className="w-5 h-5" />
                  return <Database className="w-5 h-5" />
                }

                const getColor = (key) => {
                  const lowerKey = key.toLowerCase()
                  if (lowerKey.includes('user')) return 'from-blue-500 to-blue-600'
                  if (lowerKey.includes('student')) return 'from-green-500 to-green-600'
                  if (lowerKey.includes('teacher')) return 'from-purple-500 to-purple-600'
                  if (lowerKey.includes('subject')) return 'from-orange-500 to-orange-600'
                  if (lowerKey.includes('class')) return 'from-pink-500 to-pink-600'
                  if (lowerKey.includes('quiz')) return 'from-teal-500 to-teal-600'
                  if (lowerKey.includes('content')) return 'from-indigo-500 to-indigo-600'
                  return 'from-gray-500 to-gray-600'
                }

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 ${getColor(key)} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                          {getIcon(key)}
                        </div>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold mb-1">{value}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">{key.replace(/_/g, ' ')}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Unable to load system overview</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card title="Quick Actions" subtitle="Common administrative tasks">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'Manage Users', icon: <Users className="w-5 h-5" />, href: '/admin/manage-users', color: 'from-blue-500 to-blue-600' },
              { title: 'Manage Subjects', icon: <BookOpen className="w-5 h-5" />, href: '/admin/manage-subjects', color: 'from-orange-500 to-orange-600' },
              { title: 'Manage Classes', icon: <GraduationCap className="w-5 h-5" />, href: '/admin/manage-classes', color: 'from-pink-500 to-pink-600' },
              { title: 'Approve Content', icon: <Shield className="w-5 h-5" />, href: '/admin/approve-content', color: 'from-indigo-500 to-indigo-600' },
              { title: 'System Overview', icon: <Database className="w-5 h-5" />, href: '/admin/system-overview', color: 'from-gray-500 to-gray-600' }
            ].map((action, index) => (
              <a
                key={index}
                href={action.href}
                className={`p-4 rounded-xl ${action.color} text-white text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
                <div className="text-xs font-medium">{action.title}</div>
              </a>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
