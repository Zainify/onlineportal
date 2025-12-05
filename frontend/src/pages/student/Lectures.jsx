import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../lib/api'
import { SERVER_ORIGIN } from '../../lib/config'
import Card from '../../components/ui/Card.jsx'

export default function Lectures() {
  const { classId } = useParams()
  const [items, setItems] = useState([])
  const [classes, setClasses] = useState([])

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const c = await api.get('/classes')
        setClasses(c.data || [])
      } catch { }
    }
    loadClasses()
  }, [])

  useEffect(() => {
    const loadLectures = async () => {
      if (!classId) { setItems([]); return }
      try {
        const r = await api.get('/lectures', { params: { class_id: classId } })
        setItems(r.data.data || [])
      } catch { }
    }
    loadLectures()
  }, [classId])
  return (
    <div className="space-y-4">
      {!classId ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Lectures</h2>
          <p className="opacity-80">Choose your class to view lectures.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">
            {classes.map(c => (
              <Link
                key={c._id || c.id}
                to={`/student/lectures/${c._id || c.id}`}
                className="group relative overflow-hidden bg-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 ring-1 ring-transparent hover:ring-white/10"
              >
                <div className="text-xl font-semibold">{c.title}</div>
                <div className="opacity-90 text-sm">View lectures</div>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Lectures – {classes.find(x => String(x._id || x.id) === String(classId))?.title || ''}</h2>
              <p className="opacity-80">All lectures for this class.</p>
            </div>
            <Link to="/student/lectures" className="text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition">Change Class</Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {items.map(l => (
              <Card
                key={l._id || l.id}
                title={l.title}
                subtitle={l.description}
                actions={l.type === 'link' ? (
                  <a
                    href={l.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
                  >
                    Open Link
                  </a>
                ) : null}
              >
                {l.type === 'file' && (
                  <video controls src={`${SERVER_ORIGIN}${l.file_path}`} className="w-full rounded-lg" />
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  {(l.class?.title || l.Class?.title) && (
                    <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">{l.class?.title || l.Class?.title}</span>
                  )}
                  {(l.subject?.name || l.Subject?.name) && (
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">{l.subject?.name || l.Subject?.name}</span>
                  )}
                  <span className="opacity-70">{l.type === 'file' ? 'Video (file)' : 'Video (link)'}</span>
                </div>
              </Card>
            ))}
          </div>
          {!items.length && (
            <div className="opacity-70">No lectures found for this class.</div>
          )}
        </>
      )}
    </div>
  )
}
