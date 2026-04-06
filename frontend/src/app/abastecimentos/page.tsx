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
  LocalGasStation,
  Search,
  AttachMoney,
  History
} from '@mui/icons-material';

interface Refuel {
  id: string;
  vehicle: { placa: string; model: string };
  driver: { name: string };
  date: string;
  fuelType: string;
  liters: number;
  totalValue: number;
  currentKM: number;
  station: string;
}

interface Vehicle {
  id: string;
  placa: string;
  model: string;
}

interface Driver {
  id: string;
  name: string;
}

export default function RefuelsPage() {
  const [refuels, setRefuels] = useState<Refuel[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    date: new Date().toISOString().split('T')[0],
    fuelType: 'GASOLINA_COMUM',
    liters: 0,
    totalValue: 0,
    currentKM: 0,
    station: ''
  });

  const fetchData = async () => {
    try {
      const [refRes, vehRes, driRes] = await Promise.all([
        fetch('/api/refuels'),
        fetch('/api/vehicles'),
        fetch('/api/drivers')
      ]);
      const [refData, vehData, driData] = await Promise.all([
        refRes.json(),
        vehRes.json(),
        driRes.json()
      ]);
      setRefuels(refData);
      setVehicles(vehData);
      setDrivers(driData);
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
      driverId: '',
      date: new Date().toISOString().split('T')[0],
      fuelType: 'GASOLINA_COMUM',
      liters: 0,
      totalValue: 0,
      currentKM: 0,
      station: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'liters' || name === 'totalValue' || name === 'currentKM') ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString()
      };
      const res = await fetch('/api/refuels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        handleClose();
        fetchData();
      }
    } catch (err) {
      console.error('Erro ao salvar abastecimento:', err);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>
            Gestão de Abastecimentos
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Registro detalhado de consumo, controle de quilometragem e gastos da frota.
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
          Novo Abastecimento
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
                    <Typography variant="overline" color="textSecondary">Total Litros</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800 }}>842.5</Typography>
                </Box>
                <LocalGasStation color="primary" sx={{ fontSize: 40, opacity: 0.5 }} />
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
                    <Typography variant="overline" color="textSecondary">Investimento Total</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#00ccb1' }}>R$ 4.291</Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, opacity: 0.5, color: '#00ccb1' }} />
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
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>MOTORISTA</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>LITROS</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>VALOR TOTAL</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>COMBUSTÍVEL</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>KM ATUAL</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }} align="right">AÇÕES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : refuels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                  <Alert severity="info" variant="outlined" sx={{ border: 'none', display: 'inline-flex' }}>
                    Nenhum abastecimento registrado.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              refuels.map((r) => (
                <TableRow key={r.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{new Date(r.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{r.vehicle?.placa}</Typography>
                    <Typography variant="caption" color="textSecondary">{r.vehicle?.model}</Typography>
                  </TableCell>
                  <TableCell>{r.driver?.name}</TableCell>
                  <TableCell>{r.liters}L</TableCell>
                  <TableCell sx={{ color: '#00ccb1', fontWeight: 700 }}>
                    R$ {r.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                     <Chip label={r.fuelType.replace('_', ' ')} size="small" variant="outlined" color="primary" sx={{ fontSize: 10, fontWeight: 700 }} />
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{r.currentKM} km</TableCell>
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

      {/* Modal Novo Abastecimento */}
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
          Registrar Abastecimento
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth select label="Veículo" name="vehicleId" required value={formData.vehicleId} onChange={handleChange}>
                  {vehicles.map(v => <MenuItem key={v.id} value={v.id}>{v.placa} - {v.model}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth select label="Motorista" name="driverId" required value={formData.driverId} onChange={handleChange}>
                  {drivers.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Data" name="date" type="date" required value={formData.date} onChange={handleChange} slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Posto / Estabelecimento" name="station" required value={formData.station} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth select label="Tipo de Combustível" name="fuelType" required value={formData.fuelType} onChange={handleChange}>
                  <MenuItem value="GASOLINA_COMUM">Gasolina Comum</MenuItem>
                  <MenuItem value="GASOLINA_ADITIVADA">Gasolina Aditivada</MenuItem>
                  <MenuItem value="DIESEL_COMUM">Diesel Comum</MenuItem>
                  <MenuItem value="DIESEL_S10">Diesel S10</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Litros" name="liters" type="number" required value={formData.liters} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Valor Total (R$)" name="totalValue" type="number" required value={formData.totalValue} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="KM Atual" name="currentKM" type="number" required value={formData.currentKM} onChange={handleChange} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, px: 4 }}>Confirmar Registro</Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainLayout>
  );
}
