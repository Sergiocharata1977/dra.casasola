'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function Join() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    provincia: '',
    municipio: '',
    email: '',
    celular: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Aquí se implementaría el envío del formulario
  }

  return (
    <section id="sumate" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content (Image or Text) - Optional, simplified for now to focus on form matching screenshot layout */}
          <div className="hidden lg:block lg:w-1/2">
            <img
              src="/Logos-lla/Logo LLA Chaco-02.png"
              alt="LLA Logo"
              className="w-full max-w-md mx-auto opacity-90"
            />
            <h2 className="mt-8 text-4xl font-extrabold text-[#5B2C83] text-center text-balance">
              LA LIBERTAD AVANZA
            </h2>
          </div>

          <div className="w-full lg:w-1/2">
            <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
              <CardHeader className="pb-2 pt-8 px-8">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Anotate acá para fiscalizar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="nombre" className="text-gray-500 text-xs font-semibold uppercase tracking-wider pl-1">Nombre</Label>
                      <Input
                        id="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                        className="h-12 border-gray-300 rounded-lg focus-visible:ring-[#5B2C83]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="apellido" className="text-gray-500 text-xs font-semibold uppercase tracking-wider pl-1">Apellido</Label>
                      <Input
                        id="apellido"
                        placeholder="Apellido"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        required
                        className="h-12 border-gray-300 rounded-lg focus-visible:ring-[#5B2C83]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="dni" className="text-gray-500 text-xs font-semibold uppercase tracking-wider pl-1">DNI</Label>
                      <Input
                        id="dni"
                        placeholder="DNI"
                        value={formData.dni}
                        onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                        required
                        className="h-12 border-gray-300 rounded-lg focus-visible:ring-[#5B2C83]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="provincia" className="text-gray-500 text-xs font-semibold uppercase tracking-wider pl-1">Provincia</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, provincia: value })}>
                        <SelectTrigger className="h-12 border-gray-300 rounded-lg focus:ring-[#5B2C83]">
                          <SelectValue placeholder="Provincia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chaco">Chaco</SelectItem>
                          <SelectItem value="corrientes">Corrientes</SelectItem>
                          <SelectItem value="misiones">Misiones</SelectItem>
                          <SelectItem value="formosa">Formosa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="municipio" className="text-gray-500 text-xs font-semibold uppercase tracking-wider pl-1">Municipio</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, municipio: value })}>
                      <SelectTrigger className="h-12 border-gray-300 rounded-lg focus:ring-[#5B2C83]">
                        <SelectValue placeholder="Municipio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resistencia">Resistencia</SelectItem>
                        <SelectItem value="saenz-pena">Sáenz Peña</SelectItem>
                        <SelectItem value="villa-angela">Villa Ángela</SelectItem>
                        <SelectItem value="charata">Charata</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-gray-500 text-xs font-semibold uppercase tracking-wider pl-1">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12 border-gray-300 rounded-lg focus-visible:ring-[#5B2C83]"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="celular" className="text-gray-500 text-xs font-semibold uppercase tracking-wider pl-1">Celular</Label>
                    <Input
                      id="celular"
                      type="tel"
                      placeholder="Celular"
                      value={formData.celular}
                      onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                      required
                      className="h-12 border-gray-300 rounded-lg focus-visible:ring-[#5B2C83]"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-[#3F0F63] hover:bg-[#2d0b47] text-white text-lg font-bold py-6 rounded-lg mt-4">
                    Enviar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
