import React from 'react';
import { createRoot } from 'react-dom/client';
import EventBus from 'event-bus';
import PlanPickerScreen from './PlanPickerScreen.jsx';
import './fonts.css';

export function mount(container) {
  const root = createRoot(container);

  // Overlay wrapper that presents the paywall as a full-screen modal
  function PaywallOverlay({ products, onDone }) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.80)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0',
        overflowY: 'auto',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 390,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.70)',
        }}>
          <PlanPickerScreen
            products={products}
            onContinue={(plan) => onDone(plan)}
            onClose={() => onDone(null)}
          />
        </div>
      </div>
    );
  }

  const cleanup = EventBus.on('paywall:init', ({ products }) => {
    root.render(
      <PaywallOverlay
        products={products}
        onDone={(plan) => {
          EventBus.dispatch('paywall:continue', {
            selectedProduct: plan
              ? { name: plan.label, price: plan.total }
              : { name: 'Dismissed', price: '$0' },
          });
          cleanup();
          root.unmount();
        }}
      />
    );
  });
}
