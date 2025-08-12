// Service Worker para Loja de Utilidades
// Cache Strategy: Cache First with Network Fallback

const CACHE_NAME = 'loja-utilidades-v2.0.0';
const STATIC_CACHE = 'static-v2.0.0';
const DYNAMIC_CACHE = 'dynamic-v2.0.0';

// URLs para cache estático
const STATIC_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// URLs da API para cache dinâmico
const API_CACHE_URLS = [
    '/api/produtos',
    '/api/produtos/categorias/distinct',
    '/api/stats/dashboard'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_URLS);
            })
            .then(() => {
                console.log('Service Worker: Static files cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Error caching static files', error);
            })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Remover caches antigos
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Interceptação de requests
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Estratégia para arquivos estáticos
    if (request.method === 'GET' && isStaticAsset(url.pathname)) {
        event.respondWith(cacheFirst(request));
    }
    
    // Estratégia para API
    else if (request.method === 'GET' && url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(request));
    }
    
    // Estratégia para HTML (SPA)
    else if (request.method === 'GET' && request.headers.get('accept').includes('text/html')) {
        event.respondWith(networkFirst(request));
    }
    
    // Outros requests
    else {
        event.respondWith(fetch(request));
    }
});

// Estratégia Cache First
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Cache First Strategy Error:', error);
        return new Response('Offline content not available', { status: 503 });
    }
}

// Estratégia Network First
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback para páginas HTML
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
        }
        
        return new Response('Offline content not available', { status: 503 });
    }
}

// Verificar se é um asset estático
function isStaticAsset(pathname) {
    return pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json)$/);
}

// Background Sync para pedidos offline
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync-pedidos') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Sincronizar pedidos pendentes
        const db = await openDB();
        const pedidosPendentes = await db.getAll('pedidosPendentes');
        
        for (const pedido of pedidosPendentes) {
            try {
                const response = await fetch('/api/pedidos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(pedido)
                });
                
                if (response.ok) {
                    await db.delete('pedidosPendentes', pedido.id);
                }
            } catch (error) {
                console.error('Error syncing pedido:', error);
            }
        }
    } catch (error) {
        console.error('Background sync error:', error);
    }
}

// Push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nova notificação da Loja de Utilidades',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver produtos',
                icon: '/icons/icon-72x72.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/icons/icon-72x72.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Loja de Utilidades', options)
    );
});

// Click em notificação
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/produtos')
        );
    } else if (event.action === 'close') {
        // Apenas fechar a notificação
    } else {
        // Click na notificação principal
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Função auxiliar para abrir IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('LojaUtilidadesDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Criar store para pedidos pendentes
            if (!db.objectStoreNames.contains('pedidosPendentes')) {
                db.createObjectStore('pedidosPendentes', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
} 