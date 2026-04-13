'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Avatar, 
  Tooltip,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard, 
  DirectionsCar, 
  Person, 
  LocalGasStation, 
  Build, 
  Settings, 
  Logout,
  Notifications,
  Search,
  Today,
  Assignment,
  Assessment,
  Warning,
  QrCodeScanner,
  School as SchoolIcon,
  CreditCard
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

const drawerWidth = 280;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
}

const menuSections: { title?: string; items: MenuItem[] }[] = [
  {
    title: 'Geral',
    items: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['ADMIN', 'SECRETARIA'] },
      { text: 'Área do Aluno', icon: <Dashboard />, path: '/dashboard/estudante', roles: ['ALUNO'] },
      { text: 'Scanner QR', icon: <QrCodeScanner />, path: '/dashboard/scanner', roles: ['MOTORISTA', 'ADMIN'] },
    ]
  },
  {
    title: 'Gestão Estudantil',
    items: [
      { text: 'Validar Alunos', icon: <Assignment />, path: '/estudantil/validacao', roles: ['ADMIN', 'SECRETARIA'] },
      { text: 'Escolas', icon: <SchoolIcon />, path: '/estudantil/escolas', roles: ['ADMIN', 'SECRETARIA'] },
      { text: 'Planos', icon: <CreditCard />, path: '/estudantil/planos', roles: ['ADMIN', 'SECRETARIA'] },
    ]
  },
  {
    title: 'Gestão de Frota',
    items: [
      { text: 'Veículos', icon: <DirectionsCar />, path: '/veiculos', roles: ['ADMIN'] },
      { text: 'Motoristas', icon: <Person />, path: '/motoristas', roles: ['ADMIN'] },
      { text: 'Abastecimentos', icon: <LocalGasStation />, path: '/abastecimentos', roles: ['ADMIN'] },
      { text: 'Manutenções', icon: <Build />, path: '/manutencoes', roles: ['ADMIN'] },
      { text: 'Peças', icon: <Settings />, path: '/pecas', roles: ['ADMIN'] },
      { text: 'Revisões', icon: <Today />, path: '/revisoes', roles: ['ADMIN'] },
      { text: 'Multas', icon: <Warning />, path: '/multas', roles: ['ADMIN'] },
    ]
  },
  {
    title: 'Sistema',
    items: [
      { text: 'Relatórios', icon: <Assessment />, path: '/relatorios', roles: ['ADMIN', 'SECRETARIA'] },
      { text: 'Configurações', icon: <Settings />, path: '/configuracoes', roles: ['ADMIN', 'SECRETARIA', 'ALUNO'] },
    ]
  }
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { data: session, isPending } = authClient.useSession();

  React.useEffect(() => {
    if (!isPending && !session) {
      router.push('/');
    }
  }, [session, isPending, router]);

  const handleDrawerToggle = () => {

    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        }
      }
    });
  };

  const userRole = session?.user?.role || 'ALUNO';

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box 
          sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: 'primary.main', 
            borderRadius: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`
          }}
        >
          <DirectionsCar sx={{ color: 'background.default' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -1, color: 'text.primary' }}>
          SICONTROLA
        </Typography>
      </Box>

      <Box sx={{ px: 2, flexGrow: 1, overflowY: 'auto' }}>
        {menuSections.map((section, idx) => {
          const visibleItems = section.items.filter(item => !item.roles || item.roles.includes(userRole));
          
          if (visibleItems.length === 0) return null;

          return (
            <React.Fragment key={idx}>
              {section.title && (
                <Typography 
                  variant="overline" 
                  sx={{ 
                    px: 2, 
                    mt: 3, 
                    mb: 1, 
                    display: 'block', 
                    color: 'text.secondary',
                    fontWeight: 700,
                    opacity: 0.6
                  }}
                >
                  {section.title}
                </Typography>
              )}
              <List disablePadding>
                {visibleItems.map((item) => {
                  const active = pathname === item.path;
                  return (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton 
                        component={Link}
                        href={item.path}
                        sx={{ 
                          borderRadius: 2,
                          bgcolor: active ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                          color: active ? 'primary.main' : 'text.secondary',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                            color: 'text.primary'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ color: active ? 'primary.main' : 'inherit', minWidth: 40 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: active ? 700 : 500, variant: 'body2' }} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </React.Fragment>
          );
        })}
      </Box>

      <Box sx={{ p: 2, mt: 'auto' }}>
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            bgcolor: alpha(theme.palette.primary.main, 0.02), 
            borderColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={session?.user?.image || undefined}
              sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}
            >
              {session?.user?.name?.[0] || 'U'}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                {userRole}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session?.user?.name || 'Usuário'}
              </Typography>
            </Box>
            <IconButton size="small" sx={{ ml: 'auto' }} color="error" onClick={handleLogout}>
              <Logout fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: alpha(theme.palette.background.default, 0.7),
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: alpha(theme.palette.common.white, 0.05),
          boxShadow: 'none',
          color: 'text.primary',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', bgcolor: alpha(theme.palette.common.white, 0.03), px: 2, py: 0.5, borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
            <Search fontSize="small" />
            <Typography variant="body2">Pesquisar...</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Notificações">
              <IconButton color="inherit" size="small">
                <Notifications fontSize="small" />
              </IconButton>
            </Tooltip>
            {session?.user && (
              <>
                <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{session.user.name}</Typography>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth, 
              border: 'none',
              borderRight: '1px solid',
              borderColor: alpha(theme.palette.common.white, 0.05)
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          overflowX: 'hidden'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

