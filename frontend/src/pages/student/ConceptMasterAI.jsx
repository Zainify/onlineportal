import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import api from '../../lib/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ConceptMasterAI() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I'm your Concept Master AI tutor. I can explain any topic you're studying. What would you like to learn about today?"
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setLoading(true)

        try {
            const { data } = await api.post('/ai/generate', {
                prompt: `Act as an AI teacher here is the user message and be friendly: ${userMessage}`
            })

            setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
        } catch (error) {
            console.error('AI Error:', error)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm sorry, I encountered an error while trying to explain that. Please try again."
            }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-3 flex-shrink-0"
            >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        Concept Master AI
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Your personal AI tutor available 24/7</p>
                </div>
            </motion.div>

            <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl ring-1 ring-gray-200 dark:ring-gray-800 backdrop-blur-xl">
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                }`}>
                                {msg.role === 'assistant' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'assistant'
                                ? 'bg-gray-50 dark:bg-gray-800/50 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                                : 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                                }`}>
                                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                return !inline ? (
                                                    <div className="bg-gray-900 rounded-lg p-4 my-2 overflow-x-auto border border-gray-800">
                                                        <code className="text-gray-100 font-mono text-sm" {...props}>
                                                            {children}
                                                        </code>
                                                    </div>
                                                ) : (
                                                    <code className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 font-mono text-xs font-medium" {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            },
                                            h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">{children}</h1>,
                                            h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-4 text-gray-900 dark:text-white">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-3 text-gray-900 dark:text-white">{children}</h3>,
                                            ul: ({ children }) => <ul className="list-disc pl-4 my-2 space-y-1 text-gray-700 dark:text-gray-300">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal pl-4 my-2 space-y-1 text-gray-700 dark:text-gray-300">{children}</ol>,
                                            li: ({ children }) => <li className="my-1">{children}</li>,
                                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                            strong: ({ children }) => <span className="font-bold text-blue-600 dark:text-blue-400">{children}</span>,
                                            blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 my-2 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 py-2 rounded-r">{children}</blockquote>,
                                            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{children}</a>,
                                            table: ({ children }) => <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-gray-700"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">{children}</table></div>,
                                            thead: ({ children }) => <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>,
                                            tbody: ({ children }) => <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">{children}</tbody>,
                                            tr: ({ children }) => <tr>{children}</tr>,
                                            th: ({ children }) => <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{children}</th>,
                                            td: ({ children }) => <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{children}</td>,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-gray-50/80 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me to explain any topic..."
                            className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
