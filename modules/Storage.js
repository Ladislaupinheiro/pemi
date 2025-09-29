// modules/Storage.js

const DB_NAME = 'pemi_DB';
const DB_VERSION = 2;
const STORY_STORE_NAME = 'backlog';
const INBOX_STORE_NAME = 'inbox';
let db;

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const dbInstance = event.target.result;
            if (!dbInstance.objectStoreNames.contains(STORY_STORE_NAME)) {
                dbInstance.createObjectStore(STORY_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
            if (!dbInstance.objectStoreNames.contains(INBOX_STORE_NAME)) {
                dbInstance.createObjectStore(INBOX_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Base de dados aberta com sucesso na versão 2.');
            resolve(db);
        };

        request.onerror = (event) => {
            console.error('Erro ao abrir a base de dados:', event.target.error);
            reject(event.target.error);
        };
    });
}

// --- Funções para User Stories (Backlog) ---
function addStory(storyData) {
    return new Promise((resolve, reject) => {
        if (!db) return reject('A base de dados não foi inicializada.');
        const transaction = db.transaction([STORY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORY_STORE_NAME);
        const request = store.add(storyData);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function getAllStories() {
    return new Promise((resolve, reject) => {
        if (!db) return reject('A base de dados não foi inicializada.');
        const transaction = db.transaction([STORY_STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORY_STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

// **NOVA FUNÇÃO**
function updateStory(storyId, updatedProperties) {
    return new Promise((resolve, reject) => {
        if (!db) return reject('A base de dados não foi inicializada.');
        const transaction = db.transaction([STORY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORY_STORE_NAME);
        const getRequest = store.get(storyId);

        getRequest.onsuccess = () => {
            const story = getRequest.result;
            if (story) {
                // Funde as propriedades antigas com as novas
                Object.assign(story, updatedProperties);
                const putRequest = store.put(story);
                putRequest.onsuccess = () => resolve(putRequest.result);
                putRequest.onerror = (event) => reject(event.target.error);
            } else {
                reject(`História com ID ${storyId} não encontrada.`);
            }
        };
        getRequest.onerror = (event) => reject(event.target.error);
    });
}


// --- Funções para Ideias (Inbox) ---
function addIdea(ideaData) {
    return new Promise((resolve, reject) => {
        if (!db) return reject('A base de dados não foi inicializada.');
        const transaction = db.transaction([INBOX_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(INBOX_STORE_NAME);
        const request = store.add(ideaData);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function getAllIdeas() {
    return new Promise((resolve, reject) => {
        if (!db) return reject('A base de dados não foi inicializada.');
        const transaction = db.transaction([INBOX_STORE_NAME], 'readonly');
        const store = transaction.objectStore(INBOX_STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function deleteIdea(ideaId) {
     return new Promise((resolve, reject) => {
        if (!db) return reject('A base de dados não foi inicializada.');
        const transaction = db.transaction([INBOX_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(INBOX_STORE_NAME);
        const request = store.delete(ideaId);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
}


export const Storage = {
    initDB,
    addStory,
    getAllStories,
    updateStory, // Exporta a nova função
    addIdea,
    getAllIdeas,
    deleteIdea
};