import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import Select from '../../components/ui/Select.jsx'
import { motion } from 'framer-motion'
import { BookOpen, Plus, Search, Trash2, AlertCircle, CheckCircle, GraduationCap, Layers } from 'lucide-react'

export default function ManageChapters() {
    const [list, setList] = useState([])
    const [classes, setClasses] = useState([])
    const [subjects, setSubjects] = useState([])

    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [title, setTitle] = useState('')
    const [order, setOrder] = useState(0)

    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [msg, setMsg] = useState('')

    useEffect(() => {
        const loadDependencies = async () => {
            try {
                const [c, s] = await Promise.all([
                    api.get('/classes'),
                    api.get('/subjects')
                ])
                setClasses(c.data || [])
                setSubjects(s.data || [])
            } catch (error) {
                console.error('Failed to load dependencies', error)
            }
        }
        loadDependencies()
    }, [])

    const loadChapters = async () => {
        if (!selectedClass || !selectedSubject) {
            setList([])
            return
        }
        setLoading(true)
        try {
            const { data } = await api.get('/chapters', {
                params: { class_id: selectedClass, subject_id: selectedSubject }
            })
            setList(data || [])
        } catch (error) {
            console.error('Failed to load chapters:', error)
            setMsg('Failed to load chapters')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadChapters()
    }, [selectedClass, selectedSubject])

    const create = async () => {
        if (!title.trim() || !selectedClass || !selectedSubject) return

        setMsg('')
        setLoading(true)
        try {
            await api.post('/chapters', {
                title,
                class_id: selectedClass,
                subject_id: selectedSubject,
                order: Number(order)
            })
            setTitle('')
            setOrder(prev => prev + 1)
            setMsg('Chapter created successfully!')
            loadChapters()
        } catch (error) {
            setMsg(error.response?.data?.message || 'Failed to create chapter')
        } finally {
            setLoading(false)
        }
    }

    const remove = async (id) => {
        if (!confirm('Are you sure you want to delete this chapter?')) return
        try {
            await api.delete(`/chapters/${id}`)
            setMsg('Chapter deleted successfully!')
            loadChapters()
        } catch (error) {
            setMsg('Failed to delete chapter')
        }
    }

    const filteredChapters = list.filter(chapter =>
        chapter.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Manage Chapters</h1>
                        <p className="text-gray-600 dark:text-gray-400">Organize content into chapters</p>
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

            {/* Create Chapter Form */}
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
                            <h2 className="text-lg font-semibold">Create New Chapter</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Class *"
                                value={selectedClass}
                                onChange={e => setSelectedClass(e.target.value)}
                            >
                                <option value="">Select Class</option>
                                {classes.map(c => (
                                    <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
                                ))}
                            </Select>
                            <Select
                                label="Subject *"
                                value={selectedSubject}
                                onChange={e => setSelectedSubject(e.target.value)}
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(s => (
                                    <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                                ))}
                            </Select>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-[2]">
                                <Input
                                    placeholder="e.g. Chapter 1: Algebra"
                                    label="Chapter Title *"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="0"
                                    label="Order"
                                    value={order}
                                    onChange={e => setOrder(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    onClick={create}
                                    disabled={!title.trim() || !selectedClass || !selectedSubject || loading}
                                    loading={loading}
                                    className="px-8 w-full sm:w-auto"
                                >
                                    Create
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Chapters List */}
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
                                    <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-lg font-semibold">Chapters</h2>
                                <span className="text-sm text-gray-500">({filteredChapters.length} total)</span>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search chapters..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {!selectedClass || !selectedSubject ? (
                            <div className="text-center py-12 opacity-70">
                                Please select a Class and Subject to view chapters.
                            </div>
                        ) : loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : filteredChapters.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Layers className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    {searchTerm ? 'No chapters found' : 'No chapters available'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {searchTerm
                                        ? 'Try adjusting your search terms'
                                        : 'Start by creating your first chapter for this subject'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredChapters.map((chapter, index) => (
                                    <motion.div
                                        key={chapter._id || chapter.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-900 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm font-bold text-gray-500">
                                                {chapter.order}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {chapter.title}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    ID: {chapter._id || chapter.id}
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => remove(chapter._id || chapter.id)}
                                            className="flex items-center gap-1"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
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
