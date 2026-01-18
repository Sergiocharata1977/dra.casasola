import { Card, CardContent } from '@/components/ui/card'
import { Award, Scale, Briefcase, Users } from 'lucide-react'

export function SobreMi() {
    return (
        <section id="sobre-mi" className="py-20 md:py-32 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-sans font-bold text-gray-900 text-balance tracking-tight">
                            Trayectoria y Compromiso Profesional
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Con una sólida formación académica y años de ejercicio profesional, me dedico a brindar soluciones
                            legales estratégicas en el ámbito del Derecho Civil y de Familia.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Mi enfoque combina el rigor técnico con una visión humana, priorizando siempre la
                            resolución efectiva de conflictos y la protección de los derechos de mis clientes.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Card className="border-0 shadow-lg bg-gray-50">
                                <CardContent className="p-6">
                                    <Scale className="h-8 w-8 text-gray-900 mb-3" />
                                    <div className="text-2xl font-bold text-gray-900">500+</div>
                                    <div className="text-sm text-gray-500">Casos Resueltos</div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg bg-gray-50">
                                <CardContent className="p-6">
                                    <Users className="h-8 w-8 text-gray-900 mb-3" />
                                    <div className="text-2xl font-bold text-gray-900">98%</div>
                                    <div className="text-sm text-gray-500">Clientes Satisfechos</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="relative">
                        <Card className="p-8 bg-gray-50 border-0 shadow-xl">
                            <CardContent className="p-0 space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-xl shadow-sm">
                                        <Award className="h-6 w-6 text-gray-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Especialización</h3>
                                        <p className="text-sm text-gray-500">Derecho Civil, Sucesiones y Familia</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-xl shadow-sm">
                                        <Scale className="h-6 w-6 text-gray-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Enfoque</h3>
                                        <p className="text-sm text-gray-500">Resolución de Conflictos y Asesoría Integral</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-xl shadow-sm">
                                        <Briefcase className="h-6 w-6 text-gray-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Experiencia</h3>
                                        <p className="text-sm text-gray-500">Más de 20 años de ejercicio legal</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
