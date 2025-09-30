// modules/Store.js
import { Storage } from './Storage.js';
import { AppState } from './AppState.js';

const state = {
    projects: [],
    activeProject: null,
    stories: [],
    ideas: [],
    currentView: 'backlog',
    activeModal: null,
    uiFeedback: { error: null }
};

let subscribers = [];

const actions = {
    // ... (as ações initialize, loadProjectData, addNewProject, etc. permanecem iguais)

    async initialize() {
        await Storage.initDB();
        await this.loadProjectData();
    },

    async loadProjectData() {
        const projectId = AppState.getActiveProjectId();
        state.projects = await Storage.getAllProjects();

        if (!projectId) {
            state.activeProject = null;
            state.stories = [];
            state.ideas = [];
        } else {
            state.activeProject = state.projects.find(p => p.id === projectId) || null;
            if (state.activeProject) {
                state.stories = await Storage.getAllStories(projectId);
                state.ideas = await Storage.getAllIdeas(projectId);
            }
        }
        notify();
    },

    async addNewProject(projectData) {
        const newProjectNameTrimmed = projectData.name.trim().toLowerCase();
        
        const isDuplicate = state.projects.some(
            project => project.name.trim().toLowerCase() === newProjectNameTrimmed
        );

        if (isDuplicate) {
            state.uiFeedback.error = `Já existe um projeto com o nome "${projectData.name.trim()}".`;
            notify();
            return; 
        }

        const newProjectId = await Storage.addProject(projectData);
        AppState.setActiveProjectId(newProjectId);
        state.currentView = 'backlog';
        actions.closeModal();
        await this.loadProjectData();
    },

    async selectProject(projectId) {
        AppState.setActiveProjectId(projectId);
        state.currentView = 'backlog';
        await this.loadProjectData();
    },

    navigateTo(viewName) {
        state.currentView = viewName;
        notify();
    },

    async addNewStory(storyData) {
        const projectId = AppState.getActiveProjectId();
        await Storage.addStory(storyData, projectId);
        actions.closeModal();
        await this.loadProjectData();
    },

    async updateStory(storyId, updatedProperties) {
        await Storage.updateStory(storyId, updatedProperties);
        await this.loadProjectData();
    },

    // AÇÃO ATÓMICA E DEFINITIVA PARA GERIR O DRAG-AND-DROP NA MATRIZ
    async handleDropInMatrix(updateInfo) {
        const { movedItemId, toQuadrantId, fromQuadrantId, toItems, fromItems } = updateInfo;

        // 1. Atualiza o quadrante do item movido
        await Storage.updateStory(movedItemId, { quadrant: toQuadrantId });

        // 2. Atualiza a ordem de todos os itens no quadrante de destino
        for (const item of toItems) {
            await Storage.updateStory(item.id, { orderIndex: item.orderIndex });
        }

        // 3. Se foi um movimento entre quadrantes, atualiza a ordem no quadrante de origem
        if (fromQuadrantId !== toQuadrantId) {
            for (const item of fromItems) {
                await Storage.updateStory(item.id, { orderIndex: item.orderIndex });
            }
        }

        // 4. Após TODAS as operações, recarrega o estado e notifica a UI uma única vez.
        await this.loadProjectData();
    },

    async deleteStory(storyId) {
        await Storage.deleteStory(storyId);
        await this.loadProjectData();
    },

    async addNewIdea(ideaData) {
        const projectId = AppState.getActiveProjectId();
        await Storage.addIdea(ideaData, projectId);
        await this.loadProjectData();
    },

    async deleteIdea(ideaId) {
        await Storage.deleteIdea(ideaId);
        await this.loadProjectData();
    },

    openModal(modalName) {
        state.activeModal = modalName;
        state.uiFeedback.error = null;
        notify();
    },

    closeModal() {
        state.activeModal = null;
        state.uiFeedback.error = null;
        notify();
    }
};

function subscribe(callback) {
    subscribers.push(callback);
    return () => {
        subscribers = subscribers.filter(sub => sub !== callback);
    };
}

function notify() {
    subscribers.forEach(callback => callback(state));
}

export const Store = {
    subscribe,
    actions,
    get state() {
        return state;
    }
};