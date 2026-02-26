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
    document.getElementById('bookingModal').classList.add('open');
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

window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target == modal) closeModal();;
}

/* ═══════════════════════════════════════════
   CATALOG — єдина версія функцій
   ═══════════════════════════════════════════ */

const CATS = {
    'troyandy':    {label:'Троянди',           desc:'Розкішні троянди — символ любові та вишуканості'},
    'khrizantema': {label:'Хризантема',        desc:'Ніжні хризантеми для особливих моментів'},
    'tulpany':     {label:'Тюльпани',          desc:'Яскраві тюльпани — весняний настрій'},
    'kulky':       {label:'Кульки',            desc:'Святкові кульки для будь-якого свята'},
    'solodki':     {label:'Солодкі букети',    desc:'Букети з цукерок та солодощів'},
    'igrashky':    {label:"М'які іграшки",     desc:"М'які іграшки — ніжний подарунок"},
    'topery':      {label:'Топери',            desc:'Красиві топери для тортів та композицій'},
    'korobky':     {label:'Коробки та кошики', desc:'Елегантні коробки, сумочки та кошики'},
    'listivky':    {label:'Листівки',          desc:'Красиві листівки для будь-якого приводу'},
    'sumochky':    {label:'Сумочки квітів',    desc:'Стильні сумочки з квітами'},
};

// При завантаженні — показати по 4 з кожної категорії
document.addEventListener('DOMContentLoaded', function() {
    showCatalogOverview();
    renderColors('Троянди');
});

function showCatalogOverview() {
    // Hide grid on load — user must pick category from dropdown
    document.querySelectorAll('.pc').forEach(card => card.classList.add('hidden'));
    const gridEl  = document.getElementById('pcGrid');
    const emptyEl = document.getElementById('catEmpty');
    const titleEl = document.getElementById('catTitle');
    const descEl  = document.getElementById('catDesc');
    if (gridEl)  gridEl.style.display  = 'none';
    if (emptyEl) emptyEl.style.display = 'none';
    if (titleEl) titleEl.textContent = 'Оберіть категорію';
    if (descEl)  descEl.textContent  = 'Натисніть «Каталог» у меню вище, щоб переглянути товари';
}

function openCat(catId) {
    // Close dropdown
    ['navCatMenu','catArrow'].forEach(id => document.getElementById(id)?.classList.remove('open'));
    document.querySelector('.nav-cat-trigger')?.classList.remove('open');

    const titleEl = document.getElementById('catTitle');
    const descEl  = document.getElementById('catDesc');
    const emptyEl = document.getElementById('catEmpty');
    const gridEl  = document.getElementById('pcGrid');

    const info = catId === 'all'
        ? {label:'Всі категорії', desc:'Весь асортимент Imperial'}
        : (CATS[catId] || {label:catId, desc:''});

    if (titleEl) titleEl.textContent = info.label;
    if (descEl)  descEl.textContent  = info.desc;

    let visible = 0;
    document.querySelectorAll('.pc').forEach(card => {
        const show = catId === 'all' || card.dataset.cat === catId;
        card.classList.toggle('hidden', !show);
        if (show) visible++;
    });

    if (gridEl)  gridEl.style.display  = visible > 0 ? 'grid' : 'none';
    if (emptyEl) emptyEl.style.display = visible === 0 ? 'block' : 'none';

    document.getElementById('catWelcome')?.style && (document.getElementById('catWelcome').style.display = 'none');
    document.getElementById('catalog')?.scrollIntoView({behavior:'smooth', block:'start'});
}

function toggleCatMenu(e) {
    if (e) e.stopPropagation();
    const menu    = document.getElementById('navCatMenu');
    const arrow   = document.getElementById('catArrow');
    const trigger = document.querySelector('.nav-cat-trigger');
    if (!menu) return;
    const isOpen = menu.classList.contains('open');
    if (!isOpen) {
        const rect = trigger.getBoundingClientRect();
        menu.style.left = rect.left + 'px';
        menu.style.top  = (rect.bottom + 6) + 'px';
    }
    menu.classList.toggle('open', !isOpen);
    if (arrow)   arrow.classList.toggle('open', !isOpen);
    if (trigger) trigger.classList.toggle('open', !isOpen);
}

function closeCatMenu() {
    document.getElementById('navCatMenu')?.classList.remove('open');
    document.getElementById('catArrow')?.classList.remove('open');
    document.querySelector('.nav-cat-trigger')?.classList.remove('open');
}

document.addEventListener('click', function(e) {
    const wrap = document.querySelector('.nav-cat-wrap');
    if (wrap && !wrap.contains(e.target)) closeCatMenu();
});

/* ═══════════════════════════════════════════
   CART
   ═══════════════════════════════════════════ */
let cart = [];
let cartMessenger = 'telegram';

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (!sidebar) return;
    const isOpen = sidebar.classList.contains('open');
    sidebar.classList.toggle('open', !isOpen);
    overlay.classList.toggle('open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
}

function addToCart(name) {
    const existing = cart.find(i => i.name === name);
    if (existing) { existing.qty++; } else { cart.push({name, qty:1}); }
    updateCartUI();
    const countEl = document.getElementById('cartCount');
    if (countEl) { countEl.classList.add('bump'); setTimeout(()=>countEl.classList.remove('bump'),400); }
}

function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    updateCartUI();
}

function changeQty(name, delta) {
    const item = cart.find(i => i.name === name);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    updateCartUI();
}

function updateCartUI() {
    const total = cart.reduce((s,i) => s+i.qty, 0);
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = total;

    const itemsEl  = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    if (!itemsEl) return;

    if (cart.length === 0) {
        itemsEl.innerHTML = `<div class="cart-empty"><span>🌸</span><p>Кошик порожній</p><small>Додайте товари, які вам сподобались</small></div>`;
        if (footerEl) footerEl.style.display = 'none';
    } else {
        itemsEl.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQty('${item.name}',-1)">−</button>
                    <span class="qty-num">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${item.name}',1)">+</button>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">×</button>
                </div>
            </div>`).join('');
        if (footerEl) { footerEl.style.display = 'block'; }
        document.getElementById('cartTotalCount').textContent = total;
    }
}

function selectCartMessenger(m) {
    cartMessenger = m;
    document.querySelectorAll('[data-m]').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`[data-m="${m}"]`);
    if (btn) btn.classList.add('active');
    const hint = document.getElementById('cartCopyHint');
    const hintText = document.getElementById('cartCopyHintText');
    if (!hint) return;
    if (m === 'viber' || m === 'instagram') {
        if(hintText) hintText.innerHTML = `Після відкриття ${m==='viber'?'Viber':'Instagram'} — натисніть і утримайте поле вводу та оберіть <b>«Вставити»</b> ✨`;
        hint.style.display = 'flex';
    } else { hint.style.display = 'none'; }
}

function orderFromCart() {
    if (cart.length === 0) return;
    const lines = cart.map(i => i.qty > 1 ? `• ${i.name} — ${i.qty} шт.` : `• ${i.name}`).join('\n');
    const msg = `Вітаю! 🌸 Хочу оформити замовлення:\n\n${lines}\n\nПідкажіть, будь ласка, актуальну ціну та як оформити?`;
    sendToMessenger(cartMessenger, msg);
    toggleCart();
}

/* Tabs */
function switchTab(tab) {
    document.getElementById('tabCart')?.classList.toggle('active', tab==='cart');
    document.getElementById('tabBuild')?.classList.toggle('active', tab==='build');
    const pc = document.getElementById('panelCart');
    const pb = document.getElementById('panelBuild');
    if (pc) pc.style.display = tab==='cart' ? 'flex' : 'none';
    if (pb) pb.style.display = tab==='build' ? 'flex' : 'none';
}

function openBuildTab() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar && !sidebar.classList.contains('open')) {
        sidebar.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    switchTab('build');
}

/* ═══ BOUQUET BUILDER ═══ */
const FLOWER_COLORS = {
    'Троянди':    [{name:'Червоні',hex:'#c0392b'},{name:'Рожеві',hex:'#e91e8c'},{name:'Білі',hex:'#f5f0eb'},{name:'Кремові',hex:'#f0d9b5'},{name:'Жовті',hex:'#f1c40f'},{name:'Бордові',hex:'#7b1e3a'},{name:'Персикові',hex:'#ffb347'},{name:'Мікс',hex:'linear-gradient(135deg,#e91e8c,#f1c40f,#c0392b)'}],
    'Хризантеми': [{name:'Білі',hex:'#f5f0eb'},{name:'Жовті',hex:'#f1c40f'},{name:'Рожеві',hex:'#e91e8c'},{name:'Фіолетові',hex:'#8e44ad'},{name:'Кремові',hex:'#f0d9b5'},{name:'Мікс',hex:'linear-gradient(135deg,#f5f0eb,#f1c40f,#e91e8c)'}],
    'Тюльпани':   [{name:'Червоні',hex:'#c0392b'},{name:'Рожеві',hex:'#e91e8c'},{name:'Білі',hex:'#f5f0eb'},{name:'Жовті',hex:'#f1c40f'},{name:'Фіолетові',hex:'#8e44ad'},{name:'Помаранчеві',hex:'#e67e22'},{name:'Мікс',hex:'linear-gradient(135deg,#c0392b,#f1c40f,#e91e8c)'}]
};
let currentFlowerType='Троянди', currentColor=null, customQty=1, customFlowers=[], buildMessenger='telegram';

function renderColors(type) {
    const grid = document.getElementById('colorGrid');
    if (!grid) return;
    const colors = FLOWER_COLORS[type] || [];
    grid.innerHTML = colors.map(c => {
        const dot = c.hex.startsWith('linear') ? `background:${c.hex};border:none;` : `background:${c.hex};`;
        return `<button class="color-chip${currentColor===c.name?' active':''}" onclick="selectColor('${c.name}')" data-color="${c.name}"><span class="color-dot" style="${dot}"></span>${c.name}</button>`;
    }).join('');
}

function selectFlowerType(btn) {
    document.querySelectorAll('.flower-type-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentFlowerType = btn.dataset.type;
    currentColor = null;
    renderColors(currentFlowerType);
}

function selectColor(name) {
    currentColor = name;
    document.querySelectorAll('.color-chip').forEach(c=>c.classList.toggle('active', c.dataset.color===name));
}

function changeCustomQty(delta) {
    customQty = Math.max(1, Math.min(999, customQty+delta));
    const el = document.getElementById('customQty');
    if (el) el.textContent = customQty;
}

function addCustomFlower() {
    if (!currentColor) return;
    customFlowers.push({type:currentFlowerType, color:currentColor, qty:customQty});
    renderCustomList();
    currentColor=null; customQty=1;
    const el=document.getElementById('customQty'); if(el) el.textContent='1';
    document.querySelectorAll('.color-chip').forEach(c=>c.classList.remove('active'));
}

function removeCustomFlower(idx) { customFlowers.splice(idx,1); renderCustomList(); }

function renderCustomList() {
    const section=document.getElementById('customListSection');
    const list=document.getElementById('customList');
    const footer=document.getElementById('buildFooter');
    const empty=document.getElementById('buildEmpty');
    if (!list) return;
    if (customFlowers.length===0) {
        if(section) section.style.display='none';
        if(footer) footer.style.display='none';
        if(empty) empty.style.display='flex';
        return;
    }
    if(section) section.style.display='block';
    if(footer) footer.style.display='block';
    if(empty) empty.style.display='none';
    list.innerHTML = customFlowers.map((f,i)=>`
        <div class="custom-item">
            <div class="custom-item-info"><div class="custom-item-name">${f.type}</div><div class="custom-item-detail">${f.color} · ${f.qty} шт.</div></div>
            <button class="custom-item-remove" onclick="removeCustomFlower(${i})">×</button>
        </div>`).join('');
}

function selectBuildMessenger(m) {
    buildMessenger=m;
    document.querySelectorAll('[data-bm]').forEach(b=>b.classList.remove('active'));
    const btn=document.querySelector(`[data-bm="${m}"]`); if(btn) btn.classList.add('active');
    const hint=document.getElementById('buildCopyHint');
    const hintText=document.getElementById('buildCopyHintText');
    if(!hint) return;
    if(m==='viber'||m==='instagram'){
        if(hintText) hintText.innerHTML=`Після відкриття ${m==='viber'?'Viber':'Instagram'} — натисніть і утримайте поле та оберіть <b>«Вставити»</b> ✨`;
        hint.style.display='flex';
    } else { hint.style.display='none'; }
}

function orderCustomBouquet() {
    if(customFlowers.length===0) return;
    const note=document.getElementById('customNote')?.value.trim()||'';
    const lines=customFlowers.map(f=>`• ${f.type} (${f.color}) — ${f.qty} шт.`).join('\n');
    let msg=`Вітаю! 🌸 Хочу замовити власний букет:\n\n${lines}`;
    if(note) msg+=`\n\n📝 Побажання: ${note}`;
    msg+=`\n\nПідкажіть актуальну ціну та як оформити замовлення?`;
    sendToMessenger(buildMessenger, msg);
    toggleCart();
}

/* ═══════════════════════════════════════════
   ACCORDION CATALOG
   ═══════════════════════════════════════════ */

function toggleAcc(id) {
    const block = document.getElementById('acc-' + id);
    const body  = document.getElementById('accBody-' + id);
    if (!block || !body) return;
    const isOpen = block.classList.contains('open');
    // Close all others
    document.querySelectorAll('.acc-block').forEach(b => {
        b.classList.remove('open');
        const bodyEl = b.querySelector('.acc-body');
        if (bodyEl) bodyEl.style.display = 'none';
    });
    // Toggle this one
    if (!isOpen) {
        block.classList.add('open');
        body.style.display = 'block';
    }
}

function openAcc(id) {
    closeCatMenu();

    if (id === 'all') {
        // Open all
        document.querySelectorAll('.acc-block').forEach(b => {
            b.classList.add('open');
            const body = b.querySelector('.acc-body');
            if (body) body.style.display = 'block';
        });
    } else {
        toggleAcc(id);
    }
    // Scroll to the block
    const target = id === 'all'
        ? document.getElementById('catalog')
        : document.getElementById('acc-' + id);
    if (target) setTimeout(() => target.scrollIntoView({behavior:'smooth', block:'start'}), 50);
}
