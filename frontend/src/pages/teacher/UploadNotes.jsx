import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Textarea from '../../components/ui/Textarea.jsx'
import Button from '../../components/ui/Button.jsx'
import Select from '../../components/ui/Select.jsx'
import { motion } from 'framer-motion'
import { Upload, FileText, AlertCircle, CheckCircle, FolderOpen, Info, Layers, BookOpen } from 'lucide-react'

export default function UploadNotes() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [chapters, setChapters] = useState([])

  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [chapterId, setChapterId] = useState('')

  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    const loadDependencies = async () => {
      setLoading(true)
      try {
        const [c, s] = await Promise.all([
          api.get('/classes'),
          api.get('/subjects')
        ])
        setClasses(c.data || [])
        setSubjects(s.data || [])
      } catch (e) {
        console.error('UploadNotes - Dependencies error:', e)
      }
      setLoading(false)
    }
    loadDependencies()
  }, [])

  useEffect(() => {
    const loadChapters = async () => {
      if (!classId || !subjectId) {
        setChapters([])
        setChapterId('')
        return
      }
      try {
        const { data } = await api.get('/chapters', {
          params: { class_id: classId, subject_id: subjectId }
        })
        setChapters(data || [])
      } catch (e) {
        console.error('Failed to load chapters', e)
      }
    }
    loadChapters()
  }, [classId, subjectId])

  const submit = async (e) => {
    e.preventDefault()
    setMsg(''); setErr('')
    setLoading(true)

    try {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('description', description)
      if (classId) fd.append('class_id', classId)
      if (subjectId) fd.append('subject_id', subjectId)
      if (chapterId) fd.append('chapter_id', chapterId)
      if (file) fd.append('note', file)

      await api.post('/notes', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMsg('Notes uploaded successfully! Awaiting approval.')
      setTitle(''); setDescription(''); setFile(null); setClassId(''); setSubjectId(''); setChapterId('')
    } catch (e) {
      setErr(e.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const isFormValid = title.trim() && file && classId && subjectId

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Upload Study Notes</h1>
            <p className="text-gray-600 dark:text-gray-400">Share educational materials with your students</p>
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

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="overflow-hidden">
          <form onSubmit={submit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold">Basic Information</h2>
              </div>

              <div>
                <Input
                  label="Title *"
                  placeholder="Enter note title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Textarea
                  label="Description"
                  placeholder="Provide a brief description of the notes content"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Classification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold">Classification</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Class *"
                  value={classId}
                  onChange={e => setClassId(e.target.value)}
                  disabled={!classes.length}
                >
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
                  ))}
                </Select>

                <Select
                  label="Subject *"
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  disabled={!subjects.length}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                  ))}
                </Select>

                <Select
                  label="Chapter (Optional)"
                  value={chapterId}
                  onChange={e => setChapterId(e.target.value)}
                  disabled={!chapters.length}
                >
                  <option value="">Select Chapter</option>
                  {chapters.map(ch => (
                    <option key={ch._id || ch.id} value={ch._id || ch.id}>{ch.title}</option>
                  ))}
                </Select>
              </div>

              {!classes.length && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-medium mb-1">No classes available</p>
                    <p>Please contact your administrator to add classes first.</p>
                  </div>
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Upload className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-semibold">File Upload</h2>
              </div>

              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={e => setFile(e.target.files?.[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                />

                <div className="space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${file
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                    {file ? (
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {file ? file.name : 'Drop your file here or click to browse'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Supported formats: PDF, DOC, DOCX, TXT, PPT, PPTX (Max 10MB)
                    </p>
                  </div>
                </div>
              </div>

              {file && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                loading={loading}
                className="px-8 py-3"
              >
                {loading ? 'Uploading...' : 'Upload Notes'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
