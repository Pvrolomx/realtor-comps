import { useState } from 'react';
import PropertyForm from './PropertyForm';
import CompResults from './CompResults';

export default function CompsApp() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/generate-comps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property: formData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar comps');
      }

      setResults(data.data);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-primary mb-2">
        🔍 Generador de Comps
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Ingresa los datos de la propiedad y obtén un análisis profesional en segundos
      </p>

      <div className="grid gap-8">
        <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}

        {results && <CompResults data={results} />}
      </div>
    </div>
  );
}
