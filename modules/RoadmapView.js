// modules/RoadmapView.js
import { Storage } from './Storage.js';

let viewContainer;

async function renderHTML() {
    const stories = await Storage.getAllStories();

    // Simulação: distribuir histórias pelas colunas
    const nowStories = stories.slice(0, 2);
    const nextStories = stories.slice(2, 4);
    const futureStories = stories.slice(4, 6);

    const roadmapHTML = `
        <div class="p-4 h-full flex flex-col">
            <h1 class="text-2xl font-bold mb-4 flex-shrink-0">Roadmap Visual</h1>

            <div class="flex-grow flex space-x-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-4 md:space-x-0">

                <div class="flex-shrink-0 w-4/5 md:w-full bg-blue-50 rounded-lg p-3">
                    <h2 class="font-bold text-blue-800 mb-3">Agora</h2>
                    <div class="space-y-3">
                        ${nowStories.length > 0 ? nowStories.map(story => `
                            <div class="bg-white p-3 rounded shadow">
                                <p class="text-sm font-semibold">${story.quero}</p>
                            </div>
                        `).join('') : '<p class="text-sm text-gray-500">Nenhum item.</p>'}
                    </div>
                </div>

                <div class="flex-shrink-0 w-4/5 md:w-full bg-purple-50 rounded-lg p-3">
                    <h2 class="font-bold text-purple-800 mb-3">Próximo</h2>
                    <div class="space-y-3">
                        ${nextStories.length > 0 ? nextStories.map(story => `
                            <div class="bg-white p-3 rounded shadow">
                                <p class="text-sm font-semibold">${story.quero}</p>
                            </div>
                        `).join('') : '<p class="text-sm text-gray-500">Nenhum item.</p>'}
                    </div>
                </div>

                <div class="flex-shrink-0 w-4/5 md:w-full bg-gray-200 rounded-lg p-3">
                    <h2 class="font-bold text-gray-800 mb-3">Futuro</h2>
                    <div class="space-y-3">
                        ${futureStories.length > 0 ? futureStories.map(story => `
                            <div class="bg-white p-3 rounded shadow">
                                <p class="text-sm font-semibold">${story.quero}</p>
                            </div>
                        `).join('') : '<p class="text-sm text-gray-500">Nenhum item.</p>'}
                    </div>
                </div>

            </div>
        </div>
    `;
    viewContainer.innerHTML = roadmapHTML;
}

export async function init(container) {
    if (container) viewContainer = container;
    if (!viewContainer) return;
    
    await renderHTML();
    console.log("RoadmapView inicializado.");
}

export function cleanup() {
    // Atualmente não há eventos para remover, mas a função está aqui para o futuro.
    console.log("RoadmapView limpo.");
}