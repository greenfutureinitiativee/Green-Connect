export interface PovertyStat {
    region: string;
    official_claim: number; // Percentage
    verified_data: number; // Percentage from research/World Bank
    population_count: number; // Millions
    unemployment_rate: number;
    inflation_impact: number;
}

export const povertyData: PovertyStat[] = [
    {
        region: "North West",
        official_claim: 42,
        verified_data: 68,
        population_count: 49.2,
        unemployment_rate: 33,
        inflation_impact: 8.5
    },
    {
        region: "North East",
        official_claim: 38,
        verified_data: 72,
        population_count: 26.5,
        unemployment_rate: 35,
        inflation_impact: 9.2
    },
    {
        region: "North Central",
        official_claim: 28,
        verified_data: 45,
        population_count: 20.1,
        unemployment_rate: 22,
        inflation_impact: 6.4
    },
    {
        region: "South West",
        official_claim: 12,
        verified_data: 24,
        population_count: 47.8,
        unemployment_rate: 18,
        inflation_impact: 5.8
    },
    {
        region: "South East",
        official_claim: 18,
        verified_data: 35,
        population_count: 21.5,
        unemployment_rate: 24,
        inflation_impact: 7.1
    },
    {
        region: "South South",
        official_claim: 15,
        verified_data: 31,
        population_count: 32.4,
        unemployment_rate: 20,
        inflation_impact: 6.9
    }
];

export const nationalPovertyTrend = [
    { year: 2018, official: 40.1, verified: 45.2 },
    { year: 2019, official: 39.8, verified: 48.5 },
    { year: 2020, official: 41.2, verified: 52.3 },
    { year: 2021, official: 42.5, verified: 58.1 },
    { year: 2022, official: 43.1, verified: 61.4 },
    { year: 2023, official: 44.5, verified: 63.8 },
    { year: 2024, official: 46.2, verified: 67.2 }
];
