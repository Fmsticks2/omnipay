# OmniPay Netlify Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- GitHub/GitLab repository with your OmniPay code
- Netlify account (free tier available)
- Environment variables ready

### 2. Deploy to Netlify

#### Option A: Git-based Deployment (Recommended)
1. Push your code to GitHub/GitLab
2. Go to [Netlify](https://netlify.com) and sign in
3. Click "New site from Git"
4. Connect your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables (see section below)
7. Click "Deploy site"

#### Option B: Manual Deployment
1. Run `npm run build` locally
2. Drag and drop the `dist` folder to Netlify

## 🔐 Required Environment Variables

Add these environment variables in Netlify Dashboard → Site Settings → Environment Variables:

### **Reown AppKit Configuration**
```
VITE_PROJECT_ID=8705083ab8c9e3514f4214364153d89c
```
> **Note**: Replace with your actual Reown Project ID from [Reown Cloud](https://cloud.reown.com)

### **Push Chain Configuration**
```
VITE_PUSHCHAIN_RPC_URL=https://evm.rpc-testnet-donut-node1.push.org
VITE_PUSHCHAIN_CHAIN_ID=42101
VITE_PUSHCHAIN_EXPLORER_URL=https://testnet-explorer.push.org
VITE_PUSHCHAIN_NAME=Push Testnet Donut
VITE_PUSHCHAIN_SYMBOL=PC
```

### **OmniPay Contract Addresses**
```
VITE_OMNIPAY_NOTIFIER=0x7c19b04AD3375e3710e5bBF4C528909C407af46B
VITE_OMNIPAY_CORE=0x19ADFCCDB66985EeD6dAA6f5A7846A3d4fd86b9D
VITE_OMNIPAY_SUBSCRIPTION=0x64C4601153e9E553806f37d30f49a0295267c1Ae
VITE_OMNIPAY_BRIDGE=0x634b3cD5db670b9f104D4242621c4E200c6aDb4F
VITE_OMNIPAY_SETTLEMENT=0x37525E8B82C776F608eCA8A49C000b98a456fBdD
```

## 📋 Environment Variables Checklist

Copy and paste these into Netlify's environment variables section:

```bash
# Reown AppKit
VITE_PROJECT_ID=8705083ab8c9e3514f4214364153d89c

# Push Chain Network
VITE_PUSHCHAIN_RPC_URL=https://evm.rpc-testnet-donut-node1.push.org
VITE_PUSHCHAIN_CHAIN_ID=42101
VITE_PUSHCHAIN_EXPLORER_URL=https://testnet-explorer.push.org
VITE_PUSHCHAIN_NAME=Push Testnet Donut
VITE_PUSHCHAIN_SYMBOL=PC

# Smart Contracts
VITE_OMNIPAY_NOTIFIER=0x7c19b04AD3375e3710e5bBF4C528909C407af46B
VITE_OMNIPAY_CORE=0x19ADFCCDB66985EeD6dAA6f5A7846A3d4fd86b9D
VITE_OMNIPAY_SUBSCRIPTION=0x64C4601153e9E553806f37d30f49a0295267c1Ae
VITE_OMNIPAY_BRIDGE=0x634b3cD5db670b9f104D4242621c4E200c6aDb4F
VITE_OMNIPAY_SETTLEMENT=0x37525E8B82C776F608eCA8A49C000b98a456fBdD
```

## ⚙️ Build Configuration

The project includes:
- ✅ `netlify.toml` - Deployment configuration
- ✅ SPA redirects for React Router
- ✅ Security headers
- ✅ Asset caching
- ✅ TypeScript compilation

## 🔧 Troubleshooting

### Build Fails
1. Check Node.js version (should be 18+)
2. Verify all environment variables are set
3. Check build logs for missing dependencies

### App Doesn't Load
1. Verify environment variables are correctly set
2. Check browser console for errors
3. Ensure contract addresses are valid

### Wallet Connection Issues
1. Verify `VITE_PROJECT_ID` is correct
2. Check Reown Cloud project settings
3. Ensure domain is added to allowed origins

## 🌐 Production Considerations

### For Mainnet Deployment:
1. Update contract addresses to mainnet versions
2. Change RPC URLs to mainnet endpoints
3. Update chain IDs accordingly
4. Use production Reown Project ID

### Security:
- Environment variables are automatically secured by Netlify
- Never commit `.env` files to version control
- Regularly rotate API keys and project IDs

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables match exactly
3. Test locally with `npm run build && npm run preview`
4. Check browser developer console for errors

---

**🎉 Your OmniPay application is now ready for deployment!**