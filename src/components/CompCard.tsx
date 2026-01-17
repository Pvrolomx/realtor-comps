interface CompCardProps {
  rank: number;
  name: string;
  price_usd: number;
  m2: number;
  price_per_m2: number;
  similarity_score: number;
  justification: string;
  bedrooms?: number;
  bathrooms?: number;
}

export default function CompCard({
  rank,
  name,
  price_usd,
  m2,
  price_per_m2,
  similarity_score,
  justification,
  bedrooms,
  bathrooms
}: CompCardProps) {
  const scoreColor = similarity_score >= 80 
    ? 'bg-green-500' 
    : similarity_score >= 60 
      ? 'bg-yellow-500' 
      : 'bg-gray-400';

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-sm text-gray-500">#{rank}</span>
          <h3 className="text-lg font-bold text-primary">{name}</h3>
        </div>
        <div className={`${scoreColor} text-white px-3 py-1 rounded-full text-sm font-bold`}>
          {similarity_score}% match
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-2xl font-bold text-accent">${price_usd.toLocaleString()} USD</p>
          <p className="text-sm text-gray-500">Precio</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-700">${price_per_m2.toLocaleString()}</p>
          <p className="text-sm text-gray-500">USD/m²</p>
        </div>
      </div>

      <div className="flex gap-4 text-gray-600 mb-4">
        {bedrooms !== undefined && <span>🛏️ {bedrooms} rec</span>}
        {bathrooms !== undefined && <span>🚿 {bathrooms} baños</span>}
        <span>📐 {m2} m²</span>
      </div>

      <p className="text-sm text-gray-600 italic border-t pt-3">
        💡 {justification}
      </p>
    </div>
  );
}
