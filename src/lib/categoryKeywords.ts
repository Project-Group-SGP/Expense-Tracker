import { CategoryTypes } from "@prisma/client"

//prettier-ignore
export const categories: { name: CategoryTypes; keywords: string[] }[] = [
  { 
    name: "Other", 
    keywords: [
      "miscellaneous", "general", "various", "uncategorized", "misc", "random","unknown",
    ] 
  },
  {
    name: "Bills",
    keywords: [
      "bill", "bills", "utility", "utilities", "electricity", "water", "gas", "bsnl", "jio", "airtel", "recharge", 
      "subscription", "subscriptions", "maintenance", "internet", "prepaid", "postpaid", "telecom", "tax", "taxes", 
      "tv", "power", "torrent", "pgvcl", "ugvcl", "mgvcl", "dgvcl", "vera", "gst", "vodafone idea", "vi", "dish tv", 
      "tata sky", "d2h", "lpg", "cylinder", "electric", "telephone", "landline", "heating", "billing"
    ]
  },
  {
    name: "Food",
    keywords: [
      "food", "restaurant", "meal", "dinner", "lunch", "breakfast", "zomato", "swiggy", "cafe", "dhaba", "manchurian", 
      "kfc", "pizza", "burger", "pasta", "ice cream", "coffee", "tea", "samosa", "momo", "biryani", "dosa", "dhosa", 
      "snack", "chips", "chocolate", "fries", "snacks", "salad", "fast food", "delivery", "sushi", "curry", "jalebi", 
      "sandwich", "dessert", "noodles", "sweets", "biscuit", "rice", "gathiya", "khaman", "khamman", "locho", "punjabi", 
      "chinese", "subway", "bhajiya", "vada", "idli", "thali", "dabeli", "vadapav", "pani puri", "sev", "fafda", "dhokla", 
      "undhiyu", "khandvi", "dal dhokli", "farsan", "thepla", "rotli", "chai", "lassi", "buttermilk", "chaas", "pav bhaji", 
      "gujarati", "kathiyawadi", "surti", "buffet", "snack bar", "takeout", "catering", "street food", "bakery", "dessert"
    ]
  },
  {
    name: "Entertainment",
    keywords: [
      "movie", "movies", "concert", "game", "parties", "party", "theatre", "theater", "show", "pvr", "inox", "netflix", 
      "prime", "hotstar", "picture", "music", "radio", "cinema", "esport", "zee5", "sony", "premiere", "ramzat", "club", 
      "park", "dj", "imax", "garba", "dandiya", "navratri", "kite festival", "uttarayan", "amusement park", "water park", 
      "museum", "multiplex", "bookmyshow", "jio cinema", "voot", "alt balaji", "mxplayer", "games", "arcade", "festivals", 
      "streaming", "gaming", "live show", "performance", "circus"
    ]
  },
  {
    name: "Transportation",
    keywords: [
      "bus", "train", "taxi", "uber", "ola", "fare", "auto", "metro", "rickshaw", "cab", "flight", "aeroplane", "ferry", 
      "cruise", "toll", "fastag", "brts", "amts", "gsrtc", "rapido", "jugnoo", "irctc", "makemytrip", "goibibo", "redbus", 
      "zoomcar", "revv", "yulu", "vogo", "parking", "rental", "journey", "bike", "scooter", "shuttle", "travel", "trip"
    ]
  },
  {
    name: "EMI",
    keywords: [
      "emi", "loan", "installment", "payment", "bajaj", "hdfc", "sbi", "kotak", "icici", "axis", "paytm", "debt", 
      "interest", "bank", "card", "lender", "borrow", "idbi", "rbi", "mortgage", "credit card", "overdraft", "gpay", 
      "phonepe", "bhim", "credit", "finance", "installments", "equated monthly installment", "deferred payment", 
      "monthly payment", "interest payment"
    ]
  },
  {
    name: "Healthcare",
    keywords: [
      "doctor", "hospital", "medicine", "pharmacy", "health", "apollo", "fortis", "operation", "clinic", "dentist", 
      "eye", "dava", "laboratory", "insurance", "therapy", "vaccine", "prescription", "checkup", "consultation", "icu", 
      "surgery", "xray", "scan", "mri", "healthcare", "treatment", "civil", "sterling", "zydus", "shalby", "cims", 
      "ayurveda", "homeopathy", "yoga", "physiotherapy", "optician", "pathology", "blood", "aarogyasetu", "wellness", 
      "sanjeevani", "medical", "health insurance", "medication", "nurse", "emergency", "ambulance", "care"
    ]
  },
  {
    name: "Education",
    keywords: [
      "school", "college", "course", "book", "tuition", "study", "tution", "unacademy", "academy", "udemy", "learn", 
      "coursera", "university", "exam", "degree", "diploma", "class", "training", "certification", "textbook", "chopda", 
      "library", "iim", "nit", "iit", "iiit", "gtu", "nirma", "pdpu", "charusat", "coaching", "byju", "vedantu", "toppr", 
      "nptel", "swayam", "upsc", "gpsc", "ielts", "toefl", "gre", "gmat", "learning", "schooling", "syllabus", "education fee", 
      "tuition fee", "study materials", "curriculum", "scholarship","fees"
    ]
  },
  {
    name: "Investment",
    keywords: [
      "invest", "stock", "bond", "mutual fund", "crypto", "sip", "lic", "nsc", "ppf", "ipo", "zerodha", "upstox", "groww", 
      "angel", "motilal oswal", "icici direct", "nse", "bse", "sensex", "nifty", "demat", "trading", "dividend", "gold", 
      "silver", "etf", "elss", "nps", "fixed deposit", "fd", "recurring deposit", "rd", "stocks", "real estate", "portfolio", 
      "investment fund", "assets", "futures", "commodities", "hedge", "shares"
    ]
  },
  {
    name: "Shopping",
    keywords: [
      "shopping", "shop", "clothes", "apparel", "dress", "electronics", "gadget", "mobile", "laptop", "computer", "phone", 
      "fashion", "flipkart", "myntra", "ajio", "zara", "pantaloons", "mall", "boutique", "supermarket", "big bazaar", 
      "amazon", "shein", "snapdeal", "meesho", "decathlon", "ikea", "furniture", "sofa", "curtain", "blanket", 
      "accessories", "reliance digital", "croma", "vijay sales", "tanishq", "kalyan", "tbz", "lifestyle", "westside", 
      "fabindia", "bandhani", "patola", "chaniya choli", "zudio", "jewellery", "makeup", "beauty", "shirt", "tshirt", 
      "jeans", "kurti", "saree", "watch", "necklace", "jewellery", "ring", "earring", "bracelet", "iphone"
    ]
  },
  {
    name: "Fuel",
    keywords: [
      "gas", "petrol", "diesel", "fuel", "cng", "indian oil", "hp", "petroleum", "fill", "station", "gulf", "bhavnagar gas", 
      "gujarat gas", "reliance petrol", "adani gas", "lpg", "oil", "fuel station", "gasoline", "car fuel", "motor oil", "charging",
      "ev", "charge"
    ]
  },
  {
    name: "Groceries",
    keywords: [
      "grocery", "food", "vegetable", "fruit", "milk", "egg", "ration", "bazar", "store", "supermarket", "safal", "reliance", 
      "dmart", "bazaar", "madhur", "cooking", "masala", "atta", "flour", "dal", "dairy", "chocolates", "bakery", "biscuit", 
      "sweets", "namkeen", "spices", "fmcg", "bisleri", "amul", "nestle", "fortune", "maggi", "ghee", "paneer", "khari", 
      "butter", "curd", "yogurt", "sugar", "salt", "rice", "wheat", "toor dal", "bajra", "jowar", "groceries", "beverage", 
      "daily essentials", "kirana", "dry fruit", "pulse", "bread", "haldar", "hing", "mirchi", "marchi", "powder", "paneer",
      "big basket", "bigbasket", "blinkit", "pulses", "lot", "pickle"
    ]
  }
];

// Function to suggest category
export const suggestCategory = (description: string): CategoryTypes => {
  const lowerDescription = description.toLowerCase()
  let bestMatch: { category: CategoryTypes; score: number } = {
    category: CategoryTypes.Other,
    score: 0,
  }

  for (const category of categories) {
    let categoryScore = 0
    for (const keyword of category.keywords) {
      const keywordLower = keyword.toLowerCase()
      if (lowerDescription.includes(keywordLower)) {
        // Calculate score based on keyword length
        const keywordScore = keywordLower.length ** 2 // Square the length to give more weight to longer matches
        categoryScore += keywordScore
      }
    }

    if (categoryScore > bestMatch.score) {
      bestMatch = { category: category.name, score: categoryScore }
    }
  }

  // console.log("Suggested category:", bestMatch.category)

  return bestMatch.category
}
