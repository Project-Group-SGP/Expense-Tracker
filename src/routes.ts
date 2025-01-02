/**
 *  An Array of routes that are accessible to public
 * These routes do not require aythentication
 * @type{string[]}
 *
 */
export const publicRoutes = [
  "/",
  "/auth/new-verification",
  "/api/sendMonthlyMail",
  "/api/sendRemainder",
  "/api/recurringTransaction"
]

/**
 *
 * An Array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type{string[]}
 *
 */

export const authRoutes = [
  "/auth/signin",
  "/auth/signup",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
]

/**
 *  The prefix for Api authentication routes
 * Routes that start with this
 * @type{string[]}
 *
 */

export const apiAuthPrefix = "/api/auth"

/**
 *  The default redirect path after loggong in
 * @type{string}
 *
 */

export const DEFAULT_LOGIN_REDIRECT = "/dashboard"

export const apiRoutes = [
  "/api/total-income-expense",
  "/api/allData",
  "/api/joinin-date",
  "/api/budget-category",
  "/api/register-push",
  "/api/history/bulkdata",
  "/api/history/singletransaction",
  "/api/get-group",
  "/api/get-group-transaction",
  "/api/balance",
  "/api/get-suggestion",
]

export const privateRoutes = [
  "/dashboard",
  "/transaction",
  "/settings",
  "/history",
  "/report",
  "/budget",
  "/budget/food",
  "/budget/entertainment",
  "/budget/transportation",
  "/budget/healthcare",
  "/budget/education",
  "/budget/investment",
  "/budget/shopping",
  "/budget/groceries",
  "/budget/other",
  "/budget/bills",
  "/budget/fuel",
  "/budget/emi",
  "/group",
  "/recurring"
]
