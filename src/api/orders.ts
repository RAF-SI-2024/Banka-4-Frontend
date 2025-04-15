import { Axios } from 'axios';
import { CreateOrderRequest, OrderPreviewRequest } from '@/api/request/orders';
import { OrderDto, OrderPreviewDto } from '@/api/response/orders';
import { OrderStatus } from '@/types/orders';
import { Pageable } from '@/types/pageable';
import { cleanObject } from '@/lib/request-utils';

export const createOrder = async (client: Axios, body: CreateOrderRequest) =>
  client.post<OrderDto>('/stock/orders', cleanObject(body));

export const calculateAveragePrice = async (
  client: Axios,
  body: OrderPreviewRequest
) =>
  client.post<OrderPreviewDto>(
    '/stock/orders/calculate-average-price',
    cleanObject(body)
  );

export const searchOrders = async (
  client: Axios,
  status: OrderStatus,
  page: number,
  size: number
) =>
  client.get<Pageable<OrderDto>>('/stock/orders', {
    params: { statuses: status, page, size },
  });

export const approveOrder = async (client: Axios, orderId: string) =>
  client.post<void>(`/stocks/orders/${orderId}/approve`);

export const declineOrder = async (client: Axios, orderId: string) =>
  client.post<void>(`/stocks/orders/${orderId}/decline`);
