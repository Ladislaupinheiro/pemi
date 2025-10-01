// modules/MatrixView.js

export function render(container, state) {
    const { stories } = state;

    const storiesInQuadrants = {};
    const storiesInPool = [];

    stories.forEach(story => {
        if (story.quadrant && story.quadrant !== 'story-pool') {
            if (!storiesInQuadrants[story.quadrant]) {
                storiesInQuadrants[story.quadrant] = [];
            }
            storiesInQuadrants[story.quadrant].push(story);
        } else {
            storiesInPool.push(story);
        }
    });

    for (const quadrant in storiesInQuadrants) {
        storiesInQuadrants[quadrant].sort((a, b) => {
            const orderA = a.orderIndex ?? Infinity;
            const orderB = b.orderIndex ?? Infinity;
            return orderA - orderB;
        });
    }

    const renderStoryItem = (story) => `
        <div class="story-item bg-white p-2 rounded shadow cursor-grab" data-id="${story.id}" style="touch-action: none;">
            <p class="text-sm font-semibold pointer-events-none break-words">${story.quero}</p>
        </div>`;

    const matrixHTML = `
        <div class="p-4 h-full flex flex-col max-w-7xl mx-auto">
            <h1 class="text-2xl font-bold mb-4 flex-shrink-0">Matriz de Priorização</h1>
            
            <div class="flex-grow grid grid-cols-2 grid-rows-2 gap-4 border-2 border-dashed border-gray-300 rounded-lg p-2">
                
                <div id="quadrant-quick-wins" class="quadrant bg-green-50 rounded-lg p-2 flex flex-wrap content-start gap-2">
                    <h2 class="font-bold text-green-800 text-center w-full mb-2">Ganhos Rápidos</h2>
                    ${(storiesInQuadrants['quadrant-quick-wins'] || []).map(renderStoryItem).join('')}
                </div>
                
                <div id="quadrant-major-projects" class="quadrant bg-blue-50 rounded-lg p-2 flex flex-wrap content-start gap-2">
                    <h2 class="font-bold text-blue-800 text-center w-full mb-2">Grandes Projetos</h2>
                    ${(storiesInQuadrants['quadrant-major-projects'] || []).map(renderStoryItem).join('')}
                </div>

                <div id="quadrant-fill-ins" class="quadrant bg-yellow-50 rounded-lg p-2 flex flex-wrap content-start gap-2">
                    <h2 class="font-bold text-yellow-800 text-center w-full mb-2">Tarefas de Preenchimento</h2>
                    ${(storiesInQuadrants['quadrant-fill-ins'] || []).map(renderStoryItem).join('')}
                </div>

                <div id="quadrant-consider-dropping" class="quadrant bg-red-50 rounded-lg p-2 flex flex-wrap content-start gap-2">
                    <h2 class="font-bold text-red-800 text-center w-full mb-2">Considerar Descartar</h2>
                    ${(storiesInQuadrants['quadrant-consider-dropping'] || []).map(renderStoryItem).join('')}
                </div>
            </div>

            <div class="flex-shrink-0 mt-6">
                <h3 class="font-bold mb-2">Itens do Backlog a Priorizar:</h3>
                <div id="story-pool" class="quadrant flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg min-h-[50px]">
                    ${storiesInPool.map(renderStoryItem).join('')}
                </div>
            </div>
        </div>
    `;
    container.innerHTML = matrixHTML;
}