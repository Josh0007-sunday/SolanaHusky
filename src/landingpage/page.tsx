import { useState, useEffect } from "react";
import { Dog, Sun, Moon } from "lucide-react";
import globe from "./globe.gif";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useNavigate,
} from "react-router-dom";

const HuskyLanding = () => {
  const [isDark, setIsDark] = useState(false);
  const { connected } = useWallet(); // Destructure the `connected` status from useWallet
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (connected) {
      navigate("/dashboard"); // Redirect if wallet is connected
    }
  }, [connected, navigate]);

  return (
    <div
      className={`min-h-screen font-mono transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-pink-400"
          : "bg-gradient-to-b from-pink-50 to-white text-pink-600"
      }`}
    >
      {/* Navbar */}
      <nav
        className={`border-b transition-colors duration-300 ${
          isDark ? "border-pink-400/20" : "border-pink-200"
        } p-4`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dog className="w-6 h-6 text-pink-500" />
            <span className="text-xl tracking-wider">HUSKY_NFT</span>
          </div>
          <div className="flex items-center space-x-8">
            {["About", "Community", "Connect"].map((item) => (
              <button
                key={item}
                className={`hover:text-pink-500 transition-colors ${
                  isDark ? "text-pink-400" : "text-pink-600"
                }`}
              >
                {"> " + item}
              </button>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-pink-400 hover:bg-pink-400 hover:text-white transition-all"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
          HUSKY NFT
        </h1>

        {/* Globe and Rocket Animation Container */}
        <div className="relative w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] aspect-square mx-auto ">
          {/* Pink blur backdrop */}
          <div className="absolute inset-0 rounded-full bg-pink-400/20 blur-3xl transform scale-90"></div>

          {/* Globe container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={globe}
              alt="Globe Animation"
              className={`w-[100%] h-[100%] object-contain transform scale-110 ${
                isDark ? "opacity-50" : ""
              }`}
            />
          </div>

          {/* Rocket container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-[moveRocket_12s_ease-in-out_infinite] text-6xl md:text-7xl lg:text-8xl">
              🚀
            </div>
          </div>
        </div>

        <p
          className={`text-lg md:text-xl mt-4 max-w-2xl mx-auto ${
            isDark ? "text-pink-400/80" : "text-pink-500"
          }`}
        >
          Join the pack in the next generation of digital collectibles. Where
          loyalty meets blockchain technology! 🐕
        </p>

        <WalletMultiButton />
      </div>

      {/* Other Sections... */}
    </div>
  );
};



export default HuskyLanding;
