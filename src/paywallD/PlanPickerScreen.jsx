// MyDrama — Plan Picker (paywall) — ES module version for webpack/Module Federation.
// Converted from global-functions CDN style to proper ES module.

import React, { useState, useEffect } from 'react';

// Poster images — webpack resolves these to hashed URLs at build time
const POSTERS = Array.from({ length: 17 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  // eslint-disable-next-line import/no-dynamic-require
  return require(`./assets/posters/p${num}.jpg`);
});

function PlanPickerScreen({
  // Products injected via paywall:init from the host
  products,
  heroImagery = true,
  socialProof = true,
  benefits = 'compact',
  timerTreatment = 'sticky',
  accent = 'violet',
  cardLayout = 'split',
  priceEmphasis = 'perDay',
  showSavePct = true,
  onClose,
  onContinue,
}) {
  const [selected, setSelected] = useState('3mo');
  const [pressed, setPressed] = useState(false);
  const [mins, secs] = useCountdown(9 * 60 + 44);

  const accentColors = accent === 'gold'
    ? {
        primary: '#FF9534',
        primary2: '#FFBF85',
        primaryDark: '#CD501A',
        wash: 'radial-gradient(ellipse at 50% -10%, rgba(255,149,52,0.30) 0%, rgba(4,4,5,0) 55%)',
        ctaGrad: 'linear-gradient(180deg,#FFBF85 0%,#FF9534 55%,#CD501A 100%)',
        ctaGlow: '0 8px 28px rgba(205,80,26,0.45), 0 2px 6px rgba(0,0,0,0.4)',
        ctaText: '#3A1700',
        chipGrad: 'linear-gradient(135deg,#FFE7B8,#FF9534)',
        chipText: '#3A1700',
        ringGlow: 'rgba(255,149,52,0.18)',
        cardTint: 'rgba(255,149,52,0.10)',
      }
    : {
        primary: '#4000E8',
        primary2: '#5E1CFF',
        primaryDark: '#2A007F',
        wash: 'radial-gradient(ellipse at 50% -10%, rgba(94,28,255,0.40) 0%, rgba(4,4,5,0) 55%)',
        ctaGrad: 'linear-gradient(135deg,#5E1CFF 0%,#4000E8 55%,#2A007F 100%)',
        ctaGlow: '0 8px 28px rgba(64,0,232,0.55), 0 2px 6px rgba(0,0,0,0.4)',
        ctaText: '#fff',
        chipGrad: 'linear-gradient(135deg,#5E1CFF,#4000E8)',
        chipText: '#fff',
        ringGlow: 'rgba(64,0,232,0.18)',
        cardTint: 'rgba(64,0,232,0.10)',
      };

  // Design defaults — label and total are overridden by products from paywall:init when provided
  const planDefaults = [
    { id: '1mo',  label: '1 month',   save: '51%', total: '$13.99', strike: '$28.55', perDay: '0.47', strikeDay: '$0.95' },
    { id: '3mo',  label: '3 months',  save: '60%', total: '$20.39', strike: '$50.98', perDay: '0.23', strikeDay: '$0.57', popular: true },
    { id: '12mo', label: '12 months', save: '51%', total: '$59.99', strike: '$122.43', perDay: '0.16', strikeDay: '$0.34' },
  ];
  const plans = planDefaults.map((defaults, i) => ({
    ...defaults,
    ...(products && products[i] ? { label: products[i].name, total: products[i].price } : {}),
  }));

  const benefitItems = [
    { icon: require('./assets/benefits/crown-unlock.png'),   text: 'Everything unlocked' },
    { icon: require('./assets/benefits/clapper-adfree.png'), text: 'Ad-free, premiere-day drops' },
    { icon: require('./assets/benefits/play-online.png'),    text: 'Watch online, anywhere' },
    { icon: require('./assets/benefits/brain-ai.png'),       text: 'Personal picks just for you' },
  ];

  const handleContinue = () => {
    const plan = plans.find(p => p.id === selected);
    onContinue(plan);
  };

  return (
    <div style={{
      background: '#040405', minHeight: '100%', color: '#fff', position: 'relative',
      fontFamily: "'Albert Sans', system-ui, sans-serif",
    }}>
      {/* Ambient wash */}
      <div style={{ position: 'absolute', inset: 0, background: accentColors.wash, pointerEvents: 'none' }} />

      {/* Sticky countdown bar (variant: sticky) */}
      {timerTreatment === 'sticky' && (
        <div style={{
          position: 'sticky', top: 0, zIndex: 5,
          padding: '20px 16px 12px',
          background: 'linear-gradient(180deg, rgba(4,4,5,0.95) 70%, rgba(4,4,5,0))',
          backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.02em' }}>
              60% discount reserved for:
            </div>
            <div style={{
              fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', color: '#fff',
              fontVariantNumeric: 'tabular-nums', marginTop: 2,
            }}>
              {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            all: 'unset', cursor: 'pointer', width: 32, height: 32, borderRadius: 999,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M5 5l14 14M19 5 5 19"/></svg>
          </button>
        </div>
      )}

      {/* Close X for non-sticky variants */}
      {timerTreatment !== 'sticky' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5,
          padding: '20px 16px 0',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} aria-label="Close" style={{
            all: 'unset', cursor: 'pointer', width: 32, height: 32, borderRadius: 999,
            background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M5 5l14 14M19 5 5 19"/></svg>
          </button>
        </div>
      )}

      <div style={{ position: 'relative', padding: timerTreatment === 'sticky' ? '8px 16px 32px' : '60px 16px 32px' }}>
        {/* Hero poster strip */}
        {heroImagery && <HeroPosterStrip />}

        {/* Hero timer treatment */}
        {timerTreatment === 'hero' && (
          <HeroTimer mins={mins} secs={secs} accentColors={accentColors} />
        )}

        {/* Title + subtitle */}
        <div style={{ textAlign: 'center', marginTop: heroImagery ? 18 : 8, marginBottom: benefits === 'none' ? 18 : 14 }}>
          <div style={{
            fontWeight: 800, fontSize: 32, lineHeight: 1.06, letterSpacing: '-0.025em',
            textWrap: 'balance',
          }}>
            Choose your plan
          </div>
          <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 500 }}>
            Everything unlocked. <span style={{ color: '#fff' }}>Cancel anytime.</span>
          </div>

          {timerTreatment === 'pill' && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
              <PillTimer mins={mins} secs={secs} accentColors={accentColors} />
            </div>
          )}
        </div>

        {/* Benefits */}
        {benefits !== 'none' && (
          <div style={{ marginBottom: 16 }}>
            {benefits === 'compact' ? (
              <div style={{
                display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 14px',
                color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600,
              }}>
                {benefitItems.map(b => (
                  <span key={b.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <img src={b.icon} alt="" style={{ width: 18, height: 18, objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                    {b.text}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
                {benefitItems.map(b => (
                  <div key={b.text} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <img src={b.icon} alt="" style={{ width: 26, height: 26, objectFit: 'contain', flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.92)', lineHeight: 1.25 }}>{b.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Plan cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {plans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isOn={selected === plan.id}
              onSelect={() => setSelected(plan.id)}
              accentColors={accentColors}
              cardLayout={cardLayout}
              priceEmphasis={priceEmphasis}
              showSavePct={showSavePct}
            />
          ))}
        </div>

        {/* Social proof */}
        {socialProof && (
          <div style={{
            marginTop: 16,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 14px', borderRadius: 14,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <AvatarStack />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                Sarah, Mia &amp; <span style={{ color: accentColors.primary === '#4000E8' ? '#B49BFF' : '#FFBF85' }}>124k watchers</span> unlocked this
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2, fontStyle: 'italic' }}>
                "I finished the new episode before my friends knew it was out." — Mia R.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 1, color: '#FFBF85', fontSize: 11, fontWeight: 700 }}>
              ★★★★★
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: 20 }}>
          <button
            onClick={handleContinue}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            onTouchStart={() => setPressed(true)}
            onTouchEnd={() => setPressed(false)}
            style={{
              all: 'unset', boxSizing: 'border-box', cursor: 'pointer',
              width: '100%', padding: '17px 22px', borderRadius: 14,
              background: accentColors.ctaGrad,
              color: accentColors.ctaText,
              fontWeight: 800, fontSize: 16, letterSpacing: '-0.005em',
              textAlign: 'center',
              boxShadow: pressed ? 'none' : accentColors.ctaGlow,
              transform: pressed ? 'scale(0.985)' : 'scale(1)',
              transition: 'transform 120ms cubic-bezier(0.2,0.8,0.2,1), box-shadow 120ms',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              position: 'relative', overflow: 'hidden',
            }}
          >
            <span>Continue</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColors.ctaText} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
            {/* Shimmer */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, width: 60,
              background: `linear-gradient(90deg, transparent, ${accent === 'gold' ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.30)'}, transparent)`,
              animation: 'pp-shimmer 2.6s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
          </button>
          <div style={{
            marginTop: 8, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.5)',
          }}>
            Renews at <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{plans.find(p => p.id === selected).total}</span> · Cancel anytime
          </div>
        </div>

        {/* Trust */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          marginTop: 16, color: '#6BDBA9', fontSize: 13, fontWeight: 700,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z"/><path d="m9 12 2 2 4-4"/>
          </svg>
          Pay safe &amp; secure
        </div>

        {/* Payment methods */}
        <PaymentRow />

        {/* Fine print */}
        <div style={{
          marginTop: 16, color: 'rgba(255,255,255,0.45)',
          fontSize: 11, lineHeight: 1.55, textAlign: 'center', padding: '0 4px',
        }}>
          Discounted price applies to your first subscription. Auto-renewing subscription. Cancel anytime in Settings.
          <div style={{ marginTop: 8 }}>
            <span style={{ textDecoration: 'underline', marginRight: 12 }}>Terms</span>
            <span style={{ textDecoration: 'underline', marginRight: 12 }}>Subscription</span>
            <span style={{ textDecoration: 'underline', marginRight: 12 }}>Privacy</span>
            <span style={{ textDecoration: 'underline' }}>Restore</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pp-shimmer {
          0%   { left: -80px; }
          60%  { left: 100%; }
          100% { left: 100%; }
        }
        @keyframes pp-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(64,0,232,0.45); }
          50%      { box-shadow: 0 0 0 8px rgba(64,0,232,0); }
        }
      `}</style>
    </div>
  );
}

// ── Plan card ─────────────────────────────────────────────────
function PlanCard({ plan, isOn, onSelect, accentColors, cardLayout, priceEmphasis, showSavePct }) {
  return (
    <div style={{ position: 'relative' }}>
      {plan.popular && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2,
          background: accentColors.chipGrad,
          color: accentColors.chipText, textAlign: 'center',
          fontSize: 10, fontWeight: 800, letterSpacing: '0.14em',
          padding: '6px 0', borderTopLeftRadius: 14, borderTopRightRadius: 14,
          textTransform: 'uppercase',
          boxShadow: isOn ? `0 4px 14px ${accentColors.ringGlow}` : 'none',
        }}>
          ★ Most Popular · Save {plan.save}
        </div>
      )}
      <button onClick={onSelect} style={{
        all: 'unset', cursor: 'pointer', display: 'block', width: '100%',
        marginTop: plan.popular ? 28 : 0, boxSizing: 'border-box',
        background: isOn ? accentColors.cardTint : 'rgba(255,255,255,0.025)',
        border: isOn ? `1.5px solid ${accentColors.primary}` : '1.5px solid rgba(255,255,255,0.10)',
        borderRadius: 14, padding: '14px 14px',
        boxShadow: isOn
          ? `0 0 0 4px ${accentColors.ringGlow}, 0 12px 32px ${accentColors.ringGlow}`
          : 'none',
        transition: 'all 180ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Radio */}
          <div style={{
            width: 18, height: 18, borderRadius: 999, flexShrink: 0,
            border: isOn ? `5px solid ${accentColors.primary}` : '1.5px solid rgba(255,255,255,0.32)',
            background: isOn ? '#fff' : 'transparent',
            boxShadow: isOn ? `0 0 8px ${accentColors.primary}66` : 'none',
            transition: 'all 180ms cubic-bezier(0.2,0.8,0.2,1)',
          }} />

          {/* Left meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em' }}>{plan.label}</span>
              {showSavePct && (
                <span style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
                  padding: '3px 7px', borderRadius: 4,
                  background: accentColors.chipGrad,
                  color: accentColors.chipText,
                }}>SAVE {plan.save}</span>
              )}
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: 'rgba(255,255,255,0.85)', fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.4)', marginRight: 6 }}>{plan.strike}</span>
              <span style={{
                fontWeight: priceEmphasis === 'total' ? 800 : 700,
                fontSize: priceEmphasis === 'total' ? 16 : 13,
                color: '#fff',
              }}>{plan.total}</span>
            </div>
          </div>

          {/* Right per-day */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>{plan.strikeDay}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 1, justifyContent: 'flex-end' }}>
              <span style={{
                fontSize: 14, fontWeight: 700,
                color: isOn ? '#fff' : 'rgba(255,255,255,0.65)',
              }}>$</span>
              <span style={{
                fontWeight: 800,
                fontSize: priceEmphasis === 'perDay' && isOn ? 44 : (isOn ? 36 : 30),
                lineHeight: 1, letterSpacing: '-0.04em',
                color: isOn ? '#fff' : 'rgba(255,255,255,0.55)',
                fontVariantNumeric: 'tabular-nums',
                transition: 'all 180ms cubic-bezier(0.2,0.8,0.2,1)',
              }}>0</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: 2 }}>
                <span style={{
                  fontWeight: 800,
                  fontSize: priceEmphasis === 'perDay' && isOn ? 18 : 15,
                  lineHeight: 1,
                  color: isOn ? '#fff' : 'rgba(255,255,255,0.7)',
                  fontVariantNumeric: 'tabular-nums',
                }}>{plan.perDay.replace('0.','')}</span>
                <span style={{
                  fontSize: 8, fontWeight: 800, letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.5)', marginTop: 2,
                }}>PER DAY</span>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

// ── Hero poster strip ─────────────────────────────────────────
function HeroPosterStrip() {
  const order = [0, 8, 2, 14, 5, 11, 1, 16, 6, 9, 3, 13, 4, 15, 7, 10, 12];
  const items = order.map(i => POSTERS[i]).filter(Boolean);
  return (
    <div style={{
      position: 'relative',
      margin: '4px -16px 4px',
      height: 130,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', gap: 8, height: '100%',
        animation: 'hero-drift 38s linear infinite',
        width: 'max-content',
        transform: 'translateX(-12px)',
      }}>
        {[...items, ...items].map((src, i) => (
          <div key={i} style={{
            width: 73, height: '100%', flexShrink: 0,
            borderRadius: 10, overflow: 'hidden',
            background: '#0d0b14',
            boxShadow: '0 6px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset',
          }}>
            <img
              src={src} alt=""
              draggable={false}
              loading="lazy"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                display: 'block', userSelect: 'none', pointerEvents: 'none',
              }}
            />
          </div>
        ))}
      </div>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(90deg, #040405 0%, transparent 14%, transparent 86%, #040405 100%)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, height: 24,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(4,4,5,0.85) 0%, rgba(4,4,5,0) 100%)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 60,
        pointerEvents: 'none',
        background: 'linear-gradient(0deg, #040405 0%, transparent 100%)',
      }} />
      <style>{`
        @keyframes hero-drift {
          0%   { transform: translateX(-12px); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
      `}</style>
    </div>
  );
}

// ── Hero timer ────────────────────────────────────────────────
function HeroTimer({ mins, secs, accentColors }) {
  return (
    <div style={{ textAlign: 'center', margin: '4px 0 6px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 12px 5px 8px', borderRadius: 999,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: 999,
          background: accentColors.primary,
          boxShadow: `0 0 10px ${accentColors.primary}`,
          animation: 'pp-blink 1.4s ease-in-out infinite',
        }} />
        60% off · reserved
      </div>
      <div style={{
        marginTop: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontVariantNumeric: 'tabular-nums',
      }}>
        <TimerBlock value={String(mins).padStart(2,'0')} label="MIN" accentColors={accentColors} />
        <span style={{ fontWeight: 800, fontSize: 28, color: 'rgba(255,255,255,0.4)' }}>:</span>
        <TimerBlock value={String(secs).padStart(2,'0')} label="SEC" accentColors={accentColors} />
      </div>
      <style>{`
        @keyframes pp-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}

function TimerBlock({ value, label, accentColors }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '6px 14px 4px', borderRadius: 10,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.10)',
      minWidth: 56,
    }}>
      <span style={{ fontWeight: 800, fontSize: 30, lineHeight: 1, letterSpacing: '-0.04em', color: '#fff' }}>{value}</span>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{label}</span>
    </div>
  );
}

// ── Pill timer ────────────────────────────────────────────────
function PillTimer({ mins, secs, accentColors }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 12px 6px 10px', borderRadius: 999,
      background: 'rgba(0,0,0,0.5)',
      border: `1px solid ${accentColors.primary}55`,
      boxShadow: `0 0 0 3px ${accentColors.ringGlow}`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 999,
        background: accentColors.primary,
        boxShadow: `0 0 8px ${accentColors.primary}`,
      }} />
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>60% off ends in</span>
      <span style={{
        fontWeight: 800, fontSize: 13, color: '#fff',
        fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em',
      }}>{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</span>
    </div>
  );
}

// ── Avatar stack ──────────────────────────────────────────────
function AvatarStack() {
  const avatars = [
    { bg: 'linear-gradient(135deg,#FF6B8A,#8a1830)', initial: 'S' },
    { bg: 'linear-gradient(135deg,#B49BFF,#4000E8)', initial: 'M' },
    { bg: 'linear-gradient(135deg,#FFBF85,#CD501A)', initial: 'A' },
  ];
  return (
    <div style={{ display: 'flex', flexShrink: 0 }}>
      {avatars.map((a, i) => (
        <div key={i} style={{
          width: 28, height: 28, borderRadius: 999, marginLeft: i === 0 ? 0 : -10,
          background: a.bg, border: '2px solid #0d0b14',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 11,
          zIndex: 3 - i,
        }}>{a.initial}</div>
      ))}
    </div>
  );
}

// ── Payment methods row ───────────────────────────────────────
function PaymentRow() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      gap: 6, marginTop: 12, flexWrap: 'wrap',
    }}>
      {[
        { key: 'PP', content: <PayPalLogo /> },
        { key: 'AP', content: <ApplePayLogo /> },
        { key: 'GP', content: <GPayLogo /> },
        { key: 'VS', content: <VisaLogo /> },
        { key: 'MC', content: <MasterLogo /> },
        { key: 'MS', content: <MaestroLogo /> },
        { key: 'DC', content: <DiscoverLogo /> },
        { key: 'AX', content: <AmexLogo /> },
      ].map(p => (
        <div key={p.key} style={{
          width: 44, height: 28, background: '#fff',
          borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
        }}>
          {p.content}
        </div>
      ))}
    </div>
  );
}

function PayPalLogo() {
  return (
    <span style={{ fontWeight: 900, fontSize: 11, letterSpacing: '-0.02em', fontStyle: 'italic' }}>
      <span style={{ color: '#003087' }}>Pay</span><span style={{ color: '#009CDE' }}>Pal</span>
    </span>
  );
}
function ApplePayLogo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', color: '#000', fontWeight: 600, fontSize: 11 }}>
      <svg width="11" height="13" viewBox="0 0 16 19" fill="#000" style={{ marginRight: 1 }}>
        <path d="M13.4 9.95c-.02-2.06 1.69-3.05 1.77-3.1-.97-1.4-2.47-1.6-3-1.62-1.27-.13-2.49.75-3.13.75-.65 0-1.65-.73-2.72-.71-1.4.02-2.69.81-3.41 2.06-1.45 2.52-.37 6.25 1.05 8.3.7.99 1.52 2.11 2.59 2.07 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.6.67 2.7.65 1.11-.02 1.82-1.01 2.5-2 .79-1.15 1.11-2.27 1.13-2.33-.02-.01-2.16-.83-2.18-3.3z"/>
        <path d="M11.4 4.04c.57-.69.96-1.66.86-2.62-.83.04-1.84.55-2.43 1.24-.53.61-.99 1.59-.87 2.55.93.07 1.87-.47 2.44-1.17z"/>
      </svg>
      <span style={{ marginLeft: 1 }}>Pay</span>
    </span>
  );
}
function GPayLogo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 10, fontWeight: 600, letterSpacing: '0.02em' }}>
      <span style={{ color: '#4285F4' }}>G</span>
      <span style={{ color: '#EA4335' }}>·</span>
      <span style={{ color: '#5F6368', marginLeft: 1 }}>Pay</span>
    </span>
  );
}
function VisaLogo() {
  return (
    <span style={{ color: '#1A1F71', fontWeight: 900, fontSize: 11, fontStyle: 'italic', letterSpacing: '-0.03em' }}>
      VISA
    </span>
  );
}
function MasterLogo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ width: 12, height: 12, borderRadius: 999, background: '#EB001B', display: 'inline-block', marginRight: -4 }} />
      <span style={{ width: 12, height: 12, borderRadius: 999, background: '#F79E1B', display: 'inline-block', mixBlendMode: 'multiply' }} />
    </span>
  );
}
function MaestroLogo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ width: 12, height: 12, borderRadius: 999, background: '#0099DF', display: 'inline-block', marginRight: -4 }} />
      <span style={{ width: 12, height: 12, borderRadius: 999, background: '#ED0006', display: 'inline-block', mixBlendMode: 'multiply' }} />
    </span>
  );
}
function DiscoverLogo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 8, fontWeight: 900, color: '#000', letterSpacing: '-0.01em' }}>
      DISC
      <span style={{
        width: 6, height: 6, borderRadius: 999, marginLeft: 2,
        background: 'linear-gradient(135deg, #FF6000, #FFBF85)',
      }} />
    </span>
  );
}
function AmexLogo() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: '#006FCF', color: '#fff', fontWeight: 900, fontSize: 8.5,
      padding: '3px 5px', borderRadius: 2, letterSpacing: '0.02em',
    }}>
      AMEX
    </span>
  );
}

// ── Countdown hook ────────────────────────────────────────────
function useCountdown(startSec) {
  const [t, setT] = useState(startSec);
  useEffect(() => {
    const i = setInterval(() => setT(v => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(i);
  }, []);
  return [Math.floor(t / 60), t % 60];
}

export default PlanPickerScreen;
