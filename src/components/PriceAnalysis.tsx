interface PriceAnalysisProps {
  avg_price_per_m2: number;
  estimated_value_low: number;
  estimated_value_mid: number;
  estimated_value_high: number;
  methodology?: string;
}

export default function PriceAnalysis({
  avg_price_per_m2,
  estimated_value_low,
  estimated_value_mid,
  estimated_value_high,
  methodology
}: PriceAnalysisProps) {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-lg p-8">
      <h3 className="text-2xl font-bold mb-6">💰 Análisis de Valuación</h3>
      
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <p className="text-sm opacity-80">Precio/m² Promedio</p>
          <p className="text-2xl font-bold">${avg_price_per_m2.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <p className="text-sm opacity-80">Rango Bajo</p>
          <p className="text-2xl font-bold">${estimated_value_low.toLocaleString()}</p>
        </div>
        <div className="bg-accent rounded-xl p-4 text-center">
          <p className="text-sm">Valor Estimado</p>
          <p className="text-3xl font-bold">${estimated_value_mid.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <p className="text-sm opacity-80">Rango Alto</p>
          <p className="text-2xl font-bold">${estimated_value_high.toLocaleString()}</p>
        </div>
      </div>

      {methodology && (
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-sm opacity-80 mb-1">Metodología:</p>
          <p className="text-sm">{methodology}</p>
        </div>
      )}
    </div>
  );
}
