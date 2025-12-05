import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'

export default function StudentAttempts() {
  const [quizId, setQuizId] = useState('')
  const [items, setItems] = useState([])
  const load = async () => {
    if (!quizId) return
    const { data } = await api.get(`/quizzes/${quizId}/attempts`)
    setItems(data.data || [])
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Student Attempts</h2>
      <Card>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Quiz ID" label="Quiz ID" value={quizId} onChange={e=>setQuizId(e.target.value)} />
          <Button onClick={load}>Load</Button>
        </div>
      </Card>
      <div className="space-y-3">
        {items.map(a => (
          <Card key={a.id} title={a.student?.name} subtitle={`Score: ${a.score} (${a.percentage}%)`}>
            <div className="text-xs opacity-60">{new Date(a.createdAt).toLocaleString()}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
