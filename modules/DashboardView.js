// modules/DashboardView.js

export function render(container, state) {
    const { userProfile, projects } = state;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const formatTime = () => {
        return new Date().toLocaleTimeString('pt-PT', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = () => {
        return new Date().toLocaleDateString('pt-PT', {
            day: 'numeric',
            month: 'numeric',
            year: '2-digit',
        });
    };

    const dashboardHTML = `
        <div class="p-4 sm:p-6 lg:p-8">
            <div class="max-w-4xl mx-auto">
                
                <div class="dashboard-greeting bg-[#D9D9D9] rounded-xl p-6 text-center mb-8">
                    <p class="text-xl font-medium text-gray-700">${getGreeting()}, ${userProfile.name}!</p>
                    <p class="text-7xl font-bold text-gray-800 my-2">${formatTime()}</p>
                    <p class="text-lg text-gray-600">${formatDate()}</p>
                </div>

                <div>
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Meus projetos</h2>
                    
                    <div class="bg-[#D9D9D9] rounded-xl p-4 space-y-3">
                        ${projects.map(project => `
                            <button 
                                data-action="show-project-summary-modal" 
                                data-id="${project.id}" 
                                class="project-card w-full bg-white rounded-lg shadow p-4 flex items-center justify-between text-left hover:shadow-md transition-shadow">
                                <div>
                                    <p class="font-semibold text-lg text-gray-800 pointer-events-none">${project.name}</p>
                                    <p class="text-sm text-gray-500 mt-1 pointer-events-none">${new Date(project.createdAt).toLocaleDateString()}</p>
                                </div>
                                <svg class="w-6 h-6 text-blue-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        `).join('')}
                    </div>

                    <div class="text-center mt-6">
                        <button 
                            data-action="show-add-project-modal" 
                            class="bg-[#FFCE3B] text-gray-800 font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity shadow-sm">
                            + novo projeto
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `;

    container.innerHTML = dashboardHTML;
}