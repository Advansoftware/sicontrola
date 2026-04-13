'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  Grid,
  alpha,
  useTheme,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Person, 
  Email, 
  Lock, 
  Phone, 
  Home, 
  School, 
  CreditCard,
  CloudUpload,
  CheckCircle,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const steps = ['Conta', 'Dados Pessoais', 'Estudos', 'Documentos'];

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();

  // Step 1: Account
  const [accountData, setAccountData] = useState({ name: '', email: '', password: '' });
  // Step 2: Personal
  const [personalData, setPersonalData] = useState({ cpf: '', birthDate: '', phone: '', address: '', bairro: '' });
  // Step 3: Academic
  const [academicData, setAcademicData] = useState({ schoolId: '', course: '', period: '', schoolYear: '', planId: '' });
  // Step 4: Documents (simplified for now, just placeholders)
  // Options from backend
  const [schools, setSchools] = useState<{id: string, name: string}[]>([]);
  const [plans, setPlans] = useState<{id: string, name: string, price: number}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // These routes might not be ready but we'll try
            const schoolsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/students/schools`);
            const plansRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/students/plans`);
            if (schoolsRes.ok) setSchools(await schoolsRes.json());
            if (plansRes.ok) setPlans(await plansRes.json());
        } catch (e) {
            console.error('Failed to fetch initial data', e);
        }
    };
    fetchData();
  }, []);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
        // 1. Sign up (create user)
        const { data: signUpData, error: signUpError } = await authClient.signUp.email({
          email: accountData.email,
          password: accountData.password,
          name: accountData.name,
        });

        if (signUpError) throw new Error(signUpError.message || 'Erro ao criar conta');

        // 2. Create student profile
        // Better-Auth automatically signs in after sign up in most cases
        // We'll call our backend API to create the student profile
        const studentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Better-Auth uses cookies, so it should be included if using cross-site correctly
                // or we might need to handle credentials
            },
            body: JSON.stringify({
                ...personalData,
                ...academicData
            })
        });

        if (!studentRes.ok) {
            const errData = await studentRes.json();
            throw new Error(errData.message || 'Erro ao criar perfil de estudante');
        }

        handleNext(); // Move to success step
    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Nome Completo" variant="filled" 
                value={accountData.name} onChange={(e) => setAccountData({...accountData, name: e.target.value})}
                slotProps={{ input: { startAdornment: <Person sx={{mr: 1, color: 'primary.main'}} /> } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="E-mail" variant="filled" type="email"
                value={accountData.email} onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                slotProps={{ input: { startAdornment: <Email sx={{mr: 1, color: 'primary.main'}} /> } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Senha" variant="filled" type="password"
                value={accountData.password} onChange={(e) => setAccountData({...accountData, password: e.target.value})}
                slotProps={{ input: { startAdornment: <Lock sx={{mr: 1, color: 'primary.main'}} /> } }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth label="CPF" variant="filled" 
                value={personalData.cpf} onChange={(e) => setPersonalData({...personalData, cpf: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth label="Data de Nascimento" variant="filled" type="date"
                value={personalData.birthDate} onChange={(e) => setPersonalData({...personalData, birthDate: e.target.value})}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Telefone" variant="filled" 
                value={personalData.phone} onChange={(e) => setPersonalData({...personalData, phone: e.target.value})}
                slotProps={{ input: { startAdornment: <Phone sx={{mr: 1, color: 'primary.main'}} /> } }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField 
                fullWidth label="Endereço" variant="filled" 
                value={personalData.address} onChange={(e) => setPersonalData({...personalData, address: e.target.value})}
                slotProps={{ input: { startAdornment: <Home sx={{mr: 1, color: 'primary.main'}} /> } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField 
                fullWidth label="Bairro" variant="filled" 
                value={personalData.bairro} onChange={(e) => setPersonalData({...personalData, bairro: e.target.value})}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                fullWidth select label="Escola / Instituição" variant="filled"
                value={academicData.schoolId} onChange={(e) => setAcademicData({...academicData, schoolId: e.target.value})}
              >
                {schools.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth label="Curso" variant="filled" 
                value={academicData.course} onChange={(e) => setAcademicData({...academicData, course: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth select label="Período" variant="filled"
                value={academicData.period} onChange={(e) => setAcademicData({...academicData, period: e.target.value})}
              >
                <MenuItem value="MANHA">Manhã</MenuItem>
                <MenuItem value="TARDE">Tarde</MenuItem>
                <MenuItem value="NOITE">Noite</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth select label="Plano de Uso" variant="filled"
                value={academicData.planId} onChange={(e) => setAcademicData({...academicData, planId: e.target.value})}
              >
                {plans.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name} - R$ {option.price.toFixed(2)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CloudUpload sx={{ fontSize: 60, color: 'primary.main', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>Envio de Documentos</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
              Você poderá enviar seus documentos (RG, CPF, Comprovante de Residência e Foto) 
              logo após concluir este cadastro inicial através do seu painel.
            </Typography>
            <Alert severity="info" sx={{ textAlign: 'left', borderRadius: 2 }}>
              Ao clicar em "Finalizar", você concorda com os termos de uso do transporte municipal.
            </Alert>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 3, md: 6 }, 
          width: '100%', 
          maxWidth: 700,
          bgcolor: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: alpha(theme.palette.common.white, 0.05),
          borderRadius: 6,
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1, mb: 1 }}>
            Cadastro Estudantil
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Preencha os dados abaixo para solicitar sua carteirinha.
          </Typography>
        </Box>

        {activeStep < steps.length ? (
          <>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

            <Box sx={{ mt: 4, minHeight: 280 }}>
              {renderStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
              <Button
                startIcon={<ArrowBack />}
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Voltar
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleRegister}
                  disabled={loading}
                  sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Finalizar Cadastro'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={handleNext}
                  sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
                >
                  Continuar
                </Button>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Sucesso!</Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 6 }}>
              Seu cadastro foi realizado e está em análise. <br />
              Você receberá um e-mail com as próximas etapas.
            </Typography>
            <Button 
                variant="contained" 
                onClick={() => router.push('/')}
                sx={{ borderRadius: 2, px: 6, py: 1.5, fontWeight: 700 }}
            >
              Ir para o Login
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
