/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useRef, useState } from 'react';
import Logo from '@theme/Logo';
import lottie from 'lottie-web';

export default function NavbarLogo() {
  const container = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: require('../../../../static/gif/Taquito_Loop_01.json'),
      name: 'navbarLogo',
    });

    return () => {
      lottie.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      setTimeout(() => {
        setIsActive(true);
        return lottie.play('navbarLogo');
      }, 2000);
    }
  }, [isActive]);

  return (
    <a href="/" rel="noreferrer noopener" aria-label="" className="navbar__brand__container">
      <div
        ref={container}
        onMouseEnter={() => {
          return lottie.play('navbarLogo');
        }}
        onMouseLeave={setInterval(() => {
          if (isActive) {
            return lottie.stop('navbarLogo');
          }
        }, 5000)}
        className="navbar__brand"
        imageClassName="navbar__logo"
        titleClassName="navbar__title"
      />
    </a>
  );
}
