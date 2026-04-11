// Nutritional calculation engine for Bio-Aliment
// Based on INRA standards and the specific formulas provided

export interface AnimalData {
  weight: number; // kg
  milkProduction?: number; // kg/day
  parity: 'Primipare' | 'Multipare' | 'Tarie';
  physiologicalPhase: string;
  daysInLactation?: number;
  daysInGestation?: number;
}

export interface WeatherData {
  temperature: number; // °C
  humidity: number; // % (0-100)
}

export interface NutritionalNeeds {
  thi: number;
  ci: number; // Capacité d'Ingestion (kg MS)
  totalUFL: number;
  totalPDI: number; // grams
  alerts: string[];
}

/**
 * Calculate Temperature Humidity Index (THI)
 * Formula: THI = (1.8 * T + 32) - (0.55 - 0.0055 * HR/100) * (1.8 * T - 26)
 */
export function calculateTHI(temperature: number, humidity: number): number {
  const T = temperature;
  const HR = humidity;
  
  const thi = (1.8 * T + 32) - (0.55 - 0.0055 * HR / 100) * (1.8 * T - 26);
  return Math.round(thi * 10) / 10;
}

/**
 * Calculate Capacité d'Ingestion (CI) in kg MS
 * Based on the specific logic provided in the requirements
 */
export function calculateCI(animal: AnimalData, thi: number): number {
  const { weight, milkProduction = 0, parity } = animal;
  const thiSeuil = 68;
  
  const ci_base_formule_A = 1.4 * ((weight / 100) + 2) - 1.5;
  const ci_base_formule_B = 0.3 * milkProduction;
  
  // CI Reduction for Heat Stress
  const ciReduit = (thi - thiSeuil) * 0.45;
  
  let ci: number;
  
  if (parity === 'Tarie' && thi < thiSeuil) {
    ci = ci_base_formule_A;
  } else if (parity === 'Primipare' && thi < thiSeuil) {
    ci = ci_base_formule_A + ci_base_formule_B;
  } else if (parity === 'Multipare' && thi < thiSeuil) {
    ci = 1.4 * ((weight / 100) + 2) + ci_base_formule_B;
  } else if (parity === 'Tarie' && thi >= thiSeuil) {
    ci = ci_base_formule_A - ciReduit;
  } else if ((parity === 'Primipare' || parity === 'Multipare') && thi >= thiSeuil) {
    ci = ci_base_formule_A + ci_base_formule_B - ciReduit;
  } else {
    ci = ci_base_formule_A; // fallback
  }
  
  return Math.max(ci, 0); // Ensure CI is not negative
}

/**
 * Calculate Maintenance needs (UFL and PDI)
 * Standard INRA formulas based on metabolic weight
 */
export function calculateMaintenanceNeeds(weight: number): { ufl: number; pdi: number } {
  const metabolicWeight = Math.pow(weight, 0.75);
  
  return {
    ufl: 0.041 * metabolicWeight, // UFL for maintenance
    pdi: 3.25 * metabolicWeight   // PDI for maintenance (grams)
  };
}

/**
 * Calculate Lactation needs
 */
export function calculateLactationNeeds(milkProduction: number): { ufl: number; pdi: number } {
  return {
    ufl: milkProduction * 0.45,  // UFL per kg of milk
    pdi: milkProduction * 48     // PDI per kg of milk (grams)
  };
}

/**
 * Calculate Gestation needs
 */
export function calculateGestationNeeds(weight: number, daysInGestation?: number): { ufl: number; pdi: number } {
  if (!daysInGestation || daysInGestation < 180) {
    return { ufl: 0, pdi: 0 };
  }
  
  // Gestation needs increase significantly in the last trimester
  const gestationFactor = Math.max(0, (daysInGestation - 180) / 100);
  
  return {
    ufl: 0.01 * weight * gestationFactor,
    pdi: 10 * weight * gestationFactor
  };
}

/**
 * Calculate Growth needs (for young animals)
 */
export function calculateGrowthNeeds(weight: number, physiologicalPhase: string): { ufl: number; pdi: number } {
  if (physiologicalPhase !== 'Croissance' || weight > 400) {
    return { ufl: 0, pdi: 0 };
  }
  
  // Growth needs based on target daily gain (assuming 0.8 kg/day)
  const dailyGain = 0.8;
  
  return {
    ufl: dailyGain * 4.5,    // UFL per kg of gain
    pdi: dailyGain * 350     // PDI per kg of gain (grams)
  };
}

/**
 * Calculate total nutritional needs
 */
export function calculateTotalNeeds(animal: AnimalData, weather: WeatherData): NutritionalNeeds {
  const thi = calculateTHI(weather.temperature, weather.humidity);
  const ci = calculateCI(animal, thi);
  
  // Calculate individual needs
  const maintenance = calculateMaintenanceNeeds(animal.weight);
  const lactation = animal.milkProduction 
    ? calculateLactationNeeds(animal.milkProduction) 
    : { ufl: 0, pdi: 0 };
  const gestation = calculateGestationNeeds(animal.weight, animal.daysInGestation);
  const growth = calculateGrowthNeeds(animal.weight, animal.physiologicalPhase);
  
  // Total needs
  const totalUFL = maintenance.ufl + lactation.ufl + gestation.ufl + growth.ufl;
  const totalPDI = maintenance.pdi + lactation.pdi + gestation.pdi + growth.pdi;
  
  // Generate alerts
  const alerts: string[] = [];
  
  if (thi > 80) {
    alerts.push("🚨 ALERTE CRITIQUE: Risque de mortalité élevé (THI > 80)");
  } else if (thi > 72) {
    alerts.push("⚠️ ALERTE FORTE: Stress thermique sévère (THI > 72)");
  } else if (thi > 68) {
    alerts.push("⚠️ Attention: Début de stress thermique (THI > 68)");
  }
  
  return {
    thi,
    ci,
    totalUFL: Math.round(totalUFL * 100) / 100,
    totalPDI: Math.round(totalPDI),
    alerts
  };
}

/**
 * Calculate ration apports from selected aliments
 */
export interface AlimentRation {
  id: string;
  name_fr: string;
  quantity_mb: number; // Matière Brute (kg)
  ms_percentage: number;
  ufl_per_kg_ms: number;
  pdie_per_kg_ms: number;
  pdin_per_kg_ms: number;
  ndf_per_kg_ms: number;
}

export interface RationApports {
  totalMS: number;
  totalUFL: number;
  totalPDIE: number;
  totalPDIN: number;
  totalNDF: number;
  concentrateMS: number; // MS from concentrates
}

export function calculateRationApports(ration: AlimentRation[]): RationApports {
  let totalMS = 0;
  let totalUFL = 0;
  let totalPDIE = 0;
  let totalPDIN = 0;
  let totalNDF = 0;
  let concentrateMS = 0;
  
  ration.forEach(aliment => {
    const quantiteMS = aliment.quantity_mb * (aliment.ms_percentage / 100);
    const apportUFL = quantiteMS * aliment.ufl_per_kg_ms;
    const apportPDIE = quantiteMS * aliment.pdie_per_kg_ms;
    const apportPDIN = quantiteMS * aliment.pdin_per_kg_ms;
    const apportNDF = quantiteMS * aliment.ndf_per_kg_ms;
    
    totalMS += quantiteMS;
    totalUFL += apportUFL;
    totalPDIE += apportPDIE;
    totalPDIN += apportPDIN;
    totalNDF += apportNDF;
    
    // Check if it's a concentrate (category would need to be included)
    // For now, assume concentrates have NDF < 30%
    if (aliment.ndf_per_kg_ms < 30) {
      concentrateMS += quantiteMS;
    }
  });
  
  return {
    totalMS: Math.round(totalMS * 100) / 100,
    totalUFL: Math.round(totalUFL * 100) / 100,
    totalPDIE: Math.round(totalPDIE),
    totalPDIN: Math.round(totalPDIN),
    totalNDF: Math.round(totalNDF * 100) / 100,
    concentrateMS: Math.round(concentrateMS * 100) / 100
  };
}

/**
 * Analyze ration balance and generate alerts
 */
export interface RationAnalysis {
  msBalance: number; // Difference between CI and total MS
  energyBalance: number; // Difference between needs and apports (UFL)
  proteinBalance: number; // Difference between needs and apports (PDI)
  ndfPercentage: number; // NDF as percentage of total MS
  concentratePercentage: number; // Concentrate MS as percentage of total MS
  alerts: string[];
  recommendations: string[];
}

export function analyzeRation(
  needs: NutritionalNeeds, 
  apports: RationApports
): RationAnalysis {
  const alerts: string[] = [];
  const recommendations: string[] = [];
  
  // MS Balance (CI vs Total MS)
  const msBalance = apports.totalMS - needs.ci;
  const msBalancePercentage = (Math.abs(msBalance) / needs.ci) * 100;
  
  if (msBalancePercentage > 5) {
    if (msBalance > 0) {
      alerts.push("🔴 Excès de matière sèche: la ration dépasse la capacité d'ingestion");
      recommendations.push("Réduire les quantités d'aliments pour respecter la CI");
    } else {
      alerts.push("🔴 Déficit de matière sèche: la ration est insuffisante");
      recommendations.push("Augmenter les quantités d'aliments pour atteindre la CI");
    }
  }
  
  // Energy Balance
  const energyBalance = apports.totalUFL - needs.totalUFL;
  if (Math.abs(energyBalance) > 0.5) {
    if (energyBalance > 0) {
      alerts.push("🟡 Excès énergétique: risque d'engraissement");
    } else {
      alerts.push("🔴 Déficit énergétique: production compromise");
      recommendations.push("Ajouter des aliments énergétiques (céréales, pulpes)");
    }
  }
  
  // Protein Balance (using PDIE as reference)
  const proteinBalance = apports.totalPDIE - needs.totalPDI;
  if (Math.abs(proteinBalance) > 50) {
    if (proteinBalance > 0) {
      alerts.push("🟡 Excès protéique: coût élevé et pollution azotée");
    } else {
      alerts.push("🔴 Déficit protéique: production compromise");
      recommendations.push("Ajouter des tourteaux ou de l'urée");
    }
  }
  
  // NDF Analysis
  const ndfPercentage = apports.totalMS > 0 ? (apports.totalNDF / apports.totalMS) * 100 : 0;
  if (ndfPercentage < 28) {
    alerts.push("🚨 RISQUE D'ACIDOSE: NDF insuffisant (< 28%)");
    recommendations.push("Augmenter les fourrages grossiers pour améliorer la rumination");
  }
  
  // Concentrate Analysis
  const concentratePercentage = apports.totalMS > 0 ? (apports.concentrateMS / apports.totalMS) * 100 : 0;
  if (concentratePercentage > 50) {
    alerts.push("⚠️ Trop de concentrés: risque d'acidose et troubles digestifs");
    recommendations.push("Réduire la proportion de concentrés (< 50% de la MS)");
  }
  
  return {
    msBalance: Math.round(msBalance * 100) / 100,
    energyBalance: Math.round(energyBalance * 100) / 100,
    proteinBalance: Math.round(proteinBalance),
    ndfPercentage: Math.round(ndfPercentage * 10) / 10,
    concentratePercentage: Math.round(concentratePercentage * 10) / 10,
    alerts,
    recommendations
  };
}

/**
 * Check acidosis risk
 */
export function checkAcidosisRisk(apports: RationApports): { risk: boolean; message: string } {
  const ndfPercentage = apports.totalMS > 0 ? (apports.totalNDF / apports.totalMS) * 100 : 0;
  
  if (ndfPercentage < 28) {
    return {
      risk: true,
      message: "🚨 RISQUE FORT D'ACIDOSE: Le taux de NDF est inférieur à 28%. Augmentez immédiatement les fourrages grossiers."
    };
  }
  
  return {
    risk: false,
    message: "✅ PAS DE RISQUE D'ACIDOSE: Le taux de NDF est suffisant pour maintenir une bonne rumination."
  };
}