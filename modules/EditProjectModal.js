// modules/EditProjectModal.js

export function render(state) {
    const { id, currentName } = state.editingProject;
    const errorMessage = state.uiFeedback?.error;

    return `
        <div id="edit-project-modal" class="fixed inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center p-4 z-50">
            <div class="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h1 class="text-2xl font-bold text-gray-800">Editar Nome do Projeto</h1>
                        <button data-action="close-modal" class="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                    </div>

                    <form id="edit-project-form" data-action="update-project">
                        <input type="hidden" name="projectId" value="${id}">
                        
                        ${errorMessage ? `
                            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                                <span class="block sm:inline">${errorMessage}</span>
                            </div>
                        ` : ''}

                        <div class="flex items-center">
                            <input name="newProjectName" type="text" value="${currentName}" required class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" autofocus onfocus="this.select()">
                            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}