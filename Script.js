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
    html: { src: 'html.png', label: 'HTML5' },
    css: { src: 'css.png', label: 'CSS3' },
    javascript: { src: 'javascript.png', label: 'JavaScript' },
    python: { src: 'python.png', label: 'Python' },
    php: { src: 'php.png', label: 'PHP' },
    mysql: { src: 'mysql.png', label: 'MySQL' },
    cpp: { src: 'cpp.png', label: 'C++' },
    arduino: { src: 'arduino.png', label: 'Arduino' }
};


// ==============================
// === ÉTAT GLOBAL / CAROUSEL ===
// ==============================
let currentSlide = 0;
let currentProject = null;


// ==============================
// === SNAKE GAME + LEADERBOARD ===
// ==============================
let snakeCanvas, snakeCtx;
let snakeGame = {
    snake: [{x: 10, y: 10}],
    food: {x: 15, y: 15},
    dx: 0,
    dy: 0,
    score: 0,
    highScore: 0,
    gameLoop: null,
    isRunning: false,
    isPaused: false,
    gridSize: 20,
    tileCount: 20
};

// LEADERBOARD - Stockage dans localStorage
function getLeaderboard() {
    const data = localStorage.getItem('snakeLeaderboard');
    return data ? JSON.parse(data) : [];
}

function saveLeaderboard(leaderboard) {
    localStorage.setItem('snakeLeaderboard', JSON.stringify(leaderboard));
}

function addScoreToLeaderboard(playerName, score) {
    const leaderboard = getLeaderboard();
    
    const newEntry = {
        name: playerName,
        score: score,
        date: new Date().toISOString()
    };
    
    leaderboard.push(newEntry);
    
    // Trier par score décroissant
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Garder seulement le top 10
    const top10 = leaderboard.slice(0, 10);
    
    saveLeaderboard(top10);
    displayLeaderboard();
    
    // Retourner le rang du joueur
    const rank = top10.findIndex(entry => 
        entry.name === playerName && 
        entry.score === score && 
        entry.date === newEntry.date
    ) + 1;
    
    return rank;
}

function displayLeaderboard() {
    const leaderboard = getLeaderboard();
    const listEl = document.getElementById('leaderboard-list');
    
    if (!listEl) return;
    
    if (leaderboard.length === 0) {
        listEl.innerHTML = '<div class="leaderboard-empty">Aucun score enregistré.<br>Soyez le premier à jouer !</div>';
        return;
    }
    
    listEl.innerHTML = '';
    
    leaderboard.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        
        const rank = index + 1;
        let rankClass = '';
        let rankIcon = `#${rank}`;
        
        if (rank === 1) {
            rankClass = 'gold';
            rankIcon = '🥇';
        } else if (rank === 2) {
            rankClass = 'silver';
            rankIcon = '🥈';
        } else if (rank === 3) {
            rankClass = 'bronze';
            rankIcon = '🥉';
        }
        
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
        });
        
        item.innerHTML = `
            <span class="leaderboard-rank ${rankClass}">${rankIcon}</span>
            <span class="leaderboard-player">${escapeHtml(entry.name)}</span>
            <span class="leaderboard-score">${entry.score} pts</span>
            <span class="leaderboard-date">${dateStr}</span>
        `;
        
        listEl.appendChild(item);
    });
    
    // Mettre à jour le high score
    if (leaderboard.length > 0) {
        snakeGame.highScore = leaderboard[0].score;
        const highScoreEl = document.getElementById('snake-high-score');
        if (highScoreEl) {
            highScoreEl.textContent = snakeGame.highScore;
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showPlayerNameModal(score) {
    // Créer l'overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'player-modal-overlay';
    
    // Créer le modal
    const modal = document.createElement('div');
    modal.className = 'player-name-modal';
    modal.innerHTML = `
        <h3>🎉 Nouveau Score : ${score} points !</h3>
        <p style="text-align: center; margin-bottom: 12px; color: #666;">
            Entrez votre nom pour le leaderboard :
        </p>
        <input type="text" id="player-name-input" maxlength="20" placeholder="Votre nom" autofocus>
        <div class="modal-buttons">
            <button onclick="submitPlayerName()">✅ Valider</button>
            <button onclick="cancelPlayerName()">❌ Annuler</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    
    // Focus sur l'input
    setTimeout(() => {
        const input = document.getElementById('player-name-input');
        if (input) {
            input.focus();
            // Soumettre avec Enter
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submitPlayerName();
                }
            });
        }
    }, 100);
}

function submitPlayerName() {
    const input = document.getElementById('player-name-input');
    const playerName = input ? input.value.trim() : '';
    
    if (!playerName) {
        alert('Veuillez entrer un nom valide !');
        return;
    }
    
    const score = snakeGame.score;
    const rank = addScoreToLeaderboard(playerName, score);
    
    // Fermer le modal
    closePlayerModal();
    
    // Afficher un message de félicitations
    if (rank <= 10) {
        alert(`🎉 Félicitations ${playerName} !\nVous êtes classé #${rank} avec ${score} points !`);
        
        // Highlight le score dans le leaderboard
        setTimeout(() => {
            highlightLeaderboardEntry(playerName, score);
        }, 100);
    }
}

function cancelPlayerName() {
    closePlayerModal();
}

function closePlayerModal() {
    const overlay = document.getElementById('player-modal-overlay');
    const modal = document.querySelector('.player-name-modal');
    
    if (overlay) overlay.remove();
    if (modal) modal.remove();
}

function highlightLeaderboardEntry(playerName, score) {
    const items = document.querySelectorAll('.leaderboard-item');
    items.forEach(item => {
        const nameEl = item.querySelector('.leaderboard-player');
        const scoreEl = item.querySelector('.leaderboard-score');
        
        if (nameEl && scoreEl) {
            const itemScore = parseInt(scoreEl.textContent);
            if (nameEl.textContent === playerName && itemScore === score) {
                item.classList.add('highlight');
                // Scroller vers l'élément
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    });
}

function initSnakeGame() {
    snakeCanvas = document.getElementById('snake-canvas');
    if (!snakeCanvas) return;
    
    snakeCtx = snakeCanvas.getContext('2d');
    
    // Charger et afficher le leaderboard
    displayLeaderboard();
    
    // Keyboard controls
    document.addEventListener('keydown', changeSnakeDirection);
}

function changeSnakeDirection(e) {
    if (!snakeGame.isRunning || snakeGame.isPaused) return;
    
    const key = e.key;
    const goingUp = snakeGame.dy === -1;
    const goingDown = snakeGame.dy === 1;
    const goingRight = snakeGame.dx === 1;
    const goingLeft = snakeGame.dx === -1;
    
    if ((key === 'ArrowLeft' || key === 'Left') && !goingRight) {
        snakeGame.dx = -1;
        snakeGame.dy = 0;
    }
    if ((key === 'ArrowUp' || key === 'Up') && !goingDown) {
        snakeGame.dx = 0;
        snakeGame.dy = -1;
    }
    if ((key === 'ArrowRight' || key === 'Right') && !goingLeft) {
        snakeGame.dx = 1;
        snakeGame.dy = 0;
    }
    if ((key === 'ArrowDown' || key === 'Down') && !goingUp) {
        snakeGame.dx = 0;
        snakeGame.dy = 1;
    }
}

function startSnakeGame() {
    if (snakeGame.isRunning && !snakeGame.isPaused) return;
    
    if (!snakeGame.isRunning) {
        snakeGame.snake = [{x: 10, y: 10}];
        snakeGame.food = {x: 15, y: 15};
        snakeGame.dx = 0;
        snakeGame.dy = 0;
        snakeGame.score = 0;
        
        const scoreEl = document.getElementById('snake-score');
        if (scoreEl) scoreEl.textContent = '0';
        drawSnakeGame();
    }
    
    snakeGame.isRunning = true;
    snakeGame.isPaused = false;
    snakeGame.gameLoop = setInterval(updateSnakeGame, 100);
}

function pauseSnakeGame() {
    if (!snakeGame.isRunning) return;
    
    snakeGame.isPaused = !snakeGame.isPaused;
    
    if (snakeGame.isPaused) {
        clearInterval(snakeGame.gameLoop);
    } else {
        snakeGame.gameLoop = setInterval(updateSnakeGame, 100);
    }
}

function resetSnakeGame() {
    clearInterval(snakeGame.gameLoop);
    snakeGame.snake = [{x: 10, y: 10}];
    snakeGame.food = {x: 15, y: 15};
    snakeGame.dx = 0;
    snakeGame.dy = 0;
    snakeGame.score = 0;
    snakeGame.isRunning = false;
    snakeGame.isPaused = false;
    
    const scoreEl = document.getElementById('snake-score');
    if (scoreEl) scoreEl.textContent = '0';
    drawSnakeGame();
}

function updateSnakeGame() {
    if (snakeGame.isPaused) return;
    
    if (snakeGame.dx === 0 && snakeGame.dy === 0) return;
    
    const head = {x: snakeGame.snake[0].x + snakeGame.dx, y: snakeGame.snake[0].y + snakeGame.dy};
    
    if (head.x < 0 || head.x >= snakeGame.tileCount || head.y < 0 || head.y >= snakeGame.tileCount) {
        gameOver();
        return;
    }
    
    for (let i = 0; i < snakeGame.snake.length; i++) {
        if (head.x === snakeGame.snake[i].x && head.y === snakeGame.snake[i].y) {
            gameOver();
            return;
        }
    }
    
    snakeGame.snake.unshift(head);
    
    if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
        snakeGame.score += 10;
        const scoreEl = document.getElementById('snake-score');
        if (scoreEl) scoreEl.textContent = snakeGame.score;
        generateFood();
    } else {
        snakeGame.snake.pop();
    }
    
    drawSnakeGame();
}

function generateFood() {
    snakeGame.food = {
        x: Math.floor(Math.random() * snakeGame.tileCount),
        y: Math.floor(Math.random() * snakeGame.tileCount)
    };
    
    for (let segment of snakeGame.snake) {
        if (segment.x === snakeGame.food.x && segment.y === snakeGame.food.y) {
            generateFood();
            return;
        }
    }
}

function drawSnakeGame() {
    if (!snakeCtx || !snakeCanvas) return;
    
    snakeCtx.fillStyle = '#e8e8e8';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    snakeCtx.strokeStyle = '#d0d0d0';
    snakeCtx.lineWidth = 1;
    for (let i = 0; i <= snakeGame.tileCount; i++) {
        snakeCtx.beginPath();
        snakeCtx.moveTo(i * snakeGame.gridSize, 0);
        snakeCtx.lineTo(i * snakeGame.gridSize, snakeCanvas.height);
        snakeCtx.stroke();
        
        snakeCtx.beginPath();
        snakeCtx.moveTo(0, i * snakeGame.gridSize);
        snakeCtx.lineTo(snakeCanvas.width, i * snakeGame.gridSize);
        snakeCtx.stroke();
    }
    
    snakeGame.snake.forEach((segment, index) => {
        if (index === 0) {
            snakeCtx.fillStyle = '#000';
        } else {
            snakeCtx.fillStyle = '#333';
        }
        snakeCtx.fillRect(
            segment.x * snakeGame.gridSize + 1,
            segment.y * snakeGame.gridSize + 1,
            snakeGame.gridSize - 2,
            snakeGame.gridSize - 2
        );
    });
    
    snakeCtx.fillStyle = '#ff0000';
    snakeCtx.fillRect(
        snakeGame.food.x * snakeGame.gridSize + 2,
        snakeGame.food.y * snakeGame.gridSize + 2,
        snakeGame.gridSize - 4,
        snakeGame.gridSize - 4
    );
    
    snakeCtx.fillStyle = '#00ff00';
    snakeCtx.fillRect(
        snakeGame.food.x * snakeGame.gridSize + snakeGame.gridSize / 2,
        snakeGame.food.y * snakeGame.gridSize + 2,
        4,
        4
    );
}

function gameOver() {
    clearInterval(snakeGame.gameLoop);
    snakeGame.isRunning = false;
    snakeGame.isPaused = false;
    
    const finalScore = snakeGame.score;
    
    if (!snakeCtx || !snakeCanvas) return;
    
    snakeCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    snakeCtx.fillStyle = '#fff';
    snakeCtx.font = 'bold 24px Arial';
    snakeCtx.textAlign = 'center';
    snakeCtx.fillText('GAME OVER', snakeCanvas.width / 2, snakeCanvas.height / 2 - 20);
    snakeCtx.font = '16px Arial';
    snakeCtx.fillText('Score: ' + finalScore, snakeCanvas.width / 2, snakeCanvas.height / 2 + 20);
    
    // Vérifier si le score mérite d'être dans le leaderboard
    const leaderboard = getLeaderboard();
    const isTopScore = leaderboard.length < 10 || finalScore > leaderboard[leaderboard.length - 1].score;
    
    if (isTopScore && finalScore > 0) {
        snakeCtx.fillText('🎉 Nouveau record ! 🎉', snakeCanvas.width / 2, snakeCanvas.height / 2 + 50);
        
        // Afficher le modal après un court délai
        setTimeout(() => {
            showPlayerNameModal(finalScore);
        }, 1000);
    } else {
        snakeCtx.fillText('Appuyez sur Démarrer pour rejouer', snakeCanvas.width / 2, snakeCanvas.height / 2 + 50);
    }
}

// ==============================
// === CONTACT FORM (EmailJS) ===
// ==============================
function handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const statusDiv = document.getElementById('contact-status');
    const submitBtn = form.querySelector('.form-button');
    
    if (!submitBtn) return;
    
    // Get form data
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector('textarea');
    
    if (!nameInput || !emailInput || !messageInput) {
        showContactStatus('Erreur: formulaire incomplet', 'error');
        return;
    }
    
    const formData = {
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value
    };
    
    // Disable button during send
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi...';
    
    
    // OPTION 2: Formspree (gratuit, sans code backend)
    // Inscription sur https://formspree.io/
    // Remplace FORM_ID par ton ID
    
    fetch('https://formspree.io/f/xgvnrzvr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            showContactStatus('Message envoyé avec succès ! ✅', 'success');
            form.reset();
        } else {
            showContactStatus('Erreur lors de l\'envoi. Réessayez.', 'error');
        }
    })
    .catch(error => {
        showContactStatus('Erreur réseau. Vérifiez votre connexion.', 'error');
        console.error('Error:', error);
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer';
    });
}

function showContactStatus(message, type) {
    let statusDiv = document.getElementById('contact-status');
    
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'contact-status';
        statusDiv.className = 'contact-form-status';
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.appendChild(statusDiv);
        }
    }
    
    statusDiv.textContent = message;
    statusDiv.className = 'contact-form-status ' + type;
    
    setTimeout(() => {
        statusDiv.className = 'contact-form-status';
    }, 5000);
}


// ==============================
// === FONCTIONS WINDOWS (OPEN/CLOSE/TOGGLE) ===
// ==============================
function toggleWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    win.classList.toggle('active');
    
    // Initialize snake game when window opens
    if (windowId === 'snake-window' && win.classList.contains('active')) {
        if (!snakeCtx) {
            initSnakeGame();
            drawSnakeGame();
        }
    }
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
    
    // Pause snake game when closing window
    if (windowId === 'snake-window' && snakeGame.isRunning) {
        pauseSnakeGame();
    }
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

    const titleEl = document.getElementById('project-detail-title');
    const nameEl = document.getElementById('project-detail-name');
    const descEl = document.getElementById('project-detail-description');

    if (titleEl) titleEl.textContent = project.title;
    if (nameEl) nameEl.textContent = project.title;
    if (descEl) descEl.textContent = project.description;

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
                icon.innerHTML = '<div style="font-size:14px;padding:6px;">' + t + '</div>';
            }

            techContainer.appendChild(icon);
        });
    }

    const downloadBtn = document.getElementById('download-button');
    if (downloadBtn) {
        downloadBtn.onclick = async function() {
            if (!currentProject || !currentProject.downloadLink) {
                alert("Aucun lien de téléchargement défini pour ce projet.");
                return;
            }

            let downloadURL = currentProject.downloadLink;

            if (downloadURL.includes("github.com") && downloadURL.includes("/blob/")) {
                downloadURL = downloadURL
                    .replace("github.com", "raw.githubusercontent.com")
                    .replace("/blob/", "/");
            }

            if (downloadURL.startsWith("github:")) {
                const repo = downloadURL.replace("github:", "");
                downloadURL = `https://github.com/${repo}/archive/refs/heads/main.zip`;
            }

            try {
                const response = await fetch(downloadURL);
                if (!response.ok) throw new Error("Impossible de télécharger le fichier.");
                const blob = await response.blob();

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;

                let fileName = downloadURL.split('/').pop() || 'download';
                fileName = fileName.split('?')[0];

                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } catch (err) {
                alert("Erreur pendant le téléchargement : " + err.message);
            }
        };
    }

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
    // CORRECTION: Gestionnaire pour les boutons de projets
    document.querySelectorAll('.project-button').forEach(btn => {
        const projectKey = btn.getAttribute('data-project');
        if (!projectKey) return;
        btn.addEventListener('click', function() {
            openProjectDetail(projectKey);
            document.querySelectorAll('.project-button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // CORRECTION: Gestionnaire pour les boutons de fermeture
    document.querySelectorAll('.window-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const win = btn.closest('.window');
            if (win && win.id) closeWindow(win.id);
        });
    });

    // CORRECTION: Gestionnaire pour les boutons de carrousel
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));

    // CORRECTION: Initialisation des fenêtres déplaçables
    enableDraggableWindows();

    // CORRECTION: Gestionnaire pour le formulaire de contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleSubmit);
    }
});
