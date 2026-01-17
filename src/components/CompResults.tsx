import CompCard from './CompCard';
import PriceAnalysis from './PriceAnalysis';

interface CompResultsProps {
  data: {
    target_summary: string;
    selected_comps: Array<{
      rank: number;
      name: string;
      price_usd: number;
      m2: number;
      price_per_m2: number;
      similarity_score: number;
      justification: string;
      bedrooms?: number;
      bathrooms?: number;
    }>;
    price_analysis: {
      avg_price_per_m2: number;
      estimated_value_low: number;
      estimated_value_mid: number;
      estimated_value_high: number;
      methodology?: string;
    };
    market_insights: string;
    recommendation: string;
  };
}

export default function CompResults({ data }: CompResultsProps) {
  return (
    <div className="space-y-8">
      {/* Target Summary */}
      <div className="bg-blue-50 border-l-4 border-primary rounded-xl p-6">
        <h3 className="text-lg font-bold text-primary mb-2">🏠 Propiedad Evaluada</h3>
        <p className="text-gray-700">{data.target_summary}</p>
      </div>

      {/* Price Analysis */}
      <PriceAnalysis {...data.price_analysis} />

      {/* Comps Grid */}
      <div>
        <h3 className="text-2xl font-bold text-primary mb-4">📊 Top 5 Comparables</h3>
        <div className="grid gap-4">
          {data.selected_comps.map(comp => (
            <CompCard key={comp.rank} {...comp} />
          ))}
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-bold text-primary mb-3">📈 Insights del Mercado</h3>
        <p className="text-gray-700">{data.market_insights}</p>
      </div>

      {/* Recommendation */}
      <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-6">
        <h3 className="text-xl font-bold text-green-700 mb-3">✅ Recomendación</h3>
        <p className="text-gray-700">{data.recommendation}</p>
      </div>
    </div>
  );
}
