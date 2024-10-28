/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
        loader: "custom",
        loaderFile: "./src/util/imageLoader.ts",
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
