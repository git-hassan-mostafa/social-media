/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: []
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};  
