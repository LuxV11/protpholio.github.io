// Project Data (défini globalement)
const projectsData = {
    project1: {
        title: "Application de Gestion de Tâches",
        description: "Application web complète pour la gestion de tâches avec interface rétro inspirée des anciens systèmes d'exploitation. Permet de créer, modifier et organiser des tâches avec un système de priorités et de catégories.",
        images: [
            "images/projects/project1-1.png",
            "images/projects/project1-2.png",
            "images/projects/project1-3.png"
        ],
        technologies: ['html', 'css', 'javascript'],
        downloadLink: "files/projet1.zip"
    },
    project2: {
        title: "Mini-Jeu Python",
        description: "Mini jeux de roulette come au casion ",
        images: [
            "images/projects/project2-1.png",
            "images/projects/project2-2.png"
        ],
        technologies: ['python'],
        downloadLink: "Roulette.py"
    },
    project3: {
        title: "Site Web Associatif",
        description: "Site web responsive avec système de gestion de contenu pour une association locale. Inclut un espace membre, un calendrier d'événements et une galerie photo. Base de données MySQL pour la gestion du contenu.",
        images: [
            "images/projects/project3-1.png",
            "images/projects/project3-2.png",
            "images/projects/project3-3.png"
        ],
        technologies: ['html', 'css', 'javascript', 'php', 'mysql'],
        downloadLink: "files/projet3.zip"
    },
    project4: {
        title: "Système Domotique Arduino",
        description: "Système embarqué de domotique intelligente utilisant Arduino. Contrôle de l'éclairage, température et sécurité. Interface web pour le monitoring en temps réel. Programmation en C++ et Python pour l'interface.",
        images: [
            "images/projects/project4-1.png",
            "images/projects/project4-2.png"
        ],
        technologies: ['cpp', 'python', 'arduino'],
        downloadLink: "files/projet4.zip"
    }
};

// Technology logos mapping
const techLogos = {
    html: { src: 'html.png', label: 'HTML5' },
    css: { src: 'css.png', label: 'CSS3' },
    javascript: { src: 'javascript.png', label: 'JavaScript' },
    python: { src: 'python.png', label: 'Python' },
    cpp: { src: 'cpp.png', label: 'C++' },
    php: { src: 'php.png', label: 'PHP' },
    mysql: { src: 'mysql.png', label: 'MySQL' },
    arduino: { src: 'arduino.png', label: 'Arduino' }
};

// Carousel state
let currentSlide = 0;
let currentProject = null;

// Window Management
function toggleWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win.classList.contains('active')) {
        win.classList.remove('active');
    } else {
        win.classList.add('active');
    }
}

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.classList.remove('active');
    }
}

// Form Handling
function handleSubmit(e) {
    e.preventDefault();
    alert('Message envoyé ! (Simulation - intégrez votre backend ici)');
    e.target.reset();
}

// Open Project Detail
function openProjectDetail(projectId) {
    currentProject = projectsData[projectId];
    currentSlide = 0;
    
    if (!currentProject) {
        console.error('Projet non trouvé:', projectId);
        return;
    }

    // Set title
    document.getElementById('project-detail-title').textContent = currentProject.title;
    document.getElementById('project-detail-name').textContent = currentProject.title;
    document.getElementById('project-detail-description').textContent = currentProject.description;

    // Build carousel
    const carouselContainer = document.getElementById('carousel-images');
    carouselContainer.innerHTML = '';
    
    currentProject.images.forEach((imgSrc, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide' + (index === 0 ? ' active' : '');
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = 'Screenshot ' + (index + 1);
        img.onerror = function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="20"%3EImage ' + (index + 1) + '%3C/text%3E%3C/svg%3E';
        };
        
        slide.appendChild(img);
        carouselContainer.appendChild(slide);
    });

    // Build dots
    const dotsContainer = document.getElementById('carousel-dots');
    dotsContainer.innerHTML = '';
    currentProject.images.forEach((img, index) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.onclick = function() {
            goToSlide(index);
        };
        dotsContainer.appendChild(dot);
    });

    // Build tech icons
    const techContainer = document.getElementById('tech-icons');
    techContainer.innerHTML = '';
    currentProject.technologies.forEach(tech => {
        const techData = techLogos[tech];
        if (techData) {
            const icon = document.createElement('div');
            icon.className = 'tech-icon';
            
            const iconImg = document.createElement('div');
            iconImg.className = 'tech-icon-img';
            
            const img = document.createElement('img');
            img.src = techData.src;
            img.alt = techData.label;
            img.onerror = function() {
                this.parentElement.innerHTML = '<div style="font-size:24px">' + tech.toUpperCase() + '</div>';
            };
            
            iconImg.appendChild(img);
            
            const label = document.createElement('div');
            label.className = 'tech-icon-label';
            label.textContent = techData.label;
            
            icon.appendChild(iconImg);
            icon.appendChild(label);
            techContainer.appendChild(icon);
        }
    });

    // Set download link
    const downloadBtn = document.getElementById('download-button');
    downloadBtn.onclick = function() {
        alert('Téléchargement de : ' + currentProject.downloadLink + '\n(Intégrez votre système de téléchargement ici)');
        // Pour activer le téléchargement réel, décommentez la ligne suivante :
        // window.location.href = currentProject.downloadLink;
    };

    // Open window
    toggleWindow('project-detail-window');
}

// Carousel controls
function changeSlide(direction) {
    if (!currentProject) return;
    
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    if (!currentProject) return;
    
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {

    // Draggable Windows - Desktop only
    let draggedWindow = null;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    document.querySelectorAll('.window-header').forEach(function(header) {
        header.addEventListener('mousedown', startDrag);
    });

    function startDrag(e) {
        // Disable dragging on mobile
        if (window.innerWidth < 768) return;
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
            
            // Keep window within screen bounds
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

    // Reset window positions on resize
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

    // Hide boot screen after animation
    setTimeout(function() {
        const bootScreen = document.getElementById('boot-screen');
        if (bootScreen) {
            bootScreen.style.display = 'none';
        }
    }, 3000);

    // Log pour debug
    console.log('Portfolio loaded successfully!');
    console.log('Projects data:', projectsData);
});
