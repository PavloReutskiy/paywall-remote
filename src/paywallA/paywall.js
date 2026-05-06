import './style.css';
import EventBus from 'event-bus';

export function mount(container) {
  container.innerHTML = `
    <div class="pw-overlay">
      <div class="pw-modal">
        <h2 class="pw-title">Choose your plan</h2>
        <div class="pw-products" id="pw-products"></div>
        <button class="pw-cta" id="pw-continue">Get Full Access</button>
      </div>
    </div>
  `;

  let products = [];
  const list = container.querySelector('#pw-products');

  const cleanup = EventBus.on('paywall:init', ({ products: incoming }) => {
    products = incoming;

    list.innerHTML = products
      .map(
        (p, i) => `
          <div class="pw-card${i === 0 ? ' is-selected' : ''}" data-index="${i}">
            <div class="pw-radio"></div>
            <span class="pw-card-name">${p.name}</span>
            <span class="pw-card-price">${p.price}</span>
          </div>
        `
      )
      .join('');

    list.querySelectorAll('.pw-card').forEach((card) => {
      card.addEventListener('click', () => {
        list.querySelectorAll('.pw-card').forEach((c) => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
      });
    });
  });

  container.querySelector('#pw-continue').addEventListener('click', () => {
    const selected = list.querySelector('.pw-card.is-selected');
    const index = selected ? parseInt(selected.dataset.index) : 0;
    EventBus.dispatch('paywall:continue', { selectedProduct: products[index] });
    cleanup();
  });
}
