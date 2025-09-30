// modules/InboxView.js

export function render(container, state) {
    const { ideas } = state;

    const inboxHTML = `
        <div class="p-4">
            <h1 class="text-2xl font-bold">Caixa de Entrada de Ideias</h1>
            
            <form id="add-idea-form" data-action="add-idea" class="mt-4 mb-6 bg-white p-4 rounded-lg shadow">
                <div class="flex items-center">
                    <input name="ideaText" type="text" placeholder="Digite uma nova ideia..." required class="flex-grow min-w-0 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">Salvar</button>
                </div>
            </form>

            <div id="idea-list" class="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                ${ideas.length > 0 ? ideas.map(idea => `
                    <div class="bg-white p-3 rounded-lg shadow flex justify-between items-start">
                        <p class="text-gray-800 mr-2">${idea.text}</p>
                        <button data-action="delete-idea" data-id="${idea.id}" class="flex-shrink-0 text-gray-400 hover:text-red-500 text-2xl leading-none">&times;</button>
                    </div>
                `).join('') : ''}
            </div>

            ${ideas.length === 0 ? `<div class="text-center text-gray-500 mt-8">Nenhuma ideia na caixa de entrada.</div>` : ''}
        </div>
    `;

    container.innerHTML = inboxHTML;
}