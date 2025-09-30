// modules/app.js
import { Store } from './Store.js';
import { render as renderShell } from './Shell.js';
import { render as renderWelcomeView } from './WelcomeView.js';
import { render as renderAddProjectModal } from './AddProjectModal.js';
import { render as renderAddStoryModal } from './AddStoryModal.js';

import { render as renderBacklog } from './BacklogView.js';
import { render as renderMatrix } from './MatrixView.js';
import { render as renderRoadmap } from './RoadmapView.js';
import { render as renderInbox } from './InboxView.js';

const views = {
    'backlog': renderBacklog,
    'matrix': renderMatrix,
    'roadmap': renderRoadmap,
    'inbox': renderInbox
};
let draggableInstances = [];
let sortableInstances = [];

// --- GESTÃO DE INTERATIVIDADE ESPECÍFICA ---

function cleanupInteractivity() {
    if (draggableInstances.length > 0) {
        draggableInstances.forEach(d => d.kill());
        draggableInstances = [];
    }
    if (sortableInstances.length > 0) {
        sortableInstances.forEach(s => s.destroy());
        sortableInstances = [];
    }
}

function initMatrixInteractivity() {
    const quadrantElements = gsap.utils.toArray('#quadrant-quick-wins, #quadrant-major-projects, #quadrant-fill-ins, #quadrant-consider-dropping');
    
    sortableInstances = quadrantElements.map(quadrant => {
        return Sortable.create(quadrant, {
            group: 'matrix-quadrants',
            animation: 150,
            // LÓGICA DE onEnd SIMPLIFICADA E CORRIGIDA
            onEnd: (evt) => {
                const movedItemId = parseInt(evt.item.dataset.id, 10);
                const toQuadrantId = evt.to.id;
                const fromQuadrantId = evt.from.id;

                const toItems = Array.from(evt.to.querySelectorAll('.story-item')).map((item, index) => ({
                    id: parseInt(item.dataset.id, 10),
                    orderIndex: index
                }));
                
                const fromItems = Array.from(evt.from.querySelectorAll('.story-item')).map((item, index) => ({
                    id: parseInt(item.dataset.id, 10),
                    orderIndex: index
                }));

                // Apenas uma chamada para a nova ação atómica no Store
                Store.actions.handleDropInMatrix({
                    movedItemId,
                    toQuadrantId,
                    fromQuadrantId,
                    toItems,
                    fromItems
                });
            }
        });
    });

    const poolItems = gsap.utils.toArray('#story-pool .story-item');
    const dropTargets = gsap.utils.toArray('.quadrant');

    draggableInstances = Draggable.create(poolItems, {
        onDragStart: function() {
            this.target.classList.add("is-dragging");
        },
        onDragEnd: async function() {
            this.target.classList.remove("is-dragging");
            const storyId = parseInt(this.target.dataset.id, 10);
            let targetQuadrant = null;

            dropTargets.forEach(quad => { if (this.hitTest(quad, "50%")) targetQuadrant = quad; });

            if (targetQuadrant && targetQuadrant.id !== 'story-pool') {
                const quadrantId = targetQuadrant.id;
                const storiesInTarget = Store.state.stories.filter(s => s.quadrant === quadrantId);
                const newOrderIndex = storiesInTarget.length;

                await Store.actions.updateStory(storyId, { 
                    quadrant: quadrantId, 
                    orderIndex: newOrderIndex,
                    position: null
                });
            }
        }
    });
}


// --- GESTOR DE EVENTOS GLOBAL ---
function addGlobalEventListeners() {
    if (document.body.dataset.listenersAttached === 'true') return;

    document.addEventListener('click', async (event) => {
        const target = event.target;
        const action = target.closest('[data-action]')?.dataset.action;
        if (!action) return;

        switch (action) {
            case 'navigate':
                Store.actions.navigateTo(target.closest('[data-view]').dataset.view);
                break;
            case 'select-project':
                const projectId = parseInt(target.closest('[data-id]').dataset.id, 10);
                await Store.actions.selectProject(projectId);
                break;
            case 'show-add-project-modal':
                Store.actions.openModal('addProject');
                break;
            case 'show-add-story-modal':
                Store.actions.openModal('addStory');
                break;
            case 'delete-idea':
                const ideaId = parseInt(target.closest('[data-id]').dataset.id, 10);
                await Store.actions.deleteIdea(ideaId);
                break;
            case 'close-modal':
                Store.actions.closeModal();
                break;
            case 'toggle-project-dropdown':
                document.getElementById('project-dropdown')?.classList.toggle('hidden');
                break;
        }
    });

    document.addEventListener('submit', async (event) => {
        event.preventDefault();
        const target = event.target;
        const action = target.dataset.action;
        if (!action) return;

        switch (action) {
            case 'create-project':
                const projectName = new FormData(target).get('projectName').trim();
                if (projectName) {
                    await Store.actions.addNewProject({ name: projectName, createdAt: new Date().toISOString() });
                }
                break;
            case 'create-story':
                const formData = new FormData(target);
                const storyData = { como: formData.get('como'), quero: formData.get('quero'), para_que: formData.get('para_que'), createdAt: new Date().toISOString() };
                await Store.actions.addNewStory(storyData);
                break;
            case 'add-idea':
                const ideaText = new FormData(target).get('ideaText').trim();
                if (ideaText) {
                    await Store.actions.addNewIdea({ text: ideaText, createdAt: new Date().toISOString() });
                    target.reset();
                }
                break;
        }
    });

    document.body.dataset.listenersAttached = 'true';
}

// --- FUNÇÃO DE RENDERIZAÇÃO PRINCIPAL ---
function renderApp(state) {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    cleanupInteractivity();

    let baseHTML = '';
    if (state.activeProject) {
        baseHTML = renderShell(state);
    } else {
        baseHTML = renderWelcomeView(state);
    }

    let modalHTML = '';
    if (state.activeModal === 'addProject') {
        modalHTML = renderAddProjectModal(state);
    } else if (state.activeModal === 'addStory') {
        modalHTML = renderAddStoryModal(state);
    }
    
    appContainer.innerHTML = baseHTML + modalHTML;

    if (state.activeProject) {
        const viewContainer = document.getElementById('view-container');
        const renderCurrentView = views[state.currentView];
        if (renderCurrentView && viewContainer) {
            renderCurrentView(viewContainer, state);
            if (state.currentView === 'matrix') {
                initMatrixInteractivity();
            }
        }
    }
    
    addGlobalEventListeners();
}

// --- INICIALIZAÇÃO ---
async function initialize() {
    Store.subscribe(renderApp);
    await Store.actions.initialize();
    console.log("pemi inicializado com arquitetura State-Driven finalizada.");
}

initialize();