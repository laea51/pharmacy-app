"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pill, Upload, Send, Package, Truck, CheckCircle2, Bitcoin } from 'lucide-react';
import { extractMedicationDetailsFromSlip } from '@/ai/flows/extract-medication-details-from-slip-flow';
import { INITIAL_ORDERS, getStatusColor } from '@/lib/store';
import { Order, OrderItem } from '@/lib/types';

export default function PatientDashboard() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedMeds, setExtractedMeds] = useState<{name: string, dosage: string, quantity: string}[]>([]);
  const [slipText, setSlipText] = useState('');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [view, setView] = useState<'HOME' | 'PAYMENT'>('HOME');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const handleExtract = async () => {
    if (!slipText) return;
    setIsExtracting(true);
    try {
      const result = await extractMedicationDetailsFromSlip({ slipText });
      setExtractedMeds(result);
    } catch (error) {
      console.error("Extraction failed", error);
    } finally {
      setIsExtracting(false);
    }
  };

  const createOrder = (type: 'PICKUP' | 'DELIVERY') => {
    const items: OrderItem[] = extractedMeds.map((med, i) => ({
      medicationId: `temp-${i}`,
      name: med.name,
      quantity: 1, // simplified
      unitPrice: 10.00 // simplified
    }));

    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 900) + 100}`,
      userId: '1',
      patientName: 'Juan Pérez',
      items,
      status: 'Created',
      total: items.length * 10.00,
      createdAt: new Date().toISOString(),
      type,
      deliveryAddress: type === 'DELIVERY' ? 'Dirección Guardada' : undefined,
      lightningInvoice: 'lnbc100u1p3...'
    };

    setOrders([newOrder, ...orders]);
    setCurrentOrder(newOrder);
    setView('PAYMENT');
  };

  if (view === 'PAYMENT' && currentOrder) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Bitcoin className="text-primary" /> Pago Lightning
              </CardTitle>
              <CardDescription>Escanea el código QR para confirmar tu pedido</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="bg-white p-6 rounded-xl border-2 border-primary/20">
                <div className="w-64 h-64 bg-slate-100 flex items-center justify-center text-slate-400 relative">
                  {/* Lightning QR Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=lightning-invoice-demo" alt="Lightning QR" className="w-full h-full" />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{currentOrder.total.toFixed(2)} USD</p>
                <p className="text-sm text-muted-foreground font-mono truncate w-full max-w-[250px]">{currentOrder.lightningInvoice}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => {
                const updatedOrders = orders.map(o => o.id === currentOrder.id ? {...o, status: 'Paid' as any} : o);
                setOrders(updatedOrders);
                setView('HOME');
              }}>
                Confirmar Pago (Simulación)
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setView('HOME')}>Volver</Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="text-primary h-5 w-5" /> Nueva Receta
              </CardTitle>
              <CardDescription>Sube una foto o pega el texto de tu receta médica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="border-2 border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group">
                <Upload className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                <p className="text-sm font-medium">Click para subir foto</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG o PDF</p>
              </div>
              <div className="space-y-2">
                <Label>Texto de la receta</Label>
                <Textarea 
                  placeholder="Pega aquí el contenido de tu receta si no tienes foto..." 
                  className="min-h-[120px]"
                  value={slipText}
                  onChange={(e) => setSlipText(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleExtract}
                disabled={isExtracting || !slipText}
              >
                {isExtracting ? 'Analizando receta...' : <><Send className="mr-2 h-4 w-4" /> Analizar con AI</>}
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="text-primary h-5 w-5" /> Medicamentos Identificados
              </CardTitle>
              <CardDescription>Confirma los detalles extraídos por nuestra AI</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {extractedMeds.length > 0 ? (
                <div className="space-y-4">
                  {extractedMeds.map((med, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm">
                      <div>
                        <p className="font-semibold text-primary">{med.name}</p>
                        <p className="text-sm text-muted-foreground">{med.dosage} - {med.quantity}</p>
                      </div>
                      <Badge variant="outline">Confirmado</Badge>
                    </div>
                  ))}
                  <div className="pt-4 space-y-4 border-t mt-4">
                    <p className="text-sm font-medium">Selecciona método de entrega:</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex flex-col gap-1" onClick={() => createOrder('PICKUP')}>
                        <Store className="h-5 w-5" />
                        <span>Retiro en Tienda</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col gap-1 border-primary/40 bg-primary/5" onClick={() => createOrder('DELIVERY')}>
                        <Truck className="h-5 w-5 text-primary" />
                        <span>Envío a Domicilio</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                  <CheckCircle2 className="h-12 w-12 mb-4 opacity-20" />
                  <p>Sube una receta para ver los medicamentos aquí.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="text-primary h-5 w-5" /> Historial de Pedidos
            </CardTitle>
            <CardDescription>Seguimiento de tus compras recientes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {order.type === 'PICKUP' ? 'Retiro' : 'Entrega'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status === 'Paid' ? 'Pagado' : 
                         order.status === 'Created' ? 'Creado' : 
                         order.status === 'Preparing' ? 'Preparando' : 
                         order.status === 'Ready' ? 'Listo' : 'Entregado'}
                      </Badge>
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
