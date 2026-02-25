let currentBouquetItem = "";
let selectedMessenger = "telegram";

const PHONE = "+380970938241";
const CLEAN_PHONE = "380970938241";
const INSTAGRAM = "https://ig.me/m/kvi_tka24";

function selectMessenger(platform) {
    selectedMessenger = platform;
    document.querySelectorAll('.messenger-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`.messenger-btn[data-platform="${platform}"]`);
    if (btn) btn.classList.add('active');

    const hint = document.getElementById('copyHint');
    const detail = document.getElementById('copyHintDetail');
    if (platform === 'viber') {
        detail.innerHTML = 'Текст із назвою букету та обраною датою вже буде у вашому буфері обміну — вам залишиться лише відкрити Viber, натиснути і утримати поле вводу та обрати <b>«Вставити»</b> ✨';
        hint.style.display = 'flex';
    } else if (platform === 'instagram') {
        detail.innerHTML = 'Текст із назвою букету та обраною датою вже буде у вашому буфері обміну — вам залишиться лише відкрити Instagram Direct, натиснути і утримати поле вводу та обрати <b>«Вставити»</b> ✨';
        hint.style.display = 'flex';
    } else {
        hint.style.display = 'none';
    }
}

function buildMessengerUrl(platform, message) {
    const encoded = encodeURIComponent(message);
    if (platform === 'telegram') return `https://t.me/${PHONE}?text=${encoded}`;
    if (platform === 'whatsapp') return `https://wa.me/${CLEAN_PHONE}?text=${encoded}`;
    if (platform === 'viber') return `viber://chat?number=%2B${CLEAN_PHONE}`;
    if (platform === 'instagram') return INSTAGRAM;
    return '#';
}

// Viber and Instagram don't support pre-filled text — copy to clipboard instead
function openWithCopy(platform, message) {
    navigator.clipboard.writeText(message).catch(() => {});
    setTimeout(() => {
        window.open(buildMessengerUrl(platform, message), '_blank');
    }, 300);
    showCopyToast(platform);
}

function showCopyToast(platform) {
    const existing = document.getElementById('copyToast');
    if (existing) existing.remove();

    const platformName = platform === 'viber' ? 'Viber' : 'Instagram Direct';
    const hint = platform === 'viber'
        ? '(<b>Ctrl+V</b> або утримайте поле вводу)'
        : '(натисніть і утримайте поле вводу → Вставити)';

    const toast = document.createElement('div');
    toast.id = 'copyToast';
    toast.innerHTML = `<span style="font-size:20px">📋</span><span>Текст скопійовано! Вставте його у ${platformName} ${hint}</span>`;
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: #3a3330; color: #fdf9f5;
        padding: 14px 22px; border-radius: 14px;
        font-family: 'Montserrat', sans-serif; font-size: 13px;
        max-width: 400px; width: 90%; text-align: center;
        z-index: 9999; display: flex; align-items: center; gap: 10px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.25);
        opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease;
        line-height: 1.5;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 5000);
}

function sendToMessenger(platform, message) {
    if (platform === 'viber' || platform === 'instagram') {
        openWithCopy(platform, message);
    } else {
        window.open(buildMessengerUrl(platform, message), '_blank');
    }
}

function orderBouquet(bouquetName) {
    currentBouquetItem = bouquetName;
    document.getElementById('modalBouquetName').innerText = `Букет: "${bouquetName}"`;
    document.getElementById('bookingModal').style.removeProperty('display');
    document.body.style.overflow = 'hidden';
    document.getElementById('bookingDate').value = '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').setAttribute('min', today);
    document.getElementById('confirmBtn').textContent = 'Дізнатись ціну';
    document.getElementById('confirmBtn').onclick = function() {
        const msg = `Добрий день! 🌸 Мене зацікавив букет "${currentBouquetItem}". Підкажіть, будь ласка, яка його вартість та як оформити замовлення?`;
        sendToMessenger(selectedMessenger, msg);
        closeModal();
    };
    document.getElementById('dateGroup').style.display = 'none';
}

function openContact(platform, phone) {
    const message = `Вітаю! 🌸 Хотів(ла) би замовити у вас квіти. Підкажіть, будь ласка, які варіанти зараз доступні та як оформити доставку?`;
    sendToMessenger(platform, message);
}

function reserveBouquet(bouquetName) {
    currentBouquetItem = bouquetName;
    document.getElementById('modalBouquetName').innerText = `Букет: "${bouquetName}"`;
    document.getElementById('bookingModal').style.removeProperty('display');
    document.body.style.overflow = 'hidden';
    document.getElementById('dateGroup').style.display = 'block';
    document.getElementById('bookingDate').value = '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').setAttribute('min', today);
    document.getElementById('confirmBtn').textContent = 'Перейти до месенджера';
    document.getElementById('confirmBtn').onclick = confirmBooking;
    selectMessenger('telegram');
    document.getElementById('copyHint').style.display = 'none';
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById('bookingDate').value = '';
}

function confirmBooking() {
    const selectedDate = document.getElementById('bookingDate').value;
    const dateGroupVisible = document.getElementById('dateGroup').style.display !== 'none';

    if (dateGroupVisible && !selectedDate) {
        alert("Будь ласка, оберіть дату для передзамовлення.");
        return;
    }

    let message;
    if (dateGroupVisible && selectedDate) {
        const dateObj = new Date(selectedDate);
        const formattedDate = dateObj.toLocaleDateString('uk-UA');
        message = `Вітаю! 🌸 Я хотів(ла) би зробити передзамовлення на букет "${currentBouquetItem}" на дату: ${formattedDate}.\n\nПідкажіть, як ми можемо це оформити?`;
    } else {
        message = `Добрий день! 🌸 Мене зацікавив букет "${currentBouquetItem}". Підкажіть, будь ласка, яка його вартість?`;
    }

    sendToMessenger(selectedMessenger, message);
    closeModal();
}

window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target == modal) closeModal();;
}

/* ════════════════════════════════
   CART LOGIC
   ════════════════════════════════ */

let cart = []; // [{name, qty}]
let cartMessenger = 'telegram';

function addToCart(name) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, qty: 1 });
    }
    updateCartUI();
    bumpCartCount();

    // Visual feedback on button
    const btns = document.querySelectorAll('.add-cart-btn');
    btns.forEach(btn => {
        if (btn.getAttribute('onclick') === `addToCart('${name}')`) {
            btn.classList.add('added');
            btn.textContent = '✓ Додано';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.textContent = '🛒 В кошик';
            }, 1500);
        }
    });
}

function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    updateCartUI();
}

function changeQty(name, delta) {
    const item = cart.find(i => i.name === name);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(name);
    else updateCartUI();
}

function updateCartUI() {
    const total = cart.reduce((s, i) => s + i.qty, 0);

    // Update counter badge
    const countEl = document.getElementById('cartCount');
    countEl.textContent = total;
    countEl.style.background = total > 0 ? '' : 'var(--text-muted)';

    // Update total in footer
    const totalEl = document.getElementById('cartTotalCount');
    if (totalEl) totalEl.textContent = total;

    // Show/hide footer
    const footer = document.getElementById('cartFooter');
    if (footer) footer.style.display = total > 0 ? 'block' : 'none';

    // Render items
    const container = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty"><span>🌸</span><p>Кошик порожній</p><small>Додайте букети, які вам сподобались</small></div>';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
                <span class="qty-num">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.name}')" title="Видалити">×</button>
        </div>
    `).join('');
}

function createEmptyEl() {
    const d = document.createElement('div');
    d.className = 'cart-empty';
    d.id = 'cartEmpty';
    d.innerHTML = '<span>🌸</span><p>Кошик порожній</p><small>Додайте букети, які вам сподобались</small>';
    return d;
}

function bumpCartCount() {
    const el = document.getElementById('cartCount');
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 300);
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

function selectCartMessenger(m) {
    cartMessenger = m;
    document.querySelectorAll('.cart-m-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.cart-m-btn[data-m="${m}"]`).classList.add('active');

    const hint = document.getElementById('cartCopyHint');
    const hintText = document.getElementById('cartCopyHintText');
    if (m === 'viber') {
        hintText.innerHTML = 'Після відкриття Viber — натисніть і утримайте поле вводу та оберіть <b>«Вставити»</b> ✨';
        hint.style.display = 'flex';
    } else if (m === 'instagram') {
        hintText.innerHTML = 'Після відкриття Instagram Direct — натисніть і утримайте поле вводу та оберіть <b>«Вставити»</b> ✨';
        hint.style.display = 'flex';
    } else {
        hint.style.display = 'none';
    }
}

function orderFromCart() {
    if (cart.length === 0) return;

    const itemsList = cart.map(i => `• ${i.name}${i.qty > 1 ? ` — ${i.qty} шт.` : ''}`).join('\n');
    const message = `Вітаю! 🌸 Хочу оформити замовлення:\n\n${itemsList}\n\nПідкажіть, будь ласка, як можна це оформити та дізнатись актуальну ціну?`;

    sendToMessenger(cartMessenger, message);
    toggleCart();
}

/* ════════════════════════════════
   BOUQUET BUILDER
   ════════════════════════════════ */

const FLOWER_COLORS = {
    'Троянди':     [
        { name: 'Червоні',    hex: '#c0392b' },
        { name: 'Рожеві',     hex: '#e91e8c' },
        { name: 'Білі',       hex: '#f5f0eb' },
        { name: 'Кремові',    hex: '#f0d9b5' },
        { name: 'Жовті',      hex: '#f1c40f' },
        { name: 'Бордові',    hex: '#7b1e3a' },
        { name: 'Персикові',  hex: '#ffb347' },
        { name: 'Мікс',       hex: 'linear-gradient(135deg,#e91e8c,#f1c40f,#c0392b)' },
    ],
    'Хризантеми':  [
        { name: 'Білі',       hex: '#f5f0eb' },
        { name: 'Жовті',      hex: '#f1c40f' },
        { name: 'Рожеві',     hex: '#e91e8c' },
        { name: 'Фіолетові',  hex: '#8e44ad' },
        { name: 'Кремові',    hex: '#f0d9b5' },
        { name: 'Мікс',       hex: 'linear-gradient(135deg,#f5f0eb,#f1c40f,#e91e8c)' },
    ],
    'Тюльпани':    [
        { name: 'Червоні',    hex: '#c0392b' },
        { name: 'Рожеві',     hex: '#e91e8c' },
        { name: 'Білі',       hex: '#f5f0eb' },
        { name: 'Жовті',      hex: '#f1c40f' },
        { name: 'Фіолетові',  hex: '#8e44ad' },
        { name: 'Помаранчеві',hex: '#e67e22' },
        { name: 'Мікс',       hex: 'linear-gradient(135deg,#c0392b,#f1c40f,#e91e8c)' },
    ]
};

let currentFlowerType = 'Троянди';
let currentColor = null;
let customQty = 1;
let customFlowers = []; // [{type, color, qty}]
let buildMessenger = 'telegram';

// Render colors for selected flower type
function renderColors(type) {
    const grid = document.getElementById('colorGrid');
    const colors = FLOWER_COLORS[type] || [];
    grid.innerHTML = colors.map(c => {
        const dotStyle = c.hex.startsWith('linear')
            ? `background:${c.hex}; border:none;`
            : `background:${c.hex};`;
        return `<button class="color-chip ${currentColor === c.name ? 'active' : ''}"
                    onclick="selectColor('${c.name}')" data-color="${c.name}">
                    <span class="color-dot" style="${dotStyle}"></span>
                    ${c.name}
                </button>`;
    }).join('');
}

function selectFlowerType(btn) {
    document.querySelectorAll('.flower-type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFlowerType = btn.dataset.type;
    currentColor = null;
    renderColors(currentFlowerType);
}

function selectColor(name) {
    currentColor = name;
    document.querySelectorAll('.color-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.color === name);
    });
}

function changeCustomQty(delta) {
    customQty = Math.max(1, Math.min(999, customQty + delta));
    document.getElementById('customQty').textContent = customQty;
}

function addCustomFlower() {
    if (!currentColor) {
        const grid = document.getElementById('colorGrid');
        grid.style.outline = '2px solid var(--accent)';
        grid.style.borderRadius = '8px';
        setTimeout(() => grid.style.outline = '', 1200);
        return;
    }
    customFlowers.push({ type: currentFlowerType, color: currentColor, qty: customQty });
    renderCustomList();
    // reset
    currentColor = null;
    customQty = 1;
    document.getElementById('customQty').textContent = '1';
    document.querySelectorAll('.color-chip').forEach(c => c.classList.remove('active'));
}

function removeCustomFlower(idx) {
    customFlowers.splice(idx, 1);
    renderCustomList();
}

function renderCustomList() {
    const section = document.getElementById('customListSection');
    const list = document.getElementById('customList');
    const footer = document.getElementById('buildFooter');
    const empty = document.getElementById('buildEmpty');

    if (customFlowers.length === 0) {
        section.style.display = 'none';
        footer.style.display = 'none';
        empty.style.display = 'flex';
        return;
    }

    section.style.display = 'block';
    footer.style.display = 'block';
    empty.style.display = 'none';

    list.innerHTML = customFlowers.map((f, i) => `
        <div class="custom-item">
            <div class="custom-item-info">
                <div class="custom-item-name">${f.type}</div>
                <div class="custom-item-detail">${f.color} · ${f.qty} шт.</div>
            </div>
            <button class="custom-item-remove" onclick="removeCustomFlower(${i})">×</button>
        </div>
    `).join('');
}

function selectBuildMessenger(m) {
    buildMessenger = m;
    document.querySelectorAll('[data-bm]').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-bm="${m}"]`).classList.add('active');

    const hint = document.getElementById('buildCopyHint');
    const hintText = document.getElementById('buildCopyHintText');
    if (m === 'viber') {
        hintText.innerHTML = 'Після відкриття Viber — натисніть і утримайте поле вводу та оберіть <b>«Вставити»</b> ✨';
        hint.style.display = 'flex';
    } else if (m === 'instagram') {
        hintText.innerHTML = 'Після відкриття Instagram Direct — натисніть і утримайте поле вводу та оберіть <b>«Вставити»</b> ✨';
        hint.style.display = 'flex';
    } else {
        hint.style.display = 'none';
    }
}

function orderCustomBouquet() {
    if (customFlowers.length === 0) return;
    const note = document.getElementById('customNote').value.trim();
    const lines = customFlowers.map(f => `• ${f.type} (${f.color}) — ${f.qty} шт.`).join('\n');
    let message = `Вітаю! 🌸 Хочу замовити власний букет:\n\n${lines}`;
    if (note) message += `\n\n📝 Побажання: ${note}`;
    message += `\n\nПідкажіть, будь ласка, актуальну ціну та як оформити замовлення?`;
    sendToMessenger(buildMessenger, message);
    toggleCart();
}

// Tab switching
function switchTab(tab) {
    document.getElementById('tabCart').classList.toggle('active', tab === 'cart');
    document.getElementById('tabBuild').classList.toggle('active', tab === 'build');
    document.getElementById('panelCart').style.display = tab === 'cart' ? 'flex' : 'none';
    document.getElementById('panelBuild').style.display = tab === 'build' ? 'flex' : 'none';
}

// Init color grid on page load
document.addEventListener('DOMContentLoaded', () => {
    renderColors('Троянди');
});

/* ════════════════════════════════
   CATEGORIES FILTER
   ════════════════════════════════ */

let activeCategory = 'all';

function toggleCategories() {
    const sidebar = document.getElementById('catSidebar');
    const overlay = document.getElementById('catOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

function filterCategory(btn, cat) {
    activeCategory = cat;

    // Update active buttons in both dropdown and sidebar
    document.querySelectorAll('.cat-item, .dropdown-item').forEach(b => b.classList.remove('active'));
    // Activate all matching buttons across both menus
    document.querySelectorAll(`[data-cat="${cat}"]`).forEach(b => b.classList.add('active'));

    // Filter cards
    const cards = document.querySelectorAll('.flower-card');
    cards.forEach(card => {
        const cardCat = card.dataset.category;
        if (cat === 'all' || cardCat === cat) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    // Show/hide filter badge
    const subtitle = document.querySelector('.section-subtitle');
    const existingBadge = document.getElementById('filterBadge');
    if (existingBadge) existingBadge.remove();

    if (cat !== 'all') {
        const icons = { 'Троянди':'🌹', 'Хризантеми':'🌼', 'Тюльпани':'🌷', 'Мікс':'🌺' };
        const badge = document.createElement('div');
        badge.id = 'filterBadge';
        badge.className = 'filter-badge';
        badge.innerHTML = `${icons[cat] || '💐'} ${cat} <span onclick="filterCategory(document.querySelector('.cat-item[data-cat=\'all\']'), 'all')" style="opacity:0.6; font-size:14px; margin-left:2px;">×</span>`;
        badge.onclick = () => {
            filterCategory(document.querySelector(".cat-item[data-cat='all']"), 'all');
        };
        subtitle.insertAdjacentElement('afterend', badge);
    }

    // Close sidebar if open
    const catSidebar = document.getElementById('catSidebar');
    if (catSidebar && catSidebar.classList.contains('open')) toggleCategories();

    // Scroll to catalog
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openBuildTab() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    // Open cart if not already open
    if (!sidebar.classList.contains('open')) {
        sidebar.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    // Always switch to build tab
    switchTab('build');
}
