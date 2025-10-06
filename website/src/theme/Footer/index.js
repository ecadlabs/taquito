/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the Apache 2.0 License found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { useThemeConfig } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import styles from './styles.module.css';
import ThemedImage from '@theme/ThemedImage';
import IconExternalLink from '@theme/Icon/ExternalLink';
import FooterForm from '../../components/FooterForm/FooterForm';

function FooterLink({ to, href, label, prependBaseUrlToHref, reactComponent, ...props }) {
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, {
    forcePrependBaseUrl: true,
  });
  return (
    <Link
      className="footer__link-item"
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            to: toUrl,
          })}
      {...props}
    >
      {href && !isInternalUrl(href) ? (
        <span>
          {label}
          <IconExternalLink />
        </span>
      ) : (
        label
      )}
    </Link>
  );
}

const FooterLogo = ({ sources, alt, width, height }) => (
  <ThemedImage className="footer__logo" alt={alt} sources={sources} width={width} height={height} />
);

function Footer() {
  const footerContainer = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const { footer } = useThemeConfig();
  const { copyright, links = [], logo = {} } = footer || {};
  const sources = {
    light: useBaseUrl(logo.src),
    dark: useBaseUrl(logo.srcDark || logo.src),
  };
  const handleSubmit = (e) => {
    if (!email) {
      e.preventDefault();
    }
  };
  if (!footer) {
    return null;
  }

  useEffect(() => {
    // SSR-safe lottie loading
    if (typeof window !== 'undefined') {
      import('lottie-web').then((lottie) => {
        lottie.default.loadAnimation({
          container: footerContainer.current,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: require('../../../static/gif/Taquito_Loop_01.json'),
          name: 'footerLogo',
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
          lottie.default.play('footerLogo');
        });
      }, 2000);
    }
  }, [isActive]);

  return (
    <footer
      className={clsx('footer', {
        'footer--dark': footer.style === 'dark',
      })}
    >
      <div className="container">
        {links && links.length > 0 && (
          <div className="row footer__links">
            {links.map((linkItem, i) => (
              <div key={i} className="col footer__col">
                {linkItem.title != null ? (
                  <div className="footer__title">{linkItem.title}</div>
                ) : null}
                {linkItem.items != null &&
                Array.isArray(linkItem.items) &&
                linkItem.items.length > 0 ? (
                  <ul className="footer__items">
                    {linkItem.items.map((item, key) =>
                      item.html ? (
                        item.html === 'form' ? (
                          <li key={key} className="footer__item">
                            <FooterForm />
                          </li>
                        ) : item.html === 'image' ? (
                          <a key={key} href="/" rel="noreferrer noopener" aria-label="">
                            <div
                              ref={footerContainer}
                              onMouseEnter={() => {
                                if (typeof window !== 'undefined') {
                                  import('lottie-web').then((lottie) => {
                                    lottie.default.play('footerLogo');
                                  });
                                }
                              }}
                              onMouseLeave={() => setInterval(() => {
                                if (isActive && typeof window !== 'undefined') {
                                  import('lottie-web').then((lottie) => {
                                    lottie.default.stop('footerLogo');
                                  });
                                }
                              }, 5000)}
                              className="footerLogo"
                            />
                          </a>
                        ) : (
                          <li
                            key={key}
                            className="footer__item"
                            dangerouslySetInnerHTML={{
                              __html: item.html,
                            }}
                          />
                        )
                      ) : (
                        <li key={item.href || item.to} className="footer__item">
                          <FooterLink {...item} />
                        </li>
                      )
                    )}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {(logo || copyright) && (
          <div className="footer__bottom text--center">
            {logo && (logo.src || logo.srcDark) && (
              <div className="margin-bottom--sm">
                {logo.href ? (
                  <Link href={logo.href} className={styles.footerLogoLink}>
                    <FooterLogo
                      alt={logo.alt}
                      sources={sources}
                      width={logo.width}
                      height={logo.height}
                    />
                  </Link>
                ) : (
                  <FooterLogo alt={logo.alt} sources={sources} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="footer__copyright">
        {`Copyright © ${new Date().getFullYear()} ECAD Labs - Open Source Apache 2.0 License`}
      </div>
    </footer>
  );
}

export default Footer;
