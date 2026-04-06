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
  LinearProgress
} from '@mui/material';
import { Grid } from '@mui/material'; // Usando a nova API de Grid do MUI v7
import { 
  Add, 
  Edit, 
  Delete, 
  Settings,
  Search,
  Inventory,
  Warning,
  TrendingUp,
  Storefront
} from '@mui/icons-material';

interface Part {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unitValue: number;
  provider: string;
}

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    category: 'MECANICA',
    stock: 0,
    minStock: 5,
    unitValue: 0,
    provider: ''
  });

  const fetchParts = async () => {
    try {
      const res = await fetch('/api/parts');
      const data = await res.json();
      setParts(data);
    } catch (err) {
      console.error('Erro ao buscar peças:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', category: 'MECANICA', stock: 0, minStock: 5, unitValue: 0, provider: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'stock' || name === 'minStock' || name === 'unitValue') ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        handleClose();
        fetchParts();
      }
    } catch (err) {
      console.error('Erro ao salvar peça:', err);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>
            Gestão de Peças e Peças
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Controle de inventário, estoque mínimo e suprimentos técnicos para a manutenção da frota.
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
          Nova Peça
        </Button>
      </Box>

      {/* Stats row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
             <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05), borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="overline" color="textSecondary">Itens em Estoque</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>{parts.reduce((acc, p) => acc + p.stock, 0)}</Typography>
                    </Box>
                    <Inventory color="primary" />
                </Box>
             </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
             <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05), borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="overline" color="textSecondary">Abaixo do Mínimo</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main' }}>
                            {parts.filter(p => p.stock < p.minStock).length}
                        </Typography>
                    </Box>
                    <Warning color="error" />
                </Box>
             </Paper>
        </Grid>
      </Grid>

      {/* Search and Table */}
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
                placeholder="Buscar por nome da peça, categoria ou fornecedor..." 
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
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>PEÇA / DESCRIÇÃO</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>CATEGORIA</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>ESTOQUE</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>VALOR UNIT.</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>FORNECEDOR</TableCell>
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
            ) : parts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <Alert severity="info" variant="outlined" sx={{ border: 'none', display: 'inline-flex' }}>
                    Nenhuma peça cadastrada no inventário.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              parts.map((p) => {
                const stockHealth = (p.stock / (p.minStock * 2)) * 100;
                const isCritical = p.stock < p.minStock;
                return (
                  <TableRow key={p.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1.5 }}>
                              <Settings sx={{ color: 'primary.main', fontSize: 20 }} />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={p.category} size="small" variant="outlined" sx={{ fontSize: 10, fontWeight: 700 }} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 150 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: isCritical ? 'error.main' : 'inherit' }}>
                              {p.stock} un
                          </Typography>
                          <Typography variant="caption" color="textSecondary">/ min {p.minStock}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(stockHealth, 100)} 
                        color={isCritical ? 'error' : 'primary'}
                        sx={{ height: 4, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                      R$ {p.unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Storefront sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">{p.provider || 'Interno'}</Typography>
                       </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton size="small" color="primary"><Edit fontSize="small" /></IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Nova Peça */}
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
          Cadastrar Peça / Insumo
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField fullWidth label="Nome da Peça" name="name" required value={formData.name} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth select label="Categoria" name="category" value={formData.category} onChange={handleChange}>
                  <MenuItem value="MECANICA">Mecânica</MenuItem>
                  <MenuItem value="ELETRICA">Elétrica</MenuItem>
                  <MenuItem value="PNEUMATICA">Pneus / Rodagem</MenuItem>
                  <MenuItem value="LUBRIFICANTES">Óleos / Fluidos</MenuItem>
                  <MenuItem value="ESTETICA">Estética / Limpeza</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Estoque Atual" name="stock" type="number" required value={formData.stock} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Estoque Mínimo" name="minStock" type="number" required value={formData.minStock} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Valor Unitário (R$)" name="unitValue" type="number" required value={formData.unitValue} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Fornecedor Principal" name="provider" value={formData.provider} onChange={handleChange} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, px: 4 }}>Salvar Peça</Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainLayout>
  );
}
