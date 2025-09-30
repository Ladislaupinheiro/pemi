// modules/AppState.js

// A CHAVE DO LOCALSTORAGE FOI REMOVIDA.

let activeProjectId = null;

function setActiveProjectId(id) {
    activeProjectId = id;
    // A LÓGICA DE SALVAR NO LOCALSTORAGE FOI REMOVIDA.
    console.log(`Projeto ativo definido (em memória) como: ${id}`);
}

function getActiveProjectId() {
    // A LÓGICA DE LER DO LOCALSTORAGE FOI REMOVIDA.
    // Simplesmente retorna o valor que está em memória.
    // No início de cada sessão, este valor será sempre 'null'.
    return activeProjectId;
}

export const AppState = {
    setActiveProjectId,
    getActiveProjectId
};