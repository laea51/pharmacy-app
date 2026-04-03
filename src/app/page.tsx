"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, ShieldCheck, User as UserIcon, LogIn, Store } from 'lucide-react';
import { MOCK_USERS } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = (userId: string, role: string) => {
    setLoading(userId);
    // In a real app, this would set a session/cookie
    localStorage.setItem('farmacia_user_id', userId);
    localStorage.setItem('farmacia_user_role', role);
    
    setTimeout(() => {
      router.push(`/dashboard/${role.toLowerCase()}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-12">
      <div className="text-center space-y-4 max-w-2xl">
        <div className="flex items-center justify-center space-x-2 text-primary">
          <Store size={48} />
          <h1 className="text-5xl font-bold tracking-tight">FarmaciaPlus</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Tu salud, nuestra prioridad. Gestión moderna de medicamentos con pagos en Bitcoin Lightning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {MOCK_USERS.map((user) => (
          <Card key={user.id} className="relative overflow-hidden group hover:shadow-xl transition-all border-2 border-transparent hover:border-primary/20">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-secondary p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {user.role === 'PATIENT' && <UserIcon size={32} className="text-primary" />}
                {user.role === 'CLERK' && <Pill size={32} className="text-primary" />}
                {user.role === 'ADMIN' && <ShieldCheck size={32} className="text-primary" />}
              </div>
              <CardTitle className="text-xl">
                {user.role === 'PATIENT' ? 'Acceso Paciente' : user.role === 'CLERK' ? 'Acceso Farmacéutico' : 'Acceso Administrador'}
              </CardTitle>
              <CardDescription>Entrar como {user.name}</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              {user.role === 'PATIENT' && 'Sube tus recetas, haz pedidos y rastrea tu medicación.'}
              {user.role === 'CLERK' && 'Gestiona pedidos entrantes y actualiza estados de entrega.'}
              {user.role === 'ADMIN' && 'Control de inventario, reportes de ventas y alertas de stock.'}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-12 text-lg" 
                onClick={() => handleLogin(user.id, user.role)}
                disabled={loading !== null}
              >
                {loading === user.id ? 'Cargando...' : <><LogIn className="mr-2 h-5 w-5" /> Iniciar Sesión</>}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center text-muted-foreground text-sm">
        <p>Utilizamos tecnología AI para extraer detalles de tus recetas médicas de forma segura.</p>
        <p className="mt-2">Pagos instantáneos vía Bitcoin Lightning Network.</p>
      </div>
    </div>
  );
}
