import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/stocks`)
      .then(res => res.json())
      .then(data => {
        setStocks(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stocks:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <h1>Trading Insights Dashboard</h1>
      {loading ? (
        <p>Loading stock data...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Company</th>
              <th>Action</th>
              <th>Price</th>
              <th>Change</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock: any) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.company}</td>
                <td>{stock.action}</td>
                <td>${stock.price}</td>
                <td>{stock.change}%</td>
                <td>{stock.confidence}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
