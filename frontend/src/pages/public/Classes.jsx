import React from 'react'
import Card from '../../components/ui/Card.jsx'

const CLASSES = [
  { id: 1, title: 'Class 9 Science', badge: 'Live', desc: 'Physics, Chemistry, Biology basics with practice.' },
  { id: 2, title: 'Matric English', badge: 'Recorded', desc: 'Grammar + comprehension booster pack.' },
  { id: 3, title: 'Intermediate Math', badge: 'Live', desc: 'Algebra, Trigonometry, Calculus foundations.' },
]

export default function PublicClasses() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Classes</h2>
        <p className="opacity-80">Discover our curated live and recorded classes.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {CLASSES.map(c => (
          <Card key={c.id} title={c.title} subtitle={c.desc} actions={<a href="#" className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition">Learn more</a>}>
            <div className="text-xs inline-flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full ${c.badge==='Live' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'}`}>{c.badge}</span>
              <span className="opacity-70">Seats available</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
