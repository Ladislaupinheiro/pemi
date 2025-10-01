// modules/ConfirmationModal.js

export function render(state) {
    const { message, confirmAction } = state.confirmation;

    // Define o texto e a cor do botão de confirmação para ações destrutivas.
    const confirmButtonText = 'Eliminar';
    const confirmButtonClasses = 'bg-red-600 hover:bg-red-700';

    return `
        <div id="confirmation-modal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
                <h2 class="text-xl font-bold text-gray-800 mb-4">Ação Irreversível</h2>
                <p class="text-gray-600 mb-6">${message}</p>
                <div class="flex justify-center space-x-4">
                    <button data-action="hideConfirmation" class="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">
                        Cancelar
                    </button>
                    <button data-action="${confirmAction}" class="px-6 py-2 text-white rounded-md ${confirmButtonClasses} font-medium">
                        ${confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    `;
}