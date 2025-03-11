/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network;
              frame-src 'self' https://js.stripe.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: https://firebasestorage.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' https://api.stripe.com https://m.stripe.network https://firestore.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com;
            `.replace(/\n/g, ""), // Supprime les sauts de ligne pour éviter les erreurs
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
