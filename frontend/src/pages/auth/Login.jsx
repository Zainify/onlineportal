import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { TextField, Button, Card, CardContent, Typography, InputAdornment, IconButton, Box, Grid, Link as MLink } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(email, password)
      location.href = '/'
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} md={6} sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc'
        }}>
          <Box sx={{ px: 6, maxWidth: 520 }}>
            <Typography variant="h3" fontWeight={800} gutterBottom color="primary.main">Concept Master</Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>Master concepts with SLO‑based learning.</Typography>
            <Typography variant="body1" color="text.secondary">Track your progress, take quizzes with instant feedback, and learn faster with curated notes and lectures.</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'grid', placeItems: 'center', p: 2 }}>
          <Card elevation={6} sx={{ width: '100%', maxWidth: 420, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>Welcome back</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Sign in to continue to your dashboard</Typography>
              {error && <Typography variant="body2" color="error" sx={{ mb: 2 }}>{error}</Typography>}
              <Box component="form" onSubmit={submit} noValidate>
                <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" required />
                <TextField label="Password" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => setShow(s => !s)} aria-label="toggle password visibility">
                          {show ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2, py: 1.2 }} disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </Button>
              </Box>
              <Typography variant="body2" sx={{ mt: 2 }}>No account? <MLink href="/register" underline="hover">Create one</MLink></Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
