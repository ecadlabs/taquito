import React, { useEffect, useState } from 'react';
import DocItem from '@theme-original/DocItem';
import AddFeedback from '@site/src/theme/Feedback/AddFeedback';

// Client-side only component for URL transformation
function UrlTransformer() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Helper function to transform URLs by replacing contract address lookups
    const transformUrlsInDocument = (contractAddresses) => {
      if (!contractAddresses) return;
      
      // Find all links in the document that have contractAddresses in href or text
      const allLinks = document.querySelectorAll('a');
      const contractLinks = Array.from(allLinks).filter(link => {
        const href = link.getAttribute('href');
        const text = link.textContent;
        return href?.includes('contractAddresses.') || text?.includes('contractAddresses.');
      });
      
      contractLinks.forEach(link => {
        let href = link.getAttribute('href');
        let textContent = link.textContent;
        let hrefChanged = false;
        let textChanged = false;
        
        // Replace contractAddresses.ContractName with actual addresses
        Object.keys(contractAddresses).forEach(contractName => {
          const regex = new RegExp(`contractAddresses\\.${contractName}`, 'g');
          const replacement = contractAddresses[contractName];
          
          // Transform href
          if (href) {
            const newHref = href.replace(regex, replacement);
            if (newHref !== href) {
              href = newHref;
              hrefChanged = true;
            }
          }
          
          // Transform text content
          if (textContent) {
            const newTextContent = textContent.replace(regex, replacement);
            if (newTextContent !== textContent) {
              textContent = newTextContent;
              textChanged = true;
            }
          }
        });
        
        // Apply changes
        if (hrefChanged) {
          link.setAttribute('href', href);
        }
        
        if (textChanged) {
          link.textContent = textContent;
        }
      });
    };
    
    // Fetch contract addresses and transform URLs
    async function loadContractAddressesAndTransform() {
      try {
        const response = await fetch('/example/originated-contracts.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contractAddresses = await response.json();
        
        // Add a small delay to ensure DOM is fully rendered
        setTimeout(() => {
          transformUrlsInDocument(contractAddresses);
        }, 100);
        
        // Also run immediately in case delay isn't needed
        transformUrlsInDocument(contractAddresses);
      } catch (error) {
        // Silently fail if contract addresses can't be loaded
      }
    }
    
    // Run transformation after component mounts and content is available
    loadContractAddressesAndTransform();
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return null;
}

export default function DocItemWrapper(props) {
  return (
    <>
      <DocItem {...props} />
      <UrlTransformer />
      <AddFeedback {...props}/>
    </>
  );
}