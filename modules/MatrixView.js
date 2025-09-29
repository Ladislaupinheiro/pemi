// modules/MatrixView.js
import { Storage } from './Storage.js';

let viewContainer;
let draggableInstances = []; // Guarda as instâncias do Draggable para podermos destruí-las

async function renderHTML() {
    const stories = await Storage.getAllStories();
    const storiesInQuadrants = {};
    const storiesInPool = [];

    stories.forEach(story => {
        if (story.quadrant && story.quadrant !== 'story-pool') {
            if (!storiesInQuadrants[story.quadrant]) storiesInQuadrants[story.quadrant] = [];
            storiesInQuadrants[story.quadrant].push(story);
        } else {
            storiesInPool.push(story);
        }
    });

    const renderStoryInQuadrant = (story) => `
        <div class="story-item bg-white p-2 rounded shadow cursor-grab" data-id="${story.id}" style="position: absolute; touch-action: none;">
            <p class="text-sm font-semibold pointer-events-none">${story.quero}</p>
        </div>`;
    const renderStoryInPool = (story) => `
        <div class="story-item bg-white p-2 rounded shadow cursor-grab" data-id="${story.id}" style="position: relative; touch-action: none;">
            <p class="text-sm font-semibold pointer-events-none">${story.quero}</p>
        </div>`;
    
    const matrixHTML = `
        <div class="p-4 h-full flex flex-col max-w-7xl mx-auto">
            <h1 class="text-2xl font-bold mb-4 flex-shrink-0">Matriz de Priorização</h1>
            <div class="flex-grow grid grid-cols-2 grid-rows-2 gap-4 border-2 border-dashed border-gray-300 rounded-lg p-2">
                <div id="quadrant-quick-wins" class="quadrant bg-green-50 rounded-lg p-2 relative overflow-hidden"><h2 class="font-bold text-green-800 text-center">Ganhos Rápidos</h2>${(storiesInQuadrants['quadrant-quick-wins'] || []).map(renderStoryInQuadrant).join('')}</div>
                <div id="quadrant-major-projects" class="quadrant bg-blue-50 rounded-lg p-2 relative overflow-hidden"><h2 class="font-bold text-blue-800 text-center">Grandes Projetos</h2>${(storiesInQuadrants['quadrant-major-projects'] || []).map(renderStoryInQuadrant).join('')}</div>
                <div id="quadrant-fill-ins" class="quadrant bg-yellow-50 rounded-lg p-2 relative overflow-hidden"><h2 class="font-bold text-yellow-800 text-center">Tarefas de Preenchimento</h2>${(storiesInQuadrants['quadrant-fill-ins'] || []).map(renderStoryInQuadrant).join('')}</div>
                <div id="quadrant-consider-dropping" class="quadrant bg-red-50 rounded-lg p-2 relative overflow-hidden"><h2 class="font-bold text-red-800 text-center">Considerar Descartar</h2>${(storiesInQuadrants['quadrant-consider-dropping'] || []).map(renderStoryInQuadrant).join('')}</div>
            </div>
            <div class="flex-shrink-0 mt-6">
                <h3 class="font-bold mb-2">Itens do Backlog a Priorizar:</h3>
                <div id="story-pool" class="quadrant flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg min-h-[50px] relative">
                    ${storiesInPool.map(renderStoryInPool).join('')}
                </div>
            </div>
        </div>`;
    viewContainer.innerHTML = matrixHTML;
}

function addDragAndDrop() {
    const stories = gsap.utils.toArray(".story-item");
    const dropTargets = gsap.utils.toArray(".quadrant");

    stories.forEach(async (item) => {
        const storyId = parseInt(item.dataset.id, 10);
        const [story] = await Storage.getAllStories().then(s => s.filter(i => i.id === storyId));
        if (story && story.position && item.parentElement.id !== 'story-pool') {
            gsap.set(item, { x: story.position.x, y: story.position.y });
        }
    });

    draggableInstances = Draggable.create(stories, {
        onDragStart: function() { this.target.classList.add("is-dragging"); },
        onDragEnd: async function() {
            this.target.classList.remove("is-dragging");
            const storyId = parseInt(this.target.dataset.id, 10);
            let targetQuadrant = null;

            dropTargets.forEach(quad => {
                if (this.hitTest(quad, "50%")) targetQuadrant = quad;
            });

            try {
                const newPosition = { x: this.pointerX - targetQuadrant.getBoundingClientRect().left - (this.target.offsetWidth / 2), y: this.pointerY - targetQuadrant.getBoundingClientRect().top - (this.target.offsetHeight / 2) };
                const quadrantId = (targetQuadrant && targetQuadrant.id !== 'story-pool') ? targetQuadrant.id : null;
                await Storage.updateStory(storyId, { quadrant: quadrantId, position: quadrantId ? newPosition : null });
                await init(viewContainer); // Re-renderiza a partir da Fonte da Verdade
            } catch (error) { console.error("Falha ao atualizar a história:", error); }
        }
    });
}

export async function init(container) {
    if (container) viewContainer = container;
    if (!viewContainer) return;

    await renderHTML();
    addDragAndDrop();
    console.log("MatrixView inicializado.");
}

export function cleanup() {
    // Destrói todas as instâncias Draggable para libertar memória e remover eventos
    if (draggableInstances) {
        draggableInstances.forEach(d => d.kill());
        draggableInstances = [];
    }
    console.log("MatrixView limpo.");
}