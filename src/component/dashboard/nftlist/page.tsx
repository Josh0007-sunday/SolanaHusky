import React, { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Loader2 } from "lucide-react";

// Define strict types for NFT data
type NFTData = {
  name: string;
  image: string;
  description?: string;
};

type NFTCollectionLoaderProps = {
  isDark: boolean;
};

const NFTCollectionLoader: React.FC<NFTCollectionLoaderProps> = ({
  isDark,
}) => {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collection creator address
  const CREATOR_ADDRESS = "8TtouGqvJfjPKRkDVJVw7vN3qk6SM3E8D8iFj72KrKAv";

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        // Initialize connection using public RPC endpoint
        const connection = new Connection(
          "https://mainnet.helius-rpc.com/?api-key=6cc14252-ab50-45b3-a9e8-4756b48cf439",
          "confirmed"
        );

        // Fetch all token accounts for the creator
        const accounts = await connection.getParsedProgramAccounts(
          new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
          {
            filters: [
              {
                dataSize: 165, // Size of token account
              },
              {
                memcmp: {
                  offset: 32,
                  bytes: new PublicKey(CREATOR_ADDRESS).toBase58(),
                },
              },
            ],
          }
        );

        // Process accounts in parallel with rate limiting
        const processedNFTs = await Promise.all(
          accounts.map(async (account, index) => {
            try {
              // Add delay to prevent rate limiting
              await new Promise((resolve) => setTimeout(resolve, index * 100));

              const tokenAddress = account.pubkey.toBase58();

              // Fetch metadata account
              const metadataAddress = await getMetadataAddress(tokenAddress);
              const metadataAccount = await connection.getAccountInfo(
                new PublicKey(metadataAddress)
              );

              if (!metadataAccount) return null;

              // Parse metadata
              const metadata = decodeMetadata(metadataAccount.data);

              // Fetch JSON metadata
              const response = await fetch(metadata.uri);
              const jsonMetadata = await response.json();

              // Ensure the returned object matches NFTData type
              const nftData: NFTData = {
                name: metadata.name,
                image: jsonMetadata.image,
                ...(jsonMetadata.description && {
                  description: jsonMetadata.description,
                }),
              };

              return nftData;
            } catch (err) {
              console.error(`Error processing NFT: ${err}`);
              return null;
            }
          })
        );

        // Type guard function
        const isNFTData = (item: NFTData | null): item is NFTData => {
          return item !== null;
        };

        // Filter out null values and set state
        const validNFTs = processedNFTs.filter(isNFTData);
        setNfts(validNFTs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setError(
          `Failed to load NFT collection: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  // Helper function to get metadata address
  const getMetadataAddress = async (tokenAddress: string): Promise<string> => {
    const [address] = await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
        new PublicKey(tokenAddress).toBuffer(),
      ],
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    );
    return address.toBase58();
  };

  // Simple metadata decoder with type safety
  const decodeMetadata = (buffer: Buffer): { name: string; uri: string } => {
    const nameLength = buffer[4];
    const name = buffer.slice(5, 5 + nameLength).toString();

    const symbolLength = buffer[5 + nameLength];
    const uriLength = buffer[6 + nameLength + symbolLength];
    const uri = buffer
      .slice(
        7 + nameLength + symbolLength,
        7 + nameLength + symbolLength + uriLength
      )
      .toString();

    return { name, uri };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center p-4">No NFTs found in this collection.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {nfts.map((nft, index) => (
        <div
          key={index}
          className={`border rounded-xl p-4 transition-colors duration-300 ${
            isDark ? "border-pink-400/20 bg-gray-800" : "border-pink-200"
          }`}
        >
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold">{nft.name}</h3>
          {nft.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {nft.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default NFTCollectionLoader;
