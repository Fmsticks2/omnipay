# OmniPay Frontend - Netlify Deployment Guide

This guide explains how to deploy the OmniPay frontend to Netlify.

## Prerequisites

- Node.js 18 or higher
- npm or pnpm
- Netlify account

## Deployment Methods

### Method 1: Netlify CLI (Recommended)

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize the site:
   ```bash
   cd frontend
   netlify init
   ```

4. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Method 2: Git Integration

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Netlify:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Choose your Git provider and repository
   - Configure build settings:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build:production`
     - **Publish directory**: `dist`

### Method 3: Manual Deploy

1. Build the project locally:
   ```bash
   cd frontend
   npm install
   npm run build:production
   ```

2. Drag and drop the `dist` folder to Netlify's deploy interface

## Environment Variables

Set the following environment variables in your Netlify dashboard:

### Required Variables
```
VITE_PROJECT_ID=your_reown_project_id
VITE_PUSHCHAIN_RPC_URL=https://evm.rpc-testnet-donut-node1.push.org
VITE_PUSHCHAIN_CHAIN_ID=42101
VITE_PUSHCHAIN_EXPLORER_URL=https://testnet-explorer.push.org
VITE_PUSHCHAIN_NAME=Push Testnet Donut
VITE_PUSHCHAIN_SYMBOL=PC
```

### Contract Addresses
```
VITE_OMNIPAY_NOTIFIER=0x7c19b04AD3375e3710e5bBF4C528909C407af46B
VITE_OMNIPAY_CORE=0x19ADFCCDB66985EeD6dAA6f5A7846A3d4fd86b9D
VITE_OMNIPAY_SUBSCRIPTION=0x64C4601153e9E553806f37d30f49a0295267c1Ae
VITE_OMNIPAY_BRIDGE=0x634b3cD5db670b9f104D4242621c4E200c6aDb4F
VITE_OMNIPAY_SETTLEMENT=0x37525E8B82C776F608eCA8A49C000b98a456fBdD
```

### Optional Variables
```
VITE_APP_NAME=OmniPay
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=https://api.omnipay.com
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
```

## Configuration Files

The following files have been configured for Netlify deployment:

### `netlify.toml`
- Build settings and commands
- Redirect rules for SPA routing
- Security headers
- Caching policies
- Environment-specific configurations

### `public/_redirects`
- Fallback redirects for React Router
- Static asset handling
- API proxy rules (if needed)

## Build Configuration

The project uses Vite with the following build configurations:

- **Development**: `npm run dev`
- **Production**: `npm run build:production`
- **Preview**: `npm run preview`
- **Netlify Build**: `npm run netlify:build`

## Domain Configuration

After deployment:

1. **Custom Domain**: Configure your custom domain in Netlify dashboard
2. **HTTPS**: Netlify provides free SSL certificates
3. **DNS**: Update your DNS records to point to Netlify

## Performance Optimization

The build is optimized with:

- Code splitting for vendor libraries
- Tree shaking for unused code
- Asset optimization and compression
- Source map generation disabled in production
- Console.log removal in production builds

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version (should be 18+)
   - Verify all environment variables are set
   - Check for TypeScript errors

2. **Routing Issues**:
   - Ensure `_redirects` file is in the `public` directory
   - Verify SPA redirect rules in `netlify.toml`

3. **Environment Variables**:
   - All Vite environment variables must start with `VITE_`
   - Variables are embedded at build time, not runtime

### Build Logs

Check Netlify build logs for detailed error information:
- Go to your site dashboard
- Click on "Deploys"
- View the failed deploy logs

## Security

The deployment includes security headers:
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy for camera, microphone, geolocation

## Support

For deployment issues:
1. Check Netlify documentation
2. Review build logs
3. Verify environment variables
4. Test build locally first

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router and SPAs](https://reactrouter.com/en/main/guides/ssr)