import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { useParams } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { AlertCircle, Clock, CheckCircle, Calendar } from 'lucide-react'

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
  const [error, setError] = useState('')

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
      const payload = { answers: Object.entries(answers).map(([qid, idx]) => ({ question_id: Number(qid), selected_option_index: idx })) }
      const { data } = await api.post(`/quizzes/${id}/attempts`, payload)
      setSubmitted(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz')
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
    <Card title="Result" subtitle={`${submitted.score}/${submitted.total} (${submitted.percentage}%)`}>
      <div className="text-sm opacity-80">Great job! Review questions to learn from mistakes.</div>
    </Card>
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
            const isAnswered = answers[q.id] !== undefined
            const isActive = i === current
            return (
              <button key={q.id} onClick={() => setCurrent(i)}
                className={`w-9 h-9 rounded-md text-sm font-medium border transition ${isActive ? 'bg-blue-600 text-white border-blue-600' : isAnswered ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >{i + 1}</button>
            )
          })}
        </div>
      </Card>

      {quiz.questions && quiz.questions[current] && (
        <Card title={`Question ${current + 1}`} subtitle={quiz.questions[current].text}>
          <div className="grid gap-2">
            {quiz.questions[current].options.map((opt, idx) => (
              <label key={idx} className={`border rounded-lg p-3 cursor-pointer transition ${answers[quiz.questions[current].id] === idx ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                <input className="hidden" type="radio" name={`q-${quiz.questions[current].id}`} onChange={() => setAnswers({ ...answers, [quiz.questions[current].id]: idx })} />
                {opt}
              </label>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="secondary" onClick={() => setCurrent(c => Math.max(0, c - 1))}>Previous</Button>
            <Button variant="secondary" onClick={() => setCurrent(c => Math.min((quiz.questions?.length || 1) - 1, c + 1))}>Next</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
