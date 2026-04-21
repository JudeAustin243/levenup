"use client";

import { motion } from "framer-motion";
import { getLayerZIndex, LAYER_ORDER, type EquippedItem } from "@/lib/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarPreviewProps {
  equippedItems: EquippedItem[];
  size?: number;
  className?: string;
}

export default function AvatarPreview({
  equippedItems,
  size = 300,
  className,
}: AvatarPreviewProps) {
  const sorted = [...equippedItems].sort(
    (a, b) =>
      LAYER_ORDER.indexOf(a.layer as any) -
      LAYER_ORDER.indexOf(b.layer as any)
  );

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size * 1.33 }}
    >
      {sorted.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <span className="text-gray-400 text-sm">No items equipped</span>
        </div>
      )}
      {sorted.map((item) => (
        <motion.div
          key={item.layer}
          className="absolute inset-0"
          style={{ zIndex: getLayerZIndex(item.layer) }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-contain"
          />
        </motion.div>
      ))}
    </div>
  );
}
