/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ['api.telegram.org'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', 'jsonwebtoken', 'mongodb']
  }
}
