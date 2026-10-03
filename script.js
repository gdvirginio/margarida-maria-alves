/* ==========================================================================
   SCRIPTS COMPARTILHADOS — MEMORIAL MARGARIDA MARIA ALVES
   Navegação Mobile, Linha do Tempo Animada, Lightbox e Progresso de Rolagem
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sombra e Estilo no Header ao Rolar (Otimizado com requestAnimationFrame)
    const header = document.querySelector('.site-header');
    if (header) {
        let isScrolling = false;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const winScroll = window.scrollY || document.documentElement.scrollTop;
                    if (winScroll > 20) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });
    }

    // 2. Controle do Menu Mobile (Drawer)
    const openMenuBtn = document.getElementById('open-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');

    function openDrawer() {
        if (drawer && backdrop) {
            drawer.classList.add('open');
            backdrop.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeDrawer() {
        if (drawer && backdrop) {
            drawer.classList.remove('open');
            backdrop.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    // Expor globalmente para os atributos onclick inline do HTML
    window.openDrawer = openDrawer;
    window.closeDrawer = closeDrawer;

    if (openMenuBtn) openMenuBtn.addEventListener('click', openDrawer);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Fechar ao pressionar Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDrawer();
            fecharLightbox();
        }
    });

    // 3. Linha do Tempo Animada (Apenas na Home onde existe .timeline-wrapper)
    const timelineWrapper = document.querySelector('.timeline-wrapper');
    const timelineFill = document.querySelector('.timeline-fill-line');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineWrapper && timelineFill && timelineItems.length > 0) {
        let timelineTicking = false;

        function updateTimeline() {
            const rect = timelineWrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const triggerY = windowHeight * 0.55;

            const startY = rect.top;
            const totalHeight = rect.height;
            const currentProgress = triggerY - startY;

            let percentage = (currentProgress / totalHeight) * 100;
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;

            timelineFill.style.height = percentage + '%';

            timelineItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                if (itemRect.top <= triggerY + 40) {
                    item.classList.add('active-entry');
                } else {
                    item.classList.remove('active-entry');
                }
            });
            timelineTicking = false;
        }

        function requestTimelineUpdate() {
            if (!timelineTicking) {
                window.requestAnimationFrame(updateTimeline);
                timelineTicking = true;
            }
        }

        window.addEventListener('scroll', requestTimelineUpdate, { passive: true });
        window.addEventListener('resize', requestTimelineUpdate, { passive: true });
        updateTimeline();
    }

    // 4. Centraliza a aba horizontal ativa na visualização mobile
    const activeRightsTab = document.querySelector('.rights-tab-link.active');
    if (activeRightsTab) {
        activeRightsTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // 5. Ativação Automática de Lightbox para Fotografias com data-lightbox="true"
    const lightboxTargets = document.querySelectorAll('[data-lightbox="true"]');
    lightboxTargets.forEach(target => {
        target.setAttribute('role', 'button');
        target.setAttribute('tabindex', '0');
        target.setAttribute('aria-label', 'Ampliar fotografia histórica no acervo');

        function trigger() {
            const img = target.querySelector('img');
            if (!img) return;
            const src = img.getAttribute('src');
            const title = target.getAttribute('data-title') || img.getAttribute('alt') || 'Fotografia Histórica';
            const desc = target.getAttribute('data-desc') || '';
            const credit = target.getAttribute('data-credit') || '';
            abrirLightbox(src, title, desc, credit);
        }

        target.addEventListener('click', trigger);
        target.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trigger();
            }
        });
    });
});

// Funções Globais de Lightbox para Fotografias Reais
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxCredit = document.getElementById('lightbox-credit');

function abrirLightbox(src, title, desc, credit) {
    if (!lightboxModal) return;
    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;
    lightboxCredit.textContent = credit;
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function fecharLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

const lightboxCloseBtn = document.getElementById('lightbox-close');
if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', fecharLightbox);
if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) fecharLightbox();
    });
}
