const CACHE_NAME = 'pemi-cache-v1';
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'manifest.json',
    'modules/app.js',
    'icons/icon-192p.png',
    'icons/icon-512p.png'
];

// Evento de Instalação: Guarda os ficheiros do App Shell no cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de Fetch: Serve os ficheiros do cache ou da rede
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se o ficheiro for encontrado no cache, retorna-o
                if (response) {
                    return response;
                }
                // Caso contrário, busca na rede
                return fetch(event.request);
            })
    );
});