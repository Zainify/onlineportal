import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import { CheckCircle, Clock, Calendar, FileText, Award, TrendingUp } from 'lucide-react'

export default function Results() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/results/students/me/attempts')
      .then(r => setItems(r.data.data || []))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  )

  if (items.length === 0) return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Results</h2>
      <Card>
        <div className="text-center py-12">
          <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Quiz Results Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Complete quizzes to see your results here
          </p>
        </div>
      </Card>
    </div>
  )

  // Calculate overall statistics
  const totalQuizzes = items.length
  const averageScore = totalQuizzes > 0
    ? (items.reduce((sum, item) => sum + item.percentage, 0) / totalQuizzes).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Results</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your quiz performance and progress
        </p>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quizzes</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalQuizzes}</p>
            </div>
            <FileText className="w-12 h-12 text-purple-600 dark:text-purple-400 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{averageScore}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-600 dark:text-green-400 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Results List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quiz History</h3>
        <div className="space-y-3">
          {items.map(attempt => {
            const percentage = attempt.percentage || 0
            const isGoodScore = percentage >= 70
            const completedDate = attempt.completed_at || attempt.started_at

            return (
              <Card
                key={attempt._id || attempt.id}
                className={`transition-all duration-200 hover:shadow-lg border-l-4 ${isGoodScore
                  ? 'border-l-green-500 bg-green-50/30 dark:bg-green-900/10'
                  : 'border-l-orange-500 bg-orange-50/30 dark:bg-orange-900/10'
                  }`}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {attempt.quiz_id?.title || attempt.quiz?.title || 'Quiz'}
                      </h4>
                      {(attempt.quiz_id?.description || attempt.quiz?.description) && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {attempt.quiz_id?.description || attempt.quiz?.description}
                        </p>
                      )}
                    </div>

                    {/* Score Badge */}
                    <div className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-lg ${isGoodScore
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                      }`}>
                      {percentage}%
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Score */}
                    <div className="flex items-center gap-2 text-sm">
                      <Award className={`w-4 h-4 ${isGoodScore ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`} />
                      <span className="text-gray-700 dark:text-gray-300">
                        Score: <span className="font-semibold">{attempt.score}</span>
                      </span>
                    </div>

                    {/* Quiz Type */}
                    {(attempt.quiz_id?.type || attempt.quiz?.type) && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Type: <span className="font-semibold">
                            {(attempt.quiz_id?.type || attempt.quiz?.type) === 'SHORT_ANSWER' ? 'Short Answer' : 'MCQ'}
                          </span>
                        </span>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {completedDate
                          ? new Date(completedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                          : 'No date'}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${isGoodScore ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`} />
                      <span className={`text-sm font-medium ${isGoodScore ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}`}>
                        {isGoodScore ? 'Great Job!' : 'Keep Practicing'}
                      </span>
                    </div>

                    {completedDate && (
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(completedDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
