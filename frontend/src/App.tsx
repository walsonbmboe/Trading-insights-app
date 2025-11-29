import { Routes, Route } from "react-router-dom";
import Home from "./Pages/home";
import Sentiments from "./Pages/Sentiments";
import Portfolio from "./Pages/portfolio";

export default function App() {
  return (
    <>
      {/* Tailwind Test Box */}
      <div className="bg-red-500 p-10 text-white text-3xl">
        TAILWIND TEST
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sentiments" element={<Sentiments />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </>
  );
}
