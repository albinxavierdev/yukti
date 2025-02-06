import SourceCard from "./SourceCard";
import Image from "next/image";

export default function Sources({
  sources,
  isLoading,
}: {
  sources: { name: string; url: string }[];
  isLoading: boolean;
}) {
  return (
    <div className="h-full space-y-4">
      <div className="flex items-center gap-2 border-b pb-4">
        <Image
          src="/img/sources.svg"
          alt="Sources"
          width={24}
          height={24}
        />
        <h3 className="text-base font-bold uppercase">Sources</h3>
      </div>
      
      <div className="space-y-3">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse bg-gray-200 rounded" />
          ))
        ) : sources.length > 0 ? (
          sources.map((source) => (
            <SourceCard key={source.url} source={source} />
          ))
        ) : (
          <div className="text-center text-gray-500">No sources found</div>
        )}
      </div>
    </div>
  );
}