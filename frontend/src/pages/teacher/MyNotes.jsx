import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, Clock, Eye, Trash2, AlertCircle, Filter, Download } from 'lucide-react'

export default function MyNotes() {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')
    const [err, setErr] = useState('')
    const [filter, setFilter] = useState('all') // 'all', 'approved', 'pending'
    const [selectedNote, setSelectedNote] = useState(null)

    useEffect(() => {
        loadNotes()
    }, [filter])

    const loadNotes = async () => {
        setLoading(true)
        try {
            const params = {}
            if (filter === 'approved') params.approved = 'true'
            if (filter === 'pending') params.approved = 'false'

            const { data } = await api.get('/notes/my-notes', { params })
            setNotes(data.data || [])
        } catch (e) {
            console.error('Failed to load notes:', e)
            setErr(e.response?.data?.message || 'Failed to load notes')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return

        try {
            await api.delete(`/notes/${noteId}`)
            setMsg('Note deleted successfully')
            setNotes(notes.filter(n => n._id !== noteId))
            setTimeout(() => setMsg(''), 3000)
        } catch (e) {
            setErr(e.response?.data?.message || 'Failed to delete note')
            setTimeout(() => setErr(''), 3000)
        }
    }

    const handleView = (note) => {
        setSelectedNote(note)
    }

    const closeModal = () => {
        setSelectedNote(null)
    }

    const filteredNotes = notes
    const approvedCount = notes.filter(n => n.approved).length
    const pendingCount = notes.filter(n => !n.approved).length

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">My Uploaded Notes</h1>
                        <p className="text-gray-600 dark:text-gray-400">View and manage your uploaded study materials</p>
                    </div>
                </div>
            </motion.div>

            {/* Messages */}
            {msg && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 flex items-center gap-3"
                >
                    <CheckCircle className="w-5 h-5" />
                    <span>{msg}</span>
                </motion.div>
            )}

            {err && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center gap-3"
                >
                    <AlertCircle className="w-5 h-5" />
                    <span>{err}</span>
                </motion.div>
            )}

            {/* Stats & Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Stats */}
                        <div className="flex gap-6">
                            <div>
                                <p className="text-2xl font-bold">{notes.length}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Notes</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                            </div>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('approved')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'approved'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                Approved
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'pending'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                Pending
                            </button>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Notes List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map((note, index) => (
                        <motion.div
                            key={note._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Card className="h-full hover:shadow-xl transition-all duration-300">
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg mb-1 line-clamp-2">{note.title}</h3>
                                            {note.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {note.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ml-2 ${note.approved
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                            }`}>
                                            {note.approved ? (
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="space-y-2 text-sm">
                                        {note.class_id && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500 dark:text-gray-400">Class:</span>
                                                <span className="font-medium">{note.class_id.title}</span>
                                            </div>
                                        )}
                                        {note.subject_id && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500 dark:text-gray-400">Subject:</span>
                                                <span className="font-medium">{note.subject_id.name}</span>
                                            </div>
                                        )}
                                        {note.chapter_id && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500 dark:text-gray-400">Chapter:</span>
                                                <span className="font-medium">{note.chapter_id.title}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            {new Date(note.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => handleView(note)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(note._id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card>
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Notes Found</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {filter === 'all'
                                    ? "You haven't uploaded any notes yet"
                                    : `No ${filter} notes found`}
                            </p>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* View Modal */}
            {selectedNote && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-2">{selectedNote.title}</h2>
                                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${selectedNote.approved
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                        }`}>
                                        {selectedNote.approved ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Approved
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-4 h-4" />
                                                Pending Approval
                                            </>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {selectedNote.description && (
                                <div>
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{selectedNote.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {selectedNote.class_id && (
                                    <div>
                                        <h3 className="font-semibold mb-1">Class</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{selectedNote.class_id.title}</p>
                                    </div>
                                )}
                                {selectedNote.subject_id && (
                                    <div>
                                        <h3 className="font-semibold mb-1">Subject</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{selectedNote.subject_id.name}</p>
                                    </div>
                                )}
                                {selectedNote.chapter_id && (
                                    <div>
                                        <h3 className="font-semibold mb-1">Chapter</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{selectedNote.chapter_id.title}</p>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold mb-1">Upload Date</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {new Date(selectedNote.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {selectedNote.file_name && (
                                <div>
                                    <h3 className="font-semibold mb-2">File</h3>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-gray-400" />
                                            <span className="text-sm font-medium">{selectedNote.file_name}</span>
                                        </div>
                                        <a
                                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${selectedNote.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <Button
                                onClick={closeModal}
                                className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                            >
                                Close
                            </Button>
                            <Button
                                onClick={() => {
                                    handleDelete(selectedNote._id)
                                    closeModal()
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete Note
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
