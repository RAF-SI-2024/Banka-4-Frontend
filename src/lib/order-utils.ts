import { OrderType } from '@/types/orders';

export const orderTypeToHumanReadable = (orderType: OrderType) => {
  switch (orderType) {
    case 'LIMIT':
      return 'Limit';
    case 'MARKET':
      return 'Market';
    case 'STOP':
      return 'Stop';
    case 'STOP_LIMIT':
      return 'Stop-Limit';
  }
};
