// Mock scan history data
export const mockHistory = [
  {
    id: 1,
    productName: "Nature's Path Organic Granola",
    timestamp: "2 hours ago",
    verdict: "Safe",
    oneLineSummary: "Clean ingredients with organic whole grains and natural sweeteners.",
    keyInsights: [
      { type: "Positive", title: "Organic Whole Grains", explanation: "Rich in fiber and essential nutrients." },
      { type: "Positive", title: "No Artificial Preservatives", explanation: "Made with natural ingredients only." },
      { type: "Neutral", title: "Honey", explanation: "Natural sweetener but still contains sugars." }
    ]
  },
  {
    id: 2,
    productName: "Cola Zero Sugar",
    timestamp: "Yesterday",
    verdict: "Caution",
    oneLineSummary: "Mostly clean, but contains artificial sweeteners.",
    keyInsights: [
      { type: "Negative", title: "Aspartame", explanation: "Artificial sweetener with debated health effects." },
      { type: "Negative", title: "Phosphoric Acid", explanation: "May affect bone density with excess consumption." },
      { type: "Positive", title: "Zero Calories", explanation: "No sugar or calories for weight management." }
    ]
  },
  {
    id: 3,
    productName: "Honey BBQ Chips",
    timestamp: "2 days ago",
    verdict: "Avoid",
    oneLineSummary: "Contains multiple concerning additives and high sodium.",
    keyInsights: [
      { type: "Negative", title: "High Fructose Corn Syrup", explanation: "Linked to metabolic issues and obesity." },
      { type: "Negative", title: "MSG (E621)", explanation: "May cause adverse reactions in sensitive individuals." },
      { type: "Negative", title: "Excessive Sodium", explanation: "980mg per serving, nearly half daily limit." }
    ]
  },
  {
    id: 4,
    productName: "Greek Yogurt Plain",
    timestamp: "3 days ago",
    verdict: "Safe",
    oneLineSummary: "Excellent protein source with live cultures and minimal ingredients.",
    keyInsights: [
      { type: "Positive", title: "High Protein", explanation: "15g of protein per serving for muscle health." },
      { type: "Positive", title: "Live Probiotics", explanation: "Beneficial bacteria for gut health." },
      { type: "Positive", title: "Low Sugar", explanation: "Only naturally occurring milk sugars." }
    ]
  },
  {
    id: 5,
    productName: "Energy Drink XL",
    timestamp: "Last week",
    verdict: "Caution",
    oneLineSummary: "High caffeine content with added vitamins but synthetic ingredients.",
    keyInsights: [
      { type: "Negative", title: "High Caffeine", explanation: "200mg caffeine may cause jitters and sleep issues." },
      { type: "Neutral", title: "B-Vitamins Added", explanation: "Synthetic vitamins, not as bioavailable as natural." },
      { type: "Negative", title: "Taurine", explanation: "Synthetic amino acid with limited research on long-term effects." }
    ]
  }
];

// Mock analysis results for different ingredients
export const mockAnalysisResults = {
  default: {
    verdict: "Caution",
    oneLineSummary: "Mostly clean, but contains high fructose corn syrup.",
    keyInsights: [
      { type: "Negative", title: "High Fructose Corn Syrup", explanation: "Linked to metabolic issues and increased fat storage." },
      { type: "Positive", title: "Whole Grains", explanation: "Good source of dietary fiber and B vitamins." },
      { type: "Neutral", title: "Natural Flavors", explanation: "Vague term that could include various compounds." }
    ]
  },
  healthy: {
    verdict: "Safe",
    oneLineSummary: "Clean ingredients with excellent nutritional profile.",
    keyInsights: [
      { type: "Positive", title: "Organic Ingredients", explanation: "No pesticides or synthetic fertilizers used." },
      { type: "Positive", title: "High Fiber Content", explanation: "Supports digestive health and satiety." },
      { type: "Positive", title: "No Added Sugars", explanation: "Sweetened only with natural fruit." }
    ]
  },
  processed: {
    verdict: "Avoid",
    oneLineSummary: "Highly processed with multiple artificial additives.",
    keyInsights: [
      { type: "Negative", title: "Sodium Nitrite", explanation: "Preservative linked to increased cancer risk." },
      { type: "Negative", title: "Artificial Colors", explanation: "Red 40 and Yellow 5 may cause hyperactivity in children." },
      { type: "Negative", title: "Trans Fats", explanation: "Partially hydrogenated oils damage cardiovascular health." }
    ]
  }
};
