import EventBus from 'event-bus';
import { mount as mountA } from './paywallA.js';
import { mount as mountB } from './paywallB.js';
import { mount as mountC } from './paywallC.js';

const mounts = { A: mountA, B: mountB, C: mountC };

const TEST_PRODUCTS = [
  { name: '1-Week Trial', price: '$7.99' },
  { name: '2-Week Plan', price: '$8.49' },
  { name: '4-Week Plan', price: '$14.99' },
];

const container = document.getElementById('paywall-root');
const status = document.getElementById('status');

function launch(variant) {
  container.innerHTML = '';
  mounts[variant](container);
  EventBus.dispatch('paywall:init', { products: TEST_PRODUCTS });
  status.textContent = `Paywall ${variant} loaded — waiting for Continue...`;
}

EventBus.on('paywall:continue', ({ selectedProduct }) => {
  container.innerHTML = '';
  status.textContent = `✅ paywall:continue fired! Selected product index: ${selectedProduct}`;
});

document.querySelectorAll('[data-variant]').forEach((btn) => {
  btn.addEventListener('click', () => launch(btn.dataset.variant));
});
