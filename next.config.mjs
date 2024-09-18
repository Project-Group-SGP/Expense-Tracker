import withPWA from "next-pwa"
import path from "path"

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
            outputPath: "static/fonts/",
            publicPath: "/_next/static/fonts/",
            esModule: false,
          },
        },
      ],
    })

    // Ensure the fonts directory is copied to the build output
    if (isServer) {
      const fontsDir = path.join(process.cwd(), "public", "fonts")
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: fontsDir,
              to: path.join(config.output.path, "static", "fonts"),
            },
          ],
        })
      )
    }

    return config
  },
  // Add custom headers for font files
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
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
