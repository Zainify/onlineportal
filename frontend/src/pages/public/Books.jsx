import React, { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ShoppingCart, Star, GraduationCap, ArrowRight, Download, BookOpen, Filter, Search, Grid, List, Heart, Share2, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

const GRADES = [
  { key: '9th', label: '9th Class', color: 'from-teal-600 via-cyan-600 to-blue-600', hoverColor: 'hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700', bgPattern: 'from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20' },
  { key: '10th', label: '10th Class', color: 'from-blue-600 via-indigo-600 to-purple-600', hoverColor: 'hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700', bgPattern: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20' },
  { key: '1st-year', label: '1st Year', color: 'from-purple-600 via-pink-600 to-rose-600', hoverColor: 'hover:from-purple-700 hover:via-pink-700 hover:to-rose-700', bgPattern: 'from-purple-50 to-rose-50 dark:from-purple-900/20 dark:to-rose-900/20' },
  { key: '2nd-year', label: '2nd Year', color: 'from-emerald-600 via-green-600 to-teal-600', hoverColor: 'hover:from-emerald-700 hover:via-green-700 hover:to-teal-700', bgPattern: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20' },
]

const BOOKS = [
  {
    id: 1,
    title: 'Mathematics Essentials',
    author: 'A. Khan',
    price: 1200,
    image: '/images/books/math.jpg',
    category: 'Mathematics',
    grade: '9th',
    rating: 4.6,
    reviews: 182,
    description: 'Complete guide to 9th grade mathematics with detailed explanations and practice exercises',
    features: ['500+ pages', 'Practice questions', 'Solutions included', 'Exam preparation'],
    discount: 20
  },
  {
    id: 2,
    title: 'Physics for Beginners',
    author: 'S. Ahmed',
    price: 950,
    image: '/images/books/physics.jpg',
    category: 'Science',
    grade: '10th',
    rating: 4.3,
    reviews: 149,
    description: 'Introduction to physics concepts with real-world examples and experiments',
    features: ['400+ pages', 'Diagrams', 'Lab experiments', 'Glossary'],
    discount: 15
  },
  {
    id: 3,
    title: 'Chemistry Concepts',
    author: 'R. Ali',
    price: 1100,
    image: '/images/books/chemistry.jpg',
    category: 'Science',
    grade: '1st-year',
    rating: 4.4,
    reviews: 97,
    description: 'Comprehensive chemistry textbook covering organic and inorganic chemistry',
    features: ['600+ pages', 'Chemical equations', 'Periodic table', 'Molecular structures'],
    discount: 25
  },
  {
    id: 4,
    title: 'Biology Basics',
    author: 'N. Fatima',
    price: 990,
    image: '/images/books/biology.jpg',
    category: 'Science',
    grade: '2nd-year',
    rating: 4.2,
    reviews: 88,
    description: 'Detailed biology textbook with illustrations and case studies',
    features: ['450+ pages', 'Anatomy diagrams', 'Case studies', 'Evolution'],
    discount: 10
  },
  {
    id: 5,
    title: 'English Grammar Made Easy',
    author: 'H. Qureshi',
    price: 850,
    image: '/images/books/english.jpg',
    category: 'Language',
    grade: '10th',
    rating: 4.1,
    reviews: 131,
    description: 'Complete English grammar guide with exercises and examples',
    features: ['300+ pages', 'Grammar rules', 'Writing exercises', 'Speaking tips'],
    discount: 30
  },
  {
    id: 6,
    title: 'Advanced Calculus',
    author: 'M. Hassan',
    price: 1350,
    image: '/images/books/calculus.jpg',
    category: 'Mathematics',
    grade: '2nd-year',
    rating: 4.7,
    reviews: 203,
    description: 'Advanced calculus concepts with applications and problem-solving techniques',
    features: ['700+ pages', 'Derivatives', 'Integrals', 'Applications'],
    discount: 20
  },
]

export default function Books() {
  const { grade } = useParams()
  const [sp] = useSearchParams()
  const q = (sp.get('q') || '').toLowerCase()
  const items = useMemo(() =>
    BOOKS.filter(b => (!grade || b.grade === grade) && [b.title, b.author].join(' ').toLowerCase().includes(q))
    , [q, grade])

  const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || '' // e.g. 923001234567

  const waLink = (book) => {
    const text = `I want to buy this book: ${book.title} by ${book.author} (Price: Rs ${book.price}).`
    if (WA_NUMBER) {
      return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
    }
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
  }

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
                  Digital Library
                </h1>
                <p className="text-2xl text-gray-600 dark:text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                  Choose your class to explore our comprehensive collection of educational books
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
                    to={`/books/${g.key}`}
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
                        <p className="text-gray-600 dark:text-gray-400 mb-4">View all available books</p>

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${g.color} text-white font-semibold transition-all duration-500 hover:scale-105 shadow-md`}>
                          <BookOpen className="w-4 h-4" />
                          Browse Books
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
                  Books – {GRADES.find(g => g.key === grade)?.label || grade}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Static catalog. Add to cart opens WhatsApp.
                </p>
              </div>
              <Link
                to="/books"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 font-semibold"
              >
                Change Class
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Books Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {items.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                  className="group"
                >
                  <div className="h-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Book Image */}
                    <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <img
                        src={book.image}
                        alt={book.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/books/placeholder.jpg';
                        }}
                      />

                      {/* Discount Badge */}
                      {book.discount && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-500 text-white text-sm font-bold shadow-lg">
                          -{book.discount}%
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 text-sm font-semibold">
                        {book.category}
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-bold text-lg line-clamp-2 text-gray-900 dark:text-white mb-2">{book.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const filled = i < Math.round(book.rating || 4)
                            return (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${filled ? 'text-yellow-500' : 'text-gray-300'}`}
                                fill={filled ? 'currentColor' : 'none'}
                                strokeWidth={filled ? 0 : 2}
                              />
                            )
                          })}
                        </div>
                        <span className="text-sm text-gray-500">({book.reviews || 120})</span>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2">
                        {book.features?.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          {book.discount ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                Rs {Math.round(book.price * (1 - book.discount / 100)).toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-400 line-through">Rs {book.price.toLocaleString()}</span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                              Rs {book.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <a
                          href={waLink(book)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
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
                <div className="text-gray-500 text-lg">No books match your search.</div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
