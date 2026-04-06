'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  InputAdornment,
  alpha,
  useTheme,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  DirectionsCar,
  Lock,
  Person
} from '@mui/icons-material';
import { Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message || 'Credenciais inválidas');
      return;
    }

    if (data) {
      router.push('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '40%',
          height: '40%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
          filter: 'blur(50px)',
          zIndex: 0
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '40%',
          height: '40%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
          filter: 'blur(50px)',
          zIndex: 0
        }
      }}
    >
      <Grid container sx={{ maxWidth: 1000, width: '100%', p: 2, zIndex: 1 }}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', p: 4 }}>
           <Box sx={{ mb: 4 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'primary.main',
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.4)}`
                    }}
                >
                    <DirectionsCar sx={{ color: 'background.default', fontSize: 28 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -2, color: 'text.primary' }}>
                    SICONTROLA
                </Typography>
             </Box>
             <Typography variant="h5" color="textSecondary" sx={{ fontWeight: 400, maxWidth: 400, lineHeight: 1.4 }}>
                Gestão inteligente de frotas municipais com tecnologia de ponta e interface de alta performance.
             </Typography>
           </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              width: '100%',
              maxWidth: 450,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: alpha(theme.palette.common.white, 0.05),
              borderRadius: 5,
              position: 'relative'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -1 }}>Acessar Sistema</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 5 }}>Insira suas credenciais para continuar.</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleLogin}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="E-mail"
                  variant="filled"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  slotProps={{
                      input: {
                          disableUnderline: true,
                          startAdornment: <Person sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                      }
                  }}
                  sx={{
                    '& .MuiFilledInput-root': {
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.common.white, 0.03),
                        border: '1px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.05) },
                        '&.Mui-focused': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.02) }
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Senha"
                  variant="filled"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  slotProps={{
                      input: {
                          disableUnderline: true,
                          startAdornment: <Lock sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />,
                          endAdornment: (
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          )
                      }
                  }}
                  sx={{
                    '& .MuiFilledInput-root': {
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.common.white, 0.03),
                        border: '1px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.05) },
                        '&.Mui-focused': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.02) }
                    }
                  }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading}
                    sx={{
                        mt: 2,
                        py: 2,
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: 16,
                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`
                    }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar no Painel'}
                </Button>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="textSecondary">
                        Esqueceu sua senha? <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', fontWeight: 600 }}>Contate o suporte</Typography>
                    </Typography>
                </Box>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
