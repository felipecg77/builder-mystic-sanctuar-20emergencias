import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Shield, 
  Phone, 
  MapPin, 
  Mic, 
  Users,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from "lucide-react";

export default function Help() {
  const emergencyNumbers = [
    { number: "911", service: "Policía / Bomberos / Paramédicos", urgent: true },
    { number: "065", service: "Cruz Roja Mexicana", urgent: false },
    { number: "089", service: "Denuncia Anónima", urgent: false },
    { number: "078", service: "Línea de la Vida (Prevención del Suicidio)", urgent: false },
  ];

  const faqs = [
    {
      question: "¿Cómo funciona el botón de emergencia?",
      answer: "Al presionar el botón de emergencia, la app captura tu ubicación, inicia una grabación de audio y llama automáticamente a tus contactos de emergencia en orden hasta que alguien conteste."
    },
    {
      question: "¿Qué pasa si no tengo contactos configurados?",
      answer: "La app te mostrará los números de emergencia locales y te ofrecerá llamar automáticamente al 911 después de 5 segundos."
    },
    {
      question: "¿Puedo usar la app sin internet?",
      answer: "Sí, las funciones básicas como ubicación GPS, grabación de audio y llamadas telefónicas funcionan sin conexión a internet."
    },
    {
      question: "¿Los permisos son obligatorios?",
      answer: "Para mejor protección se recomienda activar ubicación y micrófono, pero la app funciona aunque no los concedas."
    },
    {
      question: "¿Se guardan mis grabaciones?",
      answer: "No, las grabaciones son temporales y se usan solo durante la emergencia activa. No se almacenan permanentemente."
    }
  ];

  const steps = [
    { icon: Users, title: "Configura contactos", description: "Agrega hasta 3 contactos de emergencia" },
    { icon: MapPin, title: "Permite ubicación", description: "Activa GPS para enviar tu ubicación exacta" },
    { icon: Mic, title: "Permite micrófono", description: "Para grabar audio durante emergencias" },
    { icon: Shield, title: "¡Listo!", description: "Tu sistema de emergencia está configurado" }
  ];

  return (
    <div className="min-h-screen bg-background p-4 pt-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Ayuda y Soporte</h1>
          </div>
          <p className="text-muted-foreground">Guía de uso de SafeAlert</p>
        </div>

        {/* Quick Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-safe" />
              Configuración Rápida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <Icon className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Numbers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-emergency" />
              Números de Emergencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergencyNumbers.map((emergency, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{emergency.number}</span>
                        {emergency.urgent && (
                          <Badge variant="destructive" className="text-xs">URGENTE</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{emergency.service}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = `tel:${emergency.number}`}
                  >
                    Llamar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h4 className="font-medium text-sm mb-1">{faq.question}</h4>
                  <p className="text-xs text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Consejos de Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span>🚨</span>
                <p><strong>En emergencias reales:</strong> Llama también a servicios de emergencia locales (911)</p>
              </div>
              <div className="flex gap-2">
                <span>📱</span>
                <p><strong>Mantén tu teléfono cargado:</strong> Un teléfono descargado no puede ayudarte</p>
              </div>
              <div className="flex gap-2">
                <span>👥</span>
                <p><strong>Informa a tus contactos:</strong> Asegúrate de que sepan que están en tu lista de emergencia</p>
              </div>
              <div className="flex gap-2">
                <span>🧪</span>
                <p><strong>Prueba regularmente:</strong> Verifica que la ubicación y micrófono funcionen</p>
              </div>
              <div className="flex gap-2">
                <span>🔒</span>
                <p><strong>Privacidad:</strong> Tus datos se procesan localmente y no se envían a servidores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>¿Necesitas más ayuda?</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Si tienes problemas técnicos o sugerencias para mejorar SafeAlert
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open('mailto:support@safealert.com', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Contactar Soporte
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
