import { useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'

export default function Analytics() {
  const [quizId, setQuizId] = useState('')
  const [attempts, setAttempts] = useState([])
  const [stats, setStats] = useState(null)

  const load = async () => {
    if (!quizId) return
    const { data } = await api.get(`/quizzes/${quizId}/attempts`)
    const arr = data.data || []
    setAttempts(arr)
    if (arr.length) {
      const avg = arr.reduce((s,a)=> s + Number(a.percentage || 0), 0)/arr.length
      const max = Math.max(...arr.map(a=> Number(a.percentage || 0)))
      const min = Math.min(...arr.map(a=> Number(a.percentage || 0)))
      setStats({ count: arr.length, avg: avg.toFixed(1), max, min })
    } else setStats({ count: 0, avg: 0, max: 0, min: 0 })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Quiz Analytics</h2>
      <Card>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Quiz ID" label="Quiz ID" value={quizId} onChange={e=>setQuizId(e.target.value)} />
          <Button onClick={load}>Analyze</Button>
        </div>
      </Card>
      {stats && (
        <div className="grid md:grid-cols-4 gap-3">
          <Card title="Attempts"><div className="text-3xl font-bold">{stats.count}</div></Card>
          <Card title="Average %"><div className="text-3xl font-bold">{stats.avg}</div></Card>
          <Card title="Max %"><div className="text-3xl font-bold">{stats.max}</div></Card>
          <Card title="Min %"><div className="text-3xl font-bold">{stats.min}</div></Card>
        </div>
      )}
      <div className="space-y-3">
        {attempts.map(a => (
          <Card key={a.id} title={a.student?.name} subtitle={`${a.percentage}%`}>
            <div className="text-xs opacity-60">{new Date(a.createdAt).toLocaleString()}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
