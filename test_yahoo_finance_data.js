// Test data basado en la respuesta real del endpoint
const sampleYahooFinanceData = {
  success: true,
  processed_tickers: ["AAPL", "MSFT"],
  valid_companies: [
    {
      ticker: "AAPL",
      valid: true,
      company_name: "Apple Inc.",
      sector: "Technology",
      industry: "Consumer Electronics",
      country: "United States",
      currency: "USD",
      fx_rate: 1,
      dc_ratio: 0.6009,
      effective_tax_rate: 0.2409,
      beta_levered: 1.094,
      beta_unlevered: 0.5105,
      debt_value: 85750000000,
      debt_value_formatted: "$85.75B",
      equity_value: 56950000000,
      equity_value_formatted: "$56.95B",
      de_ratio: 1.5057,
      market_cap: 3744081903616,
      market_cap_formatted: "$3744.08B",
      pretax_income: 123485000000,
      tax_provision: 29749000000,
      equity_label_used: "Stockholders Equity",
      debt_label_used: "Long Term Debt",
    },
    {
      ticker: "MSFT",
      valid: true,
      company_name: "Microsoft Corporation",
      sector: "Technology",
      industry: "Software - Infrastructure",
      country: "United States",
      currency: "USD",
      fx_rate: 1,
      dc_ratio: 0.1047,
      effective_tax_rate: 0.1763,
      beta_levered: 1.023,
      beta_unlevered: 0.9331,
      debt_value: 40152000000,
      debt_value_formatted: "$40.15B",
      equity_value: 343479000000,
      equity_value_formatted: "$343.48B",
      de_ratio: 0.1169,
      market_cap: 3817525739520,
      market_cap_formatted: "$3817.53B",
      pretax_income: 123627000000,
      tax_provision: 21795000000,
      equity_label_used: "Stockholders Equity",
      debt_label_used: "Long Term Debt",
    },
  ],
  invalid_companies: [],
  group_statistics: {
    beta_unlevered_avg: 0.7218,
    beta_unlevered_median: 0.7218,
    dc_ratio_avg: 0.3528,
    tax_rate_avg: 0.2086,
    valid_count: 2,
    total_count: 2,
  },
  metadata: {
    timestamp: "2025-10-19 23:58:36",
    processing_time: 6,
    requested_tickers: ["AAPL", "MSFT"],
    source: "Yahoo Finance",
  },
};

// Test para verificar que la función displayYahooFinanceResults funciona
console.log("Test data ready:");
console.log(
  "- Valid companies:",
  sampleYahooFinanceData.valid_companies.length
);
console.log(
  "- Group beta avg:",
  sampleYahooFinanceData.group_statistics.beta_unlevered_avg
);
console.log(
  "- Processing time:",
  sampleYahooFinanceData.metadata.processing_time,
  "seconds"
);

// Para usar en el chatbot, simplemente llama:
// displayYahooFinanceResults(sampleYahooFinanceData);
