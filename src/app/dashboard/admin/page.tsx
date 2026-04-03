"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { INITIAL_MEDICATIONS } from '@/lib/store';
import { Medication } from '@/lib/types';
import { Pill, Plus, AlertTriangle, Search, Pencil, Trash2 } from 'lucide-react';

export default function AdminInventory() {
  const [inventory, setInventory] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newMed, setNewMed] = useState<Partial<Medication>>({
    name: '', concentration: '', presentation: '', quantity: 0, price: 0, lowStockThreshold: 10
  });

  const handleAdd = () => {
    const med: Medication = {
      ...newMed as Medication,
      id: `m${inventory.length + 1}`
    };
    setInventory([...inventory, med]);
    setIsAdding(false);
    setNewMed({ name: '', concentration: '', presentation: '', quantity: 0, price: 0, lowStockThreshold: 10 });
  };

  const filteredInventory = inventory.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Inventario de Medicamentos</h1>
            <p className="text-muted-foreground text-lg">Control de stock y precios de la farmacia.</p>
          </div>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="h-11 px-6"><Plus className="mr-2 h-5 w-5" /> Añadir Medicamento</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Medicamento</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nombre</Label>
                  <Input id="name" className="col-span-3" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="conc" className="text-right">Conc.</Label>
                  <Input id="conc" className="col-span-3" value={newMed.concentration} onChange={e => setNewMed({...newMed, concentration: e.target.value})} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pres" className="text-right">Pres.</Label>
                  <Input id="pres" className="col-span-3" value={newMed.presentation} onChange={e => setNewMed({...newMed, presentation: e.target.value})} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="qty" className="text-right">Stock</Label>
                  <Input id="qty" type="number" className="col-span-3" value={newMed.quantity} onChange={e => setNewMed({...newMed, quantity: parseInt(e.target.value)})} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Precio ($)</Label>
                  <Input id="price" type="number" step="0.01" className="col-span-3" value={newMed.price} onChange={e => setNewMed({...newMed, price: parseFloat(e.target.value)})} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancelar</Button>
                <Button onClick={handleAdd}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-3">
            <CardHeader className="pb-3 border-b mb-4 flex flex-row items-center justify-between space-y-0">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar medicamentos..." 
                  className="pl-9 h-10" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Medicamento</TableHead>
                    <TableHead>Concentración</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Precio Unit.</TableHead>
                    <TableHead className="text-right pr-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell className="pl-6 font-medium">{med.name}</TableCell>
                      <TableCell>{med.concentration} / {med.presentation}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {med.quantity}
                          {med.quantity <= med.lowStockThreshold && (
                            <Badge variant="destructive" className="h-5 px-1.5"><AlertTriangle className="h-3 w-3 mr-1" /> Bajo</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">${med.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right pr-6 space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><Pencil size={16} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 size={16} /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Alertas de Stock</CardTitle>
              <CardDescription>Medicamentos por debajo del límite.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {inventory.filter(m => m.quantity <= m.lowStockThreshold).map(m => (
                <div key={m.id} className="flex flex-col gap-1 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <p className="text-sm font-semibold">{m.name}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Actual: {m.quantity}</span>
                    <span className="text-destructive font-bold">Mín: {m.lowStockThreshold}</span>
                  </div>
                </div>
              ))}
              {inventory.every(m => m.quantity > m.lowStockThreshold) && (
                <p className="text-sm text-center text-muted-foreground py-4">Sin alertas activas.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
