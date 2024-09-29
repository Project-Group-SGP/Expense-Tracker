import { CategoryTypes } from "@prisma/client"

//prettier-ignore
export const categories: { name: CategoryTypes; keywords: string[] }[] = [
  {
    name: "Other",
    //prettier-ignore
    keywords: [
      "general", "misc", "miscellaneous","other", "random", "uncategorized", "unknown", "various"
    ],
  },
  {
    name: "Bills",
    //prettier-ignore
    keywords: [
      "airtel", "bill", "billing", "bills", "bsnl", "cylinder", "d2h", "dgvcl", "dish tv", "electric", "electricity", "gas", "gst", "heating", "internet", "jio", "landline", "lpg", "maintenance", "mgvcl", "pgvcl", "postpaid", "power", "prepaid", "recharge", "subscription", "subscriptions", "tata sky", "tax", "taxes", "telecom", "telephone", "torrent", "tv", "ugvcl", "utilities", "utility", "vera", "vi", "vodafone idea", "water"
    ],
  },
  {
    name: "Food",
    //prettier-ignore
    keywords: [
      "bakery", "bhajiya", "biryani", "biscuit", "breakfast", "buffet", "burger", "buttermilk", "cafe", "catering", "chaas", "chai", "chinese", "chips", "chocolate", "coffee", "curry", "dabeli", "dal dhokli", "delivery", "dessert", "dessert", "dhaba", "dhokla", "dhosa", "dinner", "dosa", "fafda", "farsan", "fast food", "food", "fries", "gathiya", "gujarati", "ice cream", "idli", "jalebi", "kathiyawadi", "kfc", "khaman", "khamman", "khandvi", "lassi", "locho", "lunch", "manchurian", "meal", "momo", "noodles", "pani puri", "pasta", "pav bhaji", "pizza", "punjabi", "restaurant", "rice", "rotli", "salad", "samosa", "sandwich", "sev", "snack", "snack bar", "snacks", "street food", "subway", "surti", "sushi", "sweets", "swiggy", "takeout", "tea", "thali", "thepla", "undhiyu", "vada", "vadapav", "zomato"
    ],
  },
  {
    name: "Entertainment",
    //prettier-ignore
    keywords: [
      "alt balaji", "amusement park", "arcade", "bookmyshow", "cinema", "circus", "club", "concert", "dandiya", "dj", "esport", "festivals", "game", "games", "gaming", "garba", "hotstar", "imax", "inox", "jio cinema", "kite festival", "live show", "movie", "movies", "multiplex", "museum", "music", "mxplayer", "navratri", "netflix", "park", "parties", "party", "performance", "picture", "premiere", "prime", "pvr", "radio", "ramzat", "show", "sony", "streaming", "theater", "theatre", "uttarayan", "voot", "water park", "zee5"
    ],
  },
  {
    name: "Transportation",
    //prettier-ignore
    keywords: [
      "aeroplane", "amts", "auto", "bike", "brts", "bus", "cab", "cruise", "fare", "fastag", "ferry", "flight", "goibibo", "gsrtc", "irctc", "journey", "jugnoo", "makemytrip", "metro", "ola", "parking", "rapido", "redbus", "rental", "revv", "rickshaw", "scooter", "shuttle", "taxi", "toll", "train", "travel", "trip", "uber", "vogo", "yulu", "zoomcar"
    ],
  },
  {
    name: "EMI",
    //prettier-ignore
    keywords: [
      "axis", "bajaj", "bank", "bhim", "borrow", "card", "credit", "credit card", "debt", "deferred payment", "emi", "equated monthly installment", "finance", "gpay", "hdfc", "icici", "idbi", "installment", "installments", "interest", "interest payment", "kotak", "lender", "loan", "monthly payment", "mortgage", "overdraft", "payment", "paytm", "phonepe", "rbi", "sbi"
    ],
  },
  {
    name: "Healthcare",
    //prettier-ignore
    keywords: [
      "aarogyasetu", "ambulance", "apollo", "ayurveda", "blood", "care", "checkup", "cims", "civil", "clinic", "consultation", "dava", "dentist", "doctor", "emergency", "eye", "fortis", "health", "health insurance", "healthcare", "homeopathy", "hospital", "icu", "insurance", "laboratory", "medical", "medication", "medicine", "mri", "nurse", "operation", "optician", "pathology", "pharmacy", "physiotherapy", "prescription", "sanjeevani", "scan", "shalby", "sterling", "surgery", "therapy", "treatment", "vaccine", "wellness", "xray", "yoga", "zydus"
    ],
  },
  {
    name: "Education",
    //prettier-ignore
    keywords: [
      "academy", "book", "byju", "certification", "charusat", "chopda", "class", "coaching", "college", "course", "coursera", "curriculum", "degree", "diploma", "education fee", "exam", "fees", "gmat", "gpsc", "gre", "gtu", "ielts", "iiit", "iim", "iit", "learn", "learning", "library", "nirma", "nit", "nptel", "pdpu", "scholarship", "school", "schooling", "study", "study materials", "swayam", "syllabus", "textbook", "toefl", "toppr", "training", "tuition", "tuition fee", "tution", "udemy", "unacademy", "university", "upsc", "vedantu"
    ],
  },
  {
    name: "Investment",
    //prettier-ignore
    keywords: [
      "angel", "assets", "bond", "bse", "commodities", "crypto", "demat", "dividend", "elss", "etf", "fd", "fixed deposit", "futures", "gold", "groww", "hedge", "icici direct", "invest", "investment fund", "ipo", "lic", "motilal oswal", "mutual fund", "nifty", "nps", "nsc", "nse", "portfolio", "ppf", "rd", "real estate", "recurring deposit", "sensex", "shares", "silver", "sip", "stock", "stocks", "trading", "upstox", "zerodha"
    ],
  },
  {
    name: "Shopping",
    //prettier-ignore
    keywords: [
      "accessories", "ajio", "amazon", "apparel", "bandhani", "beauty", "big bazaar", "blanket", "boutique", "bracelet", "chaniya choli", "clothes", "computer", "croma", "curtain", "decathlon", "dress", "earring", "electronics", "fabindia", "fashion", "flipkart", "furniture", "gadget", "ikea", "iphone", "jeans", "jewellery", "jewellery", "kalyan", "kurti", "laptop", "lifestyle", "makeup", "mall", "meesho", "mobile", "myntra", "necklace", "pantaloons", "patola", "phone", "reliance digital", "ring", "saree", "shein", "shirt", "shop", "shopping", "snapdeal", "sofa", "supermarket", "tanishq", "tbz", "tshirt", "vijay sales", "watch", "westside", "zara", "zudio"
    ],
  },
  {
    name: "Fuel",
    //prettier-ignore
    keywords: [
      "adani gas", "bhavnagar gas", "car fuel", "charge", "charging", "cng", "diesel", "ev", "fill", "fuel", "fuel station", "gas", "gasoline", "gujarat gas", "gulf", "hp", "indian oil", "lpg", "motor oil", "oil", "petrol", "petroleum", "reliance petrol", "station"
    ],
  },
  {
    name: "Groceries",
    //prettier-ignore
    keywords: [
      "amul", "atta", "bajra", "bakery", "bazaar", "bazar", "beverage", "big basket", "bigbasket", "biscuit", "bisleri", "blinkit", "bread", "butter", "chocolates", "cooking", "curd", "daily essentials", "dairy", "dal", "dmart", "dry fruit", "egg", "flour", "fmcg", "food", "fortune", "fruit", "ghee", "groceries", "grocery", "haldar", "hing", "jowar", "khari", "kirana", "lot", "madhur", "maggi", "marchi", "masala", "milk", "mirchi", "namkeen", "nestle", "paneer", "paneer", "pickle", "powder", "pulse", "pulses", "ration", "reliance", "rice", "safal", "salt", "spices", "store", "sugar", "supermarket", "sweets", "toor dal", "vegetable", "wheat", "yogurt"
    ],
  },
]

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
