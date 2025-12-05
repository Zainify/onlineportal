import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, CheckCircle, Award, Book, FileText as FileTextIcon, ArrowRight, TrendingUp, Star, PlayCircle, Shield, Target, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Scene3D from '../../components/Scene3D';

export default function Home() {
  return (
    <div className="min-h-screen relative">

      {/* Full-Page Hero Section with 3D Model */}
      <section className="relative min-h-screen flex items-center bg-gray-100 dark:bg-slate-900 overflow-hidden pt-20 md:pt-0 transition-colors duration-300">
        {/* Optional subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent dark:from-blue-500/5"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT: Text Content & CTAs */}
            <motion.div
              className="text-gray-900 dark:text-white space-y-8 max-w-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Master Every
                <span className="block text-blue-600 dark:text-blue-400 mt-2">Concept</span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Transform your learning journey with AI-powered insights, interactive content, and personalized progress tracking
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Link
                  to="/register"
                  className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 flex items-center justify-center gap-2"
                >
                  Sign Up Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 border-2 border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/40 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl font-bold text-lg text-gray-900 dark:text-white transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
                >
                  Login
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="flex flex-wrap gap-8 pt-4 text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {[
                  { icon: Users, text: '12K+ Students' },
                  { icon: Star, text: '4.9 Rating' },
                  { icon: Award, text: '95% Success' }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium">{stat.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT: 3D Model */}
            <motion.div
              className="h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] order-first lg:order-last"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="w-full h-full">
                <Scene3D modelPath={null} autoRotate={true} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Why Choose Us?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Experience the future of education with cutting-edge features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: <Target className="w-12 h-12 md:w-14 h-14 text-blue-600" />,
                title: 'AI-Powered Learning',
                description: 'Smart adaptive learning paths that adjust to your pace and style',
                stats: '2.5x faster',
                features: ['Personalized recommendations', 'Real-time feedback', 'Adaptive difficulty']
              },
              {
                icon: <TrendingUp className="w-12 h-12 md:w-14 h-14 text-green-600" />,
                title: 'Track Progress',
                description: 'Monitor your learning journey with clear milestones and achievements',
                stats: '89% goal rate',
                features: ['Progress tracking', 'Milestone rewards', 'Performance analytics']
              },
              {
                icon: <Shield className="w-12 h-12 md:w-14 h-14 text-indigo-600" />,
                title: 'Expert Content',
                description: 'All content reviewed and verified by experienced educators',
                stats: '500+ teachers',
                features: ['Expert instructors', 'Quality assurance', 'Regular updates']
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-full p-8 md:p-10 bg-gray-50 dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="w-20 h-20 md:w-24 h-24 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-6 md:mb-8 mx-auto shadow-sm group-hover:shadow-md transition-shadow">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed text-base md:text-lg">{feature.description}</p>

                  <div className="space-y-3 mb-6">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {feature.stats}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section - Enhanced */}
      <section className="py-24 md:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Start Learning Now
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Quick access to all your learning resources
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: <Book className="w-10 h-10 md:w-12 h-12 text-white" />,
                title: 'Digital Library',
                description: 'Access thousands of educational books and resources',
                link: '/books',
                color: 'bg-emerald-600',
                hoverColor: 'hover:bg-emerald-700',
                badge: '8,000+ Books',
                features: ['Smart search', 'PDF downloads', 'Bookmarks', 'Notes']
              },
              {
                icon: <PlayCircle className="w-10 h-10 md:w-12 h-12 text-white" />,
                title: 'Live Classes',
                description: 'Join interactive sessions and recorded lectures',
                link: '/classes',
                color: 'bg-blue-600',
                hoverColor: 'hover:bg-blue-700',
                badge: '500+ Sessions',
                features: ['Live streaming', 'Recordings', 'Q&A sessions', 'Assignments']
              },
              {
                icon: <FileTextIcon className="w-10 h-10 md:w-12 h-12 text-white" />,
                title: 'Study Notes',
                description: 'Comprehensive notes and study materials',
                link: '/notes',
                color: 'bg-indigo-600',
                hoverColor: 'hover:bg-indigo-700',
                badge: '2,000+ Notes',
                features: ['Quick notes', 'Mind maps', 'Flashcards', 'Practice tests']
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link to={item.link} className="block h-full">
                  <div className="h-full p-6 md:p-8 rounded-2xl lg:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-14 h-14 md:w-16 h-16 ${item.color} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {item.icon}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.badge}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-base md:text-lg">{item.description}</p>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {item.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className={`inline-flex items-center gap-2 px-5 md:px-6 py-3 rounded-lg md:rounded-xl ${item.color} ${item.hoverColor} text-white font-semibold transition-all duration-300 shadow-md text-sm md:text-base`}>
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Trusted Worldwide
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Join thousands achieving their goals
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: '12,500+', label: 'Active Students', icon: <Users className="w-8 h-8 md:w-10 h-10" />, color: 'bg-blue-600', desc: '50+ countries' },
              { value: '8,000+', label: 'Digital Books', icon: <Book className="w-8 h-8 md:w-10 h-10" />, color: 'bg-emerald-600', desc: 'All subjects' },
              { value: '2,500+', label: 'Quizzes', icon: <FileTextIcon className="w-8 h-8 md:w-10 h-10" />, color: 'bg-indigo-600', desc: 'Instant feedback' },
              { value: '98%', label: 'Success Rate', icon: <TrendingUp className="w-8 h-8 md:w-10 h-10" />, color: 'bg-green-600', desc: 'Achievement' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-full p-6 md:p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="text-center">
                    <div className={`w-16 h-16 md:w-20 h-20 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-white shadow-md group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                    <div className="text-4xl md:text-5xl font-black mb-3 md:mb-4 text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">{stat.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-24 md:py-32 bg-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8 text-white leading-tight">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl md:text-2xl mb-10 md:mb-12 text-blue-100 leading-relaxed max-w-2xl mx-auto">
              Join thousands of students achieving their dreams with Concept Master
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 items-center mb-10 md:mb-12">
              <Link
                to="/register"
                className="group px-10 md:px-16 py-4 md:py-6 text-xl md:text-2xl font-black text-blue-900 bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 md:gap-3"
              >
                Start Free Today
                <ArrowRight className="w-6 h-6 md:w-8 h-8 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center text-blue-100 gap-2">
                <CheckCircle className="w-5 h-5 md:w-6 h-6 text-green-400" />
                <span className="text-base md:text-lg font-medium">No credit card required</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-blue-200 text-sm md:text-base">
              {['Free plan', 'Cancel anytime', '24/7 support', '30-day guarantee'].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 md:w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
