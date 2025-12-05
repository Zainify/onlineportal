import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { TextField, Button, Card, CardContent, Typography, Box, Grid, MenuItem, Select, InputLabel, FormControl, Link as MLink } from '@mui/material'
import api from '../../lib/api'
import { Link } from 'react-router-dom'

export default function Register() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [roles, setRoles] = useState([])
  const [rolesLoading, setRolesLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        console.log('Fetching roles from API...')
        const { data } = await api.get('/auth/signup-roles')
        console.log('Roles received:', data)
        setRoles(data)
        if (data.length > 0) setRole(data[0])
      } catch (err) {
        console.error('Failed to fetch roles:', err)
        // Fallback to hardcoded roles if API fails
        console.log('Using fallback roles')
        setRoles(['student', 'teacher', 'admin'])
        setRole('student')
      } finally {
        setRolesLoading(false)
      }
    }
    fetchRoles()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      const response = await register({ name, email, password, role })

      // Check if it's a teacher request submission
      if (response.message && response.message.includes('Teacher registration request submitted')) {
        setSuccess('Teacher registration request submitted successfully! Please wait for admin approval.')
        // Clear form but DO NOT redirect
        setName('')
        setEmail('')
        setPassword('')
        setRole('student')
        return // Stop here - don't redirect
      } else {
        // Normal registration - redirect to dashboard
        location.href = '/'
      }
    } catch (e) {
      console.error('Registration error:', e)
      setError(e.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} md={6} sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center', justifyContent: 'center',
          background: '#f8fafc'
        }}>
          <Box sx={{ px: 6, maxWidth: 520 }}>
            <Typography variant="h3" fontWeight={800} gutterBottom color="primary.main">Create your account</Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>Join Concept Master</Typography>
            <Typography variant="body1" color="text.secondary">Pick your role and start your learning journey with beautiful analytics and instant results.</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'grid', placeItems: 'center', p: 2 }}>
          <Card elevation={6} sx={{ width: '100%', maxWidth: 460, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>Create account</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>It only takes a minute.</Typography>
              {error && <Typography variant="body2" color="error" sx={{ mb: 2 }}>{error}</Typography>}
              {success && <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>{success}</Typography>}
              <Box component="form" onSubmit={submit} noValidate>
                <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" required />
                <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" required />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" required />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role">Role</InputLabel>
                  <Select
                    labelId="role"
                    id="role-select"
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={rolesLoading}
                  >
                    {roles.map((r) => (
                      <MenuItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</MenuItem>
                    ))}
                  </Select>
                  {rolesLoading && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, ml: 2 }}>
                      Loading roles...
                    </Typography>
                  )}
                </FormControl>
                <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2, py: 1.2 }} disabled={loading}>
                  {loading ? 'Creating…' : 'Create Account'}
                </Button>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Have an account? <MLink href="/login" underline="hover">Sign in</MLink></Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
