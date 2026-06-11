import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
  serverExternalPackages: ["html2canvas", "jspdf"],
  turbopack: {
    root: path.resolve(__dirname),
  },
}

export default nextConfig
