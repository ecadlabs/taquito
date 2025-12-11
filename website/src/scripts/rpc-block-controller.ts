/**
 * Shared RPC Block Controller
 *
 * Fetches block data from RPC nodes and shares it across all components.
 * This ensures only ONE fetch per RPC URL regardless of how many components display the data.
 */

export interface BlockData {
  protocol: string;
  header: {
    timestamp: string;
    level: number;
  };
}

export interface ControllerState {
  data: BlockData | null;
  loading: boolean;
  error: boolean;
  subscribers: Set<() => void>;
  intervalId: number | null;
  visibleCount: number;
  network: string;
}

export interface Controller {
  state: ControllerState;
  notify: () => void;
  fetchLatestBlock: () => Promise<void>;
  start: () => void;
  stop: () => void;
  subscribe: (cb: () => void) => () => void;
  incrementVisibility: () => void;
  decrementVisibility: () => void;
}

declare global {
  interface Window {
    rpcBlockControllers?: Map<string, Controller>;
    rpcBlockVisibilityInitialized?: boolean;
  }
}

export function getPollingIntervalByNetwork(network: string): number {
  if (network === 'shadownet' || network === 'seoulnet') {
    return 4000;
  }
  if (network === 'mainnet' || network === 'ghostnet') {
    return 8000;
  }
  return 8000;
}

export function getControllers(): Map<string, Controller> {
  if (!window.rpcBlockControllers) {
    window.rpcBlockControllers = new Map();
  }
  return window.rpcBlockControllers;
}

export function getController(rpcUrl: string, network: string): Controller {
  const controllers = getControllers();

  if (controllers.has(rpcUrl)) {
    const existing = controllers.get(rpcUrl)!;
    if (network && existing.state.network !== network) {
      existing.state.network = network;
      if (existing.state.intervalId !== null) {
        existing.stop();
        existing.start();
      }
    }
    return existing;
  }

  const state: ControllerState = {
    data: null,
    loading: true,
    error: false,
    subscribers: new Set(),
    intervalId: null,
    visibleCount: 0,
    network
  };

  const notify = () => {
    state.subscribers.forEach((cb) => cb());
  };

  const fetchLatestBlock = async () => {
    try {
      if (state.data === null) {
        state.loading = true;
        state.error = false;
        notify();
      }
      const response = await fetch(`${rpcUrl}/chains/main/blocks/head`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const json = await response.json() as { protocol: string; header: { timestamp: string; level: number } };
      state.data = {
        protocol: json.protocol,
        header: json.header
      };
      state.loading = false;
      state.error = false;
      notify();
    } catch (e) {
      state.loading = false;
      state.error = true;
      notify();
    }
  };

  const start = () => {
    if (state.intervalId !== null) return;
    if (document.hidden) return;
    if (state.visibleCount <= 0) return;
    state.intervalId = window.setInterval(fetchLatestBlock, getPollingIntervalByNetwork(state.network));
    fetchLatestBlock();
  };

  const stop = () => {
    if (state.intervalId !== null) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
  };

  const subscribe = (cb: () => void) => {
    state.subscribers.add(cb);
    return () => state.subscribers.delete(cb);
  };

  const incrementVisibility = () => {
    state.visibleCount += 1;
    start();
  };

  const decrementVisibility = () => {
    state.visibleCount = Math.max(0, state.visibleCount - 1);
    if (state.visibleCount === 0) {
      stop();
    }
  };

  const controller: Controller = {
    state,
    notify,
    fetchLatestBlock,
    start,
    stop,
    subscribe,
    incrementVisibility,
    decrementVisibility
  };

  controllers.set(rpcUrl, controller);
  return controller;
}

export function ensureVisibilityHandler() {
  if (window.rpcBlockVisibilityInitialized) return;
  window.rpcBlockVisibilityInitialized = true;

  const controllers = getControllers();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      controllers.forEach((c) => c.stop());
    } else {
      controllers.forEach((c) => {
        if (c.state.visibleCount > 0) c.start();
      });
    }
  });
}
