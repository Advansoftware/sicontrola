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
  TextField
} from '@mui/material';
import { Grid } from '@mui/material'; // Usando a nova API de Grid do MUI v7
import { 
  Settings, 
  Notifications, 
  Security, 
  Palette, 
  VpnKey,
  Translate,
  CloudDone
} from '@mui/icons-material';

export default function SettingsPage() {
  const theme = useTheme();

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
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bruno" 
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '4px solid', borderColor: 'primary.main' }} 
              />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Bruno Oliveira</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>Administrador de Frota</Typography>
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
                            <FormControlLabel control={<Switch defaultChecked />} label="Alertas de Vencimento de CNH" />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                             <FormControlLabel control={<Switch defaultChecked />} label="Avisos de Manutenção Preventiva" />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                             <FormControlLabel control={<Switch defaultChecked />} label="Relatórios Semanais por E-mail" />
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
                            <TextField fullWidth type="password" label="Senha Atual" size="small" />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth type="password" label="Nova Senha" size="small" />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button color="inherit" sx={{ fontWeight: 700 }}>Descartar Alterações</Button>
                    <Button variant="contained" sx={{ fontWeight: 700, px: 4 }}>Salvar Configurações</Button>
                </Box>
            </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
}
