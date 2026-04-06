'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Box, 
  Typography, 
  Paper, 
  alpha,
  useTheme,
  Button,
  Avatar,
  Divider,
  LinearProgress
} from '@mui/material';
import { Grid } from '@mui/material'; // Usando a nova API de Grid do MUI v7
import { 
  DirectionsCar, 
  LocalGasStation, 
  Engineering, 
  TrendingUp,
  Warning,
  CheckCircle,
  AccountBalanceWallet
} from '@mui/icons-material';
import { BarChart, PieChart } from '@mui/x-charts';

export default function DashboardPage() {
  const theme = useTheme();

  const kpis = [
    { title: 'Veículos Ativos', value: '124', icon: <DirectionsCar />, color: theme.palette.primary.main, trend: 'Total', secondaryIcon: <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} /> },
    { title: 'Manut. em Andamento', value: '18', icon: <Engineering />, color: '#ff9800', trend: 'OS Abertas', secondaryIcon: <Warning sx={{ fontSize: 14, color: 'warning.main' }} /> },
    { title: 'Abast. no Mês', value: '342', icon: <LocalGasStation />, color: '#00ccb1', trend: 'Registros', secondaryIcon: <TrendingUp sx={{ fontSize: 14, color: 'success.main' }} /> },
    { title: 'Multas Pendentes', value: '8', icon: <Warning />, color: '#f44336', trend: 'Ações Nec.', secondaryIcon: <TrendingUp sx={{ fontSize: 14, color: 'error.main' }} /> },
  ];

  return (
    <MainLayout>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1, mb: 1, color: 'primary.main' }}>
          Dashboard Executivo
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Visão geral do desempenho e custos da frota municipal em tempo real.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {kpis.map((kpi, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: alpha(theme.palette.common.white, 0.05),
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', bgcolor: alpha(theme.palette.background.paper, 0.6) }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: 42, 
                        height: 42, 
                        borderRadius: 2, 
                        bgcolor: alpha(kpi.color, 0.1),
                        color: kpi.color,
                        boxShadow: `0 8px 20px ${alpha(kpi.color, 0.15)}`
                    }}
                >
                  {kpi.icon}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                   <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>{kpi.trend}</Typography>
                   {kpi.secondaryIcon}
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>{kpi.value}</Typography>
              <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 700, letterSpacing: 1 }}>{kpi.title}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper 
            sx={{ 
                p: 4, 
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: alpha(theme.palette.common.white, 0.05),
                borderRadius: 4,
                height: '100%',
                minHeight: 400
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
               <Typography variant="h6" sx={{ fontWeight: 700 }}>Consumo de Combustível (Mensal)</Typography>
               <Button size="small" sx={{ fontWeight: 700 }}>Ver Relatório</Button>
            </Box>
            <Box sx={{ height: 300, width: '100%' }}>
                <BarChart
                    series={[
                        { data: [4000, 3000, 2000, 2780, 1890, 2390, 3490], label: 'Gasolina Comum', color: '#00d2ff' },
                        { data: [2400, 1398, 9800, 3908, 4800, 3800, 4300], label: 'Diesel S10', color: '#00ccb1' },
                    ]}
                    height={300}
                    xAxis={[{ data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'], scaleType: 'band' }]}
                />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper 
            sx={{ 
                p: 4, 
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: alpha(theme.palette.common.white, 0.05),
                borderRadius: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
          >
             <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Status da Frota</Typography>
             <Box sx={{ height: 250, width: '100%', display: 'flex', justifyContent: 'center' }}>
                <PieChart
                    series={[
                        {
                        data: [
                            { id: 0, value: 85, label: 'Em Uso', color: theme.palette.primary.main },
                            { id: 1, value: 15, label: 'Manut.', color: '#ff9800' },
                            { id: 2, value: 5, label: 'Inativo', color: '#f44336' },
                        ],
                        innerRadius: 80,
                        paddingAngle: 5,
                        cornerRadius: 10,
                        },
                    ]}
                    width={250}
                    height={250}
                    slotProps={{ 
                        legend: { 
                            position: { vertical: 'bottom', horizontal: 'center' }, 
                        } 
                    }}
                />
             </Box>
             <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">Disponibilidade</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>92%</Typography>
                 </Box>
                 <LinearProgress variant="determinate" value={92} sx={{ height: 6, borderRadius: 3 }} />
             </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Notifications / Alerts Row */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper 
            sx={{ 
                p: 4, 
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: alpha(theme.palette.common.white, 0.05),
                borderRadius: 4
            }}
          >
             <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Alertas Críticos</Typography>
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[1, 2, 3].map((item) => (
                    <Box key={item} sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.common.white, 0.02), display: 'flex', alignItems: 'center', gap: 3, borderLeft: '4px solid', borderLeftColor: item === 1 ? '#f44336' : '#ff9800' }}>
                        <Avatar sx={{ bgcolor: alpha(item === 1 ? '#f44336' : '#ff9800', 0.1), color: item === 1 ? '#f44336' : '#ff9800' }}>
                            {item === 1 ? <Warning /> : <Engineering />}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {item === 1 ? 'Vencimento CNH: João Silva (Categoria D)' : 'Revisão Necessária: VW Gol G8 (ABC-1234)'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">Há 2 horas • Departamento de Saúde</Typography>
                        </Box>
                        <Button size="small" variant="outlined" color="inherit">Resolver</Button>
                    </Box>
                ))}
             </Box>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
}
