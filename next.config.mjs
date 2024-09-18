import withPWA from "next-pwa"

/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack: (config, { isServer }) => {
    // Add custom font handling rules
    config.module.rules.push({
      test: /\.(ttf|eot|woff|woff2)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "static/fonts/", // Specify the output directory for fonts
            publicPath: "/_next/static/fonts/", // Specify the public URL path for fonts
            esModule: false, // Ensure compatibility with CommonJS
          },
        },
      ],
    })
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
