import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'

export default function SystemOverview() {
  const [overview, setOverview] = useState(null)
  useEffect(() => { api.get('/analytics/system/overview').then(r=> setOverview(r.data)).catch(()=>{}) }, [])
  if (!overview) return <Card><div>Loading...</div></Card>
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">System Overview</h2>
      <div className="grid md:grid-cols-5 gap-4">
        {Object.entries(overview).map(([k,v]) => (
          <Card key={k} title={k}>
            <div className="text-3xl font-bold">{v}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
