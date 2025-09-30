// modules/AppState.js

const ACTIVE_PROJECT_ID_KEY = 'pemi_activeProjectId';

let activeProjectId = null;

function setActiveProjectId(id) {
    activeProjectId = id;
    if (id !== null) {
        localStorage.setItem(ACTIVE_PROJECT_ID_KEY, id);
    } else {
        localStorage.removeItem(ACTIVE_PROJECT_ID_KEY);
    }
    console.log(`Projeto ativo definido como: ${id}`);
}

function getActiveProjectId() {
    if (activeProjectId === null) {
        const storedId = localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
        if (storedId) {
            // O ID é guardado como string, convertemos para número
            activeProjectId = parseInt(storedId, 10);
        }
    }
    return activeProjectId;
}

export const AppState = {
    setActiveProjectId,
    getActiveProjectId
};