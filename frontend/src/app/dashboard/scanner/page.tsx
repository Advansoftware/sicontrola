'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Alert, 
  CircularProgress,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar
} from '@mui/material';
import { 
  QrCodeScanner, 
  CheckCircle, 
  Cancel, 
  FlashOn,
  History,
  Person,
  School
} from '@mui/icons-material';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (scanning && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(async (decodedText) => {
        scanner.pause();
        handleScan(decodedText);
      }, (err) => {
        // Ignorar erros de busca de frame
      });

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  const handleScan = async (qrCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/usage/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode })
      });

      const data = await res.json();
      if (res.ok) {
        setScanResult(data);
      } else {
        setError(data.message || 'Erro ao validar QR Code');
      }
    } catch (e) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const resumeScanning = () => {
    setScanResult(null);
    setError(null);
    if (scannerRef.current) {
      scannerRef.current.resume();
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1 }}>
          Scanner de Embarque
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Aponte a câmera para o QR Code da carteirinha.
        </Typography>
      </Box>

      {/* Área do Scanner */}
      <Paper 
        sx={{ 
          p: 2, 
          borderRadius: 5, 
          bgcolor: 'black', 
          border: '2px solid', 
          borderColor: loading ? 'primary.main' : alpha(theme.palette.common.white, 0.1),
          overflow: 'hidden',
          position: 'relative',
          minHeight: 400
        }}
      >
        <div id="reader"></div>
        
        {loading && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0, 
              bgcolor: alpha(theme.palette.common.black, 0.7),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Paper>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button 
          fullWidth 
          variant="outlined" 
          startIcon={<History />} 
          sx={{ borderRadius: 3, py: 1.5 }}
        >
          Ver Histórico
        </Button>
        <Button 
          fullWidth 
          variant="contained" 
          startIcon={<FlashOn />} 
          sx={{ borderRadius: 3, py: 1.5 }}
        >
          Ativar Lanterna
        </Button>
      </Box>

      {/* Dialog de Resultado de Sucesso */}
      <Dialog 
        open={!!scanResult} 
        onClose={resumeScanning}
        PaperProps={{ sx: { borderRadius: 5, bgcolor: 'background.paper' } }}
      >
        <Box sx={{ bgcolor: 'success.main', p: 3, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 60, color: 'white' }} />
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mt: 1 }}>
            Embarque Autorizado!
          </Typography>
        </Box>
        <DialogContent sx={{ p: 4 }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar 
                sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 24 }}
              >
                {scanResult?.student?.name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{scanResult?.student?.name}</Typography>
                <Typography variant="body2" color="textSecondary">Aluno(a)</Typography>
              </Box>
           </Box>
           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">Escola:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{scanResult?.student?.school}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">Data/Hora:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{new Date().toLocaleString()}</Typography>
              </Box>
           </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={resumeScanning}
            sx={{ borderRadius: 3, py: 1.5, fontWeight: 700 }}
          >
            Próximo Embarque
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Erro */}
      <Dialog 
        open={!!error} 
        onClose={resumeScanning}
        PaperProps={{ sx: { borderRadius: 5, bgcolor: 'background.paper' } }}
      >
        <Box sx={{ bgcolor: 'error.main', p: 3, textAlign: 'center' }}>
          <Cancel sx={{ fontSize: 60, color: 'white' }} />
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mt: 1 }}>
            Embarque Negado
          </Typography>
        </Box>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
           <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              {error}
           </Typography>
           <Typography variant="body2" color="textSecondary">
              O aluno deve regularizar sua situação na secretaria.
           </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            fullWidth 
            variant="contained" 
            color="error"
            onClick={resumeScanning}
            sx={{ borderRadius: 3, py: 1.5, fontWeight: 700 }}
          >
            Tentar Novamente
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
