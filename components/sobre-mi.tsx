import { Card, CardContent } from '@/components/ui/card'
import { Award, Building2, Briefcase, Users } from 'lucide-react'

export function SobreMi() {
    return (
        <section id="sobre-mi" className="py-20 md:py-32 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-balance">
                            Compromiso con la Justicia Social
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Como Jefa del ANSES y especialista en Derecho Previsional, he dedicado mi carrera a garantizar que cada
                            persona reciba los derechos que le corresponden.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Mi experiencia abarca jubilaciones, pensiones, derechos de familia y sucesiones, siempre con un enfoque
                            humano y profesional que prioriza el bienestar de mis clientes.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Card>
                                <CardContent className="p-6">
                                    <Building2 className="h-8 w-8 text-accent mb-3" />
                                    <div className="text-2xl font-bold text-foreground">500+</div>
                                    <div className="text-sm text-muted-foreground">Casos Exitosos</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <Users className="h-8 w-8 text-accent mb-3" />
                                    <div className="text-2xl font-bold text-foreground">98%</div>
                                    <div className="text-sm text-muted-foreground">Clientes Satisfechos</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="relative">
                        <Card className="p-8 bg-secondary/50">
                            <CardContent className="p-0 space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-accent/10 p-3 rounded-lg">
                                        <Award className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Especialización</h3>
                                        <p className="text-sm text-muted-foreground">Derecho Previsional y Civil</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-accent/10 p-3 rounded-lg">
                                        <Building2 className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Cargo Actual</h3>
                                        <p className="text-sm text-muted-foreground">Jefa del ANSES</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-accent/10 p-3 rounded-lg">
                                        <Briefcase className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Experiencia</h3>
                                        <p className="text-sm text-muted-foreground">Más de 20 años en Seguridad Social</p>
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
