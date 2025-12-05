import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, XCircle, AlertCircle, Search, Filter, FileText, Video, Clock, Eye } from 'lucide-react'

export default function ApproveContent() {
  const [notes, setNotes] = useState([])
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const n = await api.get('/notes?approved=false')
      setNotes(n.data.data || [])
      const l = await api.get('/lectures?approved=false')
      setLectures(l.data.data || [])
    } catch (error) {
      console.error('Failed to load pending content:', error)
      setMsg('Failed to load pending content')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const approveNote = async (id) => {
    try {
      await api.patch(`/notes/${id}/approve`, { approved: true })
      setMsg('Note approved successfully!')
      load()
    } catch (error) {
      setMsg('Failed to approve note')
    }
  }

  const rejectNote = async (id) => {
    if (!confirm('Are you sure you want to reject this note?')) return
    try {
      await api.delete(`/notes/${id}`)
      setMsg('Note rejected and removed')
      load()
    } catch (error) {
      setMsg('Failed to reject note')
    }
  }

  const approveLecture = async (id) => {
    try {
      await api.patch(`/lectures/${id}/approve`, { approved: true })
      setMsg('Lecture approved successfully!')
      load()
    } catch (error) {
      setMsg('Failed to approve lecture')
    }
  }

  const rejectLecture = async (id) => {
    if (!confirm('Are you sure you want to reject this lecture?')) return
    try {
      await api.delete(`/lectures/${id}`)
      setMsg('Lecture rejected and removed')
      load()
    } catch (error) {
      setMsg('Failed to reject lecture')
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredLectures = lectures.filter(lecture =>
    lecture.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lecture.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Approve Content</h1>
            <p className="text-gray-600 dark:text-gray-400">Review and approve teacher-submitted content</p>
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

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold">Pending Content</h2>
              <span className="text-sm text-gray-500">({filteredNotes.length + filteredLectures.length} total)</span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Notes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold">Notes Pending Approval</h3>
                <span className="text-sm text-gray-500">({filteredNotes.length})</span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">No pending notes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotes.map((note, index) => (
                    <motion.div
                      key={note._id || note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{note.title}</h4>
                              {note.created_at && (
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(note.created_at).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>

                          {note.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {note.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {note.subject && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                {note.subject}
                              </span>
                            )}
                            {note.class && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                {note.class}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => approveNote(note._id || note.id)}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => rejectNote(note._id || note.id)}
                            className="flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Lectures Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold">Lectures Pending Approval</h3>
                <span className="text-sm text-gray-500">({filteredLectures.length})</span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : filteredLectures.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Video className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">No pending lectures</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLectures.map((lecture, index) => (
                    <motion.div
                      key={lecture._id || lecture.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                              <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{lecture.title}</h4>
                              {lecture.created_at && (
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(lecture.created_at).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>

                          {lecture.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {lecture.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {lecture.subject && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                {lecture.subject}
                              </span>
                            )}
                            {lecture.class && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                {lecture.class}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => approveLecture(lecture._id || lecture.id)}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => rejectLecture(lecture._id || lecture.id)}
                            className="flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
