import withPWA from "next-pwa"

/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  serverRuntimeConfig: {
    functions: {
      maxDuration: 60, // Set this to the desired number of seconds
    },
  },
}

const pwaConfig = {
  dest: "public",
  disable: process.env.NODE_ENV === "development",
}

const buildConfig = () => {
  const config = withPWA(pwaConfig)(nextConfig)
  return config
}

export default buildConfig()
