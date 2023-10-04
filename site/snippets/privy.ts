/**
 * This example assumes your app is wrapped with the `PrivyProvider` and
 * is configured to create embedded wallets for users upon login.
 *
 * The code below must be used within a React component.
 */
import { useWallets } from "@privy-io/react-auth";
import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";
import { createWalletClient, custom } from 'viem';
import { sepolia } from "viem/chains";

// Find the user's embedded wallet
const {wallets} = useWallets();
const embeddedWallet = wallets.find((wallet) => (wallet.walletClientType === 'privy'));

if (!embeddedWallet) throw new Error('User does not have an embedded wallet');

// Switch the embedded wallet to your desired network
await embeddedWallet.switchChain(sepolia.id);

// Get a viem client from the embedded wallet
const eip1193provider = await embeddedWallet.getEthereumProvider();
const privyClient = createWalletClient({
    account: embeddedWallet.address,
    chain: sepolia,
    transport: custom(eip1193provider)
});

// Create a smart account signer from the embedded wallet's viem client
export const privySigner: SmartAccountSigner = new WalletClientSigner(
    privyClient
);
