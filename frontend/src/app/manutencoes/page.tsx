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
  Build, 
  Search, 
  Engineering,
  History,
  Timer,
  Assignment
} from '@mui/icons-material';

interface Maintenance {
  id: string;
  vehicle: { placa: string; model: string };
  type: string;
  partValue: number;
  partType: string;
  date: string;
  time: string;
  technician: string;
  description: string;
}

interface Vehicle {
  id: string;
  placa: string;
  model: string;
}

export default function MaintenancesPage() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'PREVENTIVA',
    partValue: 0,
    partType: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    technician: '',
    description: ''
  });

  const fetchData = async () => {
    try {
      const [maintRes, vehRes] = await Promise.all([
        fetch('/api/maintenances'),
        fetch('/api/vehicles')
      ]);
      const [maintData, vehData] = await Promise.all([
        maintRes.json(),
        vehRes.json()
      ]);
      setMaintenances(maintData);
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
      type: 'PREVENTIVA',
      partValue: 0,
      partType: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      technician: '',
      description: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'partValue' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString()
      };
      const res = await fetch('/api/maintenances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        handleClose();
        fetchData();
      }
    } catch (err) {
      console.error('Erro ao salvar manutenção:', err);
    }
  };

  const getMaintColor = (type: string) => {
    switch(type) {
      case 'CORRETIVA': return 'error';
      case 'PREVENTIVA': return 'success';
      case 'PREDITIVA': return 'info';
      case 'PRESCRITIVA': return 'warning';
      case 'DETECTIVA': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>
            Gestão de Manutenções
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Controle técnico de ordens de serviço, troca de peças e revisões preventivas da frota.
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
          Nova Manutenção
        </Button>
      </Box>

      {/* Stats Quick View */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
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
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="overline" color="textSecondary">OS Ativas</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800 }}>12</Typography>
                </Box>
                <Assignment color="primary" sx={{ fontSize: 40, opacity: 0.5 }} />
             </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
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
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="overline" color="textSecondary">Gastos Técnicos</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>R$ 15.340</Typography>
                </Box>
                <Build color="primary" sx={{ fontSize: 40, opacity: 0.5 }} />
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
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>DATA / HORA</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>VEÍCULO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>TIPO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>TÉCNICO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>PEÇA / SERVIÇO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>VALOR</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }} align="right">AÇÕES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : maintenances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                  <Alert severity="info" variant="outlined" sx={{ border: 'none', display: 'inline-flex' }}>
                    Nenhuma manutenção registrada no sistema.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              maintenances.map((m) => (
                <TableRow key={m.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{new Date(m.date).toLocaleDateString('pt-BR')}</Typography>
                    <Typography variant="caption" color="textSecondary"><Timer fontSize="inherit" /> {m.time}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{m.vehicle?.placa}</Typography>
                    <Typography variant="caption" color="textSecondary">{m.vehicle?.model}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={m.type} 
                      size="small" 
                      color={getMaintColor(m.type) as any} 
                      variant="outlined" 
                      sx={{ fontSize: 10, fontWeight: 800 }} 
                    />
                  </TableCell>
                  <TableCell>{m.technician}</TableCell>
                  <TableCell>{m.partType}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    R$ {m.partValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

      {/* Modal Nova Manutenção */}
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
          Lançar Ordem de Serviço
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField fullWidth select label="Veículo" name="vehicleId" required value={formData.vehicleId} onChange={handleChange}>
                  {vehicles.map(v => <MenuItem key={v.id} value={v.id}>{v.placa} - {v.model}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth select label="Tipo de Manutenção" name="type" required value={formData.type} onChange={handleChange}>
                  <MenuItem value="CORRETIVA">Manutenção Corretiva</MenuItem>
                  <MenuItem value="PREVENTIVA">Manutenção Preventiva</MenuItem>
                  <MenuItem value="PREDITIVA">Manutenção Preditiva</MenuItem>
                  <MenuItem value="PRESCRITIVA">Manutenção Prescritiva</MenuItem>
                  <MenuItem value="DETECTIVA">Manutenção Detectiva</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Data" name="date" type="date" required value={formData.date} onChange={handleChange} slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField fullWidth label="Hora" name="time" type="time" required value={formData.time} onChange={handleChange} slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Técnico Responsável" name="technician" required value={formData.technician} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Peça / Serviço Aplicado" name="partType" required value={formData.partType} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Valor Total (R$)" name="partValue" type="number" required value={formData.partValue} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth multiline rows={3} label="Descrição Técnica / Notas" name="description" value={formData.description} onChange={handleChange} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, px: 4 }}>Abrir O.S.</Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainLayout>
  );
}
