import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Sun,
  Moon,
  Dog,
  Twitter,
  Globe,
  MessageCircle,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NftOwnership from "./nftinfo/page";
import NFTCollectionLoader from "./nftlist/page";

const Dashboard = () => {
  const [isDark, setIsDark] = useState(false);
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    if (!connected) {
      navigate("/"); // Redirect to landing page when wallet is disconnected
    }
  }, [connected, navigate]);



  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-mono ${
        isDark ? "bg-gray-900 text-pink-400" : "bg-white text-pink-700"
      }`}
    >
      {/* Header */}
      <nav
        className={`border-b p-4 transition-colors duration-300 ${
          isDark ? "border-pink-400/20" : "border-pink-200"
        }`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dog className="w-6 h-6 text-pink-500" />
            <span className="text-xl tracking-wider">HUSKY_NFT</span>
          </div>
          <div className="flex items-center space-x-8">
            <WalletMultiButton />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-pink-400"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8 mt-12">
        {/* Left: Description */}
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl font-bold mb-4">Husky NFT</h2>
          <p
            className={`mb-6 ${isDark ? "text-pink-400/80" : "text-gray-700"}`}
          >
            Join the next generation of digital collectibles. This collection
            features unique Huskies on the blockchain, where loyalty meets
            technology! Our idea is generated from the bonk [dog] community and we want tto support the ecosystem with Solana 
            Husky community
          </p>
          <div className="flex flex-wrap gap-4">
            {["DAO", "https://x.com/SolanaHusky_", "Discord", "Telegram"].map(
              (platform, idx) => {
                const icons = [
                  <Globe key="globe" />,
                  <Twitter key="twitter" />,
                  <MessageCircle key="discord" />,
                  <Send key="telegram" />,
                ];
                return (
                  <button
                    key={platform}
                    className={`flex items-center px-4 py-2 rounded-full transition-all border ${
                      isDark
                        ? "border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-gray-900"
                        : "border-pink-500 text-pink-600 hover:bg-pink-500 hover:text-white"
                    }`}
                  >
                    {icons[idx]}
                    <span className="ml-2">{platform}</span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Right: NFT Ownership Details */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          {publicKey && <NftOwnership walletAddress={publicKey.toString()} />}
        </div>
      </div>

      {/* Collection Cards */}
      <div className="max-w-6xl mx-auto p-6 mt-8">
        <h2 className="text-3xl font-bold mb-6">
          Other NFTs in the Collection
        </h2>
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collection.map((nft) => (
            <div
              key={nft.id}
              className={`border rounded-xl p-4 transition-colors duration-300 ${
                isDark ? "border-pink-400/20 bg-gray-800" : "border-pink-200"
              }`}
            >
              <img
                src={nft.img}
                alt={nft.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{nft.name}</h3>
            </div>
          ))}
        </div> */}
        <NFTCollectionLoader isDark={isDark} />
      </div>

      {/* Footer */}
      <footer
        className={`border-t p-4 mt-12 text-center ${
          isDark ? "border-pink-400/20" : "border-pink-200"
        }`}
      >
        <div className="flex justify-center items-center space-x-2">
          <Dog className="w-6 h-6 text-pink-500" />
          <span className="text-lg">HUSKY_NFT</span>
        </div>
        <p className={`${isDark ? "text-pink-400/80" : "text-pink-600"}`}>
          © 2024 Husky NFT - All rights reserved
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
