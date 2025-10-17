// src/components/TradingSignals.tsx
import React from 'react';

type SignalProps = {
  symbol: string;
  change: number;
};

const TradingSignals: React.FC<SignalProps> = ({ symbol, change }) => {
  const signal = change > 1 ? 'Buy' : change < -1 ? 'Sell' : 'Hold';
  const color = signal === 'Buy' ? 'text-green-600' : signal === 'Sell' ? 'text-red-600' : 'text-gray-600';

  return (
    <div className={`p-2 rounded bg-white shadow text-sm ${color}`}>
      {symbol}: {signal}
    </div>
  );
};

export default TradingSignals;
