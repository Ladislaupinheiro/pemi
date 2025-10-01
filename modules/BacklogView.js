// modules/BacklogView.js

export function render(container, state) {
    const { stories } = state;
    
    const backlogHTML = `
        <div class="p-4">
            <div id="backlog-list" class="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                ${stories.length > 0 ? stories.map(story => `
                    <div class="bg-white p-4 rounded-lg shadow hover:shadow-xl transition-shadow h-full flex flex-col justify-between group">
                        <div class="flex-grow">
                            <div class="flex justify-between items-start">
                                <p class="font-semibold text-gray-800 pr-2 break-words">${story.quero}</p>
                                <div class="relative flex-shrink-0">
                                    <button data-action="toggle-story-menu" data-id="${story.id}" class="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                                    </button>
                                    <div id="story-menu-${story.id}" class="hidden absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-10">
                                        <button data-action="show-edit-story-modal" data-id="${story.id}" class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Editar</button>
                                        <button data-action="show-delete-story-confirmation" data-id="${story.id}" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Eliminar</button>
                                    </div>
                                </div>
                            </div>
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

        <button data-action="show-add-story-modal" class="fixed bottom-24 left-1/2 -translate-x-1/2 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
            <svg class="w-8 h-8 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
        </button>
    `;
    
    container.innerHTML = backlogHTML;
}