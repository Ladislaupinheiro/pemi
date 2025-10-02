// modules/DashboardView.js

export function render(container, state) {
    const { userProfile, projects } = state;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const formatDate = () => {
        return new Date().toLocaleDateString('pt-PT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const dashboardHTML = `
        <div class="p-4 sm:p-6 lg:p-8">
            <div class="max-w-4xl mx-auto">
                
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">${getGreeting()}, ${userProfile.name}!</h1>
                    <p class="text-gray-500 mt-1">${formatDate()}</p>
                </div>

                <div class="mt-8">
                    <h2 class="text-xl font-semibold text-gray-700 mb-4">Os seus projetos</h2>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${projects.map(project => `
                            <button data-action="select-project" data-id="${project.id}" class="bg-white rounded-lg shadow p-4 text-left hover:shadow-lg transition-shadow">
                                <p class="font-bold text-gray-800 pointer-events-none">${project.name}</p>
                                <p class="text-sm text-gray-500 mt-2 pointer-events-none">${new Date(project.createdAt).toLocaleDateString()}</p>
                            </button>
                        `).join('')}

                        <button data-action="show-add-project-modal" class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500 transition-colors">
                            <div class="text-center pointer-events-none">
                                <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                <span class="font-semibold">Criar Novo Projeto</span>
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `;

    container.innerHTML = dashboardHTML;
}