import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import { motion } from 'framer-motion'
import { Clock, BookOpen, PlayCircle, CheckCircle, AlertCircle, Filter, Search, TrendingUp, GraduationCap, Calendar, Tag, FolderOpen, ArrowLeft } from 'lucide-react'

export default function QuizList() {
  const { classId } = useParams()
  const [items, setItems] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const loadClasses = async () => {
      setLoading(true)
      try {
        console.log('QuizList - Loading classes...')
        // Add timestamp to bypass cache
        const timestamp = Date.now()
        const c = await api.get(`/classes?t=${timestamp}`)
        console.log('QuizList - Classes response:', c.data)
        setClasses(c.data || [])
      } catch (e) {
        console.error('QuizList - Classes error:', e)
      }
      setLoading(false)
    }
    loadClasses()
  }, [])

  useEffect(() => {
    const loadQuizzes = async () => {
      if (!classId) { console.log('QuizList - No classId, returning'); setItems([]); return }
      setLoading(true)
      try {
        console.log('QuizList - Loading quizzes for classId:', classId)
        // Add timestamp to bypass cache
        const timestamp = Date.now()
        const r = await api.get(`/quizzes?t=${timestamp}`, { params: { class_id: classId } })
        console.log('QuizList - Response:', r.data)
        console.log('QuizList - Quizzes data:', r.data.data)
        setItems(r.data.data || [])
      } catch (e) {
        console.error('QuizList - Quizzes error:', e)
      }
      setLoading(false)
    }
    loadQuizzes()
  }, [classId])

  const filteredItems = items.filter(quiz => {
    const matchesSearch = quiz.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || quiz.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const currentClass = classes.find(c => String(c._id || c.id) === String(classId))

  console.log('QuizList - State:', {
    classId,
    items: items.length,
    classes: classes.length,
    currentClass: currentClass?.title,
    filteredItems: filteredItems.length,
    loading,
    searchTerm,
    filterStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'from-green-500 to-green-600'
      case 'draft': return 'from-gray-500 to-gray-600'
      case 'archived': return 'from-red-500 to-red-600'
      default: return 'from-blue-500 to-blue-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4" />
      case 'draft': return <AlertCircle className="w-4 h-4" />
      case 'archived': return <AlertCircle className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {!classId ? (
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Available Quizzes</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Choose your class to view available quizzes</p>
              </div>

              {classes.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FolderOpen className="w-4 h-4" />
                  <span>{classes.length} classes available</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Classes Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : classes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Classes Available</h3>
              <p className="text-gray-600 dark:text-gray-400">Please contact your administrator to add classes.</p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {classes.map((c, index) => (
                <motion.div
                  key={c._id || c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={`/student/quizzes/${c._id || c.id}`}
                    className="block h-full"
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                            {c.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            View and attempt quizzes for this class
                          </p>
                        </div>
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                          <span>View Quizzes</span>
                          <BookOpen className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header with Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Link
                to="/student/quizzes"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">
                  {currentClass ? `${currentClass.title} Quizzes` : 'Class Quizzes'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {currentClass ? `Available quizzes for ${currentClass.title}` : 'Test your knowledge with interactive quizzes'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
              ))}
            </div>
          )}

          {/* Quiz Grid */}
          {!loading && (
            <>
              {filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {searchTerm || filterStatus !== 'all' ? 'No quizzes found' : 'No quizzes available'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm || filterStatus !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Check back later for new quizzes'}
                  </p>
                </motion.div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((quiz, index) => (
                    <motion.div
                      key={quiz._id || quiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 ${getStatusColor(quiz.status)} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                            {getStatusIcon(quiz.status)}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz.status)} text-white`}>
                            {quiz.status || 'active'}
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
                                Due: {new Date(quiz.deadline).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{quiz.duration_minutes || 0} min</span>
                          </div>
                          {quiz.questions_count && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{quiz.questions_count} questions</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Created: {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : 'Unknown'}
                          </div>

                          <Link
                            to={`/student/quiz/${quiz._id || quiz.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                          >
                            <PlayCircle className="w-4 h-4" />
                            View Details
                          </Link>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
