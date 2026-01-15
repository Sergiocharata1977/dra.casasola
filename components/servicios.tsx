import { Card, CardContent } from '@/components/ui/card'
import { Scale, Users, FileText } from 'lucide-react'

export function Servicios() {
    return (
        <section id="servicios" className="py-20 md:py-32 bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 text-balance">
                        Servicios Legales Especializados
                    </h2>
                    <p className="text-lg text-muted-foreground text-pretty">
                        Asesoramiento integral en todas las áreas del Derecho Previsional y Civil
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-accent">
                        <CardContent className="p-8 space-y-4">
                            <div className="bg-primary/10 p-4 rounded-lg w-fit group-hover:bg-accent/20 transition-colors">
                                <Scale className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-foreground">Jubilaciones</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Trámites y asesoramiento para jubilaciones ordinarias, anticipadas y por edad avanzada. Garantizamos
                                sus derechos previsionales.
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-1">•</span>
                                    <span>Jubilación ordinaria</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-1">•</span>
                                    <span>Jubilación anticipada</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-1">•</span>
                                    <span>Reajuste de haberes</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-accent">
                        <CardContent className="p-8 space-y-4">
                            <div className="bg-primary/10 p-4 rounded-lg w-fit group-hover:bg-accent/20 transition-colors">
                                <Users className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-foreground">Pensiones</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Gestión de pensiones por fallecimiento, invalidez y otras prestaciones de seguridad social para usted
                                y su familia.
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-1">•</span>
                                    <span>Pensión por fallecimiento</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-1">•</span>
                                    <span>Pensión por invalidez</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-1">•</span>
                                    <span>Pensiones no contributivas</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-accent">
                        <CardContent className="p-8 space-y-4">
                            <div className="bg-primary/10 p-4 rounded-lg w-fit group-hover:bg-accent/20 transition-colors">
                                <FileText className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-foreground">Sucesiones</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Asesoramiento completo en procesos sucesorios, testamentos y división de herencias con total
                                transparencia.
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-1">•</span>
                                    <span>Declaratoria de herederos</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-1">•</span>
                                    <span>Testamentos</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-1">•</span>
                                    <span>División de herencias</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
