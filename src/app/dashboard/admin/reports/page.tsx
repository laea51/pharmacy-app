"use client";

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';

const SALES_DATA = [
  { day: 'Lun', total: 450 },
  { day: 'Mar', total: 620 },
  { day: 'Mie', total: 380 },
  { day: 'Jue', total: 810 },
  { day: 'Vie', total: 950 },
  { day: 'Sab', total: 1100 },
  { day: 'Dom', total: 720 },
];

const TOP_MEDS = [
  { name: 'Paracetamol', sales: 120, value: 660, fill: 'hsl(var(--primary))' },
  { name: 'Ibuprofeno', sales: 85, value: 697, fill: 'hsl(var(--accent))' },
  { name: 'Loratadina', sales: 45, value: 202.5, fill: 'hsl(var(--chart-3))' },
  { name: 'Amoxicilina', sales: 30, value: 360, fill: 'hsl(var(--chart-4))' },
];

export default function SalesReports() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reportes de Ventas</h1>
          <p className="text-muted-foreground text-lg">Análisis de rendimiento comercial.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales (Mes)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450.00</div>
              <p className="text-xs text-muted-foreground">+12% respecto al mes anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Completados</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">+5% esta semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unidades Vendidas</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,024</div>
              <p className="text-xs text-muted-foreground">Más vendido: Paracetamol</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$50.80</div>
              <p className="text-xs text-muted-foreground">Estable este mes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ventas Diarias (Últimos 7 días)</CardTitle>
              <CardDescription>Monto total de ventas por día.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={{ 
                total: { label: 'Ventas ($)', color: 'hsl(var(--primary))' } 
              }}>
                <BarChart data={SALES_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Productos</CardTitle>
              <CardDescription>Por volumen de unidades.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TOP_MEDS}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="sales"
                  >
                    {TOP_MEDS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalle por Medicamento</CardTitle>
            <CardDescription>Reporte desglosado de ventas mensuales.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicamento</TableHead>
                  <TableHead>Cant. Vendida</TableHead>
                  <TableHead>Precio Prom.</TableHead>
                  <TableHead className="text-right">Total Ventas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOP_MEDS.map((med) => (
                  <TableRow key={med.name}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.sales} u.</TableCell>
                    <TableCell>${(med.value / med.sales).toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">${med.value.toFixed(2)}</TableCell>
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
