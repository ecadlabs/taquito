// thanks to IsaccoSordo's contribution of https://github.com/ecadlabs/taquito/pull/3015
import { vi } from 'vitest';

interface MessageListener {
  (message: any): void;
}

class BroadcastChannel {
  name: string;
  listeners: MessageListener[];

  constructor(name: string) {
    this.name = name;
    this.listeners = [];
  }

  postMessage(message: any) {
    // Mock implementation of postMessage
    this.listeners.forEach((listener) => listener(message));
  }

  addEventListener(event: string, listener: MessageListener) {
    if (event === 'message') {
      this.listeners.push(listener);
    }
  }

  removeEventListener(event: string, listener: MessageListener) {
    if (event === 'message') {
      this.listeners = this.listeners.filter((l) => l !== listener);
    }
  }

  close() {
    // Mock implementation of close
    this.listeners = [];
  }
}

function createLeaderElection(_channel: BroadcastChannel) {
  // Mock implementation of createLeaderElection
  return {
    awaitLeadership: vi.fn(),
    hasLeader: vi.fn().mockReturnValue(true),
    isLeader: vi.fn().mockReturnValue(true),
    die: vi.fn(),
  };
}

export { BroadcastChannel, createLeaderElection };
