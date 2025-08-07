import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function Placeholder({ title, description, icon }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-background p-4 pt-20">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="flex justify-center mb-4">
              {icon || <Construction className="h-12 w-12 text-muted-foreground" />}
            </div>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{description}</p>
            <p className="text-sm text-muted-foreground">
              Esta sección estará disponible próximamente
            </p>
            <Link to="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
