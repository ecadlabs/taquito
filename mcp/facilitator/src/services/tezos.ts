/**
 * Tezos Service
 *
 * Wrapper around Taquito for Tezos RPC interactions including
 * balance queries, operation injection, and confirmation polling.
 */

import { TezosToolkit } from '@taquito/taquito';

const DEFAULT_RPC_URL = 'https://shadownet.tezos.ecadinfra.com';
const CONFIRMATION_POLL_INTERVAL = 5000; // 5 seconds
const MAX_CONFIRMATION_ATTEMPTS = 60; // 5 minutes max wait

class TezosService {
  private tezos: TezosToolkit;
  private rpcUrl: string;

  constructor() {
    this.rpcUrl = process.env.TEZOS_RPC_URL || DEFAULT_RPC_URL;
    this.tezos = new TezosToolkit(this.rpcUrl);
  }

  /**
   * Get the RPC URL being used
   */
  getRpcUrl(): string {
    return this.rpcUrl;
  }

  /**
   * Get the network name from the RPC URL
   */
  getNetworkName(): string {
    if (this.rpcUrl.includes('mainnet')) return 'mainnet';
    if (this.rpcUrl.includes('shadownet')) return 'shadownet';
    return 'unknown';
  }

  /**
   * Get the current block hash (for health check)
   */
  async getCurrentBlockHash(): Promise<string> {
    const block = await this.tezos.rpc.getBlockHeader();
    return block.hash;
  }

  /**
   * Get balance for an address in mutez
   */
  async getBalance(address: string): Promise<bigint> {
    const balance = await this.tezos.tz.getBalance(address);
    return BigInt(balance.toString());
  }

  /**
   * Check if an address has sufficient balance
   */
  async hasSufficientBalance(
    address: string,
    requiredAmount: bigint
  ): Promise<{ sufficient: boolean; balance: bigint }> {
    const balance = await this.getBalance(address);
    console.log(balance);
    
    return {
      sufficient: balance >= requiredAmount,
      balance,
    };
  }

  /**
   * Inject a signed operation into the network
   */
  async injectOperation(signedOperationBytes: string): Promise<string> {
    const operationHash = await this.tezos.rpc.injectOperation(
      signedOperationBytes
    );
    return operationHash;
  }

  /**
   * Wait for an operation to be confirmed
   */
  async waitForConfirmation(
    operationHash: string,
    confirmations: number = 1
  ): Promise<boolean> {
    let attempts = 0;

    while (attempts < MAX_CONFIRMATION_ATTEMPTS) {
      try {
        // Try to get the operation from the mempool or recent blocks
        const headBlock = await this.tezos.rpc.getBlock();

        // Check if operation is in the current block
        for (const ops of headBlock.operations) {
          for (const op of ops) {
            if (op.hash === operationHash) {
              return true;
            }
          }
        }

        // Also check the previous few blocks
        const level = headBlock.header.level;
        for (let i = 1; i <= confirmations + 2; i++) {
          try {
            const prevBlock = await this.tezos.rpc.getBlock({
              block: String(level - i),
            });
            for (const ops of prevBlock.operations) {
              for (const op of ops) {
                if (op.hash === operationHash) {
                  return true;
                }
              }
            }
          } catch {
            // Block might not exist yet, continue
          }
        }
      } catch (error) {
        // RPC error, continue polling
      }

      await this.sleep(CONFIRMATION_POLL_INTERVAL);
      attempts++;
    }

    return false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const tezosService = new TezosService();
