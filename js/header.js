const overlay = document.getElementById('overlay');
const video = document.getElementById('introVideo');
const message = document.getElementById('messageClick');
let pauseEffectuee = false;

// --- 1. PRÉPARATION DU TEXTE ---
const elementsToType = document.querySelectorAll('.hack-text:not(#messageClick)'); 
elementsToType.forEach(el => {
    el.dataset.originalText = el.innerText;
    el.innerText = "";
});

const headers = document.querySelectorAll('h1.hack-text, h2.hack-text'); 
const gridBoxes = document.querySelectorAll('.grid-box');
const footer = document.querySelector('.footer-section');


// --- 2. VÉRIFICATION DE LA MÉMOIRE (La partie importante) ---
window.addEventListener('load', function() {
    // Si l'overlay n'existe pas (ex: sur les autres pages), on arrête là
    if (!overlay) return;

    // Si on a DÉJÀ vu l'intro dans cette session
    if (sessionStorage.getItem('introSeen') === 'true') {
        overlay.style.display = 'none'; // On cache la vidéo direct
        startHeaderSequence(); // On lance l'écriture direct
    } 
    // Sinon, on laisse la vidéo visible (elle est visible par défaut en CSS)
});


// --- 3. GESTION VIDÉO (Seulement si l'overlay est présent) ---
if (overlay && video) {
    
    // A. AU CLIC
    overlay.addEventListener('click', function() {
        if (video.paused) {
            message.style.opacity = '0'; 
            video.play();
        }
    });

    // B. PAUSE À 8.5s
    video.addEventListener('timeupdate', function() {
        if (video.currentTime >= 8.5 && !pauseEffectuee) {
            video.pause();
            pauseEffectuee = true;
            message.innerText = "CLIQUER POUR CONTINUER";
            message.style.opacity = '1';
        }
    });

    // C. FIN VIDÉO -> ON ENREGISTRE EN MÉMOIRE
    video.addEventListener('ended', function() {
        // On note que l'intro est vue !
        sessionStorage.setItem('introSeen', 'true');
        
        overlay.style.display = 'none';
        
        setTimeout(() => {
            startHeaderSequence();
        }, 500);
    });
} else {
    // Si on est sur une page sans vidéo (ex: apropos.html), on affiche direct le contenu si besoin
    // (Mais tes autres pages n'ont pas l'animation d'écriture au chargement normalement)
}


// --- 4. SÉQUENCES D'ÉCRITURE ---
function startHeaderSequence() {
    typeWriterSpecificList(headers, 0, function() {
        revealBoxSequence(0);
    });
}

function revealBoxSequence(index) {
    if (index >= gridBoxes.length) {
        if(footer) footer.classList.add('box-visible');
        return;
    }
    const currentBox = gridBoxes[index];
    if(currentBox) {
        currentBox.classList.add('box-visible');
        const textElementsInBox = currentBox.querySelectorAll('.hack-text');
        typeWriterSpecificList(textElementsInBox, 0, function() {
            setTimeout(() => { revealBoxSequence(index + 1); }, 300); 
        });
    }
}

function typeWriterSpecificList(elementsList, elementIndex, onFinishedCallback) {
    if (elementIndex >= elementsList.length) {
        if (onFinishedCallback) onFinishedCallback();
        return;
    }
    const element = elementsList[elementIndex];
    if(element) {
        const text = element.dataset.originalText || "";
        let charIndex = 0;
        element.classList.add('typing-cursor');

        function typeChar() {
            if (charIndex < text.length) {
                element.innerText = text.substring(0, charIndex + 1);
                charIndex++;
                let randomSpeed = Math.floor(Math.random() * 30) + 20; 
                setTimeout(typeChar, randomSpeed);
            } else {
                element.classList.remove('typing-cursor');
                setTimeout(() => {
                    typeWriterSpecificList(elementsList, elementIndex + 1, onFinishedCallback);
                }, 100);
            }
        }
        typeChar();
    }
}

// --- 5. THEME ---
function toggleTheme() {
    const btn = document.getElementById('theme-btn');
    document.body.classList.toggle('light-mode');
    if(btn) {
        if (document.body.classList.contains('light-mode')) {
            btn.innerText = "MODE: LIGHT";
        } else {
            btn.innerText = "MODE: DARK";
        }
    }
}