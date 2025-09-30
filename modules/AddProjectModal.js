// modules/AddProjectModal.js

export function render(state) {
    // Lê a mensagem de erro do estado. Se não houver erro, será nulo.
    const errorMessage = state.uiFeedback?.error;

    return `
        <div id="add-project-modal" class="fixed inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center p-4 z-50">
            <div class="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h1 class="text-2xl font-bold text-gray-800">Criar Novo Projeto</h1>
                        <button data-action="close-modal" class="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                    </div>

                    <form id="add-project-form" data-action="create-project">
                        
                        ${/* Renderiza o bloco de erro apenas se a mensagem existir */''}
                        ${errorMessage ? `
                            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                                <span class="block sm:inline">${errorMessage}</span>
                            </div>
                        ` : ''}

                        <div class="flex items-center">
                            <input name="projectName" type="text" placeholder="Nome do projeto..." required class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" autofocus>
                            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">Criar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}