import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Menu, 
  Home, 
  Settings, 
  History, 
  HelpCircle, 
  Users,
  Info,
  Phone
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const AppHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: Home, label: "Inicio", description: "Panel principal de emergencias" },
    { path: "/contacts", icon: Users, label: "Contactos", description: "Gestionar contactos de emergencia" },
    { path: "/history", icon: History, label: "Historial", description: "Registro de emergencias anteriores" },
    { path: "/settings", icon: Settings, label: "Configuración", description: "Permisos y ajustes de la app" },
    { path: "/help", icon: HelpCircle, label: "Ayuda", description: "Guía de uso y soporte" },
    { path: "/about", icon: Info, label: "Acerca de", description: "Información de la aplicación" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-emergency" />
          <div>
            <h1 className="text-xl font-bold text-foreground">SafeAlert</h1>
            <p className="text-xs text-muted-foreground leading-none">Emergencias</p>
          </div>
        </div>

        {/* Emergency Status Badge */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden sm:flex">
            <Phone className="h-3 w-3 mr-1" />
            911
          </Badge>
          
          {/* Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="py-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                  <Shield className="h-8 w-8 text-emergency" />
                  <div>
                    <h2 className="text-lg font-semibold">SafeAlert</h2>
                    <p className="text-sm text-muted-foreground">Sistema de emergencia personal</p>
                  </div>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors hover:bg-secondary ${
                          isActive(item.path) 
                            ? "bg-secondary text-secondary-foreground" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                        {isActive(item.path) && (
                          <div className="h-2 w-2 rounded-full bg-emergency" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Emergency Numbers */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-medium mb-3">Números de emergencia</h3>
                  <div className="space-y-2">
                    <a 
                      href="tel:911" 
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-emergency"
                    >
                      <Phone className="h-4 w-4" />
                      <span>911 - Policía/Bomberos</span>
                    </a>
                    <a 
                      href="tel:065" 
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-emergency"
                    >
                      <Phone className="h-4 w-4" />
                      <span>065 - Cruz Roja</span>
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
