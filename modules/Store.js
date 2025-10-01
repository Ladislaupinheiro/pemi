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
    uiFeedback: { error: null },
    confirmation: {
        isVisible: false,
        message: '',
        confirmAction: null,
        targetId: null
    },
    editingProject: {
        id: null,
        currentName: ''
    },
    editingStory: { // <-- NOVO ESTADO PARA GERIR A EDIÇÃO DE HISTÓRIAS
        id: null,
        data: {}
    }
};

let subscribers = [];

const actions = {
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
            } else {
                AppState.setActiveProjectId(null);
            }
        }
        notify();
    },

    async addNewProject(projectData) {
        const newProjectNameTrimmed = projectData.name.trim().toLowerCase();
        const isDuplicate = state.projects.some(p => p.name.trim().toLowerCase() === newProjectNameTrimmed);
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
    
    showEditProjectModal(project) {
        state.editingProject.id = project.id;
        state.editingProject.currentName = project.name;
        this.openModal('editProject');
    },

    async updateProjectName({ projectId, newName }) {
        const newProjectNameTrimmed = newName.trim().toLowerCase();
        const isDuplicate = state.projects.some(p => p.id !== projectId && p.name.trim().toLowerCase() === newProjectNameTrimmed);
        if (isDuplicate) {
            state.uiFeedback.error = `Já existe um projeto com o nome "${newName.trim()}".`;
            notify();
            return;
        }
        await Storage.updateProject(projectId, { name: newName.trim() });
        this.closeModal();
        await this.loadProjectData();
    },
    
    async confirmDeleteProject() {
        const projectIdToDelete = state.confirmation.targetId;
        if (!projectIdToDelete) return;
        const isDeletingActiveProject = state.activeProject?.id === projectIdToDelete;
        await Storage.deleteProject(projectIdToDelete);
        this.hideConfirmation();
        if (isDeletingActiveProject) {
            AppState.setActiveProjectId(null);
        }
        await this.loadProjectData();
    },

    async selectProject(projectId) {
        AppState.setActiveProjectId(projectId);
        await this.loadProjectData();
    },

    navigateTo(viewName) {
        state.currentView = viewName;
        notify();
    },

    // --- AÇÕES DE CRUD DE HISTÓRIAS ---
    async addNewStory(storyData) {
        const projectId = AppState.getActiveProjectId();
        await Storage.addStory(storyData, projectId);
        actions.closeModal();
        await this.loadProjectData();
    },

    showEditStoryModal(story) {
        state.editingStory.id = story.id;
        state.editingStory.data = { ...story };
        this.openModal('editStory');
    },

    async updateStory(storyData) {
        // Agora esta ação é mais genérica para lidar com qualquer atualização
        await Storage.updateStory(storyData.id, storyData);
        this.closeModal(); // Fecha o modal de edição
        await this.loadProjectData();
    },

    async confirmDeleteStory() {
        const storyIdToDelete = state.confirmation.targetId;
        if (!storyIdToDelete) return;
        await Storage.deleteStory(storyIdToDelete);
        this.hideConfirmation();
        await this.loadProjectData();
    },

    async handleDropInMatrix(updateInfo) {
        const { movedItemId, toQuadrantId, fromQuadrantId, toItems, fromItems } = updateInfo;
        await Storage.updateStory(movedItemId, { quadrant: toQuadrantId });
        for (const item of toItems) { await Storage.updateStory(item.id, { orderIndex: item.orderIndex }); }
        if (fromQuadrantId !== toQuadrantId) {
            for (const item of fromItems) { await Storage.updateStory(item.id, { orderIndex: item.orderIndex }); }
        }
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
        state.editingProject.id = null;
        state.editingProject.currentName = '';
        state.editingStory.id = null; // Limpa o estado de edição de história
        state.editingStory.data = {};
        notify();
    },

    showConfirmation({ message, confirmAction, targetId }) {
        state.confirmation.isVisible = true;
        state.confirmation.message = message;
        state.confirmation.confirmAction = confirmAction;
        state.confirmation.targetId = targetId;
        notify();
    },

    hideConfirmation() {
        state.confirmation.isVisible = false;
        state.confirmation.message = '';
        state.confirmation.confirmAction = null;
        state.confirmation.targetId = null;
        notify();
    }
};

function subscribe(callback) {
    subscribers.push(callback);
    return () => { subscribers = subscribers.filter(sub => sub !== callback); };
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