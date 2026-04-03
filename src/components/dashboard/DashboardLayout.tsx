"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { User, LogOut, LayoutDashboard, Pill, ShoppingBag, ClipboardList, BarChart3, Settings, Store } from 'lucide-react';
import { MOCK_USERS } from '@/lib/store';
import { User as UserType } from '@/lib/types';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('farmacia_user_id');
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) {
      router.push('/');
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('farmacia_user_id');
    localStorage.removeItem('farmacia_user_role');
    router.push('/');
  };

  if (!currentUser) return null;

  const navigation = {
    PATIENT: [
      { name: 'Inicio', icon: LayoutDashboard, href: '/dashboard/patient' },
      { name: 'Mis Pedidos', icon: ShoppingBag, href: '/dashboard/patient/orders' },
    ],
    CLERK: [
      { name: 'Gestión Pedidos', icon: ClipboardList, href: '/dashboard/clerk' },
    ],
    ADMIN: [
      { name: 'Inventario', icon: Pill, href: '/dashboard/admin' },
      { name: 'Ventas', icon: BarChart3, href: '/dashboard/admin/reports' },
    ],
  };

  const currentNav = navigation[currentUser.role] || [];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <Sidebar>
          <SidebarHeader className="p-4 flex flex-row items-center gap-2">
            <Store className="text-primary h-6 w-6" />
            <span className="font-bold text-xl tracking-tight">FarmaciaPlus</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
              <SidebarMenu>
                {currentNav.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href}
                      tooltip={item.name}
                    >
                      <a href={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{currentUser.name}</span>
                <span className="text-xs text-muted-foreground truncate">{currentUser.role}</span>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="text-sm text-muted-foreground">
              Panel de {currentUser.role === 'PATIENT' ? 'Paciente' : currentUser.role === 'CLERK' ? 'Dependiente' : 'Admin'}
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
