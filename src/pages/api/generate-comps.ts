import type { APIRoute } from 'astro';
import { properties } from '../../lib/properties';

// Helper function to calculate similarity score
function calculateSimilarity(target: any, comp: any): number {
  let score = 0;
  
  // Region match (30%)
  if (target.region === comp.region) {
    score += 30;
  } else {
    // Nearby regions get partial credit
    const nearbyRegions: Record<string, string[]> = {
      'Bucerías': ['Flamingos', 'Nuevo Vallarta', 'La Cruz de Huanacaxtle'],
      'Nuevo Vallarta': ['Bucerías', 'Flamingos', 'Mezcales'],
      'Punta de Mita': ['La Cruz de Huanacaxtle', 'Sayulita'],
      'La Cruz de Huanacaxtle': ['Bucerías', 'Punta de Mita'],
      'Sayulita': ['San Pancho', 'Punta de Mita'],
      'San Pancho': ['Sayulita'],
      'Flamingos': ['Bucerías', 'Nuevo Vallarta'],
      'Mezcales': ['Nuevo Vallarta'],
    };
    if (nearbyRegions[target.region]?.includes(comp.region)) {
      score += 15;
    }
  }
  
  // Size match ±20% (25%)
  const sizeDiff = Math.abs(target.m2_construction - comp.m2_construction) / target.m2_construction;
  if (sizeDiff <= 0.1) score += 25;
  else if (sizeDiff <= 0.2) score += 20;
  else if (sizeDiff <= 0.3) score += 10;
  
  // Same type (20%)
  if (target.type === comp.type) score += 20;
  
  // Features match (15%)
  const targetFeatures = new Set(target.features || []);
  const compFeatures = new Set(comp.features || []);
  const intersection = [...targetFeatures].filter(f => compFeatures.has(f)).length;
  const union = new Set([...targetFeatures, ...compFeatures]).size;
  if (union > 0) {
    score += Math.round((intersection / union) * 15);
  }
  
  // Bedrooms ±1 (10%)
  const bedDiff = Math.abs((target.bedrooms || 0) - (comp.bedrooms || 0));
  if (bedDiff === 0) score += 10;
  else if (bedDiff === 1) score += 5;
  
  return Math.min(score, 100);
}

function generateJustification(target: any, comp: any, score: number): string {
  const reasons: string[] = [];
  
  if (target.region === comp.region) {
    reasons.push(`Misma zona (${comp.region})`);
  } else {
    reasons.push(`Zona cercana (${comp.region})`);
  }
  
  const sizeDiff = Math.abs(target.m2_construction - comp.m2_construction);
  if (sizeDiff <= target.m2_construction * 0.1) {
    reasons.push('tamaño muy similar');
  } else if (sizeDiff <= target.m2_construction * 0.2) {
    reasons.push('tamaño comparable');
  }
  
  if (target.type === comp.type) {
    reasons.push(`mismo tipo (${comp.type})`);
  }
  
  const sharedFeatures = (target.features || []).filter((f: string) => (comp.features || []).includes(f));
  if (sharedFeatures.length > 0) {
    const featureNames: Record<string, string> = {
      pool: 'alberca',
      ac: 'A/C',
      ocean_view: 'vista al mar',
      furnished: 'amueblado',
      beachfront: 'frente al mar'
    };
    const named = sharedFeatures.slice(0, 2).map((f: string) => featureNames[f] || f);
    reasons.push(`comparte ${named.join(' y ')}`);
  }
  
  return reasons.join(', ') + '.';
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { property } = body;
    
    if (!property) {
      return new Response(JSON.stringify({ error: 'Property data required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Calculate similarity for all properties and sort
    const compsWithScore = properties
      .filter(p => p.type === property.type || property.type === 'Terreno')
      .map(comp => ({
        ...comp,
        similarity_score: calculateSimilarity(property, comp),
        price_per_m2: Math.round(comp.price_usd / comp.m2_construction)
      }))
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, 5);
    
    // Calculate price analysis
    const avgPricePerM2 = Math.round(
      compsWithScore.reduce((sum, c) => sum + c.price_per_m2, 0) / compsWithScore.length
    );
    
    const estimatedMid = Math.round(avgPricePerM2 * property.m2_construction);
    const estimatedLow = Math.round(estimatedMid * 0.9);
    const estimatedHigh = Math.round(estimatedMid * 1.1);
    
    // Format response
    const response = {
      success: true,
      data: {
        target_summary: `${property.type} de ${property.bedrooms} recámaras y ${property.bathrooms} baños en ${property.region} con ${property.m2_construction} m² de construcción. Amenidades: ${(property.features || []).join(', ') || 'ninguna especificada'}.`,
        selected_comps: compsWithScore.map((comp, index) => ({
          rank: index + 1,
          mls_id: comp.id,
          name: comp.name,
          price_usd: comp.price_usd,
          m2: comp.m2_construction,
          bedrooms: comp.bedrooms,
          bathrooms: comp.bathrooms,
          price_per_m2: comp.price_per_m2,
          similarity_score: comp.similarity_score,
          justification: generateJustification(property, comp, comp.similarity_score)
        })),
        price_analysis: {
          avg_price_per_m2: avgPricePerM2,
          estimated_value_low: estimatedLow,
          estimated_value_mid: estimatedMid,
          estimated_value_high: estimatedHigh,
          methodology: `Valuación basada en precio promedio por m² de ${compsWithScore.length} propiedades comparables en Puerto Vallarta y Bahía de Banderas. Ponderación: ubicación (30%), tamaño (25%), tipo (20%), amenidades (15%), recámaras (10%).`
        },
        market_insights: `El mercado de ${property.type.toLowerCase()}s en ${property.region} muestra un precio promedio de $${avgPricePerM2.toLocaleString()} USD/m². Las propiedades con vista al mar y frente a la playa tienen un premium de 15-25%. La demanda se mantiene fuerte para propiedades de 2-3 recámaras en el rango de $300k-$600k USD en Puerto Vallarta y Bahía de Banderas.`,
        recommendation: `Basado en los comparables analizados, recomendamos listar la propiedad en un rango de $${estimatedLow.toLocaleString()} - $${estimatedHigh.toLocaleString()} USD, con un precio sugerido de $${estimatedMid.toLocaleString()} USD. Considere las condiciones específicas de la propiedad y el timing del mercado para ajustar el precio final.`
      }
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
