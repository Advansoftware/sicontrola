'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Box, 
  Typography, 
  Paper, 
  alpha,
  useTheme,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Avatar,
  TextField,
  CircularProgress
} from '@mui/material';
import { Grid } from '@mui/material'; 
import { 
  Notifications, 
  Security, 
} from '@mui/icons-material';
import { authClient } from '@/lib/auth-client';

interface ExtendedUser {
  role?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function SettingsPage() {

  const theme = useTheme();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>
          Configurações do Sistema
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Gerencie suas preferências de conta, notificações e parâmetros globais do Sicontrola.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid size={{ xs: 12, md: 4 }}>
           <Paper sx={{ p: 4, bgcolor: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05), borderRadius: 4, textAlign: 'center' }}>
              <Avatar 
                src={session?.user?.image || undefined} 
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '4px solid', borderColor: 'primary.main', bgcolor: 'primary.main', fontSize: 40 }} 
              >
                {session?.user?.name?.[0]}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{session?.user?.name || 'Usuário'}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                {(session?.user as ExtendedUser)?.role || 'Acesso Estudantil'}
              </Typography>

              <Button variant="outlined" fullWidth sx={{ fontWeight: 700 }}>Alterar Foto</Button>
           </Paper>
        </Grid>

        {/* Settings Form */}
        <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 4, bgcolor: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05), borderRadius: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Notifications color="primary" fontSize="small" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Notificações</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControlLabel control={<Switch defaultChecked />} label="Alertas de Sistema" />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                             <FormControlLabel control={<Switch defaultChecked />} label="Avisos por E-mail" />
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 4, opacity: 0.1 }} />

                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Security color="primary" fontSize="small" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Segurança</Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth type="password" label="Senha Atual" size="small" variant="filled" />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth type="password" label="Nova Senha" size="small" variant="filled" />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button color="inherit" sx={{ fontWeight: 700 }}>Descartar</Button>
                    <Button variant="contained" sx={{ fontWeight: 700, px: 4 }}>Salvar Alterações</Button>
                </Box>
            </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
}
