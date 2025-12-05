import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'

export default function Results() {
  const [items, setItems] = useState([])
  useEffect(() => { api.get('/results/students/me/attempts').then(r => setItems(r.data.data || [])).catch(() => { }) }, [])
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Results</h2>
      <div className="space-y-3">
        {items.map(a => (
          <Card key={a._id || a.id} title={a.quiz?.title} subtitle={`Score: ${a.score} (${a.percentage}%)`}>
            <div className="text-xs opacity-60">{new Date(a.createdAt).toLocaleString()}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
