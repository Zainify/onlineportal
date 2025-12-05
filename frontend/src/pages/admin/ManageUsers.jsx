import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Select from '../../components/ui/Select.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { Users, UserPlus, Search, Filter, Mail, Shield, Trash2, Edit3, AlertCircle, CheckCircle } from 'lucide-react'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const u = await api.get('/admin/users')
      setUsers(u.data.data || [])
      const r = await api.get('/admin/roles')
      setRoles(r.data || [])
    } catch { }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    setMsg('')
    setLoading(true)
    try {
      await api.post('/admin/users', { name, email, password, role })
      setName(''); setEmail(''); setPassword(''); setRole('student')
      setMsg('User created successfully!')
      load()
    } catch (error) {
      setMsg(error.response?.data?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  const setUserRole = async (id, role) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role })
      load()
    } catch { }
  }

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      load()
    } catch { }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const getRoleColor = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case 'admin': return 'from-red-500 to-red-600'
      case 'teacher': return 'from-blue-500 to-blue-600'
      case 'student': return 'from-green-500 to-green-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getRoleIcon = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case 'admin': return <Shield className="w-4 h-4" />
      case 'teacher': return <Edit3 className="w-4 h-4" />
      case 'student': return <Users className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <p className="text-gray-600 dark:text-gray-400">Create and manage user accounts</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${msg.includes('success')
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
            }`}
        >
          {msg.includes('success') ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{msg}</span>
        </motion.div>
      )}

      {/* Create User Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold">Create New User</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Input
                  placeholder="Full name"
                  label="Name *"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  label="Email *"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  label="Password *"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Select
                  label="Role *"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.role_name}>{r.role_name}</option>
                  ))}
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={create}
                  disabled={!name.trim() || !email.trim() || !password || loading}
                  loading={loading}
                  className="w-full"
                >
                  Create User
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <div className="space-y-6">
            {/* List Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold">Users</h2>
                <span className="text-sm text-gray-500">({filteredUsers.length} total)</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Roles</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.role_name}>{r.role_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Users Grid */}
            {loading ? (
              <div className="grid gap-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {searchTerm || filterRole !== 'all' ? 'No users found' : 'No users available'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || filterRole !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start by creating your first user'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user._id || user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* User Avatar */}
                        <div className={`w-12 h-12 rounded-full ${getRoleColor(user.role)} flex items-center justify-center text-white font-semibold`}>
                          {getRoleIcon(user.role)}
                        </div>

                        {/* User Info */}
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <Select
                          value={user.role}
                          onChange={e => setUserRole(user._id || user.id, e.target.value)}
                          className="min-w-[120px]"
                        >
                          {roles.map(r => (
                            <option key={r.id} value={r.role_name}>{r.role_name}</option>
                          ))}
                        </Select>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => remove(user._id || user.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
