/* ═══════════════════════════════════════════
   IMPERIAL — Повний скрипт
   ═══════════════════════════════════════════ */

let currentBouquetItem = "";
let selectedMessenger = "telegram";

const PHONE = "+380970938241";
const CLEAN_PHONE = "380970938241";
const INSTAGRAM = "https://ig.me/m/kvi_tka24";

/* ═══════════════════════════════════════════
   MESSENGER HELPERS
   ═══════════════════════════════════════════ */

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

function openWithCopy(platform, message) {
    navigator.clipboard.writeText(message).catch(() => { });
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

/* ═══════════════════════════════════════════
   BOOKING MODAL (Дізнатись ціну / Замовити)
   ═══════════════════════════════════════════ */

function orderBouquet(bouquetName) {
    currentBouquetItem = bouquetName;
    document.getElementById('modalBouquetName').innerText = `Букет: "${bouquetName}"`;
    document.getElementById('bookingModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('bookingDate').value = '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').setAttribute('min', today);
    document.getElementById('confirmBtn').textContent = 'Дізнатись ціну';
    document.getElementById('confirmBtn').onclick = function () {
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
    document.getElementById('bookingModal').classList.add('open');
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
    document.getElementById('bookingModal').classList.remove('open');
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

window.onclick = function (event) {
    const modal = document.getElementById('bookingModal');
    if (event.target == modal) closeModal();
};

/* ═══════════════════════════════════════════
   CATALOG — фільтрація категорій
   ═══════════════════════════════════════════ */

const CATS = {
    'troyandy': { label: 'Троянди', desc: 'Розкішні троянди — символ любові та вишуканості' },
    'khrizantema': { label: 'Хризантема', desc: 'Ніжні хризантеми для особливих моментів' },
    'tulpany': { label: 'Тюльпани', desc: 'Яскраві тюльпани — весняний настрій' },
    'kulky': { label: 'Кульки', desc: 'Святкові кульки для будь-якого свята' },
    'solodki': { label: 'Солодкі букети', desc: 'Букети з цукерок та солодощів' },
    'igrashky': { label: "М'які іграшки", desc: "М'які іграшки — ніжний подарунок" },
    'topery': { label: 'Топери', desc: 'Красиві топери для тортів та композицій' },
    'korobky': { label: 'Коробки та кошики', desc: 'Елегантні коробки, сумочки та кошики' },
    'listivky': { label: 'Листівки', desc: 'Красиві листівки для будь-якого приводу' },
    'sumochky': { label: 'Сумочки квітів', desc: 'Стильні сумочки з квітами' },
};

document.addEventListener('DOMContentLoaded', function () {
    showCatalogOverview();
    renderColors('Троянди');
});

function showCatalogOverview() {
    const countPerCat = {};
    document.querySelectorAll('.pc').forEach(card => {
        const cat = card.dataset.cat;
        countPerCat[cat] = (countPerCat[cat] || 0) + 1;
        card.classList.toggle('hidden', countPerCat[cat] > 4);
    });
    const titleEl = document.getElementById('catTitle');
    const descEl = document.getElementById('catDesc');
    if (titleEl) titleEl.textContent = 'Всі категорії';
    if (descEl) descEl.textContent = 'Весь асортимент Imperial — від класичних букетів до унікальних подарунків';
    const emptyEl = document.getElementById('catEmpty');
    const gridEl = document.getElementById('pcGrid');
    if (emptyEl) emptyEl.style.display = 'none';
    if (gridEl) gridEl.style.display = 'grid';
}

function openCat(catId) {
    // Закрити дропдаун
    const menu = document.getElementById('navCatMenu');
    const arrow = document.getElementById('catArrow');
    const trigger = document.querySelector('.nav-cat-trigger');
    if (menu) menu.classList.remove('open');
    if (arrow) arrow.classList.remove('open');
    if (trigger) trigger.classList.remove('open');

    const titleEl = document.getElementById('catTitle');
    const descEl = document.getElementById('catDesc');
    const emptyEl = document.getElementById('catEmpty');
    const gridEl = document.getElementById('pcGrid');

    if (catId === 'all') {
        showCatalogOverview();
    } else {
        const info = CATS[catId] || { label: catId, desc: '' };
        if (titleEl) titleEl.textContent = info.label;
        if (descEl) descEl.textContent = info.desc;

        let visible = 0;
        document.querySelectorAll('.pc').forEach(card => {
            const show = card.dataset.cat === catId;
            card.classList.toggle('hidden', !show);
            if (show) visible++;
        });
        if (emptyEl) emptyEl.style.display = visible === 0 ? 'block' : 'none';
        if (gridEl) gridEl.style.display = visible === 0 ? 'none' : 'grid';
    }

    // Прокрутка до каталогу
    const catSection = document.getElementById('catalog');
    if (catSection) catSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Дропдаун каталогу
function toggleCatMenu() {
    const menu = document.getElementById('navCatMenu');
    const arrow = document.getElementById('catArrow');
    const trigger = document.querySelector('.nav-cat-trigger');
    if (!menu) return;
    const isOpen = menu.classList.contains('open');
    menu.classList.toggle('open', !isOpen);
    if (arrow) arrow.classList.toggle('open', !isOpen);
    if (trigger) trigger.classList.toggle('open', !isOpen);
}

// Закрити дропдаун при кліку поза ним
document.addEventListener('click', function (e) {
    const wrap = document.querySelector('.nav-cat-wrap');
    if (wrap && !wrap.contains(e.target)) {
        const menu = document.getElementById('navCatMenu');
        const arrow = document.getElementById('catArrow');
        const trigger = document.querySelector('.nav-cat-trigger');
        if (menu) menu.classList.remove('open');
        if (arrow) arrow.classList.remove('open');
        if (trigger) trigger.classList.remove('open');
    }
});

/* ═══════════════════════════════════════════
   CART — Кошик
   ═══════════════════════════════════════════ */

let cart = [];
let cartMessenger = 'telegram';

function addToCart(itemName) {
    const existing = cart.find(i => i.name === itemName);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name: itemName, qty: 1 });
    }
    updateCartUI();

    // Animate the cart count
    const countEl = document.getElementById('cartCount');
    if (countEl) {
        countEl.classList.add('bump');
        setTimeout(() => countEl.classList.remove('bump'), 300);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function changeCartQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function updateCartUI() {
    const countEl = document.getElementById('cartCount');
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotalCount');

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countEl) countEl.textContent = totalItems;

    if (!itemsEl) return;

    if (cart.length === 0) {
        itemsEl.innerHTML = `
            <div class="cart-empty">
                <span>🌸</span>
                <p>Кошик порожній</p>
                <small>Додайте букети, які вам сподобались</small>
            </div>
        `;
        if (footerEl) footerEl.style.display = 'none';
    } else {
        itemsEl.innerHTML = cart.map((item, i) => `
            <div class="cart-item">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeCartQty(${i}, -1)">−</button>
                    <span class="qty-num">${item.qty}</span>
                    <button class="qty-btn" onclick="changeCartQty(${i}, 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${i})">×</button>
            </div>
        `).join('');
        if (footerEl) footerEl.style.display = 'block';
        if (totalEl) totalEl.textContent = totalItems;
    }
}

function toggleCart() {
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    if (!overlay || !sidebar) return;
    const isOpen = sidebar.classList.contains('open');
    overlay.classList.toggle('open', !isOpen);
    sidebar.classList.toggle('open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
}

function selectCartMessenger(platform) {
    cartMessenger = platform;
    document.querySelectorAll('.cart-m-btn[data-m]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.m === platform);
    });

    const hint = document.getElementById('cartCopyHint');
    const text = document.getElementById('cartCopyHintText');
    if (platform === 'viber' || platform === 'instagram') {
        const name = platform === 'viber' ? 'Viber' : 'Instagram Direct';
        if (text) text.textContent = `Вставте текст у ${name} (Ctrl+V або утримайте поле вводу)`;
        if (hint) hint.style.display = 'flex';
    } else {
        if (hint) hint.style.display = 'none';
    }
}

function orderFromCart() {
    if (cart.length === 0) return;
    const list = cart.map(item => `• ${item.name} × ${item.qty}`).join('\n');
    const message = `Вітаю! 🌸 Хочу замовити:\n\n${list}\n\nПідкажіть, будь ласка, загальну вартість та умови доставки?`;
    sendToMessenger(cartMessenger, message);
    toggleCart();
}

/* ═══════════════════════════════════════════
   CART TABS (Кошик / Свій букет)
   ═══════════════════════════════════════════ */

function switchTab(tabName) {
    const tabCart = document.getElementById('tabCart');
    const tabBuild = document.getElementById('tabBuild');
    const panelCart = document.getElementById('panelCart');
    const panelBuild = document.getElementById('panelBuild');

    if (tabName === 'cart') {
        if (tabCart) tabCart.classList.add('active');
        if (tabBuild) tabBuild.classList.remove('active');
        if (panelCart) panelCart.style.display = 'flex';
        if (panelBuild) panelBuild.style.display = 'none';
    } else {
        if (tabCart) tabCart.classList.remove('active');
        if (tabBuild) tabBuild.classList.add('active');
        if (panelCart) panelCart.style.display = 'none';
        if (panelBuild) panelBuild.style.display = 'flex';
    }
}

function openBuildTab() {
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    if (overlay) overlay.classList.add('open');
    if (sidebar) sidebar.classList.add('open');
    document.body.style.overflow = 'hidden';
    switchTab('build');
}

/* ═══════════════════════════════════════════
   CATEGORY SIDEBAR (old sidebar, unused now)
   ═══════════════════════════════════════════ */

function toggleCategories() {
    const overlay = document.getElementById('catOverlay');
    const sidebar = document.getElementById('catSidebar');
    if (!overlay || !sidebar) return;
    const isOpen = sidebar.classList.contains('open');
    overlay.classList.toggle('open', !isOpen);
    sidebar.classList.toggle('open', !isOpen);
}

function filterCategory(btn, category) {
    // Update active state
    document.querySelectorAll('.cat-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter products (this sidebar uses Ukrainian names)
    const cards = document.querySelectorAll('.pc');
    let visible = 0;
    cards.forEach(card => {
        if (category === 'all') {
            card.classList.remove('hidden');
            visible++;
        } else {
            const show = card.dataset.cat === category;
            card.classList.toggle('hidden', !show);
            if (show) visible++;
        }
    });
}

/* ═══════════════════════════════════════════
   BUILD YOUR OWN BOUQUET
   ═══════════════════════════════════════════ */

const COLORS = {
    'Троянди': [
        { name: 'Червоні', hex: '#c0392b' },
        { name: 'Білі', hex: '#ffffff' },
        { name: 'Рожеві', hex: '#f8a5c2' },
        { name: 'Жовті', hex: '#f9ca24' },
        { name: 'Коралові', hex: '#e17055' },
        { name: 'Кремові', hex: '#ffeaa7' },
    ],
    'Хризантеми': [
        { name: 'Білі', hex: '#ffffff' },
        { name: 'Жовті', hex: '#f9ca24' },
        { name: 'Фіолетові', hex: '#a29bfe' },
        { name: 'Рожеві', hex: '#fd79a8' },
    ],
    'Тюльпани': [
        { name: 'Червоні', hex: '#e74c3c' },
        { name: 'Білі', hex: '#ffffff' },
        { name: 'Рожеві', hex: '#f8a5c2' },
        { name: 'Жовті', hex: '#f9ca24' },
        { name: 'Фіолетові', hex: '#a29bfe' },
        { name: 'Мікс', hex: 'linear-gradient(135deg, #e74c3c, #f9ca24, #a29bfe)' },
    ],
};

let customFlowers = [];
let customQty = 1;
let selectedFlowerType = 'Троянди';
let selectedColor = '';
let buildMessenger = 'telegram';

function renderColors(type) {
    const grid = document.getElementById('colorGrid');
    if (!grid) return;
    const colors = COLORS[type] || [];
    selectedColor = colors.length > 0 ? colors[0].name : '';

    grid.innerHTML = colors.map((c, i) => {
        const bg = c.hex.includes('gradient') ? c.hex : c.hex;
        const borderFix = c.hex === '#ffffff' ? 'border: 1px solid #ddd;' : '';
        return `<button class="color-chip ${i === 0 ? 'active' : ''}" onclick="selectColor(this, '${c.name}')">
            <span class="color-dot" style="background: ${bg}; ${borderFix}"></span>
            ${c.name}
        </button>`;
    }).join('');
}

function selectColor(btn, colorName) {
    selectedColor = colorName;
    document.querySelectorAll('.color-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
}

function selectFlowerType(btn) {
    selectedFlowerType = btn.dataset.type;
    document.querySelectorAll('.flower-type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderColors(selectedFlowerType);
}

function changeCustomQty(delta) {
    customQty = Math.max(1, customQty + delta);
    const el = document.getElementById('customQty');
    if (el) el.textContent = customQty;
}

function addCustomFlower() {
    if (!selectedFlowerType || !selectedColor) return;
    customFlowers.push({
        type: selectedFlowerType,
        color: selectedColor,
        qty: customQty
    });
    customQty = 1;
    const qtyEl = document.getElementById('customQty');
    if (qtyEl) qtyEl.textContent = '1';
    renderCustomList();
}

function removeCustomFlower(index) {
    customFlowers.splice(index, 1);
    renderCustomList();
}

function renderCustomList() {
    const section = document.getElementById('customListSection');
    const list = document.getElementById('customList');
    const footer = document.getElementById('buildFooter');
    const empty = document.getElementById('buildEmpty');

    if (customFlowers.length === 0) {
        if (section) section.style.display = 'none';
        if (footer) footer.style.display = 'none';
        if (empty) empty.style.display = 'flex';
    } else {
        if (section) section.style.display = 'block';
        if (footer) footer.style.display = 'block';
        if (empty) empty.style.display = 'none';

        if (list) {
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
    }
}

function selectBuildMessenger(platform) {
    buildMessenger = platform;
    document.querySelectorAll('.cart-m-btn[data-bm]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.bm === platform);
    });

    const hint = document.getElementById('buildCopyHint');
    const text = document.getElementById('buildCopyHintText');
    if (platform === 'viber' || platform === 'instagram') {
        const name = platform === 'viber' ? 'Viber' : 'Instagram Direct';
        if (text) text.textContent = `Вставте опис букету у ${name} (Ctrl+V або утримайте поле вводу)`;
        if (hint) hint.style.display = 'flex';
    } else {
        if (hint) hint.style.display = 'none';
    }
}

function orderCustomBouquet() {
    if (customFlowers.length === 0) return;

    const flowerList = customFlowers.map(f => `• ${f.type} (${f.color}) — ${f.qty} шт.`).join('\n');
    const note = document.getElementById('customNote');
    const noteText = note && note.value.trim() ? `\n\nОсобливі побажання: ${note.value.trim()}` : '';

    const message = `Вітаю! 🌸 Хочу замовити свій букет:\n\n${flowerList}${noteText}\n\nПідкажіть, будь ласка, вартість та коли можна забрати?`;
    sendToMessenger(buildMessenger, message);
    toggleCart();
}
