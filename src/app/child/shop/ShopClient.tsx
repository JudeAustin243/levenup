"use client";

import { useState } from "react";
import CoinCounter from "@/components/CoinCounter";
import PackCard from "@/components/shop/PackCard";
import ItemCard from "@/components/shop/ItemCard";
import PackOpeningModal from "@/components/shop/PackOpeningModal";
import { PACK_CONFIG, type PackTierKey } from "@/lib/packs";
import { LAYER_ORDER } from "@/lib/avatar";
import { ShoppingBag, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface OwnedItem {
  id: string;
  name: string;
  rarity: "Common" | "Rare" | "Legendary";
  layer: string;
  imageUrl: string;
  coinValue: number;
  equipped: boolean;
}

interface PackResultItem {
  id: string;
  name: string;
  rarity: "Common" | "Rare" | "Legendary";
  layer: string;
  imageUrl: string;
  coinValue: number;
  isDuplicate: boolean;
}

interface ShopClientProps {
  initialCoins: number;
  ownedItems: OwnedItem[];
}

export default function ShopClient({
  initialCoins,
  ownedItems: initialOwned,
}: ShopClientProps) {
  const [coins, setCoins] = useState(initialCoins);
  const [owned, setOwned] = useState(initialOwned);
  const [tab, setTab] = useState<"packs" | "collection">("packs");
  const [buying, setBuying] = useState(false);

  // Pack opening modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [packResult, setPackResult] = useState<PackResultItem[]>([]);
  const [packTier, setPackTier] = useState<string>("");
  const [duplicateRebate, setDuplicateRebate] = useState(0);

  async function handleBuyPack(tier: PackTierKey) {
    if (buying) return;
    setBuying(true);

    try {
      const res = await fetch("/api/shop/buy-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packTier: tier }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to buy pack");
        return;
      }

      const data = await res.json();
      setPackResult(data.items);
      setPackTier(tier);
      setDuplicateRebate(data.duplicateRebate);
      setCoins(data.newBalance);
      setModalOpen(true);

      // Add new items to owned list
      for (const item of data.items) {
        if (!item.isDuplicate && !owned.find((o) => o.id === item.id)) {
          setOwned((prev) => [
            ...prev,
            { ...item, equipped: false },
          ]);
        }
      }
    } finally {
      setBuying(false);
    }
  }

  const groupedByLayer = LAYER_ORDER.reduce(
    (acc, layer) => {
      acc[layer] = owned.filter((item) => item.layer === layer);
      return acc;
    },
    {} as Record<string, OwnedItem[]>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Item Shop</h1>
            <p className="text-gray-500 text-sm mt-1">
              Spend your coins on avatar packs
            </p>
          </div>
          <CoinCounter coins={coins} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("packs")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors",
              tab === "packs"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            )}
          >
            <Package className="w-4 h-4" />
            Packs
          </button>
          <button
            onClick={() => setTab("collection")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors",
              tab === "collection"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            My Collection ({owned.length})
          </button>
        </div>

        {/* Packs Tab */}
        {tab === "packs" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(Object.entries(PACK_CONFIG) as [PackTierKey, (typeof PACK_CONFIG)[PackTierKey]][]).map(
              ([tier, config]) => (
                <PackCard
                  key={tier}
                  tier={tier}
                  label={config.label}
                  price={config.price}
                  gradient={config.gradient}
                  weights={config.weights}
                  canAfford={coins >= config.price}
                  onBuy={() => handleBuyPack(tier)}
                  disabled={buying}
                />
              )
            )}
          </div>
        )}

        {/* Collection Tab */}
        {tab === "collection" && (
          <div className="space-y-6">
            {LAYER_ORDER.map((layer) => {
              const items = groupedByLayer[layer];
              if (!items || items.length === 0) return null;
              return (
                <div key={layer}>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 capitalize">
                    {layer}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {items.map((item) => (
                      <ItemCard
                        key={item.id}
                        name={item.name}
                        rarity={item.rarity}
                        layer={item.layer}
                        imageUrl={item.imageUrl}
                        owned
                        equipped={item.equipped}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            {owned.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No items yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Buy packs to start your collection!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pack Opening Modal */}
      <PackOpeningModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        items={packResult}
        packTier={packTier}
        duplicateRebate={duplicateRebate}
      />
    </div>
  );
}
