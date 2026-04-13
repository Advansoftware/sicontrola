'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  IconButton, 
  alpha,
  useTheme
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  DirectionsCar,
  Lock,
  Person,
  School
} from '@mui/icons-material';
import { Grid, Alert, CircularProgress } from '@mui/material'; // Usando a nova API de Grid do MUI v7
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

interface ExtendedUser {
  role?: string;
}


export default function RootPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const theme = useTheme();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      setError(authError.message || 'Falha na autenticação');
      setLoading(false);
      return;
    }

    // Redirecionamento baseado no papel
    const role = (data?.user as ExtendedUser)?.role;

    if (role === 'ALUNO') {
      router.push('/dashboard/estudante');
    } else if (role === 'MOTORISTA') {
      router.push('/dashboard/scanner');
    } else {
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
             <Typography variant="h5" color="textSecondary" sx={{ fontWeight: 400, maxWidth: 450, lineHeight: 1.4 }}>
                Gestão unificada de frotas municipais e <strong style={{ color: theme.palette.primary.main }}>transporte estudantil</strong> com tecnologia de ponta.
             </Typography>
             
             <Box sx={{ mt: 6, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.common.white, 0.03), borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <School sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Carteirinha Digital</Typography>
                </Paper>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.common.white, 0.03), borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <DirectionsCar sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Controle de Frota</Typography>
                </Paper>
             </Box>
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
            <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>Insira suas credenciais para continuar.</Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
            )}

            <form onSubmit={handleLogin}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField 
                  fullWidth 
                  label="E-mail" 
                  variant="filled"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type={showPassword ? 'text' : 'password'}
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

                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                        Não tem uma conta?
                    </Typography>
                    <Button 
                      component={Link} 
                      href="/cadastro" 
                      variant="outlined" 
                      fullWidth
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                    >
                      Cadastrar-se como Aluno
                    </Button>
                </Box>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

