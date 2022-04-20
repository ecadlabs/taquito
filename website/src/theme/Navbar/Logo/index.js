/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useRef } from 'react';
import Logo from '@theme/Logo';
import lottie from 'lottie-web';

export default function NavbarLogo() {
  const container = useRef(null);
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
  return (
    <a
      href="/"
      target="_blank"
      rel="noreferrer noopener"
      aria-label=""
      className="navbar__brand__container"
    >
      <div
        ref={container}
        onMouseEnter={() => lottie.play('navbarLogo')}
        // onMouseLeave={() => lottie.stop('navbarLogo')}
        className="navbar__brand"
        imageClassName="navbar__logo"
        titleClassName="navbar__title"
      />
    </a>
  );
}
