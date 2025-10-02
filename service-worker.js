/**
 * @file Service Worker da Aplicação pemi
 * @description Gere o cache de recursos para funcionalidade offline (Estratégia: Network-First).
 * @version 3.0
 */

const CACHE_NAME = 'pemi-cache-v3'; // VERSÃO DO CACHE ATUALIZADA

// Lista completa e ATUALIZADA de URLs a serem cacheadas.
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './manifest.json',
    './icons/icon-192p.png',
    './icons/icon-512p.png',
    // Módulos JavaScript
    './modules/app.js',
    './modules/Storage.js',
    './modules/Store.js',
    './modules/Shell.js',
    './modules/WelcomeView.js',
    './modules/BacklogView.js',
    './modules/MatrixView.js',
    './modules/RoadmapView.js',
    './modules/AddProjectModal.js',
    './modules/EditProjectModal.js',
    './modules/AddStoryModal.js',
    './modules/EditStoryModal.js',
    './modules/AddIdeaModal.js',
    './modules/EditIdeaModal.js',
    './modules/ConfirmationModal.js'
    // O ficheiro InboxView.js foi removido.
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto e a guardar recursos da nova versão.');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: A limpar cache antiga:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                return caches.match(event.request).then(response => {
                    return response || new Response("Conteúdo não disponível offline.", {
                        status: 404,
                        statusText: "Offline"
                    });
                });
            })
    );
});