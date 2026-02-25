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
        detail.innerHTML = 'Після відкриття Viber — натисніть і утримайте поле вводу та оберіть <b>«Вставити»</b>.';
        hint.style.display = 'flex';
    } else if (platform === 'instagram') {
        detail.innerHTML = 'Після відкриття Instagram Direct — натисніть і утримайте поле вводу та оберіть <b>«Вставити»</b>.';
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
    document.getElementById('bookingModal').style.display = 'flex';
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
    document.getElementById('bookingModal').style.display = 'flex';
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
    if (event.target == modal) closeModal();
}
