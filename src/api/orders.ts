import { Axios } from 'axios';
import { CreateOrderRequest, OrderPreviewRequest } from '@/api/request/orders';
import { OrderDto, OrderPreviewDto } from '@/api/response/orders';

export const createOrder = async (client: Axios, body: CreateOrderRequest) =>
  client.post<OrderDto>('/stock/orders', body);

export const calculateAveragePrice = async (
  client: Axios,
  body: OrderPreviewRequest
) =>
  client.post<OrderPreviewDto>('/stock/orders/calculate-average-price', body);
