// modules/AddStoryModal.js
import { Storage } from './Storage.js';

function render() {
    const modalHTML = `
        <div id="add-story-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Adicionar Nova User Story</h2>
                    <button id="close-modal-btn" class="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                </div>
                <form id="add-story-form" novalidate>
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
                    <div class="flex justify-end space-x-4">
                        <button type="button" id="cancel-modal-btn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar História</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function addEventListeners() {
    const modal = document.getElementById('add-story-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-modal-btn');
    const form = document.getElementById('add-story-form');

    const closeModal = () => modal.remove();
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const storyData = {
            como: formData.get('como'),
            quero: formData.get('quero'),
            para_que: formData.get('para_que'),
            // Poderíamos adicionar mais metadados aqui no futuro
            createdAt: new Date().toISOString() 
        };

        try {
            await Storage.addStory(storyData);
            console.log('User Story salva com sucesso!');
            
            // ** Anuncia que uma nova história foi adicionada **
            document.dispatchEvent(new CustomEvent('storyAdded'));

            closeModal();
        } catch (error) {
            console.error('Falha ao salvar a User Story:', error);
            // Opcional: Mostrar uma mensagem de erro ao utilizador
        }
    });
}

export function show() {
    render();
    addEventListeners();
}