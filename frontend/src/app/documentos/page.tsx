'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tooltip,
  Chip
} from '@mui/material';
import { Grid } from '@mui/material'; // Usando a nova API de Grid do MUI v7
import { 
  Description, 
  CloudUpload, 
  Delete, 
  Visibility, 
  FilePresent, 
  PictureAsPdf, 
  Search,
  CheckCircle,
  Warning
} from '@mui/icons-material';

export default function DocumentsPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const docs = [
    { id: 1, name: 'CRLV-2024-ABC1234.pdf', type: 'CRLV', vehicle: 'ABC-1234', status: 'VÁLIDO', expiry: '2025-05-20' },
    { id: 2, name: 'CNH-Motorista-Silva.pdf', type: 'CNH', driver: 'João Silva', status: 'VENCENDO', expiry: '2024-04-15' },
    { id: 3, name: 'Seguro-Frota-Apólice.pdf', type: 'SEGURO', status: 'VÁLIDO', expiry: '2025-01-10' },
  ];

  return (
    <MainLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>
            Gestão Documental (GED)
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Armazenamento centralizado de CRLVs, CNHs, Apólices e Laudos técnicos da frota.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<CloudUpload />} 
          onClick={() => setOpen(true)}
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'background.default',
            fontWeight: 700,
            borderRadius: 2,
            px: 3
          }}
        >
          Enviar Documento
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 4, bgcolor: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05), borderRadius: 4 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, bgcolor: alpha(theme.palette.common.white, 0.03), px: 2, py: 1, borderRadius: 2 }}>
                <Search fontSize="small" sx={{ color: 'text.secondary' }} />
                <TextField variant="standard" placeholder="Buscar documentos por nome, veículo ou tipo..." fullWidth slotProps={{ input: { disableUnderline: true } }} />
             </Box>
             
             <List>
                {docs.map((doc) => (
                    <ListItem 
                        key={doc.id} 
                        sx={{ 
                            mb: 2, 
                            bgcolor: alpha(theme.palette.common.white, 0.02), 
                            borderRadius: 2,
                            '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.05) }
                        }}
                    >
                        <ListItemIcon>
                            <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1.5 }}>
                                <PictureAsPdf sx={{ color: 'primary.main' }} />
                            </Box>
                        </ListItemIcon>
                        <ListItemText 
                            primary={<Typography variant="body1" sx={{ fontWeight: 700 }}>{doc.name}</Typography>}
                            secondary={
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                                    <Chip label={doc.type} size="small" sx={{ fontSize: 10, fontWeight: 700 }} />
                                    <Typography variant="caption" color="textSecondary">Expira em: {new Date(doc.expiry).toLocaleDateString('pt-BR')}</Typography>
                                </Box>
                            }
                        />
                        <ListItemSecondaryAction>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Chip 
                                    label={doc.status} 
                                    size="small" 
                                    color={doc.status === 'VÁLIDO' ? 'success' : 'warning'} 
                                    icon={doc.status === 'VÁLIDO' ? <CheckCircle sx={{ fontSize: '10px !important' }} /> : <Warning sx={{ fontSize: '10px !important' }} />}
                                    sx={{ fontWeight: 800, fontSize: 10 }}
                                />
                                <IconButton edge="end" color="primary"><Visibility fontSize="small" /></IconButton>
                                <IconButton edge="end" color="error"><Delete fontSize="small" /></IconButton>
                            </Box>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
             </List>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ p: 4, bgcolor: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(10px)', border: '1px solid', borderColor: alpha(theme.palette.common.white, 0.05), borderRadius: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Resumo da Gestão</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 700 }}>ESPAÇO UTILIZADO</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>45.2 MB / 1 GB</Typography>
                            <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>4%</Typography>
                        </Box>
                        <Box sx={{ height: 6, bgcolor: alpha(theme.palette.common.white, 0.1), borderRadius: 3 }}>
                            <Box sx={{ width: '4%', height: '100%', bgcolor: 'primary.main', borderRadius: 3 }} />
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), border: '1px dashed', borderColor: 'warning.main', borderRadius: 2 }}>
                        <Box>
                           <Typography variant="body2" sx={{ fontWeight: 700, color: 'warning.main' }}>Doc. Vencendo</Typography>
                           <Typography variant="h4" sx={{ fontWeight: 900, color: 'warning.main' }}>12</Typography>
                        </Box>
                        <Warning color="warning" sx={{ fontSize: 40, opacity: 0.5 }} />
                    </Box>
                </Box>
            </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 800 }}>Upload de Novo Documento</DialogTitle>
          <DialogContent>
             <Box sx={{ border: '2px dashed', borderColor: alpha(theme.palette.primary.main, 0.3), borderRadius: 3, p: 6, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Selecione o arquivo ou arraste aqui</Typography>
                <Typography variant="body2" color="textSecondary">PDF, JPG, PNG até 10MB</Typography>
             </Box>
             <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Nome do Documento / Identificação" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth select label="Tipo" defaultValue="CRLV">
                        <MenuItem value="CRLV">CRLV (Certificado)</MenuItem>
                        <MenuItem value="CNH">CNH (Habilitação)</MenuItem>
                        <MenuItem value="SEGURO">Apólice de Seguro</MenuItem>
                        <MenuItem value="LAUDO">Laudo Técnico</MenuItem>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth type="date" label="Data de Vencimento" slotProps={{ inputLabel: { shrink: true } }} />
                </Grid>
             </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 4 }}>
             <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
             <Button variant="contained" onClick={() => setOpen(false)} sx={{ fontWeight: 700, px: 4 }}>Finalizar Envio</Button>
          </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
