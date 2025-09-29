// modules/InboxView.js
import { Storage } from './Storage.js';

let viewContainer;
// Guarda as referências aos "ouvintes" para podermos removê-los
const listeners = {
    submit: null,
    click: null
};

async function renderHTML() {
    const ideas = await Storage.getAllIdeas();
    const inboxHTML = `
        <div class="p-4">
            <h1 class="text-2xl font-bold">Caixa de Entrada de Ideias</h1>
            <form id="add-idea-form" class="mt-4 mb-6 bg-white p-4 rounded-lg shadow">
                <div class="flex items-center">
                    <input name="ideaText" type="text" placeholder="Digite uma nova ideia..." required class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">Salvar</button>
                </div>
            </form>
            <div id="idea-list" class="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                ${ideas.length > 0 ? ideas.map(idea => `
                    <div class="bg-white p-3 rounded-lg shadow flex justify-between items-start">
                        <p class="text-gray-800 mr-2">${idea.text}</p>
                        <button data-id="${idea.id}" class="delete-idea-btn flex-shrink-0 text-gray-400 hover:text-red-500 text-2xl leading-none">&times;</button>
                    </div>
                `).join('') : ''}
            </div>
            ${ideas.length === 0 ? `<div class="text-center text-gray-500 mt-8">Nenhuma ideia na caixa de entrada.</div>` : ''}
        </div>
    `;
    viewContainer.innerHTML = inboxHTML;
}

// --- Funções de gestão de eventos ---
async function handleFormSubmit(event) {
    if (event.target && event.target.id === 'add-idea-form') {
        event.preventDefault();
        const form = event.target;
        const input = form.querySelector('input[name="ideaText"]');
        const ideaText = input.value.trim();
        if (ideaText) {
            await Storage.addIdea({ text: ideaText, createdAt: new Date().toISOString() });
            input.value = '';
            await init(viewContainer); // Re-renderiza a própria vista
        }
    }
}

async function handleListClick(event) {
    const deleteButton = event.target.closest('.delete-idea-btn');
    if (deleteButton) {
        const ideaId = parseInt(deleteButton.dataset.id, 10);
        await Storage.deleteIdea(ideaId);
        await init(viewContainer); // Re-renderiza a própria vista
    }
}

// --- Funções do Ciclo de Vida ---
export async function init(container) {
    if (container) viewContainer = container;
    if (!viewContainer) return;

    await renderHTML();

    // Anexa os "ouvintes" e guarda as suas referências
    listeners.submit = handleFormSubmit;
    listeners.click = handleListClick;
    viewContainer.addEventListener('submit', listeners.submit);
    viewContainer.addEventListener('click', listeners.click);
    
    console.log("InboxView inicializado e eventos anexados.");
}

export function cleanup() {
    // Remove os "ouvintes" usando as referências guardadas
    if (viewContainer) {
        viewContainer.removeEventListener('submit', listeners.submit);
        viewContainer.removeEventListener('click', listeners.click);
    }
    console.log("InboxView limpo e eventos removidos.");
}