// src/components/StockCard.tsx
import React from 'react';
import TradingSignals from './TradingSignals';

type StockProps = {
  symbol: string;
  company: string;
  price: number;
  change: number;
};

const StockCard: React.FC<StockProps> = ({ symbol, company, price, change }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold">{symbol} 📈</h2>
      <p className="text-gray-700">{company}</p>
      <p className="text-lg font-semibold">£{price}</p>
      <p className={`text-sm ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
        {change > 0 ? '+' : ''}{change}%
      </p>

      {/* Add Trading Signal below */}
      <TradingSignals symbol={symbol} change={change} />
    </div>
  );
};

export default StockCard;
