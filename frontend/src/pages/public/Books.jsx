import { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ShoppingCart, Star, GraduationCap, ArrowRight, Download, BookOpen, Filter, Search, Grid, List, Heart, Share2, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../../lib/api'

const GRADE_COLORS = [
  { color: 'from-teal-500 to-cyan-500', hoverColor: 'hover:from-teal-600 hover:to-cyan-600', bgPattern: 'from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20' },
  { color: 'from-blue-500 to-indigo-500', hoverColor: 'hover:from-blue-600 hover:to-indigo-600', bgPattern: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20' },
  { color: 'from-purple-500 to-pink-500', hoverColor: 'hover:from-purple-600 hover:to-pink-600', bgPattern: 'from-purple-50 to-rose-50 dark:from-purple-900/20 dark:to-rose-900/20' },
  { color: 'from-emerald-500 to-green-500', hoverColor: 'hover:from-emerald-600 hover:to-green-600', bgPattern: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20' },
  { color: 'from-orange-500 to-red-500', hoverColor: 'hover:from-orange-600 hover:to-red-600', bgPattern: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20' },
  { color: 'from-violet-500 to-purple-500', hoverColor: 'hover:from-violet-600 hover:to-purple-600', bgPattern: 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20' },
]

export default function Books() {
  const { grade } = useParams()
  const [sp] = useSearchParams()
  const q = (sp.get('q') || '').toLowerCase()

  const [classes, setClasses] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [classesLoading, setClassesLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/classes')
        setClasses(response.data || [])
      } catch (err) {
        console.error('Error fetching classes:', err)
      } finally {
        setClassesLoading(false)
      }
    }

    fetchClasses()
  }, [])

  useEffect(() => {
    const fetchBooks = async () => {
      if (!grade) {
        setLoading(false)
        return
      }

      console.log('Fetching books for grade:', grade)

      try {
        const response = await api.get('/books', {
          params: { grade: grade || undefined }
        })
        console.log('API Response - All books:', response.data.books)
        console.log('Books count:', response.data.books?.length || 0)
        setBooks(response.data.books || [])
      } catch (err) {
        console.error('Error fetching books:', err)
        setError('Failed to load books')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [grade])

  const items = useMemo(() => {
    const filtered = books.filter(b => (!grade || b.grade === grade) && [b.title, b.author].join(' ').toLowerCase().includes(q))
    console.log('Filtered books for grade', grade, ':', filtered)
    console.log('Filter check - grade param:', grade, 'Books grades:', books.map(b => b.grade))
    return filtered
  }, [q, grade, books])

  const waLink = (book) => {
    const price = book.discount ? Math.round(book.price * (1 - book.discount / 100)) : book.price
    const text = `I want to buy this book: ${book.title} by ${book.author} (Price: Rs ${price}).`
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

            {/* Class Cards */}
            {classesLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : classes.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No classes found in the database.</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">Please ask an admin to add classes via the admin panel.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {classes.map((cls, index) => {
                  const colorScheme = GRADE_COLORS[index % GRADE_COLORS.length]
                  const className = cls.name || cls.class_name || cls.title || 'Unknown Class'

                  // Extract grade identifier from class name (e.g., "Class 9" -> "9th", "9" -> "9th")
                  const getGradeId = (name) => {
                    const match = name.match(/(\d+)(st|nd|rd|th)?/i)
                    if (match) {
                      const num = match[1]
                      if (num === '1') return '1st-year'
                      if (num === '2') return '2nd-year'
                      return `${num}th`
                    }
                    return name
                  }

                  const gradeId = getGradeId(className)
                  console.log('Displaying class:', className, 'Grade ID:', gradeId, cls)

                  return (
                    <motion.div
                      key={cls._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                    >
                      <Link
                        to={`/books/${gradeId}`}
                        className="group block h-full"
                      >
                        <div className="h-full p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400">
                          <div className="flex flex-col items-center text-center space-y-4">
                            {/* Icon */}
                            <div className="w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <GraduationCap className="w-10 h-10 text-white" />
                            </div>

                            {/* Class Name */}
                            <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{className}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Browse available books</p>
                            </div>

                            {/* Button */}
                            <div className="pt-2">
                              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md">
                                <BookOpen className="w-4 h-4" />
                                View Books
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
              // </div>
            )}
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
                  Books – {classes.find(c => c.name === grade)?.name || grade}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Browse our collection of books for {grade}
                </p>
              </div>
              <Link
                to="/books"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 font-semibold text-gray-900 dark:text-white"
              >
                Change Class
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Books Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading books...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((book, index) => (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                    className="group"
                  >
                    <div className="h-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden">
                      {/* Book Image */}
                      <Link to={`/books/detail/${book._id}`}>
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 overflow-hidden flex items-center justify-center">
                          {book.coverImage ? (
                            <img
                              src={`http://localhost:5000${book.coverImage}`}
                              alt={book.title}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                console.error('Image load error for:', e.target.src)
                                e.target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="text-gray-400 dark:text-gray-500 text-center p-4">
                              <BookOpen className="w-16 h-16 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No cover image</p>
                            </div>
                          )}

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
                      </Link>

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
                          <span className="text-sm text-gray-500">({book.reviews || 0})</span>
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
                            Buy
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* </div> */}
                  </motion.div>
                ))}
              </div>
            )}

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
    </div >
  )
}
