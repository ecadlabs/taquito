/**
 * In-memory storage for seen operation hashes
 *
 * Provides double-spend protection by tracking operation hashes
 * that have been verified. Note: this resets on server restart.
 */

interface SeenOperation {
  operationHash: string;
  source: string;
  amount: string;
  recipient: string;
  verifiedAt: Date;
  settled: boolean;
  settledAt?: Date;
}

class SeenOperationsStore {
  private operations: Map<string, SeenOperation> = new Map();

  /**
   * Check if an operation hash has been seen before
   */
  has(operationHash: string): boolean {
    return this.operations.has(operationHash);
  }

  /**
   * Add an operation to the seen set
   */
  add(
    operationHash: string,
    source: string,
    amount: string,
    recipient: string
  ): void {
    this.operations.set(operationHash, {
      operationHash,
      source,
      amount,
      recipient,
      verifiedAt: new Date(),
      settled: false,
    });
  }

  /**
   * Mark an operation as settled
   */
  markSettled(operationHash: string): boolean {
    const op = this.operations.get(operationHash);
    if (op) {
      op.settled = true;
      op.settledAt = new Date();
      return true;
    }
    return false;
  }

  /**
   * Check if an operation has been verified (exists in store)
   */
  isVerified(operationHash: string): boolean {
    return this.operations.has(operationHash);
  }

  /**
   * Check if an operation has been settled
   */
  isSettled(operationHash: string): boolean {
    const op = this.operations.get(operationHash);
    return op?.settled ?? false;
  }

  /**
   * Get operation details
   */
  get(operationHash: string): SeenOperation | undefined {
    return this.operations.get(operationHash);
  }

  /**
   * Get count of seen operations
   */
  count(): number {
    return this.operations.size;
  }

  /**
   * Clear all seen operations (useful for testing)
   */
  clear(): void {
    this.operations.clear();
  }
}

// Singleton instance
export const seenOperations = new SeenOperationsStore();
