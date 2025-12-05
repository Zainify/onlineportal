import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Mail, Lock, Shield, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function Settings() {
    const { user, login } = useAuth()

    // Profile state
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [profileLoading, setProfileLoading] = useState(false)
    const [profileMsg, setProfileMsg] = useState('')
    const [profileErr, setProfileErr] = useState('')

    // Password state
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordMsg, setPasswordMsg] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        if (user) {
            setName(user.name || '')
            setEmail(user.email || '')
        }
    }, [user])

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        setProfileMsg('')
        setProfileErr('')

        if (!name.trim() || !email.trim()) {
            setProfileErr('Name and email are required')
            return
        }

        setProfileLoading(true)
        try {
            const response = await api.put('/auth/profile', { name, email })
            setProfileMsg(response.data.message || 'Profile updated successfully')

            // Update the user context with new data
            const updatedUser = response.data.user
            login(localStorage.getItem('token'), updatedUser)

            setTimeout(() => setProfileMsg(''), 3000)
        } catch (error) {
            setProfileErr(error.response?.data?.message || 'Failed to update profile')
            setTimeout(() => setProfileErr(''), 5000)
        } finally {
            setProfileLoading(false)
        }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        setPasswordMsg('')
        setPasswordErr('')

        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordErr('All password fields are required')
            return
        }

        if (newPassword.length < 6) {
            setPasswordErr('New password must be at least 6 characters')
            return
        }

        if (newPassword !== confirmPassword) {
            setPasswordErr('New passwords do not match')
            return
        }

        setPasswordLoading(true)
        try {
            const response = await api.put('/auth/password', {
                oldPassword,
                newPassword
            })
            setPasswordMsg(response.data.message || 'Password changed successfully')
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setTimeout(() => setPasswordMsg(''), 3000)
        } catch (error) {
            setPasswordErr(error.response?.data?.message || 'Failed to change password')
            setTimeout(() => setPasswordErr(''), 5000)
        } finally {
            setPasswordLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <SettingsIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Settings</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
                    </div>
                </div>
            </motion.div>

            {/* Account Information */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-lg font-semibold">Account Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</label>
                                <p className="text-sm font-mono mt-1 text-gray-900 dark:text-gray-100">{user?.id}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
                                <p className="text-sm mt-1 capitalize">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                        {user?.role}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Profile Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-lg font-semibold">Profile Settings</h2>
                        </div>

                        {profileMsg && (
                            <div className="px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 flex items-center gap-3">
                                <CheckCircle className="w-5 h-5" />
                                <span>{profileMsg}</span>
                            </div>
                        )}

                        {profileErr && (
                            <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5" />
                                <span>{profileErr}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                icon={<User className="w-4 h-4" />}
                            />
                            <Input
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                icon={<Mail className="w-4 h-4" />}
                            />
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="submit"
                                loading={profileLoading}
                                disabled={profileLoading}
                                className="px-6"
                            >
                                Update Profile
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>

            {/* Password Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                <Lock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h2 className="text-lg font-semibold">Change Password</h2>
                        </div>

                        {passwordMsg && (
                            <div className="px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 flex items-center gap-3">
                                <CheckCircle className="w-5 h-5" />
                                <span>{passwordMsg}</span>
                            </div>
                        )}

                        {passwordErr && (
                            <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5" />
                                <span>{passwordErr}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <Input
                                    label="Current Password"
                                    type={showOldPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                    icon={<Lock className="w-4 h-4" />}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="relative">
                                <Input
                                    label="New Password"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password (min 6 characters)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    icon={<Lock className="w-4 h-4" />}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="relative">
                                <Input
                                    label="Confirm New Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    icon={<Lock className="w-4 h-4" />}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="submit"
                                loading={passwordLoading}
                                disabled={passwordLoading}
                                className="px-6"
                            >
                                Change Password
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}
