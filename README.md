# OmniPay

OmniPay is a modern cross-chain payment platform built with React, Vite, and Web3 technologies. It enables seamless payments across multiple blockchain networks with a premium user interface.

## Features

- **Cross-Chain Payments**: Support for multiple blockchain networks
- **Modern UI**: Premium design with dark/light theme support
- **Web3 Integration**: Built with Wagmi and Reown AppKit
- **Smart Contracts**: Comprehensive payment infrastructure
- **Subscription Management**: Recurring payment capabilities

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd omnipay
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run chain:compile` - Compile smart contracts
- `npm run chain:test` - Run contract tests
- `npm run chain:deploy` - Deploy contracts

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Web3**: Wagmi, Reown AppKit, Ethers.js
- **Smart Contracts**: Hardhat, Solidity
- **UI Components**: Lucide React icons

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Application pages
├── contexts/      # React contexts
├── lib/           # Utility functions and contracts
└── main.tsx       # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
