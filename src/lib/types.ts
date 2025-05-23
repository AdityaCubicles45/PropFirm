
export interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total?: number; // Optional: for cumulative total, not directly from Binance stream
}

export interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastUpdateId?: number; // From Binance
}

export type PositionType = 'BUY' | 'SELL';

// Binance WebSocket depth stream message structure (for reference)
// {
//   "e": "depthUpdate", // Event type
//   "E": 1672515782136, // Event time
//   "s": "BNBBTC",      // Symbol
//   "U": 157,           // First update ID in event
//   "u": 160,           // Final update ID in event
//   "b": [              // Bids to be updated
//     [
//       "0.0024",       // Price level to be updated
//       "10"            // Quantity
//     ]
//   ],
//   "a": [              // Asks to be updated
//     [
//       "0.0026",       // Price level to be updated
//       "100"           // Quantity
//     ]
//   ]
// }
// For @depth stream (full order book), it's:
// {
//   "lastUpdateId": 160,
//   "bids": [
//     [
//       "0.0024", // PRICE
//       "10"      // QTY
//     ]
//   ],
//   "asks": [
//     [
//       "0.0026",
//       "100"
//     ]
//   ]
// }
