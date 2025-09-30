// modules/AddStoryModal.js

export function render(state) {
    // A renderização do modal agora pode receber o estado, embora não o utilize por enquanto.
    // Isto mantém a consistência com os outros componentes.
    return `
        <div id="add-story-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Adicionar Nova User Story</h2>
                    <button data-action="close-modal" class="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                </div>
                <form id="add-story-form" data-action="create-story">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Como um...</label>
                        <input name="como" type="text" placeholder="tipo de utilizador" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Eu quero...</label>
                        <textarea name="quero" placeholder="realizar uma ação" rows="3" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700">Para que...</label>
                        <input name="para_que" type="text" placeholder="alcançar um objetivo" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div class="flex justify-end">
                        <button type="submit" class="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar História</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}