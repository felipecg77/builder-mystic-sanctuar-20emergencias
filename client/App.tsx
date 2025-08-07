import React from "react";
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import { Users, History, Info } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppHeader />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route
            path="/contacts"
            element={
              <Placeholder
                title="Gestión de Contactos"
                description="Administra tus contactos de emergencia de forma avanzada"
                icon={<Users className="h-12 w-12 text-muted-foreground" />}
              />
            }
          />
          <Route
            path="/history"
            element={
              <Placeholder
                title="Historial de Emergencias"
                description="Revisa el registro de todas tus activaciones de emergencia"
                icon={<History className="h-12 w-12 text-muted-foreground" />}
              />
            }
          />
          <Route
            path="/about"
            element={
              <Placeholder
                title="Acerca de SafeAlert"
                description="Información sobre la aplicación, versión y desarrolladores"
                icon={<Info className="h-12 w-12 text-muted-foreground" />}
              />
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
