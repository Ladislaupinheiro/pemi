// modules/EditIdeaModal.js

export function render(state) {
    const { id, text } = state.editingIdea;

    return `
        <div id="edit-idea-modal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Editar Ideia</h2>
                    <button data-action="close-modal" class="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                </div>
                <form id="edit-idea-form" data-action="update-idea">
                    <input type="hidden" name="id" value="${id}">
                    <div class="mb-4">
                        <label for="idea-text-edit" class="block text-sm font-medium text-gray-700">A sua ideia:</label>
                        <textarea id="idea-text-edit" name="text" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" autofocus>${text}</textarea>
                    </div>
                    <div class="flex justify-end">
                        <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}