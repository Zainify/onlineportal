import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, BookOpen, PlayCircle, Calendar, Tag, AlertCircle, CheckCircle, GraduationCap, User } from 'lucide-react'

export default function QuizDetail() {
  const { id } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasAttempted, setHasAttempted] = useState(false)
  const [existingAttempt, setExistingAttempt] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch quiz details
        const quizResponse = await api.get(`/quizzes/${id}`)
        console.log('QuizDetail - Quiz data:', quizResponse.data)
        setQuiz(quizResponse.data)

        // Check if student has already attempted
        try {
          const attemptResponse = await api.get(`/quizzes/${id}/my-attempt`)
          setHasAttempted(true)
          setExistingAttempt(attemptResponse.data)
        } catch (err) {
          // No attempt found, which is fine
          setHasAttempted(false)
        }
      } catch (err) {
        console.error('QuizDetail - Error:', err)
        setError('Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
      </div>
    )
  }

  if (error) return (
    <Card>
      <div className="flex items-center gap-3 text-red-600">
        <AlertCircle className="w-6 h-6" />
        <span>{error}</span>
      </div>
    </Card>
  )

  if (!quiz) return null

  // Check if deadline has passed - removed since deadline doesn't exist in database
  const isDeadlinePassed = false

  // Show existing attempt result
  if (hasAttempted && existingAttempt) return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/student/quizzes"
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Quiz Result</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Your attempt summary</p>
        </div>
      </div>

      <Card title={quiz.title} subtitle={`${existingAttempt.score}/${existingAttempt.quiz?.questions?.length || 0} (${existingAttempt.percentage}%)`}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{existingAttempt.score}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{existingAttempt.percentage}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Percentage</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {existingAttempt.quiz?.questions?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
            </div>
          </div>

          <div className="text-sm text-gray-500 text-center">
            Completed: {new Date(existingAttempt.completed_at).toLocaleString()}
          </div>
        </div>
      </Card>
    </div>
  )

  // Show deadline passed message - removed since deadline doesn't exist
  if (false) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to={`/student/quizzes${quiz.class_id ? `/${quiz.class_id}` : ''}`}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Quiz Details</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Review quiz information before attempting</p>
        </div>
      </div>

      {/* Quiz Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between mb-6">
            <div className={`w-16 h-16 ${quiz.status === 'published' ? 'from-green-500 to-green-600' : 'from-gray-500 to-gray-600'
              } rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
              <BookOpen className="w-8 h-8" />
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${quiz.status === 'published'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
              }`}>
              {quiz.status === 'published' ? 'Available' : 'Draft'}
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            {quiz.title}
          </h2>

          {quiz.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              {quiz.description}
            </p>
          )}

          <div className="space-y-3 mb-6">
            {/* Class Info */}
            {quiz.class && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">{quiz.class.title}</span>
              </div>
            )}

            {/* Subject Info */}
            {quiz.subject && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
                  <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-400">{quiz.subject.name}</span>
              </div>
            )}

            {/* Duration */}
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">{quiz.duration_minutes || 0} minutes</span>
            </div>

            {/* Questions Count */}
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">{quiz.questions?.length || 0} questions</span>
            </div>

            {/* Deadline - removed since deadline doesn't exist in database */}

            {/* Created By */}
            {quiz.creator && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-400">Created by {quiz.creator.name}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500">
              Created: {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'Unknown'}
            </div>

            {quiz.status === 'published' ? (
              <Link
                to={`/student/quiz/${quiz._id || quiz.id}/attempt`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <PlayCircle className="w-5 h-5" />
                Start Quiz
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-300 text-gray-500 font-medium cursor-not-allowed"
              >
                <AlertCircle className="w-5 h-5" />
                Not Available
              </button>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Instructions */}
      <Card title="Quiz Instructions" subtitle="Please read before starting">
        <div className="space-y-3 text-gray-600 dark:text-gray-400">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <span>You have {quiz.duration_minutes || 0} minutes to complete this quiz</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <span>Once started, the quiz cannot be paused</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <span>Make sure you have a stable internet connection</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <span>Each question has only one correct answer</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
