// modules/WelcomeView.js

export function render(state) {
    const { projects } = state;
    const welcomeHTML = `
        <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div class="max-w-md w-full">
                <h1 class="text-3xl font-bold text-center text-gray-800 mb-2">Bem-vindo ao pemi</h1>
                <p class="text-center text-gray-600 mb-8">Selecione um projeto para continuar ou crie um novo.</p>

                <div class="mb-8">
                    <button data-action="show-add-project-modal" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow">
                        + Criar Novo Projeto
                    </button>
                </div>

                <div id="project-list" class="space-y-3">
                    ${projects.length > 0 ? '<h2 class="text-lg font-semibold text-gray-700">Projetos Existentes:</h2>' : ''}
                    ${projects.length > 0 ? projects.map(project => `
                        <button data-action="select-project" data-id="${project.id}" class="w-full text-left bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                            <p class="font-semibold text-gray-800 pointer-events-none">${project.name}</p>
                        </button>
                    `).join('') : '<p class="text-sm text-gray-500">Nenhum projeto encontrado. Crie o seu primeiro projeto!</p>'}
                </div>
            </div>
        </div>
    `;
    return welcomeHTML;
}