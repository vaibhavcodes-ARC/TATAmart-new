'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './PillNav.css';

export interface PillNavItem {
  label: string;
  href: string;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export interface PillNavProps {
  logo?: string;
  logoAlt?: string;
  items: PillNavItem[];
  className?: string;
  
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  hoverBgColor?: string;
  onMobileMenuClick?: () => void;
  
}

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  
  baseColor = '#ffffff',
  pillColor = '#120F17',
  hoveredPillTextColor = '#120F17',
  pillTextColor,
  hoverBgColor,
  onMobileMenuClick,
  
}: PillNavProps) => {
  const pathname = usePathname();
  const activeHref = pathname; // Compute active route internally
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLElement | null)[]>([]);
  
  
  const logoImgRef = useRef<HTMLImageElement>(null);
  
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  // mounted tracking removed; animations disabled

  const handleEnter = () => {
    // Animations have been disabled for stability; no-op
  };

  const handleLeave = () => {
    // Animations have been disabled for stability; no-op
  };

  const handleLogoEnter = () => {
    // Rotation removed as requested
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMobileMenuClick?.();
  };

  const isExternalLink = (href: string) =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#');

  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': resolvedPillTextColor,
    '--hover-bg': hoverBgColor || (resolvedPillTextColor === '#ffffff' ? '#ffffff' : '#000000')
  } as React.CSSProperties;

  return (
    <div className="pill-nav-container" ref={containerRef}>
      <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        {logo && (
          <Link
            className="pill-logo"
            href={items?.[0]?.href || '/'}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            role="menuitem"
            ref={logoRef as React.RefObject<HTMLAnchorElement>}
          >
            <img src={logo} alt={logoAlt} ref={logoImgRef} />
          </Link>
        )}

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, _i) => {
              const isActive = activeHref === item.href || (item.href !== '/' && activeHref.startsWith(item.href));
              return (
                <li key={item.href || `item-${_i}`} role="none">
                  {isExternalLink(item.href) ? (
                    <a
                      role="menuitem"
                      href={item.href}
                      onClick={(e) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick(e);
                        }
                      }}
                      className={`pill${isActive ? ' is-active' : ''}`}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={handleEnter}
                      onMouseLeave={handleLeave}
                    >
                      <span
                        className="hover-circle"
                        aria-hidden="true"
                        ref={el => {
                          circleRefs.current[_i] = el;
                        }}
                      />
                      <span className="label-stack">
                        <span className="pill-label">{item.label}</span>
                        <span className="pill-label-hover" aria-hidden="true">
                          {item.label}
                        </span>
                      </span>
                    </a>
                  ) : (
                    <Link
                      role="menuitem"
                      href={item.href}
                      onClick={item.onClick}
                      className={`pill${isActive ? ' is-active' : ''}`}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={handleEnter}
                      onMouseLeave={handleLeave}
                    >
                      <span
                        className="hover-circle"
                        aria-hidden="true"
                        ref={el => {
                          circleRefs.current[_i] = el;
                        }}
                      />
                      <span className="label-stack">
                        <span className="pill-label">{item.label}</span>
                        <span className="pill-label-hover" aria-hidden="true">
                          {item.label}
                        </span>
                      </span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <button
          className="mobile-menu-button mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          ref={hamburgerRef}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className={`mobile-menu-popover mobile-only ${isMobileMenuOpen ? 'open' : 'closed'}`} ref={mobileMenuRef} style={cssVars}>
        <ul className="mobile-menu-list">
          {items.map((item, _i) => {
            const isActive = activeHref === item.href || (item.href !== '/' && activeHref.startsWith(item.href));
            return (
              <li key={item.href || `mobile-item-${_i}`}>
                {isExternalLink(item.href) ? (
                  <a
                    href={item.href}
                    className={`mobile-menu-link${isActive ? ' is-active' : ''}`}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick(e);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={`mobile-menu-link${isActive ? ' is-active' : ''}`}
                    onClick={(e) => {
                      if (item.onClick) item.onClick(e);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
