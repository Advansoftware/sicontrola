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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';
import { Grid } from '@mui/material'; // Usando a nova API de Grid do MUI v7
import { 
  Assessment, 
  TrendingUp, 
  FileDownload, 
  LocalGasStation, 
  Build, 
  Warning,
  DirectionsCar
} from '@mui/icons-material';
import { BarChart, PieChart } from '@mui/x-charts';

export default function ReportsPage() {
  const theme = useTheme();

  return (
    <MainLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>
            Relatórios Consolidados
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Análise aprofundada de custos, eficiência e indicadores de desempenho da frota municipal.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<FileDownload />} 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'background.default',
            fontWeight: 700,
            borderRadius: 2,
            px: 3
          }}
        >
          Exportar PDF/Excel
        </Button>
      </Box>

      {/* Main Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 4, bgcolor: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05), borderRadius: 4 }}>
             <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Evolução de Custos (12 Meses)</Typography>
             <Box sx={{ height: 350, width: '100%' }}>
                <BarChart
                    series={[
                        { data: [5000, 4500, 6000, 5800, 7200, 6800, 8000, 7500, 8200, 9000, 8800, 9500], label: 'Combustível', color: '#00d2ff' },
                        { data: [2000, 2500, 1800, 3000, 4500, 2200, 3500, 4000, 3800, 5000, 4200, 4800], label: 'Manutenção', color: '#00ccb1' },
                    ]}
                    height={350}
                    xAxis={[{ data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], scaleType: 'band' }]}
                />
             </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ p: 4, bgcolor: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05), borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Gastos por Secretaria</Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: 45, label: 'Saúde', color: '#00ccb1' },
                                    { id: 1, value: 30, label: 'Educação', color: '#00d2ff' },
                                    { id: 2, value: 15, label: 'Obras', color: '#ff9800' },
                                    { id: 3, value: 10, label: 'Admin.', color: '#f44336' },
                                ],
                                innerRadius: 70,
                                paddingAngle: 3,
                                cornerRadius: 5,
                            },
                        ]}
                        width={300}
                        height={300}
                    />
                </Box>
            </Paper>
        </Grid>
      </Grid>

      {/* Table Summary */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 4, bgcolor: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05), borderRadius: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Resumo de Custos por Veículo (Top 5)</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800 }}>VEÍCULO</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>COMBUSTÍVEL (R$)</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>MANUTENÇÃO (R$)</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>TOTAL ACUMULADO</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>EFICIÊNCIA (KM/L)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: 1.5 }}>
                                                <DirectionsCar />
                                            </Avatar>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>BMW-32{i}1 (ABC-123{i})</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>R$ 1.200,00</TableCell>
                                    <TableCell>R$ 450,00</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>R$ 1.650,00</TableCell>
                                    <TableCell>12.4 km/L</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
}
