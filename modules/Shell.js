// modules/Shell.js

export function render(state) {
    const { activeProject, projects } = state;
    const otherProjects = projects.filter(p => p.id !== activeProject?.id);

    const shellHTML = `
        <div class="h-screen w-screen flex flex-col">
            <header class="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0 z-20 relative">
                <div id="project-switcher-container" class="relative">
                    <button data-action="toggle-project-dropdown" class="flex items-center space-x-2">
                        <h1 class="text-xl font-bold text-gray-800 pointer-events-none">${activeProject?.name || 'Nenhum Projeto'}</h1>
                        <svg class="w-4 h-4 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div id="project-dropdown" class="hidden absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border">
                        <div class="p-2 text-sm text-gray-500">Trocar para:</div>
                        ${otherProjects.length > 0 ? otherProjects.map(p => `
                            <button data-action="select-project" data-id="${p.id}" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">${p.name}</button>
                        `).join('') : '<div class="px-4 py-2 text-sm text-gray-400">Nenhum outro projeto</div>'}
                    </div>
                </div>

                <button data-action="show-add-project-modal" class="flex items-center space-x-2 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    <span>Novo Projeto</span>
                </button>
            </header>

            <main id="view-container" class="flex-grow overflow-y-auto bg-gray-100"></main>

            <nav class="border-t border-gray-200 bg-gray-50 flex-shrink-0 z-10">
                <div class="flex justify-around max-w-md mx-auto">
                    <button data-action="navigate" data-view="backlog" class="p-4 text-gray-500"><svg class="w-6 h-6 mx-auto pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg><span class="text-xs pointer-events-none">Backlog</span></button>
                    <button data-action="navigate" data-view="matrix" class="p-4 text-gray-500"><svg class="w-6 h-6 mx-auto pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><span class="text-xs pointer-events-none">Matriz</span></button>
                    <button data-action="navigate" data-view="roadmap" class="p-4 text-gray-500"><svg class="w-6 h-6 mx-auto pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg><span class="text-xs pointer-events-none">Roadmap</span></button>
                    <button data-action="navigate" data-view="inbox" class="p-4 text-gray-500"><svg class="w-6 h-6 mx-auto pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg><span class="text-xs pointer-events-none">Ideias</span></button>
                </div>
            </nav>
        </div>
    `;
    return shellHTML;
}