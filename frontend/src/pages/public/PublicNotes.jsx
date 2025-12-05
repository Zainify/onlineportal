import React, { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FileText, GraduationCap, ArrowRight, Download, BookOpen, Search, Filter, Grid, List, Heart, Share2, Eye, Clock, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const GRADES = [
  { key: '9th', label: '9th Class', color: 'from-teal-600 via-cyan-600 to-blue-600', hoverColor: 'hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700', bgPattern: 'from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20' },
  { key: '10th', label: '10th Class', color: 'from-blue-600 via-indigo-600 to-purple-600', hoverColor: 'hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700', bgPattern: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20' },
  { key: '1st-year', label: '1st Year', color: 'from-purple-600 via-pink-600 to-rose-600', hoverColor: 'hover:from-purple-700 hover:via-pink-700 hover:to-rose-700', bgPattern: 'from-purple-50 to-rose-50 dark:from-purple-900/20 dark:to-rose-900/20' },
  { key: '2nd-year', label: '2nd Year', color: 'from-emerald-600 via-green-600 to-teal-600', hoverColor: 'hover:from-emerald-700 hover:via-green-700 hover:to-teal-700', bgPattern: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20' },
]

const NOTES = [
  {
    id: 1,
    title: 'Algebra Quick Notes',
    tag: 'Math',
    desc: 'Comprehensive algebra formulas and identities at a glance with step-by-step solutions',
    grade: '9th',
    pages: 3,
    size: '2.5 MB',
    downloads: 15420,
    rating: 4.8,
    features: ['Formulas', 'Examples', 'Practice problems', 'Solutions'],
    difficulty: 'Beginner',
    lastUpdated: '2 days ago'
  },
  {
    id: 2,
    title: 'Cell Biology Cheatsheet',
    tag: 'Biology',
    desc: 'Complete guide to cell organelles and their functions with detailed diagrams',
    grade: '10th',
    pages: 2,
    size: '1.8 MB',
    downloads: 12350,
    rating: 4.6,
    features: ['Diagrams', 'Functions', 'Processes', 'Glossary'],
    difficulty: 'Intermediate',
    lastUpdated: '1 week ago'
  },
  {
    id: 3,
    title: 'Tenses in English',
    tag: 'English',
    desc: 'Complete grammar guide with usage examples and quick rules for all tenses',
    grade: '1st-year',
    pages: 2,
    size: '1.2 MB',
    downloads: 18920,
    rating: 4.9,
    features: ['Rules', 'Examples', 'Exercises', 'Time expressions'],
    difficulty: 'Beginner',
    lastUpdated: '3 days ago'
  },
  {
    id: 4,
    title: 'Vectors Summary',
    tag: 'Math',
    desc: 'Quick properties and operations of vectors with visual representations',
    grade: '2nd-year',
    pages: 4,
    size: '3.1 MB',
    downloads: 9870,
    rating: 4.7,
    features: ['Properties', 'Operations', 'Applications', '3D concepts'],
    difficulty: 'Advanced',
    lastUpdated: '5 days ago'
  },
  {
    id: 5,
    title: 'Chemistry Periodic Table',
    tag: 'Chemistry',
    desc: 'Interactive periodic table with element properties and trends',
    grade: '10th',
    pages: 6,
    size: '4.2 MB',
    downloads: 22150,
    rating: 4.8,
    features: ['Elements', 'Properties', 'Trends', 'Groups'],
    difficulty: 'Intermediate',
    lastUpdated: '1 day ago'
  },
  {
    id: 6,
    title: 'Physics Mechanics',
    tag: 'Physics',
    desc: 'Fundamental laws of motion and mechanics with problem-solving techniques',
    grade: '1st-year',
    pages: 5,
    size: '3.8 MB',
    downloads: 14560,
    rating: 4.5,
    features: ['Laws', 'Formulas', 'Problems', 'Solutions'],
    difficulty: 'Intermediate',
    lastUpdated: '4 days ago'
  },
]

export default function PublicNotes() {
  const { grade } = useParams()
  const [sp] = useSearchParams()
  const q = (sp.get('q') || '').toLowerCase()
  const items = useMemo(() =>
    NOTES.filter(n => (!grade || n.grade === grade) && [n.title, n.tag, n.desc].join(' ').toLowerCase().includes(q))
    , [q, grade])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {!grade ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
                  Study Notes
                </h1>
                <p className="text-2xl text-gray-600 dark:text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                  Access comprehensive notes and study materials for all subjects and classes
                </p>
              </motion.div>
            </div>

            {/* Grade Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {GRADES.map((g, index) => (
                <motion.div
                  key={g.key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                >
                  <Link
                    to={`/notes/${g.key}`}
                    className={`group block h-full`}
                  >
                    <div className={`h-full p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 relative overflow-hidden`}>
                      {/* Hover overlay */}
                      <div className={`absolute inset-0 ${g.color.replace('bg-', 'bg-opacity-5 ')} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div className={`w-16 h-16 ${g.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-md`}>
                            <GraduationCap className="w-8 h-8 text-white" />
                          </div>
                          <ArrowRight className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </div>

                        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{g.label}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">View all available notes</p>

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${g.color} text-white font-semibold transition-all duration-500 hover:scale-105 shadow-md`}>
                          <FileText className="w-4 h-4" />
                          Browse Notes
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3">
                  Notes – {GRADES.find(g => g.key === grade)?.label || grade}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Sample static notes. Click view to open.
                </p>
              </div>
              <Link
                to="/notes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 font-semibold"
              >
                Change Class
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Notes Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {items.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                  className="group"
                >
                  <div className="h-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Note Header */}
                    <div className={`p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`px-3 py-1 rounded-full ${GRADES.find(g => g.key === note.grade)?.color || 'bg-gray-600'} text-white text-sm font-bold shadow-sm`}>
                          {note.tag}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{note.rating}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2">{note.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">{note.desc}</p>
                    </div>

                    {/* Note Details */}
                    <div className="p-6 space-y-4">
                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2">
                        {note.features?.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Meta Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <FileText className="w-4 h-4" />
                            <span>{note.pages} pages</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{note.lastUpdated}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Download className="w-4 h-4" />
                            <span>{note.downloads.toLocaleString()} downloads</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-semibold">
                              {note.difficulty}
                            </span>
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{note.size}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-end pt-2">
                        <a
                          href="#"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md"
                        >
                          <Download className="w-4 h-4" />
                          View Note
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {!items.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-gray-500 text-lg">No notes match your search.</div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
