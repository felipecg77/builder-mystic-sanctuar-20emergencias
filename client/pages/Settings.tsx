import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  MapPin, 
  Mic, 
  Bell, 
  Vibrate, 
  Volume2,
  Smartphone,
  Shield
} from "lucide-react";

export default function Settings() {
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [notifications, setNotifications] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoCall911, setAutoCall911] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // Check location permission
    if ("geolocation" in navigator) {
      try {
        await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        setLocationPermission("granted");
      } catch {
        setLocationPermission("denied");
      }
    }

    // Check microphone permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission("granted");
      stream.getTracks().forEach(track => track.stop());
    } catch {
      setMicPermission("denied");
    }
  };

  const requestLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermission("granted");
          alert("Permiso de ubicación concedido");
        },
        () => {
          setLocationPermission("denied");
          alert("Permiso de ubicación denegado");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission("granted");
      stream.getTracks().forEach(track => track.stop());
      alert("Permiso de micrófono concedido");
    } catch {
      setMicPermission("denied");
      alert("Permiso de micrófono denegado");
    }
  };

  const testVibration = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    } else {
      alert("Vibración no soportada en este dispositivo");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pt-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Configuración</h1>
          </div>
          <p className="text-muted-foreground">Ajustes de seguridad y permisos</p>
        </div>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permisos del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Ubicación</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={locationPermission === "granted" ? "default" : "destructive"}>
                  {locationPermission === "granted" ? "Permitido" : "Denegado"}
                </Badge>
                {locationPermission !== "granted" && (
                  <Button size="sm" variant="outline" onClick={requestLocationPermission}>
                    Activar
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span>Micrófono</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={micPermission === "granted" ? "default" : "destructive"}>
                  {micPermission === "granted" ? "Permitido" : "Denegado"}
                </Badge>
                {micPermission !== "granted" && (
                  <Button size="sm" variant="outline" onClick={requestMicPermission}>
                    Activar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones y Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificaciones</Label>
                <p className="text-sm text-muted-foreground">Recibir alertas de la aplicación</p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex items-center gap-2">
                <Vibrate className="h-4 w-4" />
                <div>
                  <Label htmlFor="vibration">Vibración</Label>
                  <p className="text-sm text-muted-foreground">Vibrar durante emergencias</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="vibration"
                  checked={vibration}
                  onCheckedChange={setVibration}
                />
                <Button size="sm" variant="outline" onClick={testVibration}>
                  Probar
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <div>
                  <Label htmlFor="sound">Alertas de Sonido</Label>
                  <p className="text-sm text-muted-foreground">Sonidos de emergencia</p>
                </div>
              </div>
              <Switch
                id="sound"
                checked={soundAlerts}
                onCheckedChange={setSoundAlerts}
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Configuración de Emergencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto911">Llamada automática al 911</Label>
                <p className="text-sm text-muted-foreground">
                  Llamar automáticamente si no hay contactos
                </p>
              </div>
              <Switch
                id="auto911"
                checked={autoCall911}
                onCheckedChange={setAutoCall911}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Estado del Sistema</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Ubicación: {locationPermission === "granted" ? "✅ Activa" : "❌ Inactiva"}</p>
                <p>• Micrófono: {micPermission === "granted" ? "✅ Activo" : "❌ Inactivo"}</p>
                <p>• Notificaciones: {notifications ? "✅ Activas" : "❌ Inactivas"}</p>
                <p>• Vibración: {vibration ? "✅ Activa" : "❌ Inactiva"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset */}
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => {
                if (confirm("¿Estás seguro de que quieres restablecer todos los ajustes?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              Restablecer Configuración
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Esto eliminará todos los contactos y configuraciones
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
