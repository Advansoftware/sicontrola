'use client'

import React, { useState } from 'react'
import {
  Bus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  FileText,
  GraduationCap,
  Truck,
  LogIn,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { signIn, signUp } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const demoUsers = [
  { email: 'admin@sicontrola.gov.br', password: 'admin123', name: 'Administrador', icon: Shield, color: 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' },
  { email: 'secretaria@sicontrola.gov.br', password: 'secretaria123', name: 'Secretaria', icon: FileText, color: 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200' },
  { email: 'ana.clara@email.com', password: 'aluno123', name: 'Aluno', icon: GraduationCap, color: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' },
  { email: 'carlos.motorista@sicontrola.gov.br', password: 'motorista123', name: 'Motorista', icon: Truck, color: 'bg-sky-100 text-sky-700 hover:bg-sky-200 border-sky-200' },
]

export default function LoginView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Try sign in first
      const result = await signIn.email({ email, password })

      if (result.error) {
        // If account doesn't exist, try to sign up (auto-create for demo)
        if (result.error.message?.includes('Invalid') || result.error.code === 'INVALID_CREDENTIALS') {
          // Attempt sign-up as fallback for demo users
          const signUpResult = await signUp.email({
            email,
            password,
            name: email.split('@')[0],
          })

          if (signUpResult.error) {
            setError('Credenciais invalidas. Verifique seu e-mail e senha.')
          } else {
            // Sign up succeeded, now sign in
            const loginResult = await signIn.email({ email, password })
            if (loginResult.error) {
              setError('Erro ao fazer login. Tente novamente.')
            } else {
              window.location.href = '/'
            }
          }
        } else {
          setError('Credenciais invalidas. Verifique seu e-mail e senha.')
        }
      } else {
        window.location.href = '/'
      }
    } catch {
      setError('Erro de conexao. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDemoLogin(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
    setLoading(true)

    try {
      const result = await signIn.email({ email: demoEmail, password: demoPassword })

      if (result.error) {
        // Try sign-up first for auto-create
        const signUpResult = await signUp.email({
          email: demoEmail,
          password: demoPassword,
          name: demoEmail.split('@')[0],
        })

        if (signUpResult.error) {
          setError('Nao foi possivel criar a conta de demonstracao.')
        } else {
          const loginResult = await signIn.email({ email: demoEmail, password: demoPassword })
          if (loginResult.error) {
            setError('Erro ao fazer login. Tente novamente.')
          } else {
            window.location.href = '/'
          }
        }
      } else {
        window.location.href = '/'
      }
    } catch {
      setError('Erro de conexao. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] relative bg-gradient-to-br from-[#1e3a5f] via-[#162d4a] to-[#0f172a] flex-col items-center justify-center p-12 text-white overflow-hidden">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-12 left-12 w-3 h-3 bg-white rounded-full" />
          <div className="absolute top-12 left-24 w-2 h-2 bg-white rounded-full" />
          <div className="absolute top-24 left-8 w-2 h-2 bg-white rounded-full" />
          <div className="absolute top-24 left-20 w-3 h-3 bg-white rounded-full" />
          <div className="absolute top-36 left-14 w-2 h-2 bg-white rounded-full" />
          <div className="absolute bottom-24 right-16 w-3 h-3 bg-white rounded-full" />
          <div className="absolute bottom-36 right-28 w-2 h-2 bg-white rounded-full" />
          <div className="absolute bottom-12 right-20 w-2 h-2 bg-white rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-white rounded-full" />
          <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-white rounded-full" />
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full" />

        <div className="relative z-10 text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
            <Bus className="w-12 h-12 text-blue-300" />
          </div>
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight mb-4">
            SICONTROLA
          </h1>
          <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-6">
            Sistema de Controle de Transporte Estudantil Municipal
          </p>
          <div className="w-16 h-0.5 bg-blue-400/50 mx-auto mb-6" />
          <p className="text-blue-100/70 text-sm leading-relaxed">
            Plataforma integrada para gestao de transporte estudantil,
            controle de embarques, financeiro e carteirinhas digitais.
          </p>
        </div>

        <p className="absolute bottom-8 text-blue-400/50 text-xs">
          Prefeitura Municipal &mdash; 2025
        </p>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        {/* Mobile branding */}
        <div className="lg:hidden mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] flex items-center justify-center shadow-lg">
            <Bus className="w-8 h-8 text-blue-300" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">SICONTROLA</h1>
          <p className="text-xs text-slate-400 mt-1">Transporte Estudantil Municipal</p>
        </div>

        <Card className="w-full max-w-md border-0 shadow-none lg:shadow-sm">
          <CardHeader className="text-center pb-2 px-0">
            <CardTitle className="text-2xl font-bold text-slate-900">
              Bem-vindo de volta
            </CardTitle>
            <CardDescription className="text-slate-500 mt-1">
              Faca login para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold text-sm transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            {/* Demo access */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400 font-medium">
                    Acesso Rapido (Demo)
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {demoUsers.map((demo) => {
                  const Icon = demo.icon
                  return (
                    <Button
                      key={demo.email}
                      variant="outline"
                      onClick={() => handleDemoLogin(demo.email, demo.password)}
                      disabled={loading}
                      className={cn(
                        'h-auto py-3 px-3 flex flex-col items-center gap-1.5 border text-xs font-medium transition-all duration-200',
                        demo.color
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{demo.name}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-400">
          &copy; 2025 SICONTROLA &mdash; Prefeitura Municipal
        </p>
      </div>
    </div>
  )
}
