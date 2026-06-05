export type TradeOrderSide = 'BUY' | 'SELL';

export type TradeOrderStatus = 'CANCELLED' | 'FILLED' | 'PARTIAL' | 'PENDING';

export type TradeOrderType = 'LIMIT' | 'MARKET';

export interface TradeOrder {
  createdAt: string;
  filledAt?: string;
  filledPrice?: number;
  id: string;
  limitPrice?: number;
  name: string;
  quantity: number;
  side: TradeOrderSide;
  status: TradeOrderStatus;
  symbol: string;
  type: TradeOrderType;
}
