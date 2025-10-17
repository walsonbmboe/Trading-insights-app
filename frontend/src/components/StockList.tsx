// src/components/StockList.tsx
import React, { useEffect, useState } from 'react';
import StockCard from './StockCard';
import { fetchStocks } from '../services/api';
import type { Stock } from '../services/api';


const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStocks().then((data) => {
      setStocks(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading stock data...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stocks.map((stock) => (
        <StockCard
          key={stock.symbol}
          symbol={stock.symbol}
          company={stock.company}
          price={stock.price}
          change={stock.change}
        />
      ))}
    </div>
  );
};

export default StockList;
