/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            // Allow server actions from both localhost and Clerk's authentication domains
            allowedOrigins: [
                'localhost:3000',
                'localhost',
                'clerk.com',
                '*.clerk.com',
                '*.clerk.accounts.dev'
            ]
        }
    }
}

export default nextConfig
