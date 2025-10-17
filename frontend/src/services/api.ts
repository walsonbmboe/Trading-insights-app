// src/services/api.ts
export type Stock = {
  symbol: string;
  company: string;
  price: number;
  change: number;
};

export const fetchStocks = async (): Promise<Stock[]> => {
  // Simulated delay
  await new Promise((res) => setTimeout(res, 500));

  // Simulated large dataset
  return [
    { symbol: 'AAPL', company: 'Apple Inc.', price: 150.25, change: 1.2 },
    { symbol: 'GOOGL', company: 'Alphabet Inc.', price: 2750.65, change: -0.8 },
    { symbol: 'TSLA', company: 'Tesla Inc.', price: 720.10, change: 0.0 },
    { symbol: 'AMZN', company: 'Amazon.com Inc.', price: 3300.00, change: 2.5 },
    { symbol: 'MSFT', company: 'Microsoft Corp.', price: 299.99, change: 0.5 },
    { symbol: 'NFLX', company: 'Netflix Inc.', price: 450.75, change: -1.1 },
    { symbol: 'NVDA', company: 'NVIDIA Corp.', price: 620.40, change: 3.2 },
    { symbol: 'META', company: 'Meta Platforms Inc.', price: 310.20, change: -0.3 },
    { symbol: 'BABA', company: 'Alibaba Group', price: 180.50, change: 1.8 },
    { symbol: 'INTC', company: 'Intel Corp.', price: 45.30, change: -0.6 },
    // Add more if needed
  ];
};
