// ==============================
// === DATA: projets & logos ===
// ==============================
const projectsData = {
    project1: {
        title: "Portfolio Web",
        description: "Un site portfolio moderne avec un effet Matrix et des transitions fluides. Conçu pour présenter mes projets et mon parcours en BTS CIEL.",
        images: [
            "images/projects/project1-1.png",
            "images/projects/project1-2.png",
            "images/projects/project1-3.png"
        ],
        technologies: ["html", "css", "javascript"],
        downloadLink: "files/portfolio.zip"
    },

    project2: {
        title: "Roulette Python",
        description: "Un mini-jeu de roulette développé en Python. Le joueur mise et tente sa chance sur un nombre ou une couleur.",
        images: [
            "project2-1.png",
            "project2-2.png"
        ],
        technologies: ["python"],
        // lien GitHub (blob) — sera converti automatiquement en RAW
        downloadLink: "https://github.com/LuxV11/protpholio.github.io/blob/main/Roulette.py"
    },

    project3: {
        title: "Suivi Température IoT",
        description: "Application web de suivi de la température dans une salle serveur. Connectée à une base de données IoT.",
        images: [
            "images/projects/project3-1.png",
            "images/projects/project3-2.png"
        ],
        technologies: ["php", "mysql", "html", "css"],
        downloadLink: "files/iot_dashboard.zip"
    }
};

const techLogos = {
    html: { src: 'images/tech/html.png', label: 'HTML5' },
    css: { src: 'images/tech/css.png', label: 'CSS3' },
    javascript: { src: 'images/tech/javascript.png', label: 'JavaScript' },
    python: { src: 'images/tech/python.png', label: 'Python' },
    php: { src: 'images/tech/php.png', label: 'PHP' },
    mysql: { src: 'images/tech/mysql.png', label: 'MySQL' },
    cpp: { src: 'images/tech/cpp.png', label: 'C++' },
    arduino: { src: 'images/tech/arduino.png', label: 'Arduino' }
};


// ==============================
// === ÉTAT GLOBAL / CAROUSEL ===
// ==============================
let currentSlide = 0;
let currentProject = null;


// ==============================
// === FONCTIONS WINDOWS (OPEN/CLOSE/TOGGLE) ===
// ==============================
function toggleWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    win.classList.toggle('active');
}

function openWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    win.classList.add('active');
}

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    win.classList.remove('active');
}


// ==============================
// === OUVRIR LE DÉTAIL D'UN PROJET ===
// ==============================
function openProjectDetail(projectId) {
    const project = projectsData[projectId];
    if (!project) {
        console.error('Projet non trouvé:', projectId);
        return;
    }

    currentProject = project;
    currentSlide = 0;

    // Titres & description
    const titleEl = document.getElementById('project-detail-title');
    const nameEl = document.getElementById('project-detail-name');
    const descEl = document.getElementById('project-detail-description');

    if (titleEl) titleEl.textContent = project.title;
    if (nameEl) nameEl.textContent = project.title;
    if (descEl) descEl.textContent = project.description;

    // --- Carousel d'images ---
    const carouselContainer = document.getElementById('carousel-images');
    if (carouselContainer) {
        carouselContainer.innerHTML = '';
        project.images.forEach((imgSrc, idx) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide' + (idx === 0 ? ' active' : '');

            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `${project.title} - ${idx + 1}`;
            img.onerror = function() {
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="20"%3EImage+' + (idx+1) + '%3C/text%3E%3C/svg%3E';
            };

            slide.appendChild(img);
            carouselContainer.appendChild(slide);
        });
    }

    // --- Dots ---
    const dotsContainer = document.getElementById('carousel-dots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        project.images.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
            dot.onclick = function() { goToSlide(idx); };
            dotsContainer.appendChild(dot);
        });
    }

    // --- Technologies ---
    const techContainer = document.getElementById('tech-icons');
    if (techContainer) {
        techContainer.innerHTML = '';
        project.technologies.forEach(t => {
            const techKey = t.toLowerCase();
            const techData = techLogos[techKey];
            const icon = document.createElement('div');
            icon.className = 'tech-icon';

            if (techData) {
                const imgWrap = document.createElement('div');
                imgWrap.className = 'tech-icon-img';
                const img = document.createElement('img');
                img.src = techData.src;
                img.alt = techData.label;
                img.onerror = function() {
                    imgWrap.innerHTML = '<div style="font-size:14px">' + techKey.toUpperCase() + '</div>';
                };
                imgWrap.appendChild(img);

                const label = document.createElement('div');
                label.className = 'tech-icon-label';
                label.textContent = techData.label;

                icon.appendChild(imgWrap);
                icon.appendChild(label);
            } else {
                // Fallback si pas d'icône
                icon.innerHTML = '<div style="font-size:14px;padding:6px;">' + t + '</div>';
            }

            techContainer.appendChild(icon);
        });
    }

    // --- Bouton téléchargement dans la fenêtre détail ---
    const downloadBtn = document.getElementById('download-button');
    if (downloadBtn) {
        // on remplace l'ancien onclick par la nouvelle logique
        downloadBtn.onclick = async function() {
            if (!currentProject || !currentProject.downloadLink) {
                alert("Aucun lien de téléchargement défini pour ce projet.");
                return;
            }

            let downloadURL = currentProject.downloadLink;

            // Convertit github.com/.../blob/... -> raw.githubusercontent.com/...
            if (downloadURL.includes("github.com") && downloadURL.includes("/blob/")) {
                downloadURL = downloadURL
                    .replace("github.com", "raw.githubusercontent.com")
                    .replace("/blob/", "/");
            }

            // Support github:User/Repo -> télécharge le zip du main
            if (downloadURL.startsWith("github:")) {
                const repo = downloadURL.replace("github:", "");
                downloadURL = `https://github.com/${repo}/archive/refs/heads/main.zip`;
            }

            try {
                const response = await fetch(downloadURL);
                if (!response.ok) throw new Error("Impossible de télécharger le fichier.");
                const blob = await response.blob();

                // Crée un objectURL et force le téléchargement
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;

                // Nom du fichier : on récupère la dernière partie de l'URL (fallback simple)
                let fileName = downloadURL.split('/').pop() || 'download';
                // Si query string présente -> on enlève
                fileName = fileName.split('?')[0];

                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                // Optionnel : message
                // alert(`Téléchargement de ${fileName} terminé ✅`);
            } catch (err) {
                alert("Erreur pendant le téléchargement : " + err.message);
            }
        };
    }

    // Ouvre la fenêtre de détail
    openWindow('project-detail-window');
}


// ==============================
// === CONTROLES DU CARROUSEL ===
// ==============================
function changeSlide(direction) {
    if (!currentProject) return;

    const slides = document.querySelectorAll('#carousel-images .carousel-slide');
    const dots = document.querySelectorAll('#carousel-dots .carousel-dot');
    if (!slides || slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (currentSlide + direction + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    if (!currentProject) return;

    const slides = document.querySelectorAll('#carousel-images .carousel-slide');
    const dots = document.querySelectorAll('#carousel-dots .carousel-dot');
    if (!slides || slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}


// ==============================
// === DRAGGABLE WINDOWS (DESKTOP) ===
// ==============================
function enableDraggableWindows() {
    let draggedWindow = null;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    document.querySelectorAll('.window-header').forEach(function(header) {
        header.addEventListener('mousedown', startDrag);
    });

    function startDrag(e) {
        // Désactive sur mobile
        if (window.innerWidth < 768) return;
        // Si on clique sur un bouton de la barre, n'initie pas le drag
        if (e.target.classList.contains('window-button')) return;

        draggedWindow = e.target.closest('.window');
        if (!draggedWindow) return;

        const rect = draggedWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        isDragging = true;
        draggedWindow.style.transform = 'none';

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    function drag(e) {
        if (draggedWindow && isDragging) {
            e.preventDefault();
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            // Garder la fenêtre dans l'écran
            const maxX = window.innerWidth - draggedWindow.offsetWidth;
            const maxY = window.innerHeight - draggedWindow.offsetHeight;

            draggedWindow.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
            draggedWindow.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
        }
    }

    function stopDrag() {
        isDragging = false;
        draggedWindow = null;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }

    // Reset positions on resize for small screens
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth < 768) {
                document.querySelectorAll('.window').forEach(function(win) {
                    win.style.left = '';
                    win.style.top = '';
                    win.style.transform = '';
                });
            }
        }, 250);
    });
}


// ==============================
// === INIT : DOMContentLoaded ===
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    // Attache les boutons de projet (éléments avec data-project)
    document.querySelectorAll('.project-button').forEach(btn => {
        const projectKey = btn.getAttribute('data-project');
        if (!projectKey) return;
        btn.addEventListener('click', function() {
            openProjectDetail(projectKey);
            // effet visuel: active sur bouton
            document.querySelectorAll('.project-button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Boutons de fermeture pour toutes les fenêtres (class .window-close)
    document.querySelectorAll('.window-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const win = btn.closest('.window');
            if (win && win.id) closeWindow(win.id);
        });
    });

    // Boutons prev/next du carrousel (si présents)
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));

    // Formulaire de contact si présent (id="contact-form")
    const contactForm = document.getElementById('contact-form');
    if (contactForm) contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Message envoyé ! (Simulation - intégrez votre backend ici)');
        contactForm.reset();
    });

    // Boot screen hide after animation (id="boot-screen")
    setTimeout(function() {
        const bootScreen = document.getElementById('boot-screen');
        if (bootScreen) bootScreen.style.display = 'none';
    }, 3000);

    // Active draggable windows
    enableDraggableWindows();

    console.log('Script chargé : windows, projets, carrousel et téléchargement OK ✅');
});
