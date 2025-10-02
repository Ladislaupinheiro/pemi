// modules/ProjectSummaryModal.js

export function render(state) {
    const { projects, projectForSummaryModal } = state;
    const project = projects.find(p => p.id === projectForSummaryModal);

    if (!project) {
        return ``;
    }

    return `
        <div id="project-summary-modal" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm">
                <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-lg font-semibold text-gray-800">${project.name}</h2>
                    <button data-action="close-modal" class="text-gray-400 hover:text-gray-800">&times;</button>
                </div>
                
                <div class="p-6">
                    <div class="grid grid-cols-2 gap-4">
                        <button 
                            data-action="navigate-to-project-view" 
                            data-id="${project.id}" 
                            data-view="backlog" 
                            class="bg-gray-100 p-4 rounded-xl text-center font-medium text-gray-700 hover:bg-blue-500 hover:text-white transition-colors">
                            Backlog
                        </button>
                        <button 
                            data-action="navigate-to-project-view" 
                            data-id="${project.id}" 
                            data-view="backlog"  
                            class="bg-gray-100 p-4 rounded-xl text-center font-medium text-gray-700 hover:bg-blue-500 hover:text-white transition-colors">
                            Ideias
                        </button>
                        <button 
                            data-action="navigate-to-project-view" 
                            data-id="${project.id}" 
                            data-view="matrix" 
                            class="bg-gray-100 p-4 rounded-xl text-center font-medium text-gray-700 hover:bg-blue-500 hover:text-white transition-colors">
                            Matriz
                        </button>
                        <button 
                            data-action="navigate-to-project-view" 
                            data-id="${project.id}" 
                            data-view="roadmap" 
                            class="bg-gray-100 p-4 rounded-xl text-center font-medium text-gray-700 hover:bg-blue-500 hover:text-white transition-colors">
                            Roadmap
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}