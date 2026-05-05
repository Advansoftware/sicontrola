'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/contexts/AppContext'
import { schools, planConfigs } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Upload, Check, ChevronRight, ChevronLeft, FileText, Camera, Home, IdCard } from 'lucide-react'
import type { TransportPlan, Shift } from '@/lib/types'

export default function StudentRegistrationView() {
  const { state, setView } = useApp()
  const plans = state.planConfigs.length > 0 ? state.planConfigs : planConfigs
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<TransportPlan | null>(null)
  const [uploadedDocs, setUploadedDocs] = useState({
    photo: false,
    schoolDeclaration: false,
    residenceProof: false,
    personalDocument: false,
  })

  // Personal data form state
  const [personalData, setPersonalData] = useState({
    name: '',
    cpf: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    neighborhood: '',
  })

  // School data form state
  const [schoolData, setSchoolData] = useState({
    institution: '',
    course: '',
    shift: '' as Shift | '',
    schoolYear: new Date().getFullYear(),
  })

  const maskCPF = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const maskPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const handlePersonalChange = (field: string, value: string) => {
    if (field === 'cpf') value = maskCPF(value)
    if (field === 'phone') value = maskPhone(value)
    setPersonalData(prev => ({ ...prev, [field]: value }))
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send data to an API
    setView('my-registration')
  }

  const simulateUpload = (doc: keyof typeof uploadedDocs) => {
    setUploadedDocs(prev => ({ ...prev, [doc]: true }))
  }

  const isStep1Valid = personalData.name && personalData.cpf.length === 14 && personalData.birthDate && personalData.phone.length >= 14 && personalData.email && personalData.address && personalData.neighborhood

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nova Inscrição</h1>
        <p className="text-gray-500 mt-1">Preencha os dados abaixo para solicitar seu transporte estudantil</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${step >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'bg-gray-200 text-gray-500'}`}>
            {step > 1 ? <Check className="w-5 h-5" /> : '1'}
          </div>
          <span className={`font-medium text-sm hidden sm:block ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            Dados Pessoais
          </span>
        </div>
        <div className={`h-0.5 w-16 sm:w-24 transition-colors duration-300 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${step >= 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
          <span className={`font-medium text-sm hidden sm:block ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            Dados Escolares
          </span>
        </div>
      </div>

      {/* Step 1 - Personal Data */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <IdCard className="w-4 h-4 text-blue-600" />
                </div>
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    placeholder="Digite seu nome completo"
                    value={personalData.name}
                    onChange={(e) => handlePersonalChange('name', e.target.value)}
                    required
                  />
                </div>

                {/* CPF */}
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={personalData.cpf}
                    onChange={(e) => handlePersonalChange('cpf', e.target.value)}
                    required
                  />
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={personalData.birthDate}
                    onChange={(e) => handlePersonalChange('birthDate', e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    value={personalData.phone}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={personalData.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    placeholder="Rua, número - complemento"
                    value={personalData.address}
                    onChange={(e) => handlePersonalChange('address', e.target.value)}
                    required
                  />
                </div>

                {/* Neighborhood */}
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    placeholder="Nome do bairro"
                    value={personalData.neighborhood}
                    onChange={(e) => handlePersonalChange('neighborhood', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-semibold">
                  ENVIAR CADASTRO
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* Step 2 - School Data */}
      {step === 2 && (
        <form onSubmit={handleFinalSubmit}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  Dados Escolares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Institution */}
                  <div className="space-y-2">
                    <Label>Instituição de Ensino *</Label>
                    <Select
                      value={schoolData.institution}
                      onValueChange={(val) => setSchoolData(prev => ({ ...prev, institution: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a instituição" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Course */}
                  <div className="space-y-2">
                    <Label htmlFor="course">Curso *</Label>
                    <Input
                      id="course"
                      placeholder="Ex: Ensino Médio - 1º Ano"
                      value={schoolData.course}
                      onChange={(e) => setSchoolData(prev => ({ ...prev, course: e.target.value }))}
                    />
                  </div>

                  {/* Shift */}
                  <div className="space-y-2">
                    <Label>Turno *</Label>
                    <RadioGroup
                      value={schoolData.shift}
                      onValueChange={(val) => setSchoolData(prev => ({ ...prev, shift: val as Shift }))}
                      className="flex gap-3"
                    >
                      <div className="flex items-center space-x-2 rounded-lg border p-3 flex-1 cursor-pointer hover:border-blue-300 transition-colors">
                        <RadioGroupItem value="morning" id="morning" />
                        <Label htmlFor="morning" className="cursor-pointer flex-1">Manhã</Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border p-3 flex-1 cursor-pointer hover:border-blue-300 transition-colors">
                        <RadioGroupItem value="afternoon" id="afternoon" />
                        <Label htmlFor="afternoon" className="cursor-pointer flex-1">Tarde</Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border p-3 flex-1 cursor-pointer hover:border-blue-300 transition-colors">
                        <RadioGroupItem value="night" id="night" />
                        <Label htmlFor="night" className="cursor-pointer flex-1">Noite</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* School Year */}
                  <div className="space-y-2">
                    <Label htmlFor="schoolYear">Ano Letivo *</Label>
                    <Select
                      value={String(schoolData.schoolYear)}
                      onValueChange={(val) => setSchoolData(prev => ({ ...prev, schoolYear: Number(val) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Transport Plan */}
                <div className="space-y-3">
                  <Label>Plano de Transporte *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <Card
                        key={plan.plan}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedPlan === plan.plan
                            ? 'border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-600/20'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedPlan(plan.plan)}
                      >
                        <CardContent className="p-4 text-center space-y-2">
                          <Badge variant="secondary" className="text-xs font-medium">
                            {plan.plan} por semana
                          </Badge>
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(plan.price)}
                          </div>
                          <p className="text-xs text-gray-500">{plan.description}</p>
                          <p className="text-xs text-gray-400">
                            {plan.weeklyLimit} {plan.weeklyLimit === 1 ? 'viagem' : 'viagens'} por semana
                          </p>
                          {selectedPlan === plan.plan && (
                            <div className="flex justify-center pt-1">
                              <Badge className="bg-blue-600 text-white">Selecionado</Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-blue-600" />
                  </div>
                  Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Photo */}
                  <div
                    onClick={() => simulateUpload('photo')}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 ${
                      uploadedDocs.photo ? 'border-green-400 bg-green-50' : 'border-gray-300'
                    }`}
                  >
                    {uploadedDocs.photo ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-700">Foto enviada</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">Foto 3x4</p>
                        <p className="text-xs text-gray-400">Clique ou arraste para enviar</p>
                      </div>
                    )}
                  </div>

                  {/* School Declaration */}
                  <div
                    onClick={() => simulateUpload('schoolDeclaration')}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 ${
                      uploadedDocs.schoolDeclaration ? 'border-green-400 bg-green-50' : 'border-gray-300'
                    }`}
                  >
                    {uploadedDocs.schoolDeclaration ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-700">Declaração enviada</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">Declaração Escolar</p>
                        <p className="text-xs text-gray-400">Clique ou arraste para enviar</p>
                      </div>
                    )}
                  </div>

                  {/* Residence Proof */}
                  <div
                    onClick={() => simulateUpload('residenceProof')}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 ${
                      uploadedDocs.residenceProof ? 'border-green-400 bg-green-50' : 'border-gray-300'
                    }`}
                  >
                    {uploadedDocs.residenceProof ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-700">Comprovante enviado</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                          <Home className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">Comprovante de Residência</p>
                        <p className="text-xs text-gray-400">Clique ou arraste para enviar</p>
                      </div>
                    )}
                  </div>

                  {/* Personal Document */}
                  <div
                    onClick={() => simulateUpload('personalDocument')}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 ${
                      uploadedDocs.personalDocument ? 'border-green-400 bg-green-50' : 'border-gray-300'
                    }`}
                  >
                    {uploadedDocs.personalDocument ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-700">Documento enviado</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                          <IdCard className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">Documento Pessoal</p>
                        <p className="text-xs text-gray-400">Clique ou arraste para enviar</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="px-8"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                VOLTAR
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-semibold"
              >
                ENVIAR PARA ANÁLISE
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
