import React, { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { programs } from "@metaplex/js";

const {
  metadata: { Metadata },
} = programs;

const connection = new Connection(
  "https://solana-mainnet.g.alchemy.com/v2/fuyZ3lLserrbWFkt-xA3JJC3AY20feGa"
);
const nftCollectionAddress = new PublicKey(
  "8TtouGqvJfjPKRkDVJVw7vN3qk6SM3E8D8iFj72KrKAv"
);

interface NftMetadata {
  name: string;
  uri: string;
  image: string;
  mint: string;
  traits: Record<string, any>[];
}

const checkOwnership = async (
  walletAddress: string
): Promise<string | null> => {
  try {
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      new PublicKey(walletAddress),
      {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      }
    );

    for (const account of tokenAccounts.value) {
      const accountInfo = await connection.getParsedAccountInfo(account.pubkey);
      const parsedAccountInfo = accountInfo.value?.data;
      if (!parsedAccountInfo || !("parsed" in parsedAccountInfo)) continue;

      const mintAddress = new PublicKey(parsedAccountInfo.parsed.info.mint);
      const metadataPDA = await Metadata.getPDA(mintAddress);
      const metadataAccount = await Metadata.load(connection, metadataPDA);

      if (
        metadataAccount.data.collection?.verified &&
        new PublicKey(metadataAccount.data.collection.key).equals(
          nftCollectionAddress
        )
      ) {
        return mintAddress.toString();
      }
    }
    return null;
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return null;
  }
};

const fetchNftDetails = async (
  mintAddress: string
): Promise<NftMetadata | null> => {
  try {
    const mintPubKey = new PublicKey(mintAddress);
    const metadataPDA = await Metadata.getPDA(mintPubKey);
    const metadataAccount = await Metadata.load(connection, metadataPDA);

    const metadataResponse = await fetch(metadataAccount.data.data.uri);
    const metadataJson = await metadataResponse.json();

    return {
      name: metadataJson.name,
      uri: metadataAccount.data.data.uri,
      image: metadataJson.image,
      mint: mintAddress,
      traits: metadataJson.attributes || [],
    };
  } catch (error) {
    console.error("Error fetching NFT details:", error);
    return null;
  }
};

const NftOwnership: React.FC<{ walletAddress: string }> = ({
  walletAddress,
}) => {
  const [nftMetadata, setNftMetadata] = useState<NftMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAndFetchNft = async () => {
      setIsLoading(true);
      const mintAddress = await checkOwnership(walletAddress);
      if (mintAddress) {
        const nftDetails = await fetchNftDetails(mintAddress);
        setNftMetadata(nftDetails);
      } else {
        setNftMetadata(null);
      }
      setIsLoading(false);
    };

    if (walletAddress) {
      checkAndFetchNft();
    }
  }, [walletAddress]);

  if (isLoading) {
    return (
      <div className="w-64 h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </div>
    );
  }

  return (
    <div className="nft-ownership-checker w-full max-w-md">
      {nftMetadata ? (
        <div className="nft-details flex flex-col items-center">
          <div className="relative w-64 h-64 mb-4">
            <div className="absolute inset-0 border-4 border-pink-400 rounded-lg" />
            <img
              src={nftMetadata.image}
              alt={nftMetadata.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <h3 className="text-2xl font-bold mb-2">{nftMetadata.name}</h3>
          {nftMetadata.traits.length > 0 && (
            <div className="w-full">
              <p className="font-semibold mb-2">Traits:</p>
              <div className="flex flex-wrap gap-2">
                {nftMetadata.traits.map((trait, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
                  >
                    {trait.trait_type}: {trait.value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-64 h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-center px-4">
            No NFT from the collection found for this wallet.
          </p>
        </div>
      )}
    </div>
  );
};

export default NftOwnership;
