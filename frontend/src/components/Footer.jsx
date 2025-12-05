import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black text-gray-900 dark:text-white">Concept Master</span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md mb-6">
                            Empowering students worldwide with AI-driven learning, interactive content, and expert guidance.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Platform</h4>
                        <ul className="space-y-4">
                            {['Browse Books', 'Study Notes', 'Live Classes', 'Pricing', 'For Teachers'].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Support</h4>
                        <ul className="space-y-4">
                            {['Help Center', 'Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                        © {new Date().getFullYear()} Concept Master. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-500">
                        <Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
                        <Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
                        <Link to="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
