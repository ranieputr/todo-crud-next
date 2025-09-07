/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // (opsional) kalau kamu pakai gambar eksternal
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // (opsional) aktifkan eksperimen App Router
  experimental: {
    appDir: true,
  },
}

export default nextConfig
