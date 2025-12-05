import { useState, useEffect } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Select from '../../components/ui/Select.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit3, Clock, Target, BookOpen, AlertCircle, CheckCircle, Info, GraduationCap, Calendar } from 'lucide-react'

export default function CreateQuiz() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState(10)
  const [deadline, setDeadline] = useState('')
  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [status, setStatus] = useState('draft')
  const [type, setType] = useState('MCQ')
  const [questions, setQuestions] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch classes and subjects
    api.get('/classes').then(r => {
      console.log('Classes response:', r.data)
      setClasses(r.data || [])
    }).catch(e => {
      console.error('Classes error:', e)
    })
    api.get('/subjects').then(r => {
      console.log('Subjects response:', r.data)
      setSubjects(r.data || [])
    }).catch(e => {
      console.error('Subjects error:', e)
    })
  }, [])

  const addQuestion = () => setQuestions([...questions, { text: '', options: ['', ''], correct: 0, slo_tag: '', topic: '' }])

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index)
    setQuestions(newQuestions)
  }

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  const addOption = (questionIndex) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options.push('')
    setQuestions(newQuestions)
  }

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions]
    const options = newQuestions[questionIndex].options
    if (options.length > 2) {
      options.splice(optionIndex, 1)
      // Adjust correct index if needed
      if (newQuestions[questionIndex].correct >= options.length) {
        newQuestions[questionIndex].correct = options.length - 1
      }
      setQuestions(newQuestions)
    }
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const create = async () => {
    setMsg('')
    setLoading(true)

    try {
      const { data: quiz } = await api.post('/quizzes', {
        title,
        description,
        duration_minutes: Number(duration),
        deadline: deadline || null,
        class_id: classId || null,
        subject_id: subjectId || null,
        status,
        type
      })

      for (const q of questions) {
        await api.post(`/quizzes/${quiz._id || quiz.id}/questions`, {
          text: q.text,
          options: q.options.filter(opt => opt.trim()),
          correct_option_index: q.correct,
          slo_tag: q.slo_tag,
          topic: q.topic,
        })
      }

      setMsg('Quiz created successfully!')
      setTitle(''); setDescription(''); setDuration(10); setDeadline(''); setClassId(''); setSubjectId(''); setStatus('draft'); setType('MCQ'); setQuestions([])
    } catch (error) {
      setMsg(error.response?.data?.message || 'Failed to create quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = title.trim() && questions.length > 0 && questions.every(q =>
    q.text.trim() && (type === 'SHORT_ANSWER' || q.options.filter(opt => opt.trim()).length >= 2)
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Create Quiz</h1>
            <p className="text-gray-600 dark:text-gray-400">Design interactive assessments for your students</p>
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

      {/* Quiz Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold">Quiz Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Enter quiz title"
                  label="Quiz Title *"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Enter quiz description (optional)"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <Select
                  label="Class *"
                  value={classId}
                  onChange={e => setClassId(e.target.value)}
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Select
                  label="Subject (Optional)"
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Duration in minutes"
                  label="Duration (minutes) *"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  min="1"
                  max="180"
                  required
                />
              </div>
              <div>
                <Input
                  type="datetime-local"
                  label="Deadline (Optional)"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                />
              </div>
              <div>
                <Select
                  label="Status *"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </div>
              <div>
                <Select
                  label="Quiz Type *"
                  value={type}
                  onChange={e => {
                    setType(e.target.value);
                    setQuestions([]); // Reset questions when type changes
                  }}
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="SHORT_ANSWER">Short Answer (AI Graded)</option>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Questions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold">Questions</h2>
                <span className="text-sm text-gray-500">({questions.length} added)</span>
              </div>

              <Button
                variant="secondary"
                onClick={addQuestion}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Questions Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Start building your quiz by adding questions</p>
                <Button onClick={addQuestion} className="flex items-center gap-2 mx-auto">
                  <Plus className="w-4 h-4" />
                  Add First Question
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, questionIndex) => (
                  <Card key={questionIndex} className="border-l-4 border-l-green-500">
                    <div className="space-y-4">
                      {/* Question Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Question {questionIndex + 1}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Question Text */}
                      <div>
                        <Input
                          placeholder="Enter your question here..."
                          label={`Question ${questionIndex + 1} *`}
                          value={q.text}
                          onChange={e => updateQuestion(questionIndex, 'text', e.target.value)}
                          required
                        />
                      </div>

                      {/* Options - Only for MCQ */}
                      {type === 'MCQ' && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium">Answer Options *</label>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => addOption(questionIndex)}
                              className="flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Add Option
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {q.options.map((opt, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${q.correct === optionIndex
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}>
                                    {String.fromCharCode(65 + optionIndex)}
                                  </div>
                                  <Input
                                    placeholder={`Option ${optionIndex + 1}`}
                                    value={opt}
                                    onChange={e => updateOption(questionIndex, optionIndex, e.target.value)}
                                    className="flex-1"
                                    required
                                  />
                                </div>

                                {q.options.length > 2 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeOption(questionIndex, optionIndex)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Correct Answer Selector */}
                          <div className="mt-3">
                            <Select
                              value={q.correct}
                              onChange={e => updateQuestion(questionIndex, 'correct', Number(e.target.value))}
                              label="Correct Answer *"
                            >
                              {q.options.map((_, idx) => (
                                <option key={idx} value={idx}>
                                  {String.fromCharCode(65 + idx)} - {q.options[idx] || 'Option ' + (idx + 1)}
                                </option>
                              ))}
                            </Select>
                          </div>
                        </div>
                      )}

                      {/* Additional Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Student Learning Outcome tag"
                          value={q.slo_tag}
                          onChange={e => updateQuestion(questionIndex, 'slo_tag', e.target.value)}
                          label="SLO Tag"
                        />
                        <Input
                          placeholder="Topic or category"
                          value={q.topic}
                          onChange={e => updateQuestion(questionIndex, 'topic', e.target.value)}
                          label="Topic"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Submit Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Ready to Publish?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {questions.length} question{questions.length !== 1 ? 's' : ''} • {duration} minutes
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setTitle(''); setDuration(10); setStatus('draft'); setType('MCQ'); setQuestions([])
                }}
              >
                Clear All
              </Button>

              <Button
                onClick={create}
                disabled={!isFormValid || loading}
                loading={loading}
                className="px-8"
              >
                {loading ? 'Creating...' : 'Create Quiz'}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
