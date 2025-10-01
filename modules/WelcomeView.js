// modules/WelcomeView.js

export function render(state) {
    const { projects } = state;
    const hasProjects = projects.length > 0;

    const welcomeHTML = `
        <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div class="max-w-md w-full">
                <h1 class="text-3xl font-bold text-center text-gray-800 mb-2">Bem-vindo ao pemi</h1>
                
                <p class="text-center text-gray-600 mb-8">
                    ${hasProjects ? 'Selecione um projeto para continuar ou crie um novo.' : 'A sua ferramenta para gestão ágil de produtos. Comece por criar o seu primeiro projeto.'}
                </p>

                <div class="mb-8">
                    <button data-action="show-add-project-modal" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow">
                        + Criar Novo Projeto
                    </button>
                </div>

                ${hasProjects ? `
                    <div id="project-list" class="space-y-3">
                        <h2 class="text-lg font-semibold text-gray-700 mb-2">Projetos Existentes:</h2>
                        ${projects.map(project => `
                            <div class="bg-white rounded-lg shadow flex items-center justify-between p-2 pr-4 group">
                                <button data-action="select-project" data-id="${project.id}" class="flex-grow text-left p-2">
                                    <p class="font-semibold text-gray-800 pointer-events-none">${project.name}</p>
                                </button>
                                <div class="relative">
                                    <button data-action="toggle-project-menu" data-id="${project.id}" class="p-2 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                                    </button>
                                    <div id="project-menu-${project.id}" class="hidden absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10">
                                        <button data-action="show-edit-project-modal" data-id="${project.id}" class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Editar Nome
                                        </button>
                                        <button data-action="show-delete-project-confirmation" data-id="${project.id}" data-name="${project.name}" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                            Eliminar Projeto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    return welcomeHTML;
}