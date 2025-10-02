// modules/EditProfileModal.js

export function render(state) {
    const { userProfile } = state;

    const getInitials = (name) => {
        if (!name) return '';
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.toUpperCase();
    };

    return `
        <div id="edit-profile-modal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form id="edit-profile-form" data-action="update-profile">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-bold">Editar Perfil</h2>
                            <button type="button" data-action="close-modal" class="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                        </div>
                        
                        <div class="flex flex-col items-center space-y-4 mb-6">
                            ${userProfile.photo ? `
                                <img src="${userProfile.photo}" alt="Foto de Perfil" class="w-24 h-24 rounded-full object-cover">
                            ` : `
                                <div class="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-4xl">
                                    ${getInitials(userProfile.name)}
                                </div>
                            `}
                            <label for="photo-upload" class="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 text-sm font-semibold rounded-md hover:bg-gray-200">
                                Carregar Nova Foto
                            </label>
                            <input type="file" id="photo-upload" name="photo" class="hidden" accept="image/*">
                        </div>

                        <div class="space-y-4">
                            <div>
                                <label for="profile-name" class="block text-sm font-medium text-gray-700">Nome</label>
                                <input type="text" id="profile-name" name="name" value="${userProfile.name}" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label for="profile-role" class="block text-sm font-medium text-gray-700">Papel / Responsabilidade</label>
                                <input type="text" id="profile-role" name="role" value="${userProfile.role}" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 px-6 py-3 text-right rounded-b-lg">
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}