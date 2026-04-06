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
  Avatar,
  alpha,
  useTheme
} from '@mui/material';
import { Grid } from '@mui/material'; // Usando a nova API de Grid do MUI v7
import { 
  Add, 
  Edit, 
  Delete, 
  DirectionsCar,
  Search,
  FilterAlt
} from '@mui/icons-material';

interface Vehicle {
  id: string;
  chassi: string;
  renavam: string;
  placa: string;
  make: string;
  model: string;
  year: number;
  color: string;
  type: string;
  fuelType: string;
  department: string;
  currentKM: number;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    chassi: '',
    renavam: '',
    placa: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    type: 'CARRO',
    fuelType: 'GASOLINA_COMUM',
    department: 'GASTRONOMIA',
    currentKM: 0
  });

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles');
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error('Erro ao buscar veículos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      chassi: '',
      renavam: '',
      placa: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      type: 'CARRO',
      fuelType: 'GASOLINA_COMUM',
      department: 'ADMINISTRACAO',
      currentKM: 0
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'year' || name === 'currentKM') ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        handleClose();
        fetchVehicles();
      }
    } catch (err) {
      console.error('Erro ao salvar veículo:', err);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>
            Gestão de Veículos
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Controle completo da frota municipal, departamentos e quilometragem.
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
          Novo Veículo
        </Button>
      </Box>

      {/* Filter Bar */}
      <Paper 
        sx={{ 
          p: 2, 
          mb: 4, 
          bgcolor: alpha(theme.palette.background.paper, 0.4), 
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: alpha(theme.palette.common.white, 0.05),
          borderRadius: 3,
          display: 'flex',
          gap: 2,
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, bgcolor: alpha(theme.palette.common.white, 0.03), px: 2, py: 1, borderRadius: 2 }}>
            <Search fontSize="small" sx={{ color: 'text.secondary' }} />
            <TextField 
                variant="standard" 
                placeholder="Buscar por placa, renavam, modelo ou secretaria..." 
                fullWidth
                slotProps={{ input: { disableUnderline: true } }}
            />
        </Box>
        <Button variant="outlined" color="inherit" startIcon={<FilterAlt />} sx={{ borderRadius: 2 }}>Filtros</Button>
      </Paper>

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
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>VEÍCULO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>PLACA</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>TIPO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>COMBUSTÍVEL</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>DEPARTAMENTO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>KM ATUAL</TableCell>
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
            ) : vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                  <Alert severity="info" variant="outlined" sx={{ border: 'none', display: 'inline-flex' }}>
                    Nenhum veículo cadastrado na frota.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((v) => (
                <TableRow key={v.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: 2 }}>
                            <DirectionsCar />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{v.make} {v.model}</Typography>
                            <Typography variant="caption" color="textSecondary">{v.year} • {v.color}</Typography>
                        </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{v.placa}</TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ px: 1, py: 0.5, bgcolor: alpha(theme.palette.common.white, 0.05), borderRadius: 1 }}>{v.type}</Typography>
                  </TableCell>
                  <TableCell>{v.fuelType}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{v.department}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{v.currentKM.toLocaleString('pt-BR')} km</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary"><Edit fontSize="small" /></IconButton>
                    </Tooltip>
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

      {/* Modal Novo Veículo */}
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
          Cadastrar Novo Veículo
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Chassi" name="chassi" required value={formData.chassi} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Renavam" name="renavam" required value={formData.renavam} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Placa" name="placa" required value={formData.placa} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Marca" name="make" required value={formData.make} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Modelo" name="model" required value={formData.model} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Cor" name="color" required value={formData.color} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Ano" name="year" type="number" required value={formData.year} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="KM Atual" name="currentKM" type="number" required value={formData.currentKM} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth select label="Tipo" name="type" value={formData.type} onChange={handleChange}>
                  <MenuItem value="CARRO">Carro</MenuItem>
                  <MenuItem value="ONIBUS">Ônibus</MenuItem>
                  <MenuItem value="CAMINHAO">Caminhão</MenuItem>
                  <MenuItem value="MAQUINA">Máquina</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth select label="Combustível" name="fuelType" value={formData.fuelType} onChange={handleChange}>
                  <MenuItem value="GASOLINA_COMUM">Gasolina comum.</MenuItem>
                  <MenuItem value="GASOLINA_ADITIVADA">Gasolina Aditivada.</MenuItem>
                  <MenuItem value="DIESEL_COMUM">Diesel comum.</MenuItem>
                  <MenuItem value="DIESEL_S10">Diesel S10.</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth select label="Secretaria Responsável" name="department" value={formData.department} onChange={handleChange}>
                  <MenuItem value="EDUCACAO">Educação</MenuItem>
                  <MenuItem value="SAUDE">Saúde</MenuItem>
                  <MenuItem value="ADMINISTRACAO">Administração</MenuItem>
                  <MenuItem value="GOVERNO">Governo</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, px: 4 }}>Confirmar Cadastro</Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainLayout>
  );
}
