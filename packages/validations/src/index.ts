import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['customer', 'admin', 'vendor']).default('customer'),
});

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  price: z.number().min(0),
  quantity: z.number().int().min(0).default(0),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  status: z.enum(['active', 'inactive', 'draft']).default('active'),
});

export const orderSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).default('pending'),
  total: z.number().min(0),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
  })),
});

export const searchQuerySchema = z.object({
  query: z.string().min(1).max(200),
  filters: z.object({
    category: z.string().optional(),
    priceRange: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
    inStock: z.boolean().optional(),
  }).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type User = z.infer<typeof userSchema>;
export type Product = z.infer<typeof productSchema>;
export type Order = z.infer<typeof orderSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
