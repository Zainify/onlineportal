import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card.jsx'
import { TrendingUp, Award, Target, BookOpen, Clock, Star, Activity, Calendar, Tag, PlayCircle, AlertCircle, GraduationCap } from 'lucide-react'

export default function StudentDashboard() {
  const [data, setData] = useState([])
  const [classes, setClasses] = useState([])
  const [userClass, setUserClass] = useState(null)
  const [classQuizzes, setClassQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // Fetch student info and classes
    Promise.all([
      api.get('/analytics/student/overview'),
      api.get('/classes'),
      api.get('/auth/me')
    ]).then(([analyticsRes, classesRes, userRes]) => {
      console.log('Student Dashboard - Analytics:', analyticsRes.data)
      console.log('Student Dashboard - Classes:', classesRes.data)
      console.log('Student Dashboard - User:', userRes.data)

      setData(analyticsRes.data.attempts || [])
      setClasses(classesRes.data || [])

      // Get user's class
      const user = userRes.data
      console.log('User class_id:', user.class_id)

      if (user.class_id) {
        const userClassInfo = classesRes.data.find(c => c.id === user.class_id)
        console.log('User class info:', userClassInfo)
        setUserClass(userClassInfo)

        // Fetch quizzes for student's class
        return api.get(`/quizzes?class_id=${user.class_id}`)
      } else {
        // If no class assigned, fetch all published quizzes
        console.log('No class assigned, fetching all quizzes')
        return api.get('/quizzes')
      }
      return Promise.resolve({ data: { data: [] } })
    }).then(quizzesRes => {
      console.log('Student Dashboard - Quizzes:', quizzesRes.data)
      setClassQuizzes(quizzesRes.data.data || [])
      setLoading(false)
    }).catch((e) => {
      console.error('Student Dashboard Error:', e)
      setLoading(false)
    })
  }, [])

  const completed = data.length
  const avg = completed ? (data.reduce((s, a) => s + Number(a.percentage || 0), 0) / completed).toFixed(1) : 0
  const last = completed ? Number(data[data.length - 1]?.percentage || 0) : 0
  const best = completed ? Math.max(...data.map(d => Number(d.percentage || 0))) : 0

  const recentActivity = data.slice(-5).reverse()

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 bg-blue-600 text-white shadow-lg"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Student Dashboard</h1>
              <p className="text-lg opacity-90">Track your progress and keep improving</p>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Completed Quizzes',
            value: completed,
            icon: <BookOpen className="w-6 h-6" />,
            color: 'from-blue-500 to-blue-600',
            change: '+12% from last month'
          },
          {
            title: 'Average Score',
            value: `${avg}%`,
            icon: <Target className="w-6 h-6" />,
            color: 'from-green-500 to-green-600',
            change: '+5% improvement'
          },
          {
            title: 'Best Score',
            value: `${best}%`,
            icon: <Award className="w-6 h-6" />,
            color: 'from-purple-500 to-purple-600',
            change: 'Personal best'
          },
          {
            title: 'Last Attempt',
            value: `${last}%`,
            icon: <Activity className="w-6 h-6" />,
            color: 'from-orange-500 to-orange-600',
            change: 'Recent activity'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color === 'from-blue-500 to-blue-600' ? 'bg-blue-600' : stat.color === 'from-green-500 to-green-600' ? 'bg-green-600' : stat.color === 'from-purple-500 to-purple-600' ? 'bg-purple-600' : 'bg-orange-600'} rounded-xl flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                <span className="text-xs text-green-600 font-medium">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card title="Progress Over Time" subtitle="Your performance trend">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="attempted_at" hide />
                    <YAxis domain={[0, 100]} stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#9ca3af' }}
                      itemStyle={{ color: '#e5e7eb' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="percentage"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card title="Recent Activity" subtitle="Your latest quiz attempts">
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${Number(activity.percentage) >= 80 ? 'bg-green-500' :
                        Number(activity.percentage) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                        {Math.round(Number(activity.percentage))}%
                      </div>
                      <div>
                        <div className="text-sm font-medium">Quiz #{data.length - index}</div>
                        <div className="text-xs text-gray-500">{activity.attempted_at}</div>
                      </div>
                    </div>
                    <Star className={`w-4 h-4 ${Number(activity.percentage) >= 80 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      }`} />
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div >
      </div >

      {/* Class Quizzes Section */}
      {
        (userClass || classQuizzes.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card title={`${userClass ? userClass.title + ' ' : ''}Quizzes`} subtitle={userClass ? `Available quizzes for your class` : `Available quizzes`}>
              {classQuizzes.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classQuizzes.map((quiz, index) => (
                    <motion.div
                      key={quiz._id || quiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 ${quiz.status === 'published' ? 'bg-green-600' : 'bg-gray-600'} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${quiz.status === 'published'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}>
                            {quiz.status === 'published' ? 'Available' : 'Draft'}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-purple-600 transition-colors">
                          {quiz.title}
                        </h3>

                        {quiz.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {quiz.description}
                          </p>
                        )}

                        <div className="space-y-2 mb-4">
                          {/* Class Info */}
                          {quiz.class && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                                <GraduationCap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">{quiz.class.title}</span>
                            </div>
                          )}

                          {/* Subject Info */}
                          {quiz.subject && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
                                <Tag className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="text-gray-600 dark:text-gray-400">{quiz.subject.name}</span>
                            </div>
                          )}

                          {/* Deadline */}
                          {quiz.deadline && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className={`w-6 h-6 rounded flex items-center justify-center ${new Date(quiz.deadline) < new Date()
                                ? 'bg-red-100 dark:bg-red-900/30'
                                : 'bg-orange-100 dark:bg-orange-900/30'
                                }`}>
                                <Calendar className={`w-3 h-3 ${new Date(quiz.deadline) < new Date()
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-orange-600 dark:text-orange-400'
                                  }`} />
                              </div>
                              <span className={`font-medium ${new Date(quiz.deadline) < new Date()
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-orange-600 dark:text-orange-400'
                                }`}>
                                Due: {new Date(quiz.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{quiz.duration_minutes || 0} min</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Created: {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'Unknown'}
                          </div>

                          {quiz.status === 'published' ? (
                            <a
                              href={`/student/quiz/${quiz._id || quiz.id}`}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium hover:shadow-md transition-all duration-300"
                            >
                              <PlayCircle className="w-4 h-4" />
                              Start Quiz
                            </a>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-300 text-gray-500 text-sm font-medium cursor-not-allowed"
                            >
                              <AlertCircle className="w-4 h-4" />
                              Not Available
                            </button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No quizzes available</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {userClass ? 'No quizzes have been assigned to your class yet' : 'No quizzes are currently available'}
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )
      }

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card title="Quick Actions" subtitle="Jump to your most used features">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Take Quiz', icon: <BookOpen className="w-5 h-5" />, href: '/student/quizzes', color: 'from-blue-500 to-blue-600' },
              { title: 'View Notes', icon: <BookOpen className="w-5 h-5" />, href: '/student/notes', color: 'from-green-500 to-green-600' },
              { title: 'Watch Lectures', icon: <Clock className="w-5 h-5" />, href: '/student/lectures', color: 'from-purple-500 to-purple-600' },
              { title: 'See Results', icon: <Award className="w-5 h-5" />, href: '/student/results', color: 'from-orange-500 to-orange-600' }
            ].map((action, index) => (
              <a
                key={index}
                href={action.href}
                className={`p-4 rounded-xl ${action.color === 'from-blue-500 to-blue-600' ? 'bg-blue-600 hover:bg-blue-700' : action.color === 'from-green-500 to-green-600' ? 'bg-green-600 hover:bg-green-700' : action.color === 'from-purple-500 to-purple-600' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-600 hover:bg-orange-700'} text-white text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
                <div className="text-sm font-medium">{action.title}</div>
              </a>
            ))}
          </div>
        </Card>
      </motion.div>
    </div >
  )
}
