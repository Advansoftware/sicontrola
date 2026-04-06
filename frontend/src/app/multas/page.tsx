'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import { Grid } from '@mui/material'; // Usando a nova API de Grid do MUI v7
import { 
  Add, 
  Delete, 
  Warning, 
  Search, 
  Gavel,
  History,
  Payment,
  DirectionsCar
} from '@mui/icons-material';

interface Fine {
  id: string;
  vehicle: { placa: string; model: string };
  amount: number;
  description: string;
  date: string;
  status: string;
}

interface Vehicle {
  id: string;
  placa: string;
  model: string;
}

export default function FinesPage() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const [formData, setFormData] = useState({
    vehicleId: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'PENDENTE'
  });

  const fetchData = async () => {
    try {
      const [finesRes, vehRes] = await Promise.all([
        fetch('/api/fines'),
        fetch('/api/vehicles')
      ]);
      const [finesData, vehData] = await Promise.all([
        finesRes.json(),
        vehRes.json()
      ]);
      setFines(finesData);
      setVehicles(vehData);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      vehicleId: '',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      status: 'PENDENTE'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString()
      };
      const res = await fetch('/api/fines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        handleClose();
        fetchData();
      }
    } catch (err) {
      console.error('Erro ao salvar multa:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PAGO': return 'success';
      case 'PENDENTE': return 'warning';
      case 'CANCELADO': return 'error';
      default: return 'primary';
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>
            Gestão de Multas
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Controle de infrações de trânsito, processamento de pagamentos e histórico por veículo.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={handleOpen}
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'background.default',
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          Nova Multa
        </Button>
      </Box>

      {/* Stats Quick View */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, bgcolor: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05), borderRadius: 4 }}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="overline" color="textSecondary">Multas Pendentes</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'warning.main' }}>
                        {fines.filter(f => f.status === 'PENDENTE').length}
                    </Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40, opacity: 0.5 }} />
             </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, bgcolor: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05), borderRadius: 4 }}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="overline" color="textSecondary">Total em Débitos</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'error.main' }}>
                        R$ {fines.filter(f => f.status === 'PENDENTE').reduce((acc, f) => acc + f.amount, 0).toLocaleString('pt-BR')}
                    </Typography>
                </Box>
                <Gavel color="error" sx={{ fontSize: 40, opacity: 0.5 }} />
             </Box>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer 
        component={Paper} 
        sx={{ 
            bgcolor: alpha(theme.palette.background.paper, 0.4), 
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: alpha(theme.palette.common.white, 0.05),
            borderRadius: 4,
            overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>DATA</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>VEÍCULO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>DESCRIÇÃO / INFRAÇÃO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>VALOR</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }} align="right">AÇÕES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : fines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <Alert severity="info" variant="outlined" sx={{ border: 'none', display: 'inline-flex' }}>
                    Nenhuma multa processada no momento.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              fines.map((f) => (
                <TableRow key={f.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{new Date(f.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCar sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{f.vehicle?.placa}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{f.description}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    R$ {f.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={f.status} 
                      size="small" 
                      color={getStatusColor(f.status) as any} 
                      variant="outlined" 
                      sx={{ fontSize: 10, fontWeight: 800 }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Nova Multa */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
            sx: {
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.1)'
            }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.1)', mb: 2 }}>
          Lançar Nova Multa
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField fullWidth select label="Veículo Infrator" name="vehicleId" required value={formData.vehicleId} onChange={handleChange}>
                  {vehicles.map(v => <MenuItem key={v.id} value={v.id}>{v.placa} - {v.model}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Data da Infração" name="date" type="date" required value={formData.date} onChange={handleChange} slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Valor da Multa (R$)" name="amount" type="number" required value={formData.amount} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth select label="Status Inicial" name="status" value={formData.status} onChange={handleChange}>
                  <MenuItem value="PENDENTE">Pendente</MenuItem>
                  <MenuItem value="PAGO">Pago</MenuItem>
                  <MenuItem value="CANCELADO">Cancelado / Recurso</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth multiline rows={3} label="Descrição da Infração / Enquadramento" name="description" required value={formData.description} onChange={handleChange} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, px: 4 }}>Registrar Multa</Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainLayout>
  );
}
