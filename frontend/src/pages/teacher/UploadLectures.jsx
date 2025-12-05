import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Textarea from '../../components/ui/Textarea.jsx'
import Select from '../../components/ui/Select.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { Video, Link2, Upload, AlertCircle, CheckCircle, FileVideo, GraduationCap, BookOpen, Clock } from 'lucide-react'

export default function UploadLectures() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('link')
  const [video, setVideo] = useState(null)
  const [link, setLink] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [classes, setClasses] = useState([])
  const [classId, setClassId] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const c = await api.get('/classes')
        console.log('UploadLectures - Classes response:', c.data)
        setClasses(c.data || [])
      } catch (e) {
        console.error('UploadLectures - Classes error:', e)
      }
    }
    load()
  }, [])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('video/')) {
        setVideo(file)
      } else {
        setErr('Please upload a valid video file')
      }
    }
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setErr('Title is required')
      return
    }

    if (type === 'link' && !link.trim()) {
      setErr('Link is required')
      return
    }

    if (type === 'file' && !video) {
      setErr('Video file is required')
      return
    }

    setMsg(''); setErr('')
    setLoading(true)

    try {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('description', description)
      fd.append('type', type)

      if (subjectName.trim()) {
        let sid = ''
        try {
          const created = await api.post('/subjects', { name: subjectName.trim() })
          sid = created.data?._id || created.data?.id || created.data?.data?._id || created.data?.data?.id || ''
        } catch {
          try {
            const list = await api.get('/subjects')
            const found = (list.data || []).find(s => s.name?.toLowerCase() === subjectName.trim().toLowerCase())
            if (found) sid = found._id || found.id
          } catch { }
        }
        if (sid) fd.append('subject_id', sid)
      }

      if (classId) fd.append('class_id', classId)
      if (type === 'file' && video) fd.append('video', video)
      if (type === 'link') fd.append('link', link)

      await api.post('/lectures', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMsg('Lecture submitted successfully! Awaiting approval.')
      setTitle(''); setDescription(''); setVideo(null); setLink(''); setClassId(''); setSubjectName('')
    } catch (e) {
      setErr(e.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Upload Lectures</h1>
            <p className="text-gray-600 dark:text-gray-400">Share video content with your students</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl border flex items-center gap-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
        >
          <CheckCircle className="w-5 h-5" />
          <span>{msg}</span>
        </motion.div>
      )}

      {err && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl border flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
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
        <Card>
          <div className="space-y-8">
            {/* Form Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold">Create New Lecture</h2>
            </div>

            <form onSubmit={submit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Lecture Title *"
                      placeholder="Enter lecture title..."
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Select
                      label="Lecture Type *"
                      value={type}
                      onChange={e => setType(e.target.value)}
                      required
                    >
                      <option value="link">Video Link</option>
                      <option value="file">Video File</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <Textarea
                    label="Description"
                    placeholder="Provide a brief description of the lecture content..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Class and Subject */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Target Audience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Select
                      label="Class"
                      value={classId}
                      onChange={e => setClassId(e.target.value)}
                      disabled={!classes.length}
                    >
                      <option value="">Select class (optional)</option>
                      {classes.map(c => (
                        <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Input
                      label="Subject"
                      placeholder="e.g. Physics, Mathematics"
                      value={subjectName}
                      onChange={e => setSubjectName(e.target.value)}
                    />
                  </div>
                </div>

                {!classes.length && (
                  <div className="flex items-start gap-3 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        No classes found. Please add classes from Admin → Manage Classes first.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Upload */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Content</h3>

                {type === 'link' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Video Link</span>
                    </div>
                    <Input
                      label="Video URL *"
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                      value={link}
                      onChange={e => setLink(e.target.value)}
                      required
                    />
                    <div className="text-xs text-gray-500">
                      Supports YouTube, Vimeo, and other video platforms
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileVideo className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Video File</span>
                    </div>

                    <div
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        onChange={e => setVideo(e.target.files?.[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="video/*"
                      />

                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>

                        <div>
                          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {video ? video.name : 'Drop video file here or click to browse'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Maximum file size: 500MB. Supported formats: MP4, AVI, MOV
                          </p>
                        </div>
                      </div>
                    </div>

                    {video && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileVideo className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{video.name}</p>
                            <p className="text-xs text-gray-500">{(video.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setVideo(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!title.trim() || (type === 'link' ? !link.trim() : !video)}
                  className="px-8"
                >
                  Upload Lecture
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
