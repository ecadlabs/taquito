import React, { useEffect, useState } from 'react';

export default function LastBlockLink({ network, rpcUrl }) {
  const [blockLevel, setBlockLevel] = useState(null);
  const [blockTimestamp, setBlockTimestamp] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchLatestBlock() {
      try {
        const response = await fetch(`${rpcUrl}/chains/main/blocks/head`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBlockLevel(data.header.level);
        setBlockTimestamp(data.header.timestamp);
        setLoading(false);
      } catch (error) {
        console.error(`Failed to fetch block from ${rpcUrl}:`, error);
        setError(true);
        setLoading(false);
      }
    }

    fetchLatestBlock();
  }, [rpcUrl]);

  useEffect(() => {
    if (!blockTimestamp) return;

    function updateSecondsAgo() {
      const now = new Date();
      const blockTime = new Date(blockTimestamp);
      const diffInSeconds = Math.floor((now - blockTime) / 1000);
      setSecondsAgo(diffInSeconds);
    }

    // Update immediately
    updateSecondsAgo();

    // Update every second
    const interval = setInterval(updateSecondsAgo, 1000);

    return () => clearInterval(interval);
  }, [blockTimestamp]);

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span style={{ color: '#999' }}>Error</span>;
  }

  const tzktUrl = network === 'mainnet' 
    ? `https://tzkt.io/${blockLevel}/operations`
    : `https://${network}.tzkt.io/${blockLevel}/operations`;

  return (
    <a href={tzktUrl} target="_blank" rel="noopener noreferrer">
      { blockLevel }
    </a>
  );
}

export function ReceivedTime({ network, rpcUrl }) {
  const [blockTimestamp, setBlockTimestamp] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchLatestBlock() {
      try {
        const response = await fetch(`${rpcUrl}/chains/main/blocks/head`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBlockTimestamp(data.header.timestamp);
        setLoading(false);
      } catch (error) {
        console.error(`Failed to fetch block from ${rpcUrl}:`, error);
        setError(true);
        setLoading(false);
      }
    }

    fetchLatestBlock();
  }, [rpcUrl]);

  useEffect(() => {
    if (!blockTimestamp) return;

    function updateSecondsAgo() {
      const now = new Date();
      const blockTime = new Date(blockTimestamp);
      const diffInSeconds = Math.floor((now - blockTime) / 1000);
      setSecondsAgo(diffInSeconds);
    }

    // Update immediately
    updateSecondsAgo();

    // Update every second
    const interval = setInterval(updateSecondsAgo, 1000);

    return () => clearInterval(interval);
  }, [blockTimestamp]);

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span style={{ color: '#999' }}>Error</span>;
  }

  return (
    <span>
      {secondsAgo !== null ? `${secondsAgo}s ago` : 'Unknown'}
    </span>
  );
}
