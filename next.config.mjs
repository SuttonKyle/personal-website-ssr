/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's3.amazonaws.com',
                port: '',
                pathname: '/kylesutton-personal-website-photos/**',
            },
        ],
    },
};

export default nextConfig;
