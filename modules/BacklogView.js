// modules/BacklogView.js
import { show as showAddStoryModal } from './AddStoryModal.js';
import { Storage } from './Storage.js';

let viewContainer;
// Guarda as referências aos "ouvintes" para podermos removê-los
const listeners = {
    click: null,
    storyAdded: null
};

async function renderHTML() {
    const stories = await Storage.getAllStories();
    const backlogHTML = `
        <div class="p-4">
            <div id="backlog-list" class="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                ${stories.length > 0 ? stories.map(story => `
                    <div class="bg-white p-4 rounded-lg shadow hover:shadow-xl cursor-pointer transition-shadow h-full flex flex-col justify-between">
                        <div>
                            <p class="font-semibold text-gray-800">${story.quero}</p>
                            <p class="text-sm text-gray-600 mt-1">
                                <strong>Como um</strong> ${story.como}, <strong>para que</strong> ${story.para_que}.
                            </p>
                        </div>
                        <div class="text-xs text-gray-400 mt-2 pt-2 border-t">
                            Criado em: ${new Date(story.createdAt).toLocaleString()}
                        </div>
                    </div>
                `).join('') : ''}
            </div>
            ${stories.length === 0 ? `<div class="text-center text-gray-500 mt-8">Nenhuma história no backlog. Adicione uma!</div>` : ''}
        </div>
        <button id="add-story-fab" class="fixed bottom-20 right-6 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
        </button>
    `;
    viewContainer.innerHTML = backlogHTML;
}

// --- Funções de gestão de eventos ---
function handleFabClick(event) {
    const fab = event.target.closest('#add-story-fab');
    if (fab) {
        showAddStoryModal();
    }
}

function handleStoryAdded() {
    console.log('Evento "storyAdded" detetado no Backlog. A atualizar a vista...');
    if (viewContainer) {
        init(viewContainer);
    }
}

// --- Funções do Ciclo de Vida ---
export async function init(container) {
    if (container) viewContainer = container;
    if (!viewContainer) return;

    await renderHTML();

    // Anexa os "ouvintes" e guarda as suas referências
    listeners.click = handleFabClick;
    listeners.storyAdded = handleStoryAdded;
    viewContainer.addEventListener('click', listeners.click);
    document.addEventListener('storyAdded', listeners.storyAdded);

    console.log("BacklogView inicializado e eventos anexados.");
}

export function cleanup() {
    // Remove os "ouvintes" usando as referências guardadas
    if (viewContainer) {
        viewContainer.removeEventListener('click', listeners.click);
    }
    document.removeEventListener('storyAdded', listeners.storyAdded);
    console.log("BacklogView limpo e eventos removidos.");
}