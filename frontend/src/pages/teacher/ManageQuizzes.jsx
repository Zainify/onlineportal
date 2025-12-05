import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { Database, Edit3, Trash2, Eye, Clock, AlertCircle, CheckCircle, Search, Filter, BarChart3 } from 'lucide-react'

export default function ManageQuizzes() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const response = await api.get('/quizzes')
      setItems(response.data.data || [])
    } catch (error) {
      console.error('Failed to load quizzes:', error)
      setMsg('Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const publish = async (id) => {
    try {
      await api.patch(`/quizzes/${id}`, { status: 'published' })
      setMsg('Quiz published successfully!')
      load()
    } catch (error) {
      setMsg('Failed to publish quiz')
    }
  }

  const unpublish = async (id) => {
    try {
      await api.patch(`/quizzes/${id}`, { status: 'draft' })
      setMsg('Quiz set to draft')
      load()
    } catch (error) {
      setMsg('Failed to unpublish quiz')
    }
  }

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) return
    try {
      await api.delete(`/quizzes/${id}`)
      setMsg('Quiz deleted successfully!')
      load()
    } catch (error) {
      setMsg('Failed to delete quiz')
    }
  }

  const filteredItems = items.filter(quiz => {
    const matchesSearch = quiz.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || quiz.status === filterStatus
    return matchesSearch && matchesStatus
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
      case 'draft': return <Edit3 className="w-4 h-4" />
      case 'archived': return <AlertCircle className="w-4 h-4" />
      default: return <Database className="w-4 h-4" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Manage Quizzes</h1>
            <p className="text-gray-600 dark:text-gray-400">Publish, edit, or delete your quiz content</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${msg.includes('success')
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
            }`}
        >
          {msg.includes('success') ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{msg}</span>
        </motion.div>
      )}

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold">Quizzes</h2>
              <span className="text-sm text-gray-500">({filteredItems.length} total)</span>
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
          </div>
        </Card>
      </motion.div>

      {/* Quizzes Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {loading ? (
          <div className="grid gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No quizzes found' : 'No quizzes available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start by creating your first quiz'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((quiz, index) => (
              <motion.div
                key={quiz._id || quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Quiz Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg ${getStatusColor(quiz.status)} flex items-center justify-center text-white`}>
                          {getStatusIcon(quiz.status)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{quiz.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{quiz.duration_minutes} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Database className="w-4 h-4" />
                              <span>ID: {quiz._id || quiz.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quiz Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz.status)} text-white`}>
                            {quiz.status || 'draft'}
                          </span>
                          {quiz.questions_count && (
                            <span className="text-xs text-gray-500">
                              {quiz.questions_count} questions
                            </span>
                          )}
                        </div>

                        {quiz.created_at && (
                          <div className="text-xs text-gray-500">
                            Created: {new Date(quiz.created_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {quiz.status !== 'published' ? (
                        <Button
                          size="sm"
                          onClick={() => publish(quiz._id || quiz.id)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Publish
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => unpublish(quiz._id || quiz.id)}
                          className="flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          Unpublish
                        </Button>
                      )}

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => remove(quiz._id || quiz.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
