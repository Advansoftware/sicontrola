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
  useTheme,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Grid } from '@mui/material'; // Usando a nova API de Grid do MUI v7
import { 
  Add, 
  Delete, 
  Event, 
  Search, 
  Today,
  Schedule,
  CheckCircle,
  RadioButtonUnchecked,
  DirectionsCar
} from '@mui/icons-material';

interface Revision {
  id: string;
  vehicle: { placa: string; model: string };
  description: string;
  scheduledDate: string;
  completed: boolean;
}

interface Vehicle {
  id: string;
  placa: string;
  model: string;
}

export default function RevisionsPage() {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const [formData, setFormData] = useState({
    vehicleId: '',
    description: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    completed: false
  });

  const fetchData = async () => {
    try {
      const [revRes, vehRes] = await Promise.all([
        fetch('/api/revisions'),
        fetch('/api/vehicles')
      ]);
      const [revData, vehData] = await Promise.all([
        revRes.json(),
        vehRes.json()
      ]);
      setRevisions(revData);
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
      description: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      completed: false
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        scheduledDate: new Date(formData.scheduledDate).toISOString()
      };
      const res = await fetch('/api/revisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        handleClose();
        fetchData();
      }
    } catch (err) {
      console.error('Erro ao salvar revisão:', err);
    }
  };

  const toggleComplete = async (id: string, current: boolean) => {
      try {
          await fetch(`/api/revisions/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ completed: !current })
          });
          fetchData();
      } catch (err) {
          console.error('Erro ao atualizar revisão:', err);
      }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>
            Revisões Periódicas
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Agendamento de manutenções preventivas e controle de revisões obrigatórias por quilometragem.
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
          Agendar Revisão
        </Button>
      </Box>

      {/* Stats Quick View */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, bgcolor: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05), borderRadius: 4 }}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="overline" color="textSecondary">Próximas 7 Dias</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800 }}>
                        {revisions.filter(r => !r.completed).length}
                    </Typography>
                </Box>
                <Today color="primary" sx={{ fontSize: 40, opacity: 0.5 }} />
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
              <TableCell sx={{ fontWeight: 800, color: 'primary.main', width: 60 }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>DATA AGENDADA</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>VEÍCULO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>DESCRIÇÃO DO SERVIÇO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }} align="right">AÇÕES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : revisions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Alert severity="info" variant="outlined" sx={{ border: 'none', display: 'inline-flex' }}>
                    Nenhuma revisão agendada no cronograma.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              revisions.map((r) => (
                <TableRow key={r.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, opacity: r.completed ? 0.6 : 1 }}>
                  <TableCell>
                    <IconButton size="small" onClick={() => toggleComplete(r.id, r.completed)}>
                        {r.completed ? <CheckCircle color="success" /> : <RadioButtonUnchecked />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{new Date(r.scheduledDate).toLocaleDateString('pt-BR')}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCar sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{r.vehicle?.placa}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                      <Typography variant="body2" sx={{ textDecoration: r.completed ? 'line-through' : 'none' }}>
                        {r.description}
                      </Typography>
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

      {/* Modal Nova Revisão */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
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
          Agendar Revisão Preventiva
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth select label="Veículo" name="vehicleId" required value={formData.vehicleId} onChange={handleChange}>
                  {vehicles.map(v => <MenuItem key={v.id} value={v.id}>{v.placa} - {v.model}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Data Agendada" name="scheduledDate" type="date" required value={formData.scheduledDate} onChange={handleChange} slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth multiline rows={3} label="Descrição dos Serviços a Realizar" name="description" required value={formData.description} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                 <FormControlLabel 
                    control={<Checkbox name="completed" checked={formData.completed} onChange={handleChange as any} />} 
                    label="Marcar como já concluída" 
                 />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, px: 4 }}>Confirmar Agendamento</Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainLayout>
  );
}
