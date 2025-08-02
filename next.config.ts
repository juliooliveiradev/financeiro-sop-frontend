import { NextConfig } from 'next';

const withPWA = require('next-pwa')({
  dest: 'public',
  // A desabilitação do PWA em modo de desenvolvimento é opcional,
  // mas ajuda a evitar problemas de cache durante o desenvolvimento.
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Outras configurações do Next.js aqui, se necessário.
};

module.exports = withPWA(nextConfig);
