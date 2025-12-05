import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'

export default function ParentDashboard() {
  const [studentId, setStudentId] = useState('')
  const [attempts, setAttempts] = useState([])
  const [notifications, setNotifications] = useState([])

  const load = async () => {
    if (!studentId) return
    const { data } = await api.get(`/results/students/${studentId}/attempts`)
    setAttempts(data.data || [])
  }

  useEffect(() => {
    api.get('/notifications/me').then(r => setNotifications(r.data.data?.slice(0, 5) || [])).catch(() => { })
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 bg-blue-600 text-white shadow-md">
        <div className="text-2xl font-extrabold tracking-tight">Parent Dashboard</div>
        <div className="opacity-90">Monitor your child's learning and results.</div>
      </div>

      <Card title="Child Performance" actions={
        <div className="flex gap-2">
          <Input placeholder="Child Student ID" label="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
          <Button onClick={load}>Load</Button>
        </div>
      }>
        <div className="h-56 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attempts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="createdAt" hide />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="percentage" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {attempts.map(a => (
            <div key={a.id} className="p-3 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex justify-between">
              <div>
                <div className="font-medium">{a.quiz?.title}</div>
                <div className="text-xs opacity-70">Score: {a.score} ({a.percentage}%)</div>
              </div>
              <div className="text-xs opacity-60">{new Date(a.createdAt).toLocaleString()}</div>
            </div>
          ))}
          {!attempts.length && <div className="text-sm opacity-70">No attempts loaded.</div>}
        </div>
      </Card>

      <Card title="Notifications">
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className="text-sm flex justify-between">
              <div>
                <div className="font-medium">{n.title}</div>
                <div className="opacity-70">{n.message}</div>
              </div>
              <div className="opacity-60">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          ))}
          {!notifications.length && <div className="text-sm opacity-70">No notifications.</div>}
        </div>
      </Card>
    </div>
  )
}
