import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  MapPin,
  Mic,
  Settings,
  Shield,
  Users,
  Plus,
  X,
  PhoneCall,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export default function Index() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null,
  );
  const [locationPermission, setLocationPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");
  const [micPermission, setMicPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");
  const [isRecording, setIsRecording] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [emergencyLog, setEmergencyLog] = useState<string[]>([]);
  const [currentContactIndex, setCurrentContactIndex] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedContacts = localStorage.getItem("emergencyContacts");
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }

    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // Check location permission
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
            });
          },
        );
        setLocationPermission("granted");
        updateLocation(position);
      } catch {
        setLocationPermission("denied");
      }
    }

    // Check microphone permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission("granted");
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      setMicPermission("denied");
    }
  };

  const updateLocation = (position: GeolocationPosition) => {
    const locationData: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: Date.now(),
    };
    setCurrentLocation(locationData);
  };

  const requestLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission("granted");
          updateLocation(position);
        },
        () => setLocationPermission("denied"),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    }
  };

  const updateCurrentLocation = () => {
    if (locationPermission === "granted" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocation(position);
          // Show success feedback
          const log = emergencyLog.length > 0 ? [...emergencyLog] : [];
          log.push(`📍 Ubicación actualizada: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
          if (isEmergencyActive) {
            setEmergencyLog(log);
          }
        },
        (error) => {
          console.error("Error updating location:", error);
          alert("No se pudo actualizar la ubicación. Verifica tus permisos.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission("granted");
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      setMicPermission("denied");
    }
  };

  const addContact = () => {
    if (
      newContactName.trim() &&
      newContactPhone.trim() &&
      contacts.length < 3
    ) {
      const newContact: Contact = {
        id: Date.now().toString(),
        name: newContactName.trim(),
        phone: newContactPhone.trim(),
      };
      const updatedContacts = [...contacts, newContact];
      setContacts(updatedContacts);
      localStorage.setItem(
        "emergencyContacts",
        JSON.stringify(updatedContacts),
      );
      setNewContactName("");
      setNewContactPhone("");
      setShowAddContact(false);
    }
  };

  const removeContact = (id: string) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
    localStorage.setItem("emergencyContacts", JSON.stringify(updatedContacts));
  };

  const startRecording = async () => {
    if (micPermission === "granted") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
        setIsRecording(true);

        // Auto-stop recording after 30 seconds
        recordingTimeoutRef.current = setTimeout(() => {
          stopRecording();
        }, 30000);
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);

      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    }
  };

  const startTestRecording = async () => {
    if (micPermission === "granted" && !isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        mediaRecorderRef.current = new MediaRecorder(stream);

        const audioChunks: BlobPart[] = [];
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);

          // Create a temporary audio element to play the recording
          const audio = new Audio(audioUrl);
          audio.play().catch(err => console.error("Error playing audio:", err));
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);

        // Auto-stop after 5 seconds for test
        recordingTimeoutRef.current = setTimeout(() => {
          stopRecording();
        }, 5000);

      } catch (error) {
        console.error("Error starting test recording:", error);
        alert("Error al iniciar grabación de prueba");
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startTestRecording();
    }
  };

  const activateEmergency = async () => {
    setIsEmergencyActive(true);
    setCurrentContactIndex(0);
    const log: string[] = [];

    log.push("🚨 EMERGENCIA ACTIVADA");
    log.push(`⏰ ${new Date().toLocaleString()}`);

    // Get current location
    if (locationPermission === "granted") {
      navigator.geolocation.getCurrentPosition((position) => {
        updateLocation(position);
        const newLog = [
          ...log,
          `📍 Ubicación capturada: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
          `🎯 Precisión: ${position.coords.accuracy.toFixed(0)} metros`
        ];
        setEmergencyLog(newLog);
      });
    } else {
      log.push("⚠️ Ubicación no disponible - activar permisos");
    }

    // Start recording
    if (micPermission === "granted") {
      await startRecording();
      log.push("🎤 Grabación de audio iniciada (30 segundos)");
    } else {
      log.push("⚠️ Micrófono no disponible - activar permisos");
    }

    setEmergencyLog([...log]);

    // Handle contacts
    if (contacts.length === 0) {
      log.push("⚠️ No hay contactos configurados");
      log.push("📞 Llama manualmente a servicios de emergencia:");
      log.push("🚑 Cruz Roja: 065");
      log.push("🚓 Policía: 911");
      log.push("🚒 Bomberos: 911");
      setEmergencyLog([...log]);

      // Auto-dial emergency services after 5 seconds
      setTimeout(() => {
        if (confirm("¿Llamar automáticamente al 911?")) {
          window.location.href = "tel:911";
        }
      }, 5000);
    } else {
      // Start calling contacts
      log.push("📞 Iniciando llamadas de emergencia...");
      setEmergencyLog([...log]);
      callNextContact(0, [...log]);
    }
  };

  const callNextContact = (index: number, log: string[]) => {
    if (index >= contacts.length) {
      log.push("⚠️ No se pudo contactar a ningún contacto");
      setEmergencyLog([...log]);
      return;
    }

    const contact = contacts[index];
    setCurrentContactIndex(index);
    log.push(`📞 Llamando a ${contact.name} (${contact.phone})...`);
    setEmergencyLog([...log]);

    // Simulate call - in real implementation, this would integrate with phone system
    const phoneUrl = `tel:${contact.phone}`;
    window.location.href = phoneUrl;

    // Simulate waiting for answer - in real app, this would be automated
    setTimeout(() => {
      const answered = confirm(`¿${contact.name} contestó la llamada?`);
      if (answered) {
        log.push(`✅ ${contact.name} contestó la llamada`);
        log.push("🚨 Emergencia reportada exitosamente");
        setEmergencyLog([...log]);
      } else {
        log.push(`❌ ${contact.name} no contestó`);
        callNextContact(index + 1, log);
      }
    }, 3000);
  };

  const deactivateEmergency = () => {
    setIsEmergencyActive(false);
    stopRecording();
    setEmergencyLog([]);
    setCurrentContactIndex(0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-emergency" />
            <h1 className="text-3xl font-bold text-foreground">SafeAlert</h1>
          </div>
          <p className="text-muted-foreground">
            Sistema de emergencia personal
          </p>
        </div>

        {/* Emergency Status */}
        {isEmergencyActive && (
          <Card className="border-emergency bg-emergency-light/10 animate-pulse">
            <CardHeader className="pb-3">
              <CardTitle className="text-emergency flex items-center gap-2">
                <Shield className="h-5 w-5 animate-pulse" />
                EMERGENCIA ACTIVA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-40 overflow-y-auto space-y-2">
                {emergencyLog.map((entry, index) => (
                  <p key={index} className="text-sm text-foreground bg-background/50 rounded px-2 py-1">
                    {entry}
                  </p>
                ))}
              </div>
              {contacts.length > 0 && currentContactIndex < contacts.length && (
                <div className="flex items-center gap-2 bg-secondary/50 rounded p-3">
                  <Phone className="h-4 w-4 text-emergency animate-bounce" />
                  <span className="text-sm font-medium">
                    Contactando: {contacts[currentContactIndex]?.name}
                  </span>
                </div>
              )}
              {isRecording && (
                <div className="flex items-center gap-2 bg-safe-light/20 rounded p-3">
                  <Mic className="h-4 w-4 text-safe animate-pulse" />
                  <span className="text-sm text-safe">
                    🔴 Grabando audio...
                  </span>
                </div>
              )}
              <Button
                onClick={deactivateEmergency}
                variant="outline"
                size="sm"
                className="w-full border-emergency text-emergency hover:bg-emergency hover:text-emergency-foreground"
              >
                Cancelar Emergencia
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Emergency Button */}
        {!isEmergencyActive && (
          <Card className="border-2 border-emergency">
            <CardContent className="p-8 text-center">
              <Button
                onClick={activateEmergency}
                size="lg"
                className="w-full h-32 text-2xl font-bold bg-emergency hover:bg-emergency-dark text-emergency-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              >
                <Shield className="mr-3 h-8 w-8" />
                EMERGENCIA
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                {contacts.length === 0
                  ? "Activará emergencia y servicios locales"
                  : "Enviará ubicación y llamará a contactos"}
              </p>
              {contacts.length === 0 && (
                <p className="text-xs text-warning-foreground bg-warning-light/20 rounded-md px-3 py-2 mt-2">
                  ⚠️ Configura contactos para mayor protección
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Permissions Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Estado de Permisos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Ubicación</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    locationPermission === "granted" ? "default" : "destructive"
                  }
                >
                  {locationPermission === "granted" ? "Permitido" : "Denegado"}
                </Badge>
                {locationPermission === "granted" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={updateCurrentLocation}
                    className="text-xs"
                  >
                    Actualizar
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={requestLocationPermission}
                  >
                    Permitir
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className={`h-4 w-4 ${isRecording ? 'text-emergency animate-pulse' : ''}`} />
                <span>Micrófono</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    micPermission === "granted" ? "default" : "destructive"
                  }
                >
                  {micPermission === "granted" ? "Permitido" : "Denegado"}
                </Badge>
                {micPermission === "granted" ? (
                  <Button
                    size="sm"
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={toggleRecording}
                    className="text-xs"
                  >
                    {isRecording ? "Parar" : "Probar"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={requestMicPermission}
                  >
                    Permitir
                  </Button>
                )}
              </div>
            </div>

            {currentLocation && (
              <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
                <div className="text-xs text-muted-foreground">
                  📍 <strong>Ubicación actual:</strong>
                  <br />
                  <span className="font-mono">{currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}</span>
                  <br />
                  🎯 <strong>Precisión:</strong> {currentLocation.accuracy.toFixed(0)} metros
                  <br />
                  ⏰ <strong>Actualizada:</strong> {new Date(currentLocation.timestamp).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={updateCurrentLocation}
                    className="text-xs flex items-center gap-1"
                  >
                    <MapPin className="h-3 w-3" />
                    Actualizar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const url = `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
                      window.open(url, '_blank');
                    }}
                    className="text-xs flex items-center gap-1"
                  >
                    🗺️ Ver en Mapa
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contactos de Emergencia
            </CardTitle>
            <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={contacts.length >= 3}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Contacto</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      placeholder="Nombre del contacto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      placeholder="+1234567890"
                      type="tel"
                    />
                  </div>
                  <Button onClick={addContact} className="w-full">
                    Agregar Contacto
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay contactos de emergencia configurados
              </p>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {contact.phone}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeContact(contact.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Separator className="my-4" />
            <p className="text-xs text-muted-foreground">
              Máximo 3 contactos. Se llamarán en orden hasta que alguien
              conteste.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            En caso de emergencia real, también contacta servicios de emergencia
            locales
          </p>
        </div>
      </div>
    </div>
  );
}
