import { Medication, Order, User } from './types';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan@example.com', role: 'PATIENT' },
  { id: '2', name: 'Marta Gómez', email: 'marta@example.com', role: 'CLERK' },
  { id: '3', name: 'Admin Farmacia', email: 'admin@example.com', role: 'ADMIN' },
];

export const INITIAL_MEDICATIONS: Medication[] = [
  { id: 'm1', name: 'Paracetamol', concentration: '500mg', presentation: 'Tabletas', quantity: 150, price: 5.50, lowStockThreshold: 20 },
  { id: 'm2', name: 'Ibuprofeno', concentration: '400mg', presentation: 'Cápsulas', quantity: 10, price: 8.20, lowStockThreshold: 15 },
  { id: 'm3', name: 'Amoxicilina', concentration: '250mg', presentation: 'Suspensión', quantity: 30, price: 12.00, lowStockThreshold: 5 },
  { id: 'm4', name: 'Loratadina', concentration: '10mg', presentation: 'Tabletas', quantity: 100, price: 4.50, lowStockThreshold: 20 },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    userId: '1',
    patientName: 'Juan Pérez',
    items: [{ medicationId: 'm1', name: 'Paracetamol', quantity: 1, unitPrice: 5.50 }],
    status: 'Delivered',
    total: 5.50,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    type: 'PICKUP'
  },
  {
    id: 'ORD-002',
    userId: '1',
    patientName: 'Juan Pérez',
    items: [{ medicationId: 'm2', name: 'Ibuprofeno', quantity: 2, unitPrice: 8.20 }],
    status: 'Preparing',
    total: 16.40,
    createdAt: new Date().toISOString(),
    type: 'DELIVERY',
    deliveryAddress: 'Calle Falsa 123'
  }
];

export function getStatusColor(status: string) {
  switch (status) {
    case 'Created': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Ready': return 'bg-green-100 text-green-800 border-green-200';
    case 'Delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'Paid': return 'bg-accent text-accent-foreground border-accent';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}