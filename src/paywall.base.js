import EventBus from 'event-bus';

const buildCSS = (accent) => `
  .pw-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .pw-modal {
    background: #fff;
    border-radius: 20px;
    padding: 32px 24px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
  .pw-title {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0 0 8px;
    text-align: center;
  }
  .pw-subtitle {
    font-size: 14px;
    color: #888;
    margin: 0 0 24px;
    text-align: center;
  }
  .pw-products {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }
  .pw-card {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 2px solid #e8e8e8;
    border-radius: 12px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
  }
  .pw-card:hover {
    border-color: ${accent};
    background: ${accent}10;
  }
  .pw-card input[type="radio"] {
    display: none;
  }
  .pw-card--selected {
    border-color: ${accent};
    background: ${accent}10;
  }
  .pw-radio {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #ccc;
    margin-right: 14px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s, background 0.2s;
  }
  .pw-card--selected .pw-radio {
    border-color: ${accent};
    background: ${accent};
  }
  .pw-card--selected .pw-radio::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
  }
  .pw-card-body {
    flex: 1;
  }
  .pw-badge {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 3px 8px;
    border-radius: 20px;
    color: #fff;
    background: ${accent};
    display: inline-block;
    margin-bottom: 4px;
  }
  .pw-badge--best {
    background: #f59e0b;
  }
  .pw-card-name {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a2e;
    display: block;
  }
  .pw-card-price {
    font-size: 13px;
    color: #888;
    display: block;
    margin-top: 2px;
  }
  .pw-cta {
    width: 100%;
    padding: 16px;
    background: ${accent};
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
    letter-spacing: 0.3px;
  }
  .pw-cta:hover {
    opacity: 0.88;
  }
  .pw-fine-print {
    font-size: 12px;
    color: #bbb;
    text-align: center;
    margin: 12px 0 0;
  }
`;

function injectStyles(id, css) {
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

function renderProducts(container, products) {
  const el = container.querySelector('#pw-products');
  el.innerHTML = products
    .map((p, i) => {
      const badge =
        i === 1
          ? '<span class="pw-badge">Most Popular</span><br>'
          : i === 2
          ? '<span class="pw-badge pw-badge--best">Best Value</span><br>'
          : '';
      return `
        <label class="pw-card${i === 1 ? ' pw-card--selected' : ''}">
          <input type="radio" name="pw-product" value="${i}" ${i === 1 ? 'checked' : ''}>
          <div class="pw-radio"></div>
          <div class="pw-card-body">
            ${badge}
            <span class="pw-card-name">${p.name}</span>
            <span class="pw-card-price">${p.price}</span>
          </div>
        </label>`;
    })
    .join('');

  el.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      el.querySelectorAll('.pw-card').forEach((c) => c.classList.remove('pw-card--selected'));
      radio.closest('.pw-card').classList.add('pw-card--selected');
    });
  });
}

export function createMount(accentColor) {
  return function mount(container) {
    injectStyles('pw-styles-' + accentColor.replace('#', ''), buildCSS(accentColor));

    container.innerHTML = `
      <div class="pw-overlay">
        <div class="pw-modal">
          <h2 class="pw-title">Get Full Access</h2>
          <p class="pw-subtitle">Choose the plan that works for you</p>
          <div class="pw-products" id="pw-products">
            <div style="text-align:center;padding:20px;color:#ccc">Loading...</div>
          </div>
          <button class="pw-cta" id="pw-continue">Get Full Access</button>
          <p class="pw-fine-print">Cancel anytime. No commitments.</p>
        </div>
      </div>`;

    const cleanup = EventBus.on('paywall:init', ({ products }) => {
      renderProducts(container, products);
    });

    container.querySelector('#pw-continue').addEventListener('click', () => {
      const selected = container.querySelector('input[name="pw-product"]:checked');
      EventBus.dispatch('paywall:continue', {
        selectedProduct: selected ? parseInt(selected.value) : 0,
      });
      cleanup();
    });
  };
}
