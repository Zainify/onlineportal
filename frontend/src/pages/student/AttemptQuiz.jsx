import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { useParams } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { AlertCircle, Clock, CheckCircle, Calendar, Sparkles } from 'lucide-react'

export default function AttemptQuiz() {
  const { id } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(null)
  const [current, setCurrent] = useState(0)
  const [hasAttempted, setHasAttempted] = useState(false)
  const [existingAttempt, setExistingAttempt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Helper to get question ID (handles both _id and id)
  const getQuestionId = (question) => question._id || question.id

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch quiz details
        const quizResponse = await api.get(`/quizzes/${id}`)
        console.log('AttemptQuiz - Quiz data:', quizResponse.data)
        console.log('AttemptQuiz - Questions:', quizResponse.data.questions)
        setQuiz(quizResponse.data)
        setTimeLeft((quizResponse.data.duration_minutes || 1) * 60)

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
        console.error('AttemptQuiz - Error:', err)
        setError('Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    if (!timeLeft || submitted) return
    const t = setInterval(() => setTimeLeft((s) => s > 0 ? s - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [timeLeft, submitted])

  useEffect(() => {
    if (timeLeft === 0 && !submitted && quiz) {
      submit()
    }
  }, [timeLeft])

  const submit = async () => {
    const total = quiz?.questions?.length || 0
    const answeredCount = Object.keys(answers).length
    if (answeredCount < total) {
      const confirmProceed = window.confirm(`You answered ${answeredCount}/${total} questions. Submit anyway?`)
      if (!confirmProceed) return
    }
    try {
      setSubmitting(true)
      const payload = {
        answers: Object.entries(answers).map(([qid, val]) => ({
          question_id: qid,
          [quiz.type === 'SHORT_ANSWER' ? 'answer_text' : 'selected_option_index']: val
        }))
      }
      const { data } = await api.post(`/quizzes/${id}/attempts`, payload)
      setSubmitted(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  )

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
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-3 text-blue-600 mb-4">
          <CheckCircle className="w-6 h-6" />
          <span className="text-lg font-semibold">You have already attempted this quiz</span>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold">Score: {existingAttempt.score}/{existingAttempt.quiz?.questions?.length || 0}</div>
          <div className="text-xl text-gray-600 dark:text-gray-400">Percentage: {existingAttempt.percentage}%</div>
          <div className="text-sm text-gray-500">Completed: {new Date(existingAttempt.completed_at).toLocaleString()}</div>
        </div>
      </Card>
    </div>
  )

  // Show deadline passed message - removed since deadline doesn't exist
  if (false) return null

  if (submitted) return (
    <div className="space-y-6">
      <Card title="Result" subtitle={`${submitted.score}/${submitted.total} (${submitted.percentage}%)`}>
        <div className="text-sm opacity-80">
          {quiz.type === 'SHORT_ANSWER'
            ? "AI has graded your answers. Review the feedback below."
            : "Great job! Review questions to learn from mistakes."}
        </div>
      </Card>

      {/* Detailed Results for Short Answer */}
      {quiz.type === 'SHORT_ANSWER' && submitted.attempt_id && (
        <ShortAnswerResults attemptId={submitted.attempt_id} quiz={quiz} />
      )}
    </div>
  )

  // Show loading overlay when submitting
  if (submitting) return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="max-w-md mx-4">
        <div className="text-center space-y-6 py-8">
          {/* Animated Spinner */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {quiz.type === 'SHORT_ANSWER' ? 'AI is Verifying Your Answers' : 'Submitting Your Quiz'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 animate-pulse">
              Please wait...
            </p>
          </div>

          {/* Additional context for AI grading */}
          {quiz.type === 'SHORT_ANSWER' && (
            <div className="text-sm text-gray-500 dark:text-gray-500 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <p>Our AI is carefully evaluating each answer to provide detailed feedback.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )

  const getDeadlineWarning = () => {
    // Removed since deadline doesn't exist in database
    return null
  }

  return (
    <div className="space-y-4">
      {getDeadlineWarning()}

      <div className="sticky top-0 z-10 py-3 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold truncate">{quiz.title}</h2>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-800 font-mono">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
            <Button onClick={submit}>Submit</Button>
          </div>
        </div>
        <div className="h-2 mt-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          {(() => {
            const total = (quiz?.duration_minutes || 1) * 60; const pct = total ? ((total - timeLeft) / total * 100) : 0; return (
              <div className="h-full bg-blue-600 transition-[width]" style={{ width: pct + '%' }} />
            )
          })()}
        </div>
      </div>

      <Card title="Questions">
        <div className="flex flex-wrap gap-2">
          {quiz.questions?.map((q, i) => {
            const qId = getQuestionId(q)
            const isAnswered = answers[qId] !== undefined
            const isActive = i === current
            return (
              <button key={qId} onClick={() => setCurrent(i)}
                className={`w-9 h-9 rounded-md text-sm font-medium border transition ${isActive ? 'bg-blue-600 text-white border-blue-600' : isAnswered ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >{i + 1}</button>
            )
          })}
        </div>
      </Card>

      {quiz.questions && quiz.questions[current] && (() => {
        const currentQ = quiz.questions[current]
        const currentQId = getQuestionId(currentQ)
        return (
          <Card title={`Question ${current + 1}`} subtitle={currentQ.text}>
            <div className="grid gap-2">
              {quiz.type === 'SHORT_ANSWER' ? (
                <textarea
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={4}
                  placeholder="Type your answer here..."
                  value={answers[currentQId] || ''}
                  onChange={e => setAnswers({ ...answers, [currentQId]: e.target.value })}
                />
              ) : (
                currentQ.options.map((opt, idx) => (
                  <label key={idx} className={`border rounded-lg p-3 cursor-pointer transition ${answers[currentQId] === idx ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                    <input className="hidden" type="radio" name={`q-${currentQId}`} onChange={() => setAnswers({ ...answers, [currentQId]: idx })} />
                    {opt}
                  </label>
                ))
              )}
            </div>
            <div className="flex justify-between mt-4">
              <Button key="prev-btn" variant="secondary" onClick={() => setCurrent(c => Math.max(0, c - 1))}>Previous</Button>
              <Button key="next-btn" variant="secondary" onClick={() => setCurrent(c => Math.min((quiz.questions?.length || 1) - 1, c + 1))}>Next</Button>
            </div>
          </Card>
        )
      })()}
    </div>
  )
}

function ShortAnswerResults({ attemptId, quiz }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/results/attempts/${attemptId}/details`)
      .then(r => {
        console.log('Results response:', r.data)
        setResults(r.data.quiz_results || r.data || [])
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }, [attemptId, quiz])

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  )

  const correctCount = results.filter(r => r.correct).length
  const totalCount = results.length
  const percentage = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Score Summary Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Quiz Results</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI has graded your answers</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {correctCount}/{totalCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{percentage}% Correct</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </Card>

      {/* Results List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Detailed Feedback</h3>

        {results.map((res, idx) => {
          const question = quiz.questions?.find(q => q._id === res.question_id?._id || q._id === res.question_id || q.id === res.question_id?._id || q.id === res.question_id)
          const isCorrect = res.correct

          return (
            <Card
              key={idx}
              className={`border-l-4 transition-all duration-300 hover:shadow-lg ${isCorrect
                ? 'border-l-green-500 bg-green-50/30 dark:bg-green-900/10'
                : 'border-l-red-500 bg-red-50/30 dark:bg-red-900/10'
                }`}
            >
              <div className="space-y-4">
                {/* Header with Question Number and Status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                    )}
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      Question {idx + 1}
                    </h3>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${isCorrect
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      }`}
                  >
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>

                {/* Question Text */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">Question:</p>
                  <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                    {question?.text || res.question_id?.text || 'Question not found'}
                  </p>
                </div>

                {/* Student Answer */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
                  <p className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-2">Your Answer:</p>
                  <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                    {res.student_answer_text || 'No answer provided'}
                  </p>
                </div>

                {/* AI Feedback */}
                {res.ai_feedback && (
                  <div
                    className={`p-4 rounded-lg border shadow-sm ${isCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className={`w-4 h-4 ${isCorrect
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-orange-600 dark:text-orange-400'
                        }`} />
                      <p className={`font-medium text-sm ${isCorrect
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-orange-700 dark:text-orange-300'
                        }`}>
                        AI Feedback
                      </p>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                      {res.ai_feedback.feedback || res.ai_feedback}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
