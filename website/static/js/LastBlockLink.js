import React, { useEffect, useState } from 'react';

// Custom hook to fetch block data with polling
function useBlockData(rpcUrl) {
  const [blockData, setBlockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let intervalId = null;

    async function fetchLatestBlock() {
      try {
        const response = await fetch(`${rpcUrl}/chains/main/blocks/head`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (isMounted) {
          setBlockData(data.header);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        console.error(`Failed to fetch block from ${rpcUrl}:`, error);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    }

    // Polling is 10s when visible, 30s when hidden (tab not focused)
    const startPolling = () => {
      const interval = document.hidden ? 30000 : 10000;
      intervalId = setInterval(fetchLatestBlock, interval);
    };

    // Fetch immediately
    fetchLatestBlock();

    // Start polling
    startPolling();

    // Adjust polling when visibility changes
    const handleVisibilityChange = () => {
      if (intervalId) {
        clearInterval(intervalId);
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [rpcUrl]);

  return { blockData, loading, error };
}

export default function LastBlockLink({ network, rpcUrl }) {
  const { blockData, loading, error } = useBlockData(rpcUrl);

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span style={{ color: '#999' }}>Error</span>;
  }

  const tzktUrl = network === 'mainnet' 
    ? `https://tzkt.io/${blockData.level}/operations`
    : `https://${network}.tzkt.io/${blockData.level}/operations`;

  return (
    <a href={tzktUrl} target="_blank" rel="noopener noreferrer">
      {blockData.level}
    </a>
  );
}

export function Timestamp({ network, rpcUrl }) {
  const { blockData, loading, error } = useBlockData(rpcUrl);

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span style={{ color: '#999' }}>Error</span>;
  }

  if (!blockData?.timestamp) {
    return <span>Unknown</span>;
  }

  return <span>{new Date(blockData.timestamp).toLocaleString()}</span>;
}

export function ReceivedTime({ network, rpcUrl }) {
  const { blockData, loading, error } = useBlockData(rpcUrl);
  const [secondsAgo, setSecondsAgo] = useState(null);

  useEffect(() => {
    if (!blockData?.timestamp) return;

    function updateSecondsAgo() {
      const now = new Date();
      const blockTime = new Date(blockData.timestamp);
      const diffInSeconds = Math.floor((now - blockTime) / 1000);
      setSecondsAgo(diffInSeconds);
    }

    updateSecondsAgo();
    const interval = setInterval(updateSecondsAgo, 1000);
    return () => clearInterval(interval);
  }, [blockData?.timestamp]);

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span style={{ color: '#999' }}>Error</span>;
  }

  return <span>{secondsAgo !== null ? `${secondsAgo}s ago` : 'Unknown'}</span>;
}
