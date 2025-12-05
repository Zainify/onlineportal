import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Star, ArrowLeft, Heart, Share2, CheckCircle, Package, Truck, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../../lib/api'

export default function BookDetail() {
    const { bookId } = useParams()
    const navigate = useNavigate()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await api.get(`/books/${bookId}`)
                setBook(response.data)
            } catch (err) {
                setError('Failed to load book details')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchBook()
    }, [bookId])

    const handleBuyNow = () => {
        if (!book) return

        const message = `I want to buy: ${book.title}\nAuthor: ${book.author}\nPrice: Rs ${book.discount ? Math.round(book.price * (1 - book.discount / 100)).toLocaleString() : book.price.toLocaleString()}\nGrade: ${book.grade}`

        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading book details...</p>
                </div>
            </div>
        )
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Book not found'}</p>
                    <button
                        onClick={() => navigate('/books')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
                    >
                        Back to Books
                    </button>
                </div>
            </div>
        )
    }

    const finalPrice = book.discount
        ? Math.round(book.price * (1 - book.discount / 100))
        : book.price

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </motion.button>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Side - Book Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                            <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-700">
                                <img
                                    src={book.coverImage ? `http://localhost:5000${book.coverImage}` : '/images/books/placeholder.jpg'}
                                    alt={book.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/images/books/placeholder.jpg'
                                    }}
                                />
                                {book.discount > 0 && (
                                    <div className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-full font-bold shadow-lg">
                                        -{book.discount}% OFF
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: Package, text: 'In Stock', desc: 'Ready to ship' },
                                { icon: Truck, text: 'Fast Delivery', desc: '2-3 days' },
                                { icon: Shield, text: 'Genuine', desc: '100% authentic' }
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center"
                                >
                                    <feature.icon className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{feature.text}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side - Book Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        {/* Category Badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                            {book.category} • {book.grade}
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3">
                                {book.title}
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                by {book.author}
                            </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const filled = i < Math.round(book.rating || 4)
                                    return (
                                        <Star
                                            key={i}
                                            className={`w-6 h-6 ${filled ? 'text-yellow-500' : 'text-gray-300'}`}
                                            fill={filled ? 'currentColor' : 'none'}
                                            strokeWidth={filled ? 0 : 2}
                                        />
                                    )
                                })}
                            </div>
                            <span className="text-gray-600 dark:text-gray-400">
                                {book.rating?.toFixed(1) || '4.0'} ({book.reviews || 0} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-baseline gap-4">
                                <span className="text-5xl font-black text-blue-600 dark:text-blue-400">
                                    Rs {finalPrice.toLocaleString()}
                                </span>
                                {book.discount > 0 && (
                                    <span className="text-2xl text-gray-400 line-through">
                                        Rs {book.price.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            {book.discount > 0 && (
                                <p className="text-green-600 dark:text-green-400 font-semibold mt-2">
                                    You save Rs {(book.price - finalPrice).toLocaleString()} ({book.discount}%)
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">About this book</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                {book.description || 'A comprehensive educational resource designed for students.'}
                            </p>
                        </div>

                        {/* Features */}
                        {book.features && book.features.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Key Features</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {book.features.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                                        >
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Buy Button */}
                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                Buy on WhatsApp
                            </button>
                            <button className="px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all border border-gray-200 dark:border-gray-700">
                                <Heart className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button className="px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all border border-gray-200 dark:border-gray-700">
                                <Share2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
