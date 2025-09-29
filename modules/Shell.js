// modules/Shell.js

export function render() {
    const appContainer = document.getElementById('app');

    const shellHTML = `
        <div class="h-screen w-screen flex flex-col">
            <main id="view-container" class="flex-grow overflow-y-auto">
                </main>

            <nav class="border-t border-gray-200 bg-gray-50">
                <div class="flex justify-around max-w-md mx-auto">
                    <button data-view="backlog" class="p-4 text-blue-600">
                        <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        <span class="text-xs">Backlog</span>
                    </button>
                    <button data-view="matrix" class="p-4 text-gray-500 hover:text-blue-600">
                         <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        <span class="text-xs">Matriz</span>
                    </button>
                    <button data-view="roadmap" class="p-4 text-gray-500 hover:text-blue-600">
                        <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                        <span class="text-xs">Roadmap</span>
                    </button>
                    <button data-view="inbox" class="p-4 text-gray-500 hover:text-blue-600">
                        <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        <span class="text-xs">Ideias</span>
                    </button>
                </div>
            </nav>
        </div>
    `;
    appContainer.innerHTML = shellHTML;
}