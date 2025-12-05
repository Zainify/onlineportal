import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../../components/ui/Card.jsx'

export default function Performance() {
  const [slo, setSlo] = useState([])
  const [topic, setTopic] = useState([])
  useEffect(() => {
    api.get('/analytics/student/slo-accuracy').then(r=> setSlo(r.data || [])).catch(()=>{})
    api.get('/analytics/student/topic-accuracy').then(r=> setTopic(r.data || [])).catch(()=>{})
  }, [])
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Performance</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="SLO Accuracy">
          <Chart data={slo} xKey="slo" />
        </Card>
        <Card title="Topic Accuracy">
          <Chart data={topic} xKey="topic" />
        </Card>
      </div>
    </div>
  )
}

function Chart({ data, xKey }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey={xKey} />
        <YAxis domain={[0,100]} />
        <Tooltip />
        <Bar dataKey="accuracy" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  )
}
