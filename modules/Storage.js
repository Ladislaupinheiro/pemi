// modules/Storage.js

const DB_NAME = 'pemi_DB';
const DB_VERSION = 4;
const PROJECT_STORE_NAME = 'projects';
const STORY_STORE_NAME = 'backlog';
const INBOX_STORE_NAME = 'inbox';
let db;

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const dbInstance = event.target.result;
            const transaction = event.target.transaction;

            if (!dbInstance.objectStoreNames.contains(PROJECT_STORE_NAME)) {
                dbInstance.createObjectStore(PROJECT_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }

            let storyStore;
            if (!dbInstance.objectStoreNames.contains(STORY_STORE_NAME)) {
                storyStore = dbInstance.createObjectStore(STORY_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            } else {
                storyStore = transaction.objectStore(STORY_STORE_NAME);
            }
            if (!storyStore.indexNames.contains('projectId')) {
                storyStore.createIndex('projectId', 'projectId', { unique: false });
            }

            let inboxStore;
            if (!dbInstance.objectStoreNames.contains(INBOX_STORE_NAME)) {
                inboxStore = dbInstance.createObjectStore(INBOX_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            } else {
                inboxStore = transaction.objectStore(INBOX_STORE_NAME);
            }
            if (!inboxStore.indexNames.contains('projectId')) {
                inboxStore.createIndex('projectId', 'projectId', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log(`Base de dados aberta com sucesso na versão ${DB_VERSION}.`);
            resolve(db);
        };
        request.onerror = (event) => reject(event.target.error);
    });
}

function addProject(projectData) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PROJECT_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(PROJECT_STORE_NAME);
        const request = store.add(projectData);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function getAllProjects() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PROJECT_STORE_NAME], 'readonly');
        const store = transaction.objectStore(PROJECT_STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

// NOVA FUNÇÃO PARA ATUALIZAR UM PROJETO
function updateProject(projectId, updatedProperties) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PROJECT_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(PROJECT_STORE_NAME);
        const getRequest = store.get(projectId);
        getRequest.onsuccess = () => {
            const project = getRequest.result;
            if (project) {
                Object.assign(project, updatedProperties);
                const putRequest = store.put(project);
                putRequest.onsuccess = () => resolve(putRequest.result);
                putRequest.onerror = (event) => reject(event.target.error);
            } else {
                reject(`Projeto com ID ${projectId} não encontrado.`);
            }
        };
        getRequest.onerror = (event) => reject(event.target.error);
    });
}

function deleteProject(projectId) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PROJECT_STORE_NAME, STORY_STORE_NAME, INBOX_STORE_NAME], 'readwrite');
        const projectStore = transaction.objectStore(PROJECT_STORE_NAME);
        const storyStore = transaction.objectStore(STORY_STORE_NAME);
        const inboxStore = transaction.objectStore(INBOX_STORE_NAME);

        projectStore.delete(projectId);

        const storyIndex = storyStore.index('projectId');
        const storyRequest = storyIndex.openCursor(IDBKeyRange.only(projectId));
        storyRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                storyStore.delete(cursor.primaryKey);
                cursor.continue();
            }
        };

        const inboxIndex = inboxStore.index('projectId');
        const inboxRequest = inboxIndex.openCursor(IDBKeyRange.only(projectId));
        inboxRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                inboxStore.delete(cursor.primaryKey);
                cursor.continue();
            }
        };
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(event.target.error);
    });
}


function addStory(storyData, projectId) {
    storyData.projectId = projectId;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORY_STORE_NAME);
        const request = store.add(storyData);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function getAllStories(projectId) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORY_STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORY_STORE_NAME);
        const index = store.index('projectId');
        const request = index.getAll(projectId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function updateStory(storyId, updatedProperties) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORY_STORE_NAME);
        const getRequest = store.get(storyId);
        getRequest.onsuccess = () => {
            const story = getRequest.result;
            if (story) {
                Object.assign(story, updatedProperties);
                const putRequest = store.put(story);
                putRequest.onsuccess = () => resolve(putRequest.result);
                putRequest.onerror = (event) => reject(event.target.error);
            } else { reject(`História com ID ${storyId} não encontrada.`); }
        };
        getRequest.onerror = (event) => reject(event.target.error);
    });
}

function deleteStory(storyId) {
    return new Promise((resolve, reject) => {
       const transaction = db.transaction([STORY_STORE_NAME], 'readwrite');
       const store = transaction.objectStore(STORY_STORE_NAME);
       const request = store.delete(storyId);
       request.onsuccess = () => resolve();
       request.onerror = (event) => reject(event.target.error);
   });
}

function addIdea(ideaData, projectId) {
    ideaData.projectId = projectId;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([INBOX_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(INBOX_STORE_NAME);
        const request = store.add(ideaData);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function getAllIdeas(projectId) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([INBOX_STORE_NAME], 'readonly');
        const store = transaction.objectStore(INBOX_STORE_NAME);
        const index = store.index('projectId');
        const request = index.getAll(projectId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function deleteIdea(ideaId) {
     return new Promise((resolve, reject) => {
        const transaction = db.transaction([INBOX_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(INBOX_STORE_NAME);
        const request = store.delete(ideaId);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
}

export const Storage = {
    initDB,
    addProject,
    getAllProjects,
    updateProject, // <-- Exportar a nova função
    deleteProject,
    addStory,
    getAllStories,
    updateStory,
    deleteStory,
    addIdea,
    getAllIdeas,
    deleteIdea
};