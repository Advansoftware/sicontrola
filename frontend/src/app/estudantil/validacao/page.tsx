'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  IconButton, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  alpha,
  useTheme,
  Avatar,
  Divider,
  Grid
} from '@mui/material';
import { 
  Visibility, 
  CheckCircle, 
  Cancel, 
  Edit,
  CloudDownload,
  School,
  Person
} from '@mui/icons-material';

export default function SecretaryValidationPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const theme = useTheme();

  const fetchPending = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/secretary/students/pending`);
      if (res.ok) {
        setStudents(await res.json());
      }
    } catch (e) {
      console.error('Error fetching pending students', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/secretary/students/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason })
      });
      if (res.ok) {
        setOpenDetail(false);
        setRejectionReason('');
        fetchPending();
      }
    } catch (e) {
      console.error('Error updating status', e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROVADO': return 'success';
      case 'PENDENTE': return 'warning';
      case 'EM_ANALISE': return 'info';
      case 'REPROVADO': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1 }}>
            Validação de Alunos
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Analise e aprove os novos cadastros estudantis.
          </Typography>
        </Box>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
            {students.length} Pendentes
        </Typography>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          bgcolor: alpha(theme.palette.background.paper, 0.4), 
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          border: '1px solid',
          borderColor: alpha(theme.palette.common.white, 0.05),
          boxShadow: 'none'
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Aluno</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>CPF</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Escola</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Data Cadastro</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                      {student.user.name[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{student.user.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{student.user.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{student.cpf}</TableCell>
                <TableCell>{student.school?.name}</TableCell>
                <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={student.status} size="small" color={getStatusColor(student.status)} sx={{ fontWeight: 600 }} />
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="primary" 
                    onClick={() => { setSelectedStudent(student); setOpenDetail(true); }}
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                   <Typography color="textSecondary">Não há solicitações pendentes no momento.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Detalhes */}
      <Dialog 
        open={openDetail} 
        onClose={() => setOpenDetail(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
            sx: { bgcolor: 'background.paper', borderRadius: 4 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Detalhes do Aluno</DialogTitle>
        <DialogContent dividers>
          {selectedStudent && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                 <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>Dados Pessoais</Typography>
                 <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Nome:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.user.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">CPF:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.cpf}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Endereço:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.address}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Bairro:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.bairro}</Typography>
                    </Box>
                 </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                 <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>Dados Acadêmicos</Typography>
                 <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Escola:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.school?.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Curso:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.course}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Período:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.period}</Typography>
                    </Box>
                 </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>Documentos Enviados</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {selectedStudent.documents?.length > 0 ? selectedStudent.documents.map((doc: any, i: number) => (
                        <Paper 
                           key={i} 
                           variant="outlined" 
                           sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3 }}
                        >
                            <CloudDownload color="primary" />
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{doc.type}</Typography>
                                <Button size="small" sx={{ p: 0, textTransform: 'none' }}>Baixar</Button>
                            </Box>
                        </Paper>
                    )) : (
                        <Typography variant="body2" color="textSecondary">Nenhum documento enviado ainda.</Typography>
                    )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                 <TextField 
                    fullWidth 
                    multiline 
                    rows={3} 
                    label="Motivo (para Reprovação ou Correção)" 
                    variant="filled" 
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    sx={{ mt: 2 }}
                 />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            variant="outlined" 
            color="warning" 
            startIcon={<Edit />}
            onClick={() => handleUpdateStatus(selectedStudent.id, 'EM_CORRECAO')}
          >
            Solicitar Correção
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<Cancel />}
            onClick={() => handleUpdateStatus(selectedStudent.id, 'REPROVADO')}
          >
            Reprovar
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<CheckCircle />}
            onClick={() => handleUpdateStatus(selectedStudent.id, 'APROVADO')}
            sx={{ px: 4, fontWeight: 700 }}
          >
            Aprovar Cadastro
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
