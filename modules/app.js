// modules/app.js
import { render as renderShell } from './Shell.js';
import * as BacklogView from './BacklogView.js';
import * as MatrixView from './MatrixView.js';
import * as RoadmapView from './RoadmapView.js';
import * as InboxView from './InboxView.js';
import { Storage } from './Storage.js';

const views = {
    'backlog': BacklogView,
    'matrix': MatrixView,
    'roadmap': RoadmapView,
    'inbox': InboxView
};

let currentViewModule = null;
let currentViewName = 'backlog';

function navigateTo(viewName) {
    const viewContainer = document.getElementById('view-container');
    if (!viewContainer) return;

    // 1. Limpa a vista anterior, se existir
    if (currentViewModule && typeof currentViewModule.cleanup === 'function') {
        currentViewModule.cleanup();
    }

    // 2. Encontra e inicializa a nova vista
    const newViewModule = views[viewName];
    if (newViewModule && typeof newViewModule.init === 'function') {
        newViewModule.init(viewContainer);
        currentViewModule = newViewModule;
        currentViewName = viewName;
        updateActiveTab();
    } else {
        viewContainer.innerHTML = `<h1 class="p-4 text-red-500">Erro: A vista "${viewName}" não pôde ser carregada.</h1>`;
        console.error(`O módulo da vista "${viewName}" não tem uma função init.`);
    }
}

function updateActiveTab() {
    const tabs = document.querySelectorAll('nav button');
    tabs.forEach(tab => {
        if (tab.dataset.view === currentViewName) {
            tab.classList.add('text-blue-600');
            tab.classList.remove('text-gray-500');
        } else {
            tab.classList.add('text-gray-500');
            tab.classList.remove('text-blue-600');
        }
    });
}

function addShellEventListeners() {
    const nav = document.querySelector('nav');
    if (nav) {
        nav.addEventListener('click', (event) => {
            const tabButton = event.target.closest('button');
            if (tabButton && tabButton.dataset.view) {
                const view = tabButton.dataset.view;
                if (view !== currentViewName) {
                    navigateTo(view);
                }
            }
        });
    }
}

async function initialize() {
    // ... (código do service worker e do Storage.initDB() como antes)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => console.log('Service Worker registado:', registration.scope))
                .catch(error => console.log('Falha ao registar o Service Worker:', error));
        });
    }

    try {
        await Storage.initDB();
        renderShell();
        addShellEventListeners();
        navigateTo(currentViewName);
        console.log("pemi inicializado com arquitetura de Ciclo de Vida.");

    } catch (error) {
        console.error("Falha crítica ao inicializar a aplicação:", error);
        document.getElementById('app').innerHTML = `<div class="p-4 text-red-500">Erro ao carregar a aplicação. A base de dados não pôde ser iniciada.</div>`;
    }
}

initialize();