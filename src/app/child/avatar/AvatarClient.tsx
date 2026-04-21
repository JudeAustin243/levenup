"use client";

import { useState } from "react";
import AvatarPreview from "@/components/AvatarPreview";
import ItemCard from "@/components/shop/ItemCard";
import { LAYER_ORDER } from "@/lib/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface AvatarItem {
  id: string;
  name: string;
  rarity: "Common" | "Rare" | "Legendary";
  layer: string;
  imageUrl: string;
  equipped: boolean;
}

interface AvatarClientProps {
  items: AvatarItem[];
}

export default function AvatarClient({ items: initialItems }: AvatarClientProps) {
  const [items, setItems] = useState(initialItems);
  const [activeLayer, setActiveLayer] = useState<string>("hat");
  const [loading, setLoading] = useState<string | null>(null);

  const equippedItems = items
    .filter((i) => i.equipped)
    .map((i) => ({
      layer: i.layer,
      imageUrl: i.imageUrl,
      name: i.name,
      rarity: i.rarity,
    }));

  const layerItems = items.filter((i) => i.layer === activeLayer);

  async function handleEquip(itemId: string) {
    if (loading) return;
    setLoading(itemId);

    try {
      const res = await fetch("/api/avatar/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      if (!res.ok) return;

      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      setItems((prev) =>
        prev.map((i) => {
          // If same layer, unequip all then toggle the clicked one
          if (i.layer === item.layer) {
            return {
              ...i,
              equipped: i.id === itemId ? !i.equipped : false,
            };
          }
          return i;
        })
      );
    } finally {
      setLoading(null);
    }
  }

  const layersWithItems = LAYER_ORDER.filter((layer) =>
    items.some((i) => i.layer === layer)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Avatar</h1>
            <p className="text-gray-500 text-sm mt-1">
              Customize your character
            </p>
          </div>
          <Link
            href="/child/shop"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Get More Items
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <AvatarPreview equippedItems={equippedItems} size={280} />
            </div>
          </div>

          {/* Inventory */}
          <div>
            {/* Layer tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {layersWithItems.map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors",
                    activeLayer === layer
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {layer}
                </button>
              ))}
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {layerItems.map((item) => (
                <ItemCard
                  key={item.id}
                  name={item.name}
                  rarity={item.rarity}
                  layer={item.layer}
                  imageUrl={item.imageUrl}
                  owned
                  equipped={item.equipped}
                  onClick={() => handleEquip(item.id)}
                />
              ))}
            </div>

            {layerItems.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-400 text-sm">
                  No {activeLayer} items yet. Visit the shop to get some!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
