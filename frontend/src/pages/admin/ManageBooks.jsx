import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Book, Plus, Pencil, Trash2, Upload, X } from 'lucide-react'
import api from '../../lib/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'

export default function ManageBooks() {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [currentBook, setCurrentBook] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        category: '',
        grade: '9th',
        description: '',
        features: '',
        discount: 0
    })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    useEffect(() => {
        fetchBooks()
    }, [])

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books')
            setBooks(response.data.books || [])
        } catch (err) {
            console.error('Error fetching books:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formDataToSend = new FormData()
        formDataToSend.append('title', formData.title)
        formDataToSend.append('author', formData.author)
        formDataToSend.append('price', formData.price)
        formDataToSend.append('category', formData.category)
        formDataToSend.append('grade', formData.grade)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('features', formData.features)
        formDataToSend.append('discount', formData.discount)
        if (imageFile) {
            formDataToSend.append('coverImage', imageFile)
        }

        try {
            if (currentBook) {
                await api.put(`/books/${currentBook._id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            } else {
                await api.post('/books', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            }
            fetchBooks()
            closeModal()
        } catch (err) {
            console.error('Error saving book:', err)
            alert('Failed to save book')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return

        try {
            await api.delete(`/books/${id}`)
            fetchBooks()
        } catch (err) {
            console.error('Error deleting book:', err)
            alert('Failed to delete book')
        }
    }

    const openModal = (book = null) => {
        if (book) {
            setCurrentBook(book)
            setFormData({
                title: book.title,
                author: book.author,
                price: book.price,
                category: book.category,
                grade: book.grade,
                description: book.description || '',
                features: book.features?.join(', ') || '',
                discount: book.discount || 0
            })
            setImagePreview(book.coverImage ? `${'http://localhost:5000'}${book.coverImage}` : null)
        } else {
            setCurrentBook(null)
            setFormData({
                title: '',
                author: '',
                price: '',
                category: '',
                grade: '9th',
                description: '',
                features: '',
                discount: 0
            })
            setImagePreview(null)
        }
        setImageFile(null)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setCurrentBook(null)
        setImageFile(null)
        setImagePreview(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <Book className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Manage Books</h1>
                        <p className="text-gray-600 dark:text-gray-400">Add, edit, or remove books from the library</p>
                    </div>
                </div>
                <Button onClick={() => openModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Book
                </Button>
            </div>

            {/* Books Grid */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <Card key={book._id} className="overflow-hidden">
                            <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 relative">
                                <img
                                    src={book.coverImage ? `http://localhost:5000${book.coverImage}` : '/images/books/placeholder.jpg'}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 space-y-3">
                                <div>
                                    <h3 className="font-bold line-clamp-1">{book.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-semibold text-blue-600">Rs {book.price.toLocaleString()}</span>
                                    <span className="text-gray-500">{book.grade}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(book)}
                                        className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(book._id)}
                                        className="flex-1 px-3 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{currentBook ? 'Edit Book' : 'Add New Book'}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Book Cover</label>
                                <div className="flex items-center gap-4">
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Preview" className="w-24 h-32 object-cover rounded-lg" />
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload image</span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Author"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Price (Rs)"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                />
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Grade</label>
                                    <select
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="9th">9th Class</option>
                                        <option value="10th">10th Class</option>
                                        <option value="1st-year">1st Year</option>
                                        <option value="2nd-year">2nd Year</option>
                                    </select>
                                </div>
                                <Input
                                    label="Discount (%)"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                />
                            </div>

                            <Textarea
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />

                            <Input
                                label="Features (comma separated)"
                                value={formData.features}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                placeholder="500+ pages, Diagrams, Practice questions"
                            />

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" className="flex-1">
                                    {currentBook ? 'Update Book' : 'Add Book'}
                                </Button>
                                <Button type="button" onClick={closeModal} className="flex-1 bg-gray-500 hover:bg-gray-600">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
