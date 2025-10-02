// modules/app.js
import { Store } from './Store.js';
import { render as renderShell } from './Shell.js';
import { render as renderWelcomeView } from './WelcomeView.js';
import { render as renderAddProjectModal } from './AddProjectModal.js';
import { render as renderEditProjectModal } from './EditProjectModal.js';
import { render as renderAddStoryModal } from './AddStoryModal.js';
import { render as renderEditStoryModal } from './EditStoryModal.js';
import { render as renderAddIdeaModal } from './AddIdeaModal.js';
import { render as renderEditIdeaModal } from './EditIdeaModal.js';
import { render as renderConfirmationModal } from './ConfirmationModal.js';
import { render as renderEditProfileModal } from './EditProfileModal.js'; // Importação do novo modal

import { render as renderDashboard } from './DashboardView.js'; // Importação da nova vista
import { render as renderBacklog } from './BacklogView.js';
import { render as renderMatrix } from './MatrixView.js';
import { render as renderRoadmap } from './RoadmapView.js';

const views = {
    'dashboard': renderDashboard, // Adicionada a nova vista
    'backlog': renderBacklog,
    'matrix': renderMatrix,
    'roadmap': renderRoadmap
};

let draggableInstances = [];
let sortableInstances = [];
let backlogSwiper = null;

function cleanupInteractivity() {
    if (draggableInstances.length > 0) { draggableInstances.forEach(d => d.kill()); draggableInstances = []; }
    if (sortableInstances.length > 0) { sortableInstances.forEach(s => s.destroy()); sortableInstances = []; }
    if (backlogSwiper) { backlogSwiper.destroy(true, true); backlogSwiper = null; }
}

function initDashboardInteractivity() {
    // Animação de entrada para a saudação
    gsap.from('.dashboard-greeting', {
        duration: 0.5,
        opacity: 0,
        y: -20,
        ease: 'power2.out'
    });
    // Animação stagger para os cards de projeto
    gsap.from('.project-card', {
        duration: 0.5,
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2
    });
}

function initBacklogInteractivity() {
    const fab = document.getElementById('fab-add-button');

    backlogSwiper = new Swiper('.backlog-swiper', {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 16,
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        on: {
            slideChange: function () {
                if (fab) {
                    fab.dataset.action = this.activeIndex === 0 
                        ? 'show-add-story-modal' 
                        : 'show-add-idea-modal';
                }
            }
        }
    });
}

function initMatrixInteractivity() {
    const quadrantElements = gsap.utils.toArray('#quadrant-quick-wins, #quadrant-major-projects, #quadrant-fill-ins, #quadrant-consider-dropping');
    sortableInstances = quadrantElements.map(quadrant => {
        return Sortable.create(quadrant, {
            group: 'matrix-quadrants', animation: 150,
            onEnd: (evt) => {
                const movedItemId = parseInt(evt.item.dataset.id, 10);
                const toQuadrantId = evt.to.id;
                const fromQuadrantId = evt.from.id;
                const toItems = Array.from(evt.to.querySelectorAll('.story-item')).map((item, index) => ({ id: parseInt(item.dataset.id, 10), orderIndex: index }));
                const fromItems = Array.from(evt.from.querySelectorAll('.story-item')).map((item, index) => ({ id: parseInt(item.dataset.id, 10), orderIndex: index }));
                Store.actions.handleDropInMatrix({ movedItemId, toQuadrantId, fromQuadrantId, toItems, fromItems });
            }
        });
    });
    const poolItems = gsap.utils.toArray('#story-pool .story-item');
    const dropTargets = gsap.utils.toArray('.quadrant');
    draggableInstances = Draggable.create(poolItems, {
        onDragStart: function() { this.target.classList.add("is-dragging"); },
        onDragEnd: async function() {
            this.target.classList.remove("is-dragging");
            const storyId = parseInt(this.target.dataset.id, 10);
            let targetQuadrant = null;
            dropTargets.forEach(quad => { if (this.hitTest(quad, "50%")) targetQuadrant = quad; });
            if (targetQuadrant && targetQuadrant.id !== 'story-pool') {
                const quadrantId = targetQuadrant.id;
                const storiesInTarget = Store.state.stories.filter(s => s.quadrant === quadrantId);
                const newOrderIndex = storiesInTarget.length;
                await Store.actions.updateStory({ id: storyId, quadrant: quadrantId, orderIndex: newOrderIndex });
            }
        }
    });
}

function addGlobalEventListeners() {
    if (document.body.dataset.listenersAttached === 'true') return;
    document.addEventListener('click', async (event) => {
        const actionTarget = event.target.closest('[data-action]');
        if (!actionTarget) {
            document.querySelectorAll('[id^="project-menu-"], [id^="story-menu-"], [id^="idea-menu-"], #profile-menu, #project-dropdown').forEach(menu => menu.classList.add('hidden'));
            return;
        }
        const action = actionTarget.dataset.action;

        if (!action.startsWith('toggle-')) {
            document.querySelectorAll('[id^="project-menu-"], [id^="story-menu-"], [id^="idea-menu-"], #profile-menu, #project-dropdown').forEach(menu => menu.classList.add('hidden'));
        }

        switch (action) {
            case 'navigate': Store.actions.navigateTo(actionTarget.dataset.view); break;
            case 'select-project': await Store.actions.selectProject(parseInt(actionTarget.dataset.id, 10)); break;
            case 'show-add-project-modal': Store.actions.openModal('addProject'); break;
            case 'show-edit-project-modal':
                const projectToEditId = parseInt(actionTarget.dataset.id, 10);
                const projectToEdit = Store.state.projects.find(p => p.id === projectToEditId);
                if (projectToEdit) Store.actions.showEditProjectModal(projectToEdit);
                break;
            case 'show-add-story-modal': Store.actions.openModal('addStory'); break;
            case 'show-edit-story-modal':
                const storyToEdit = Store.state.stories.find(s => s.id === parseInt(actionTarget.dataset.id, 10));
                if (storyToEdit) Store.actions.showEditStoryModal(storyToEdit);
                break;
            case 'show-add-idea-modal': Store.actions.openModal('addIdea'); break;
            case 'show-edit-idea-modal':
                const ideaToEdit = Store.state.ideas.find(i => i.id === parseInt(actionTarget.dataset.id, 10));
                if (ideaToEdit) Store.actions.showEditIdeaModal(ideaToEdit);
                break;
            case 'show-edit-profile-modal':
                Store.actions.showEditProfileModal();
                break;
            case 'promote-idea':
                const ideaToPromote = Store.state.ideas.find(i => i.id === parseInt(actionTarget.dataset.id, 10));
                if(ideaToPromote) Store.actions.promoteIdea(ideaToPromote);
                break;
            case 'close-modal': Store.actions.closeModal(); break;
            case 'toggle-project-dropdown': document.getElementById('project-dropdown')?.classList.toggle('hidden'); break;
            case 'toggle-profile-menu': document.getElementById('profile-menu')?.classList.toggle('hidden'); break;
            case 'toggle-theme': await Store.actions.toggleTheme(); break;
            case 'hideConfirmation': Store.actions.hideConfirmation(); break;
            case 'confirmDeleteProject': await Store.actions.confirmDeleteProject(); break;
            case 'confirmDeleteStory': await Store.actions.confirmDeleteStory(); break;
            case 'confirmDeleteIdea': await Store.actions.confirmDeleteIdea(); break;
            case 'toggle-project-menu':
                const projectMenuId = `project-menu-${actionTarget.dataset.id}`;
                document.getElementById(projectMenuId)?.classList.toggle('hidden');
                break;
            case 'toggle-story-menu':
                const storyMenuId = `story-menu-${actionTarget.dataset.id}`;
                document.getElementById(storyMenuId)?.classList.toggle('hidden');
                break;
            case 'toggle-idea-menu':
                const ideaMenuId = `idea-menu-${actionTarget.dataset.id}`;
                document.getElementById(ideaMenuId)?.classList.toggle('hidden');
                break;
            case 'show-delete-project-confirmation':
                const projectId = parseInt(actionTarget.dataset.id, 10);
                const projectName = actionTarget.dataset.name;
                Store.actions.showConfirmation({ message: `Tem a certeza que deseja eliminar o projeto "${projectName}"? Todos os seus dados serão perdidos.`, confirmAction: 'confirmDeleteProject', targetId: projectId });
                break;
            case 'show-delete-story-confirmation':
                const storyId = parseInt(actionTarget.dataset.id, 10);
                Store.actions.showConfirmation({ message: `Tem a certeza que deseja eliminar esta história?`, confirmAction: 'confirmDeleteStory', targetId: storyId });
                break;
            case 'show-delete-idea-confirmation':
                const ideaId = parseInt(actionTarget.dataset.id, 10);
                Store.actions.showConfirmation({ message: `Tem a certeza que deseja eliminar esta ideia?`, confirmAction: 'confirmDeleteIdea', targetId: ideaId });
                break;
        }
    });

    document.addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const action = form.dataset.action;
        if (!action) return;
        const formData = new FormData(form);

        switch (action) {
            case 'create-project':
                const projectName = formData.get('projectName').trim();
                if (projectName) { await Store.actions.addNewProject({ name: projectName, createdAt: new Date().toISOString() }); }
                break;
            case 'update-project':
                const projectIdToUpdate = parseInt(formData.get('projectId'), 10);
                const newName = formData.get('newProjectName').trim();
                if (projectIdToUpdate && newName) { await Store.actions.updateProjectName({ projectId: projectIdToUpdate, newName }); }
                break;
            case 'create-story':
                const storyData = { como: formData.get('como').trim(), quero: formData.get('quero').trim(), para_que: formData.get('para_que').trim(), createdAt: new Date().toISOString() };
                await Store.actions.addNewStory(storyData);
                break;
            case 'update-story':
                const updatedStoryData = { id: parseInt(formData.get('id'), 10), como: formData.get('como').trim(), quero: formData.get('quero').trim(), para_que: formData.get('para_que').trim() };
                await Store.actions.updateStory(updatedStoryData);
                break;
            case 'add-idea':
                const ideaText = formData.get('ideaText').trim();
                if (ideaText) { await Store.actions.addNewIdea({ text: ideaText, createdAt: new Date().toISOString() }); }
                break;
            case 'update-idea':
                const ideaId = parseInt(formData.get('id'), 10);
                const updatedIdeaText = formData.get('text').trim();
                if (ideaId && updatedIdeaText) { await Store.actions.updateIdea({ id: ideaId, text: updatedIdeaText }); }
                break;
            case 'update-profile': {
                const name = formData.get('name').trim();
                const role = formData.get('role').trim();
                const photoFile = form.querySelector('#photo-upload').files[0];
                
                const profileData = { name, role };

                if (photoFile) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        profileData.photo = reader.result; // Base64 URL
                        Store.actions.updateUserProfile(profileData);
                    };
                    reader.readAsDataURL(photoFile);
                } else {
                    Store.actions.updateUserProfile(profileData);
                }
                break;
            }
        }
    });

    document.body.dataset.listenersAttached = 'true';
}

function renderApp(state) {
    if (state.userProfile.theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    const appContainer = document.getElementById('app');
    if (!appContainer) return;
    cleanupInteractivity();

    let baseHTML = '';
    if (state.projects.length === 0 && !state.activeProject) {
        baseHTML = renderWelcomeView(state);
    } else {
        baseHTML = renderShell(state);
    }

    let modalHTML = '';
    if (state.activeModal === 'addProject') { modalHTML = renderAddProjectModal(state); } 
    else if (state.activeModal === 'editProject') { modalHTML = renderEditProjectModal(state); } 
    else if (state.activeModal === 'addStory') { modalHTML = renderAddStoryModal(state); } 
    else if (state.activeModal === 'editStory') { modalHTML = renderEditStoryModal(state); }
    else if (state.activeModal === 'addIdea') { modalHTML = renderAddIdeaModal(state); } 
    else if (state.activeModal === 'editIdea') { modalHTML = renderEditIdeaModal(state); }
    else if (state.activeModal === 'editProfile') { modalHTML = renderEditProfileModal(state); }
    
    let confirmationModalHTML = '';
    if (state.confirmation.isVisible) { confirmationModalHTML = renderConfirmationModal(state); }
    
    appContainer.innerHTML = baseHTML + modalHTML + confirmationModalHTML;
    
    const viewContainer = document.getElementById('view-container');
    const renderCurrentView = views[state.currentView];
    if (renderCurrentView && viewContainer) {
        renderCurrentView(viewContainer, state);
        
        if (state.currentView === 'dashboard') { initDashboardInteractivity(); }
        if (state.currentView === 'backlog') { initBacklogInteractivity(); }
        if (state.currentView === 'matrix') { initMatrixInteractivity(); }
    }
    
    addGlobalEventListeners();
}

async function initialize() {
    Store.subscribe(renderApp);
    await Store.actions.initialize();
    console.log("pemi inicializado com arquitetura State-Driven finalizada.");
}

initialize();