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
    editingStory: {
        id: null,
        data: {}
    },
    editingIdea: { // <-- NOVO ESTADO PARA GERIR EDIÇÃO DE IDEIAS
        id: null,
        text: ''
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

    // --- AÇÕES DE PROJETO ---
    async addNewProject(projectData) {
        const newProjectNameTrimmed = projectData.name.trim().toLowerCase();
        const isDuplicate = state.projects.some(p => p.name.trim().toLowerCase() === newProjectNameTrimmed);
        if (isDuplicate) {
            state.uiFeedback.error = `Já existe um projeto com o nome "${projectData.name.trim()}".`;
            notify();
            return;
        }
        const newProjectId = await Storage.addProject(projectData);
        await actions.selectProject(newProjectId); // Seleciona o novo projeto
        actions.closeModal();
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

    // --- AÇÕES DE HISTÓRIA (STORY) ---
    async addNewStory(storyData) {
        const projectId = AppState.getActiveProjectId();
        if(!projectId) return;

        // Se a história veio da promoção de uma ideia, apaga a ideia original
        if (storyData.promotedFromIdeaId) {
            await Storage.deleteIdea(storyData.promotedFromIdeaId);
        }

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
        await Storage.updateStory(storyData.id, storyData);
        this.closeModal();
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

    // --- AÇÕES DE IDEIA ---
    async addNewIdea(ideaData) {
        const projectId = AppState.getActiveProjectId();
        if(!projectId) return;
        await Storage.addIdea(ideaData, projectId);
        this.closeModal();
        await this.loadProjectData();
    },
    
    promoteIdea(idea) {
        // Prepara o estado para abrir o modal de 'AddStory' com dados da ideia
        state.editingStory.data = {
            quero: idea.text,
            promotedFromIdeaId: idea.id // Guarda o ID para apagar depois
        };
        this.openModal('addStory');
    },

    showEditIdeaModal(idea) {
        state.editingIdea.id = idea.id;
        state.editingIdea.text = idea.text;
        this.openModal('editIdea');
    },

    async updateIdea(ideaData) {
        await Storage.updateIdea(ideaData.id, { text: ideaData.text });
        this.closeModal();
        await this.loadProjectData();
    },

    async confirmDeleteIdea() {
        const ideaIdToDelete = state.confirmation.targetId;
        if (!ideaIdToDelete) return;
        await Storage.deleteIdea(ideaIdToDelete);
        this.hideConfirmation();
        await this.loadProjectData();
    },

    // --- AÇÕES GENÉRICAS DE UI ---
    openModal(modalName) {
        state.activeModal = modalName;
        state.uiFeedback.error = null;
        notify();
    },

    closeModal() {
        state.activeModal = null;
        state.uiFeedback.error = null;
        state.editingProject = { id: null, currentName: '' };
        state.editingStory = { id: null, data: {} };
        state.editingIdea = { id: null, text: '' };
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
        state.confirmation = { isVisible: false, message: '', confirmAction: null, targetId: null };
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