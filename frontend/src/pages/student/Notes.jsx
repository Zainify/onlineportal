import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../lib/api'
import { SERVER_ORIGIN } from '../../lib/config'
import Card from '../../components/ui/Card.jsx'
import { motion } from 'framer-motion'
import { FileText, Download, Search, Filter, BookOpen, FolderOpen, ArrowLeft, Calendar, User, Layers } from 'lucide-react'

export default function Notes() {
  const { classId } = useParams()
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)

  const [chapters, setChapters] = useState([])
  const [notes, setNotes] = useState([])

  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Load Classes on mount
  useEffect(() => {
    const loadClasses = async () => {
      setLoading(true)
      try {
        const c = await api.get('/classes')
        setClasses(c.data || [])
      } catch { }
      setLoading(false)
    }
    loadClasses()
  }, [])

  // Load Subjects when Class is selected
  useEffect(() => {
    const loadSubjects = async () => {
      if (!classId) return
      setLoading(true)
      try {
        // Ideally we should fetch subjects that are relevant to this class, 
        // but for now we fetch all subjects.
        const s = await api.get('/subjects')
        setSubjects(s.data || [])
      } catch { }
      setLoading(false)
    }
    loadSubjects()
  }, [classId])

  // Load Chapters and Notes when Subject is selected
  useEffect(() => {
    const loadContent = async () => {
      if (!classId || !selectedSubject) return
      setLoading(true)
      try {
        const [c, n] = await Promise.all([
          api.get('/chapters', { params: { class_id: classId, subject_id: selectedSubject._id || selectedSubject.id } }),
          api.get('/notes', { params: { class_id: classId, subject_id: selectedSubject._id || selectedSubject.id } })
        ])
        setChapters(c.data || [])
        setNotes(n.data.data || [])
      } catch (e) {
        console.error("Failed to load content", e)
      }
      setLoading(false)
    }
    loadContent()
  }, [classId, selectedSubject])

  const currentClass = classes.find(c => String(c._id || c.id) === String(classId))

  // Group notes by chapter
  const groupedNotes = () => {
    const grouped = {}

    // Initialize groups for all chapters
    chapters.forEach(ch => {
      grouped[ch._id || ch.id] = {
        chapter: ch,
        notes: []
      }
    })

    // Add "Uncategorized" group
    grouped['uncategorized'] = {
      chapter: { title: 'Uncategorized / General', _id: 'uncategorized' },
      notes: []
    }

    // Distribute notes
    notes.forEach(note => {
      const noteChapterId = note.chapter_id?._id || note.chapter_id
      if (noteChapterId && grouped[noteChapterId]) {
        grouped[noteChapterId].notes.push(note)
      } else {
        grouped['uncategorized'].notes.push(note)
      }
    })

    // Filter out empty groups if search term is active, or just return all
    // If search term is active, we filter notes first
    return Object.values(grouped).sort((a, b) => {
      if (a.chapter._id === 'uncategorized') return 1
      if (b.chapter._id === 'uncategorized') return -1
      return (a.chapter.order || 0) - (b.chapter.order || 0)
    })
  }

  const renderNoteCard = (note) => (
    <motion.div
      key={note._id || note.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{note.created_at ? new Date(note.created_at).toLocaleDateString() : 'Unknown'}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-purple-600 transition-colors line-clamp-2">
          {note.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {note.description || 'No description available'}
        </p>

        <div className="flex items-center justify-between mt-auto">
          {(note.uploaded_by || note.teacher?.name) && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <User className="w-3 h-3" />
              <span>{note.uploaded_by?.name || note.uploaded_by || note.teacher?.name || 'Teacher'}</span>
            </div>
          )}

          <a
            href={`${SERVER_ORIGIN}${note.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      </Card>
    </motion.div>
  )

  // 1. Class Selection View
  if (!classId) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Study Notes</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Choose your class to view available notes</p>
            </div>
            {classes.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FolderOpen className="w-4 h-4" />
                <span>{classes.length} classes available</span>
              </div>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {classes.map((c, index) => (
              <motion.div
                key={c._id || c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link to={`/student/notes/${c._id || c.id}`} className="group block h-full">
                  <div className="relative overflow-hidden bg-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                      <p className="text-sm opacity-90 mb-3">View study materials</p>
                      <div className="flex items-center text-xs opacity-80">
                        <span>Click to explore</span>
                        <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 2. Subject Selection View
  if (!selectedSubject) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-6">
            <Link to="/student/notes" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Subjects – {currentClass?.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Select a subject to view chapters and notes</p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((s, index) => (
              <motion.div
                key={s._id || s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setSelectedSubject(s)}
                className="cursor-pointer"
              >
                <div className="group block h-full">
                  <div className="relative overflow-hidden bg-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{s.name}</h3>
                      <p className="text-sm opacity-90 mb-3">View chapters</p>
                      <div className="flex items-center text-xs opacity-80">
                        <span>Click to explore</span>
                        <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 3. Notes & Chapters View
  const groups = groupedNotes()

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedSubject(null)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-3xl font-bold">{selectedSubject.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{currentClass?.title}</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-8 w-48 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => {
            // Filter notes within group based on search
            const groupNotes = group.notes.filter(note =>
              note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              note.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )

            if (groupNotes.length === 0) return null

            return (
              <div key={group.chapter._id || group.chapter.id} className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-800">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {group.chapter.title}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupNotes.map(note => renderNoteCard(note))}
                </div>
              </div>
            )
          })}

          {groups.every(g => g.notes.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0) && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {searchTerm ? 'No notes found' : 'No notes available'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms' : 'Notes will appear here once uploaded'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
