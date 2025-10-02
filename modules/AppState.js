// modules/AppState.js

const ACTIVE_PROJECT_ID_KEY = 'pemi_activeProjectId'; // <-- Chave para o localStorage

let activeProjectId = null;

function setActiveProjectId(id) {
    activeProjectId = id;
    // <-- ADICIONADO: Guarda o ID no localStorage -->
    if (id !== null) {
        localStorage.setItem(ACTIVE_PROJECT_ID_KEY, id);
    } else {
        localStorage.removeItem(ACTIVE_PROJECT_ID_KEY);
    }
    console.log(`Projeto ativo definido e guardado como: ${id}`);
}

function getActiveProjectId() {
    // Tenta primeiro ler da memória, depois do localStorage
    if (activeProjectId !== null) return activeProjectId;

    // <-- ADICIONADO: Lê o ID do localStorage se não estiver em memória -->
    const storedId = localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
    if (storedId) {
        activeProjectId = parseInt(storedId, 10);
        return activeProjectId;
    }

    return null;
}

export const AppState = {
    setActiveProjectId,
    getActiveProjectId
};