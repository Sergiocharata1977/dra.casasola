import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export function ContactoForm() {
    return (
        <section id="contacto" className="py-20 md:py-32 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 block">
                        Contacto
                    </span>
                    <h2 className="text-3xl md:text-4xl font-sans font-bold text-gray-900 mb-4 tracking-tight">
                        Consulta tu Caso
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Estoy aquí para ayudarte. Agenda una consulta y descubre cómo puedo defender tus derechos.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Info & Map */}
                    <div className="space-y-8">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="bg-gray-900 p-3 rounded-lg">
                                    <Phone className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Teléfono / WhatsApp</h3>
                                    <a href="tel:+543731532578" className="text-gray-600 hover:text-gray-900 transition-colors">
                                        +54 3731 532578
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="bg-gray-900 p-3 rounded-lg">
                                    <Mail className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                                    <a href="mailto:contacto@lidiacasasola.com.ar" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                                        contacto@lidiacasasola.com.ar
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="bg-gray-900 p-3 rounded-lg">
                                    <MapPin className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Dirección</h3>
                                    <p className="text-gray-600 text-sm">
                                        Chacabuco 56<br />
                                        Charata, Chaco, Argentina
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="bg-gray-900 p-3 rounded-lg">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Horario</h3>
                                    <p className="text-gray-600 text-sm">
                                        Lunes a Viernes<br />
                                        09:00 - 18:00 hs
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps */}
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-64 lg:h-80">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3512.7977599831196!2d-61.18947492460697!3d-27.21628277656284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94475c9e3fc4d81f%3A0x71c8bf2f4a5e1234!2sChacabuco%2056%2C%20Charata%2C%20Chaco%2C%20Argentina!5e0!3m2!1ses!2sar!4v1705123456789!5m2!1ses!2sar"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Ubicación del Estudio Jurídico"
                            />
                        </div>
                    </div>

                    {/* Form */}
                    <Card className="border-0 shadow-xl">
                        <CardContent className="p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Envianos tu consulta</h3>
                            <form className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white transition-all"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white transition-all"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white transition-all"
                                            placeholder="+54 3731 123456"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mensaje
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white resize-none transition-all"
                                        placeholder="Cuéntame sobre tu caso..."
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800 py-6 rounded-xl text-base font-semibold">
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
