"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { INITIAL_ORDERS, getStatusColor } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import { ClipboardList, Filter, Bell } from 'lucide-react';

export default function ClerkDashboard() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    // Simulating notification
    if (newStatus === 'Ready') {
      alert(`Notificación enviada al paciente para el pedido ${orderId}: Su pedido está listo.`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Pedidos</h1>
            <p className="text-muted-foreground text-lg">Procesa y actualiza el estado de las recetas entrantes.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtrar</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Bell className="mr-2 h-4 w-4" /> Notificar Pendientes</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="text-primary" /> Lista de Trabajo
            </CardTitle>
            <CardDescription>Gestiona el flujo de preparación y entrega.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pedido</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Medicamentos</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado Actual</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.id}</TableCell>
                    <TableCell className="font-medium">{order.patientName}</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        {order.items.map((item, idx) => (
                          <div key={idx}>{item.name} x {item.quantity}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.type === 'PICKUP' ? 'Tienda' : 'Domicilio'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select 
                        onValueChange={(val) => updateStatus(order.id, val as OrderStatus)}
                        defaultValue={order.status}
                      >
                        <SelectTrigger className="w-[140px] ml-auto">
                          <SelectValue placeholder="Cambiar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Created">Creado</SelectItem>
                          <SelectItem value="Preparing">Preparando</SelectItem>
                          <SelectItem value="Ready">Listo</SelectItem>
                          <SelectItem value="Delivered">Entregado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
