'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Avatar, 
  Chip, 
  Button, 
  Divider,
  alpha,
  useTheme,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert
} from '@mui/material';

import { 
  School, 
  CreditCard, 
  CloudUpload, 
  QrCode, 
  Update,
  CheckCircle,
  Error as ErrorIcon,
  DirectionsBus,
  CalendarToday
} from '@mui/icons-material';
import { authClient } from '@/lib/auth-client';
import { QRCodeSVG } from 'qrcode.react';

export default function StudentDashboard() {
  const { data: session } = authClient.useSession();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/students/me`, {
           headers: {
             // In dev it uses cookies, in complex setup we might need more
           }
        });
        if (res.ok) {
          setStudent(await res.json());
        }
      } catch (e) {
        console.error('Error fetching student data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROVADO': return 'success';
      case 'PENDENTE': return 'warning';
      case 'EM_ANALISE': return 'info';
      case 'REPROVADO': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1 }}>
          Olá, {session?.user?.name?.split(' ')[0]} 👋
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bem-vindo ao seu painel de transporte estudantil.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Carteirinha Digital */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper 
            sx={{ 
              p: 0, 
              borderRadius: 5, 
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 1)} 0%, ${alpha(theme.palette.primary.dark, 1)} 100%)`,
              boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
              position: 'relative'
            }}
          >
            {/* Design da Carteirinha */}
            <Box sx={{ p: 4, color: 'white' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>SICONTROLA</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>TRANSPORTE ESTUDANTIL</Typography>
                </Box>
                <DirectionsBus sx={{ fontSize: 32, opacity: 0.5 }} />
              </Box>

              <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                <Avatar 
                  src={session?.user?.image || undefined}
                  sx={{ width: 80, height: 80, borderRadius: 2, border: '2px solid rgba(255,255,255,0.2)' }}
                >
                  {session?.user?.name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{session?.user?.name}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>CPF: {student?.cpf}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>{student?.school?.name || 'Escola não informada'}</Typography>
                </Box>
              </Box>

              <Box 
                sx={{ 
                  bgcolor: 'white', 
                  p: 2, 
                  borderRadius: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {student?.status === 'APROVADO' ? (
                  <>
                    <QRCodeSVG 
                        value={student?.qrCode || student?.id} 
                        size={150} 
                        level="H"
                        includeMargin={false}
                    />
                    <Typography variant="caption" color="black" sx={{ fontWeight: 600, mt: 1 }}>
                        QR CODE PARA EMBARQUE
                    </Typography>
                  </>
                ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <QrCode sx={{ fontSize: 60, color: alpha(theme.palette.common.black, 0.1), mb: 2 }} />
                    <Typography variant="body2" color="black" sx={{ fontWeight: 700 }}>
                      AGUARDANDO APROVAÇÃO
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            
            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.common.black, 0.2), textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                VALIDEZ: DEZEMBRO / 2026
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Status e Info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={3}>
            {/* Status Card */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05) }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Status do Cadastro</Typography>
                    <Chip 
                        label={student?.status} 
                        color={getStatusColor(student?.status)} 
                        sx={{ fontWeight: 700 }}
                    />
                </Box>
                <Typography variant="body2" color="textSecondary">
                    {student?.status === 'APROVADO' 
                        ? 'Sua carteirinha está ativa e o QR Code pronto para uso.' 
                        : 'Seu cadastro está sendo analisado pela secretaria. Aguarde a confirmação.'}
                </Typography>
                {student?.rejectionReason && (
                   <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                     Motivo: {student.rejectionReason}
                   </Alert>
                )}
              </Paper>
            </Grid>

            {/* Documentos Status */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 4, height: '100%', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CloudUpload color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Documentos</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{student?.documents?.length || 0} / 4</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Documentos enviados</Typography>
                <Button variant="outlined" size="small" fullWidth sx={{ borderRadius: 2 }}>
                  Enviar Arquivos
                </Button>
              </Paper>
            </Grid>

            {/* Plano Status */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 4, height: '100%', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CreditCard color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Meu Plano</Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {student?.plan?.name || 'Nenhum plano'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    R$ {student?.plan?.price || 0} / mês
                </Typography>
                <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'success.main', fontWeight: 600 }}>
                    PAGAMENTO EM DIA
                </Typography>
              </Paper>
            </Grid>

            {/* Histórico Recente */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05) }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Uso Recente</Typography>
                <List disablePadding>
                  {student?.usage?.length > 0 ? (
                    student.usage.map((u: any, idx: number) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <ListItemIcon><Update /></ListItemIcon>
                        <ListItemText 
                          primary="Viagem Realizada" 
                          secondary={new Date(u.date).toLocaleString()} 
                        />
                        <ListItemText 
                          primary="Motorista" 
                          secondary={u.driver?.user?.name} 
                          sx={{ textAlign: 'right' }} 
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">Nenhum registro de uso encontrado.</Typography>
                  )}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
