import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { GraduationCap, Plus, Search, Trash2, Edit3, AlertCircle, CheckCircle, BookOpen } from 'lucide-react'

export default function ManageClasses() {
  const [list, setList] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/classes')
      setList(data || [])
    } catch { }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!title.trim()) return

    setMsg('')
    setLoading(true)
    try {
      await api.post('/classes', { title })
      setTitle('')
      setMsg('Class created successfully!')
      load()
    } catch (error) {
      setMsg(error.response?.data?.message || 'Failed to create class')
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this class?')) return
    try {
      await api.delete(`/classes/${id}`)
      load()
    } catch { }
  }

  const filteredClasses = list.filter(cls =>
    cls.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Manage Classes</h1>
            <p className="text-gray-600 dark:text-gray-400">Create and manage class sections</p>
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

      {/* Create Class Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold">Create New Class</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="e.g. Class 10A, Mathematics Section"
                  label="Class Title *"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={create}
                  disabled={!title.trim() || loading}
                  loading={loading}
                  className="px-8"
                >
                  Create Class
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Classes List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <div className="space-y-6">
            {/* List Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold">Classes</h2>
                <span className="text-sm text-gray-500">({filteredClasses.length} total)</span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Classes Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {searchTerm ? 'No classes found' : 'No classes available'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Start by creating your first class'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((cls, index) => (
                  <motion.div
                    key={cls._id || cls.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                      <div className="space-y-4">
                        {/* Class Icon */}
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <GraduationCap className="w-8 h-8" />
                        </div>

                        {/* Class Info */}
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-purple-600 transition-colors">
                            {cls.title}
                          </h3>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <BookOpen className="w-4 h-4" />
                              <span>Class Section</span>
                            </div>

                            {cls.created_at && (
                              <div className="text-xs text-gray-500">
                                Created: {new Date(cls.created_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-sm text-gray-500">
                            ID: {cls._id || cls.id}
                          </div>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => remove(cls._id || cls.id)}
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
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
