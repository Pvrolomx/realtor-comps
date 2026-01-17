import { useState } from 'react';

const regions = [
  'Bucerías', 'Nuevo Vallarta', 'Punta de Mita', 'La Cruz de Huanacaxtle',
  'Sayulita', 'San Pancho', 'Flamingos', 'Puerto Vallarta', 'Mezcales'
];

const propertyTypes = ['Condominio', 'Casa', 'Terreno', 'Comercial'];

const amenitiesOptions = [
  { id: 'pool', label: 'Alberca' },
  { id: 'ac', label: 'A/C' },
  { id: 'ocean_view', label: 'Vista al Mar' },
  { id: 'furnished', label: 'Amueblado' },
  { id: 'beachfront', label: 'Frente al Mar' },
];

interface PropertyFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export default function PropertyForm({ onSubmit, isLoading }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    type: 'Condominio',
    region: 'Bucerías',
    bedrooms: 2,
    bathrooms: 2,
    m2_construction: 100,
    features: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bedrooms' || name === 'bathrooms' || name === 'm2_construction' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(amenityId)
        ? prev.features.filter(f => f !== amenityId)
        : [...prev.features, amenityId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-primary mb-6">📝 Datos de la Propiedad</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Propiedad</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Región */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Región</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Recámaras */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recámaras</label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            min="0"
            max="10"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Baños */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Baños</label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            min="0"
            max="10"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* M2 Construcción */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">M² de Construcción</label>
          <input
            type="number"
            name="m2_construction"
            value={formData.m2_construction}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Amenidades */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Amenidades</label>
        <div className="flex flex-wrap gap-3">
          {amenitiesOptions.map(amenity => (
            <button
              key={amenity.id}
              type="button"
              onClick={() => handleAmenityToggle(amenity.id)}
              className={`px-4 py-2 rounded-full border-2 transition ${
                formData.features.includes(amenity.id)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
              }`}
            >
              {amenity.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-8 w-full bg-accent hover:bg-orange-600 disabled:bg-gray-400 text-white text-xl font-bold py-4 rounded-xl transition transform hover:scale-[1.02] disabled:transform-none"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analizando...
          </span>
        ) : (
          '🔍 Generar Comparables'
        )}
      </button>
    </form>
  );
}
