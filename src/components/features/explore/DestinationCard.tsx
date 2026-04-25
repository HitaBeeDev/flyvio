import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useSearchStore } from "@/stores/searchStore";
import type { Destination } from "@/types";

type DestinationCardProps = {
  destination: Destination;
};

export function DestinationCard({ destination }: DestinationCardProps) {
  const navigate = useNavigate();
  const params = useSearchStore((state) => state.params);
  const setParams = useSearchStore((state) => state.setParams);

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      onClick={() => {
        setParams({
          ...params,
          destination: destination.iataCode,
        });
        navigate(`/search?destination=${destination.iataCode}`);
      }}
      className="group relative w-[18.5rem] shrink-0 overflow-hidden rounded-3xl border border-indigo-200/80 text-left md:w-auto md:shrink"
    >
      <div className="aspect-[16/9] overflow-hidden bg-indigo-200 dark:bg-indigo-800">
        <img
          src={destination.imageUrl}
          alt={`${destination.city}, ${destination.country}`}
          width={800}
          height={450}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/85 via-indigo-950/25 to-transparent transition duration-500 group-hover:from-indigo-950/92 group-hover:via-indigo-950/38" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-3xl font-semibold tracking-tight text-white">
              {destination.city}
            </p>
            <p className="mt-1 text-sm text-white/80">{destination.country}</p>
          </div>
          <Badge className="border-white/20 bg-white/15 text-white backdrop-blur hover:bg-white/15">
            From ${destination.startingPrice}
          </Badge>
        </div>
      </div>
    </motion.button>
  );
}
