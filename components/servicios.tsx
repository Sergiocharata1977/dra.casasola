import { Card, CardContent } from '@/components/ui/card'
import { Scale, HeartHandshake, ScrollText } from 'lucide-react'

export function Servicios() {
    return (
        <section id="servicios" className="py-20 md:py-32 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-sans font-bold text-gray-900 mb-4 tracking-tight">
                        Especialistas en Derecho Civil
                    </h2>
                    <p className="text-lg text-gray-600">
                        Brindamos seguridad jurídica y soluciones eficaces en conflictos familiares y patrimoniales.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sucesiones */}
                    <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg bg-white">
                        <CardContent className="p-8 space-y-4">
                            <div className="bg-gray-100 p-4 rounded-xl w-fit group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                                <ScrollText className="h-8 w-8 text-gray-900 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Sucesiones</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Gestión integral de procesos sucesorios. Protegemos su patrimonio y facilitamos la transmisión de bienes.
                            </p>
                            <ul className="space-y-3 text-sm text-gray-500 pt-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent text-lg leading-none">•</span>
                                    <span>Declaratoria de herederos</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent text-lg leading-none">•</span>
                                    <span>Divisiones de herencia</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent text-lg leading-none">•</span>
                                    <span>Testamentos y legados</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Derecho de Familia */}
                    <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg bg-white">
                        <CardContent className="p-8 space-y-4">
                            <div className="bg-gray-100 p-4 rounded-xl w-fit group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                                <HeartHandshake className="h-8 w-8 text-gray-900 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Derecho de Familia</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Asesoramiento sensible y profesional en conflictos familiares, priorizando el bienestar de los involucrados.
                            </p>
                            <ul className="space-y-3 text-sm text-gray-500 pt-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent text-lg leading-none">•</span>
                                    <span>Divorcios y separaciones</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent text-lg leading-none">•</span>
                                    <span>Cuota alimentaria</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent text-lg leading-none">•</span>
                                    <span>Régimen de comunicación</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Contratos y Daños */}
                    <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg bg-white">
                        <CardContent className="p-8 space-y-4">
                            <div className="bg-gray-100 p-4 rounded-xl w-fit group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                                <Scale className="h-8 w-8 text-gray-900 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Contratos y Daños</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Redacción de contratos seguros y reclamos de indemnizaciones por daños y perjuicios.
                            </p>
                            <ul className="space-y-3 text-sm text-gray-500 pt-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent text-lg leading-none">•</span>
                                    <span>Accidentes de tránsito</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent text-lg leading-none">•</span>
                                    <span>Incumplimientos contractuales</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent text-lg leading-none">•</span>
                                    <span>Desalojos y alquileres</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
