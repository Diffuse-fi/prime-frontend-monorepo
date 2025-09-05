## Description

This library serves as a ESM-only JavaScript wrapper for the Diffuse protocol, enabling developers to interact with the protocol's smart contracts and functionalities in a straightforward manner.

It provides a set of functions and utilities to facilitate operations such as lending, borrowing, and managing positions within the Diffuse ecosystem as long as contracts address book.

## Usage

To use the Diffuse Prime SDK, you need to install it in your project. You can do this using npm or yarn:

```bash
npm install @diffuse-prime/sdk-js
```

To use smart contracts, you need to import the specific contract you want to interact with. For example, to use the Vault contract, you can do the following:

```javascript
import { Vault } from "@diffuse-prime/sdk-js";

// Initialize the contract with the required parameters
const vaultInit = {
  chainId: 1, // Ethereum mainnet
  address: "0xYourVaultContractAddress",
  client: {
    publicClient: yourPublicClientInstance,
    wallet: yourWalletClientInstance, // Optional, required for write operations
  },
};
```

```javascript
// Create an instance of the Vault contract
const vaultContract = new Vault(vaultInit);
// Now you can use the contract instance to interact with the Diffuse protocol
// For example, to get the current interest rate:
const interestRate = await vaultContract.getInterestRate(); // Or any other method provided by the contract
```

## Development

To run the SDK in development mode, use the following command:

```bash
npm run dev
```

This will start the development server and watch for changes in the source files.
