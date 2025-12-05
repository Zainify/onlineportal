import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import { motion } from 'framer-motion'
import { Upload, Video, Edit3, Database, Eye, BarChart3, Plus, FileText, Users, Clock, TrendingUp } from 'lucide-react'

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    totalUploads: 0,
    activeQuizzes: 0,
    studentAttempts: 0,
    avgScore: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch teacher statistics
        const statsResponse = await api.get('/teacher/dashboard/stats')
        const statsData = statsResponse.data || {}
        setStats({
          totalUploads: statsData.totalUploads || 0,
          activeQuizzes: statsData.activeQuizzes || 0,
          studentAttempts: statsData.studentAttempts || 0,
          avgScore: statsData.avgScore || 0
        })

        // Fetch recent activity
        const activityResponse = await api.get('/teacher/dashboard/activity')
        setRecentActivity(activityResponse.data || [])
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        // Set default values if API fails
        setStats({
          totalUploads: 0,
          activeQuizzes: 0,
          studentAttempts: 0,
          avgScore: 0
        })
        setRecentActivity([])
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const quickStats = [
    { label: 'Total Uploads', value: stats.totalUploads.toString(), change: stats.totalUploads > 0 ? 'Active content' : 'No uploads yet' },
    { label: 'Active Quizzes', value: stats.activeQuizzes.toString(), change: stats.activeQuizzes > 0 ? `${stats.activeQuizzes} published` : 'Create your first quiz' },
    { label: 'Student Attempts', value: stats.studentAttempts.toString(), change: stats.studentAttempts > 0 ? 'Recent activity' : 'No attempts yet' },
    { label: 'Avg Score', value: stats.avgScore > 0 ? `${stats.avgScore}%` : 'N/A', change: stats.avgScore > 0 ? 'Performance metric' : 'No data yet' }
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Teacher Dashboard</h1>
              <p className="text-lg opacity-90">Create content, manage quizzes, and review performance</p>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Edit3 className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          // Loading skeleton
          [...Array(4)].map((_, index) => (
            <div key={index} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          ))
        ) : (
          quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{stat.label}</div>
                <div className="text-xs text-green-600 mt-1">{stat.change}</div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'Upload Notes',
            subtitle: 'Share study material with students',
            description: 'Upload PDFs, documents, or create rich text notes with descriptions',
            icon: <Upload className="w-6 h-6" />,
            href: '/teacher/upload-notes',
            color: 'from-blue-500 to-blue-600',
            features: ['PDF support', 'Rich text editor', 'Organize by subject']
          },
          {
            title: 'Upload Lectures',
            subtitle: 'Add video content or external links',
            description: 'Upload video files or embed YouTube/external links for students',
            icon: <Video className="w-6 h-6" />,
            href: '/teacher/upload-lectures',
            color: 'from-purple-500 to-purple-600',
            features: ['Video upload', 'YouTube embed', 'External links']
          },
          {
            title: 'Create Quiz',
            subtitle: 'Build interactive assessments',
            description: 'Create comprehensive quizzes with multiple question types',
            icon: <Edit3 className="w-6 h-6" />,
            href: '/teacher/create-quiz',
            color: 'from-green-500 to-green-600',
            features: ['Multiple choice', 'Time limits', 'Auto-grading']
          },
          {
            title: 'Manage Quizzes',
            subtitle: 'Publish or delete existing quizzes',
            description: 'Review, edit, and manage all your quiz content in one place',
            icon: <Database className="w-6 h-6" />,
            href: '/teacher/manage-quizzes',
            color: 'from-orange-500 to-orange-600',
            features: ['Bulk actions', 'Schedule publishing', 'Version control']
          },
          {
            title: 'Student Attempts',
            subtitle: 'View individual student performance',
            description: 'Monitor individual student progress and provide detailed feedback',
            icon: <Eye className="w-6 h-6" />,
            href: '/teacher/student-attempts',
            color: 'from-pink-500 to-pink-600',
            features: ['Detailed reports', 'Time tracking', 'Feedback system']
          },
          {
            title: 'Analytics',
            subtitle: 'Track class performance metrics',
            description: 'Get insights into class performance and identify improvement areas',
            icon: <BarChart3 className="w-6 h-6" />,
            href: '/teacher/analytics',
            color: 'from-teal-500 to-teal-600',
            features: ['Performance trends', 'Class insights', 'Export reports']
          }
        ].map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <Link
                  to={action.href}
                  className={`px-3 py-1.5 rounded-lg ${action.color} text-white text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105`}
                >
                  Open
                </Link>
              </div>

              <h3 className="text-lg font-bold mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{action.subtitle}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 leading-relaxed">{action.description}</p>

              <div className="space-y-2">
                {action.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card title="Recent Activity" subtitle="Your latest content updates">
          <div className="space-y-3">
            {loading ? (
              // Loading skeleton
              [...Array(4)].map((_, index) => (
                <div key={index} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
              ))
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'notes' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'quiz' ? 'bg-green-100 text-green-600' :
                        activity.type === 'lecture' ? 'bg-purple-100 text-purple-600' :
                          'bg-orange-100 text-orange-600'
                      }`}>
                      {
                        activity.type === 'notes' ? <FileText className="w-4 h-4" /> :
                          activity.type === 'quiz' ? <Edit3 className="w-4 h-4" /> :
                            activity.type === 'lecture' ? <Video className="w-4 h-4" /> :
                              <Eye className="w-4 h-4" />
                      }
                    </div>
                    <div>
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-gray-500">{activity.item}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">No recent activity yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Start uploading content or creating quizzes to see your activity here</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
