import withPWA from "next-pwa"
import CopyPlugin from "copy-webpack-plugin"
import path from "path"

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
              from: path.join(__dirname, "public", "fonts"),
              to: path.join(__dirname, ".next", "server", "fonts"),
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
