// modules/BacklogView.js

export function render(container, state) {
    const { stories, ideas } = state;

    const renderStoryCard = (story) => `
        <div class="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between group">
            <div class="flex-grow">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-semibold uppercase text-blue-600">User Story</span>
                    <div class="relative flex-shrink-0 -mr-2">
                        <button data-action="toggle-story-menu" data-id="${story.id}" class="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                        </button>
                        <div id="story-menu-${story.id}" class="hidden absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-10">
                            <button data-action="show-edit-story-modal" data-id="${story.id}" class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Editar</button>
                            <button data-action="show-delete-story-confirmation" data-id="${story.id}" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Eliminar</button>
                        </div>
                    </div>
                </div>
                <p class="font-semibold text-gray-800 break-words">${story.quero}</p>
                <p class="text-sm text-gray-600 mt-2 break-words"><strong>Como um</strong> ${story.como}, <strong>para que</strong> ${story.para_que}.</p>
            </div>
            <div class="text-xs text-gray-400 mt-3 pt-2 border-t">${story.createdAt ? new Date(story.createdAt).toLocaleString() : ''}</div>
        </div>
    `;

    const renderIdeaCard = (idea) => `
        <div class="bg-yellow-100 p-4 rounded-lg shadow-md flex flex-col justify-between group">
            <div class="flex-grow">
                <div class="flex justify-between items-start mb-2">
                     <span class="text-xs font-semibold uppercase text-yellow-800">Ideia</span>
                    <div class="relative flex-shrink-0 -mr-2">
                        <button data-action="toggle-idea-menu" data-id="${idea.id}" class="p-1 rounded-full hover:bg-yellow-200 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                        </button>
                        <div id="idea-menu-${idea.id}" class="hidden absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-10">
                             <button data-action="promote-idea" data-id="${idea.id}" class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Promover</button>
                            <button data-action="show-edit-idea-modal" data-id="${idea.id}" class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Editar</button>
                            <button data-action="show-delete-idea-confirmation" data-id="${idea.id}" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Eliminar</button>
                        </div>
                    </div>
                </div>
                <p class="text-gray-800 break-words">${idea.text}</p>
            </div>
            <div class="text-xs text-yellow-900 opacity-75 mt-3 pt-2 border-t border-yellow-200">${idea.createdAt ? new Date(idea.createdAt).toLocaleString() : ''}</div>
        </div>
    `;

    const backlogHubHTML = `
        <div class="backlog-hub h-full w-full flex flex-col overflow-hidden bg-gray-100">
            <div class="swiper backlog-swiper flex-grow w-full h-full">
                <div class="swiper-wrapper items-center">

                    <div class="swiper-slide">
                        <div class="slide-card">
                            <h2 class="text-xl font-bold px-4 pt-4 pb-2 text-gray-800">Histórias</h2>
                            <div class="card-content">
                                <div class="p-4 pt-2 grid grid-cols-2 gap-4">
                                    ${stories.length > 0 ? stories.map(renderStoryCard).join('') : `<p class="col-span-2 text-center text-gray-500 mt-8">Nenhuma história no backlog.</p>`}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide">
                        <div class="slide-card">
                            <h2 class="text-xl font-bold px-4 pt-4 pb-2 text-gray-800">Caixa de Ideias</h2>
                            <div class="card-content">
                                <div class="p-4 pt-2 grid grid-cols-2 gap-4">
                                    ${ideas.length > 0 ? ideas.map(renderIdeaCard).join('') : `<p class="col-span-2 text-center text-gray-500 mt-8">Nenhuma ideia na caixa de entrada.</p>`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="control-bar">
                <div class="pagination-pills">
                    <div class="swiper-pagination"></div>
                </div>
                <button id="fab-add-button" data-action="show-add-story-modal" class="fab">
                    <svg class="w-8 h-8 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = backlogHubHTML;
}