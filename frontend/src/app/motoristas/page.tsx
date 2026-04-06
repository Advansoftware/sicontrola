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
  Person,
  Search,
  Badge,
  Phone
} from '@mui/icons-material';

interface Driver {
  id: string;
  name: string;
  cnh: string;
  category: string;
  validity: string;
  phone: string;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    cnh: '',
    category: 'B',
    validity: '',
    phone: ''
  });

  const fetchDrivers = async () => {
    try {
      const res = await fetch('/api/drivers');
      const data = await res.json();
      setDrivers(data);
    } catch (err) {
      console.error('Erro ao buscar motoristas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', cnh: '', category: 'B', validity: '', phone: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        validity: new Date(formData.validity).toISOString()
      };
      const res = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        handleClose();
        fetchDrivers();
      }
    } catch (err) {
      console.error('Erro ao salvar motorista:', err);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>
            Gestão de Motoristas
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Controle de condutores autorizados, vencimentos de CNH e telefones de contato.
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
          Novo Motorista
        </Button>
      </Box>

      {/* Search Bar */}
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
                placeholder="Buscar por nome, CNH ou categoria..." 
                fullWidth
                slotProps={{ input: { disableUnderline: true } }}
            />
        </Box>
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
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>MOTORISTA</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>CNH</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>CATEGORIA</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>VENCIMENTO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>TELEFONE</TableCell>
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
            ) : drivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <Alert severity="info" variant="outlined" sx={{ border: 'none', display: 'inline-flex' }}>
                    Nenhum motorista cadastrado.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((d) => {
                const isExpired = new Date(d.validity) < new Date();
                return (
                  <TableRow key={d.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: 2 }}>
                              <Person />
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{d.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{d.cnh}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'inline-flex', px: 1.5, py: 0.5, bgcolor: 'primary.main', color: 'background.default', borderRadius: 1, fontWeight: 800, fontSize: 12 }}>
                        {d.category}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                            fontWeight: 700, 
                            color: isExpired ? theme.palette.error.main : 'inherit' 
                        }}
                      >
                        {new Date(d.validity).toLocaleDateString('pt-BR')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">{d.phone || '---'}</Typography>
                        </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton size="small" color="primary"><Edit fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Novo Motorista */}
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
          Cadastrar Novo Motorista
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Nome Completo" name="name" required value={formData.name} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField fullWidth label="Número da CNH" name="cnh" required value={formData.cnh} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth select label="Categoria" name="category" value={formData.category} onChange={handleChange}>
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="AB">AB</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                  <MenuItem value="D">D</MenuItem>
                  <MenuItem value="E">E</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField 
                  fullWidth 
                  label="Vencimento da CNH" 
                  name="validity" 
                  type="date" 
                  required 
                  value={formData.validity} 
                  onChange={handleChange}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Telefone / Contato" name="phone" value={formData.phone} onChange={handleChange} />
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
