export type UserRole = 'PATIENT' | 'CLERK' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Medication {
  id: string;
  name: string;
  concentration: string;
  presentation: string;
  quantity: number;
  price: number;
  lowStockThreshold: number;
}

export type OrderStatus = 'Created' | 'Preparing' | 'Ready' | 'Delivered' | 'Paid';

export interface OrderItem {
  medicationId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  patientName: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  deliveryAddress?: string;
  type: 'PICKUP' | 'DELIVERY';
  lightningInvoice?: string;
}