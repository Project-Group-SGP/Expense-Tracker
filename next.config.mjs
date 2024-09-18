import withPWA from "next-pwa"
import CopyPlugin from "copy-webpack-plugin"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: join(__dirname, "public", "fonts"),
              to: join(__dirname, ".next", "server", "fonts"),
            },
          ],
        })
      )
    }
    return config
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
