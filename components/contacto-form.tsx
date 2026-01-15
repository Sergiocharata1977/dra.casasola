import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin } from 'lucide-react'

export function ContactoForm() {
    return (
        <section id="contacto" className="py-20 md:py-32 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-balance">
                            Consulta tu Caso
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Estoy aquí para ayudarte. Agenda una consulta gratuita y descubre cómo puedo defender tus derechos.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-accent/10 p-3 rounded-lg">
                                    <Phone className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">Teléfono</h3>
                                    <p className="text-muted-foreground">+54 11 1234-5678</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-accent/10 p-3 rounded-lg">
                                    <Mail className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                                    <p className="text-muted-foreground">contacto@lidiacasasola.com.ar</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-accent/10 p-3 rounded-lg">
                                    <MapPin className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">Dirección</h3>
                                    <p className="text-muted-foreground">
                                        Av. Corrientes 1234, CABA
                                        <br />
                                        Buenos Aires, Argentina
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-8">
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                        placeholder="Juan Pérez"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                        placeholder="juan@ejemplo.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                        placeholder="+54 11 1234-5678"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                        Mensaje
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none"
                                        placeholder="Cuénteme sobre su caso..."
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                    Enviar Consulta
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
