/**
 * @file Service Worker da Aplicação pemi
 * @description Gere o cache de recursos para funcionalidade offline (Estratégia: Network-First).
 * @version 2.0
 */

const CACHE_NAME = 'pemi-cache-v2'; // VERSÃO DO CACHE ATUALIZADA

// Lista completa de URLs a serem cacheadas, com base nos ficheiros do projeto.
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
    './modules/Shell.js',
    './modules/BacklogView.js',
    './modules/MatrixView.js',
    './modules/RoadmapView.js',
    './modules/InboxView.js',
    './modules/AddStoryModal.js'
];

// Evento de Instalação: Guarda os ficheiros do App Shell no cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto e a guardar recursos');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting()) // Força a ativação do novo service worker
    );
});

// Evento de Ativação: Limpa os caches antigos
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
        }).then(() => self.clients.claim()) // Garante controlo imediato das páginas
    );
});

// Evento de Fetch: Estratégia "Network-First, falling back to Cache"
self.addEventListener('fetch', event => {
    // Ignora requisições que não são GET
    if (event.request.method !== 'GET') {
        return;
    }

    // Ignora requisições para extensões do Chrome
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Se a requisição à rede for bem-sucedida, clona a resposta,
                // guarda no cache e retorna a resposta original.
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // Se a rede falhar, tenta obter a resposta do cache.
                return caches.match(event.request).then(response => {
                    return response || new Response("Conteúdo não disponível offline.", {
                        status: 404,
                        statusText: "Offline"
                    });
                });
            })
    );
});