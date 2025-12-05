import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Card, CardContent, Typography, Box, Grid, Link as MLink } from '@mui/material'
import api from '../../lib/api'

export default function TeacherRequest() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      await api.post('/teacher-requests', { name, email, password })
      setSuccess(true)
    } catch (e) {
      setError(e.response?.data?.message || 'Request submission failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid' }}>
        <Grid container sx={{ minHeight: '100vh' }}>
          <Grid item xs={12} md={6} sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center', justifyContent: 'center',
            background: '#f8fafc'
          }}>
            <Box sx={{ px: 6, maxWidth: 520 }}>
              <Typography variant="h3" fontWeight={800} gutterBottom color="primary.main">Request Submitted!</Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>Teacher Registration Request</Typography>
              <Typography variant="body1" color="text.secondary">Your request has been submitted to the administrator. You will be notified once your request is approved.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'grid', placeItems: 'center', p: 2 }}>
            <Card elevation={6} sx={{ width: '100%', maxWidth: 460, borderRadius: 3 }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} gutterBottom color="success.main">Request Submitted Successfully!</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Your teacher registration request has been sent to the administrator for approval.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  You will receive an email once your request is processed. After approval, you can login with your credentials.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 2, py: 1.2 }}
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} md={6} sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #FDF2F8 0%, #E9D5FF 100%)'
        }}>
          <Box sx={{ px: 6, maxWidth: 520 }}>
            <Typography variant="h3" fontWeight={800} gutterBottom color="primary.main">Teacher Registration</Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>Request Account Access</Typography>
            <Typography variant="body1" color="text.secondary">Submit your request to become a teacher. Your account will be created after admin approval.</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'grid', placeItems: 'center', p: 2 }}>
          <Card elevation={6} sx={{ width: '100%', maxWidth: 460, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>Teacher Request</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Fill in your details to request a teacher account.</Typography>
              {error && <Typography variant="body2" color="error" sx={{ mb: 2 }}>{error}</Typography>}
              <Box component="form" onSubmit={submit} noValidate>
                <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" required />
                <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" required />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" required />
                <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth margin="normal" required />
                <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2, py: 1.2 }} disabled={loading}>
                  {loading ? 'Submitting…' : 'Submit Request'}
                </Button>
              </Box>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account? <MLink href="/login" underline="hover">Sign in</MLink>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
