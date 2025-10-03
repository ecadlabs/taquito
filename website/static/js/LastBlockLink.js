import React, { useEffect, useRef, useState } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
const controllers = new Map();
let visibilityHandlerInitialized = false;

function getPollingIntervalByNetwork(network) {
  if (network === 'shadownet' || network === 'seoulnet') {
    return 4000;
  }
  if (network === 'mainnet' || network === 'ghostnet') {
    return 8000;
  }
  return 8000;
}

function getController(rpcUrl, network) {
  if (controllers.has(rpcUrl)) {
    const existing = controllers.get(rpcUrl);
    if (network && existing.state.network !== network) {
      existing.state.network = network;
      if (existing.state.intervalId !== null) {
        existing.stop();
        existing.start();
      }
    }
    return existing;
  }

  if (!controllers.has(rpcUrl)) {
    const state = {
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
        const json = await response.json();
        state.data = json.header;
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
      state.intervalId = setInterval(fetchLatestBlock, getPollingIntervalByNetwork(state.network));
      fetchLatestBlock();
    };

    const stop = () => {
      if (state.intervalId !== null) {
        clearInterval(state.intervalId);
        state.intervalId = null;
      }
    };

    const subscribe = (cb) => {
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

    controllers.set(rpcUrl, {
      state,
      notify,
      fetchLatestBlock,
      start,
      stop,
      subscribe,
      incrementVisibility,
      decrementVisibility
    });
  }
  return controllers.get(rpcUrl);
}

function ensureVisibilityHandler() {
  if (visibilityHandlerInitialized) return;
  if (!ExecutionEnvironment.canUseDOM) return;
  visibilityHandlerInitialized = true;
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

function useBlockData(rpcUrl, network) {
  const controller = getController(rpcUrl, network);
  // Ensure visibility handler is only set on the client
  useEffect(() => {
    ensureVisibilityHandler();
  }, []);

  const [, forceUpdate] = useState({});
  const elementRef = useRef(null);
  const visibleRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = controller.subscribe(() => forceUpdate({}));
    return () => {
      unsubscribe();
    };
  }, [controller]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!visibleRef.current) {
            visibleRef.current = true;
            setIsVisible(true);
            controller.incrementVisibility();
          }
        } else {
          if (visibleRef.current) {
            visibleRef.current = false;
            setIsVisible(false);
            controller.decrementVisibility();
          }
        }
      });
    }, { threshold: 0 });

    observer.observe(el);
    return () => {
      if (visibleRef.current) {
        controller.decrementVisibility();
        visibleRef.current = false;
        setIsVisible(false);
      }
      observer.disconnect();
    };
  }, [controller]);

  return {
    blockData: controller.state.data,
    loading: controller.state.loading,
    error: controller.state.error,
    elementRef,
    isVisible
  };
}

export function LastBlockHeaderLink({ network, rpcUrl }) {
  const { blockData, loading, error, elementRef } = useBlockData(rpcUrl, network);

  console.log('blockData', blockData);

  const href = !loading && !error && blockData?.level
    ? `${rpcUrl}/chains/main/blocks/${blockData.level}/header`
    : `${rpcUrl}/chains/main/blocks/head/header`;

  return (
    <a ref={elementRef} href={href} target='_blank'>Check</a>
  );
}


export function Timestamp({ network, rpcUrl }) {
  const { blockData, loading, error, elementRef } = useBlockData(rpcUrl, network);

  if (loading) {
    return <span ref={elementRef}>Loading...</span>;
  }

  if (error) {
    return <span ref={elementRef} style={{ color: '#999' }}>Error</span>;
  }

  if (!blockData?.timestamp) {
    return <span ref={elementRef}>Unknown</span>;
  }

  return <span ref={elementRef}>{new Date(blockData.timestamp).toLocaleString()}</span>;
}

export function ReceivedTime({ network, rpcUrl }) {
  const { blockData, loading, error, elementRef, isVisible } = useBlockData(rpcUrl, network);
  const [secondsAgo, setSecondsAgo] = useState(null);

  useEffect(() => {
    if (!blockData?.timestamp || !isVisible) return undefined;

    const update = () => {
      const now = Date.now();
      const blockTime = new Date(blockData.timestamp).getTime();
      const diffInSeconds = Math.max(0, Math.floor((now - blockTime) / 1000));
      setSecondsAgo(diffInSeconds);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [blockData?.timestamp, isVisible]);

  if (loading) {
    return <span ref={elementRef}>Loading...</span>;
  }

  if (error) {
    return <span ref={elementRef} style={{ color: '#999' }}>Error</span>;
  }

  return <span ref={elementRef}>{secondsAgo !== null ? `${secondsAgo}s ago` : 'Unknown'}</span>;
}