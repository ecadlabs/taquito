/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useRef, useState } from 'react';
import Logo from '@theme/Logo';

export default function NavbarLogo() {
  const container = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // SSR-safe lottie loading
    if (typeof window !== 'undefined') {
      import('lottie-web').then((lottie) => {
        lottie.default.loadAnimation({
          container: container.current,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: require('../../../../static/gif/Taquito_Loop_01.json'),
          name: 'navbarLogo',
        });
      });

      return () => {
        import('lottie-web').then((lottie) => {
          lottie.default.destroy();
        });
      };
    }
  }, []);

  useEffect(() => {
    if (!isActive && typeof window !== 'undefined') {
      setTimeout(() => {
        setIsActive(true);
        import('lottie-web').then((lottie) => {
          lottie.default.play('navbarLogo');
        });
      }, 2000);
    }
  }, [isActive]);


  useEffect(() => {
    // SSR-safe script injection
    if (typeof document === 'undefined') return;

    const scriptId = 'chatBaseExternalScript';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      return;
    }

    const script = document.createElement('script');

    script.src = "https://www.chatbase.co/embed.min.js";
    script.defer = true;
    script.chatbotId="Cn650xmUdORPNUE8fcKlg";
    script.domain="www.chatbase.co";
    script.id = scriptId;
    document.body.appendChild(script);
  }, []);
  
  useEffect(() => {
    // SSR-safe script injection
    if (typeof document === 'undefined') return;

    const scriptId = 'chatBaseInlineScript';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      return;
    }
    const script = document.createElement('script');

    script.text = `window.embeddedChatbotConfig = {
      chatbotId: "Cn650xmUdORPNUE8fcKlg",
      domain: "www.chatbase.co"
    };`;
    script.id = scriptId;
    document.body.appendChild(script);
  }, []);

  return (
    <a href="/" rel="noreferrer noopener" aria-label="" className="navbar__brand__container">
      <div
        ref={container}
        onMouseEnter={() => {
          if (typeof window !== 'undefined') {
            import('lottie-web').then((lottie) => {
              lottie.default.play('navbarLogo');
            });
          }
        }}
        onMouseLeave={() => setInterval(() => {
          if (isActive && typeof window !== 'undefined') {
            import('lottie-web').then((lottie) => {
              lottie.default.stop('navbarLogo');
            });
          }
        }, 5000)}
        className="navbar__brand"
      />
    </a>
  );
}
