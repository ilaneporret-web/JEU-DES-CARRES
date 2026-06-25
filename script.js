console.log("JS chargé");

const boutonNormal = document.getElementById("bouton-jouer");
const boutonSurvie = document.getElementById("mode-survie");

const scoreLabel = document.getElementById("score-label");
const niveauLabel = document.getElementById("niveau-label");
const messageJeu = document.getElementById("message-jeu");
const zoneJeu = document.getElementById("zone-jeu");
const overlay = document.getElementById("overlay");

let score = 0;
let niveau = 1;

let jeuActif = false;
let interval;
let timeout;

let vitesseSpawn = 800;
let dureeCarre = 2000;

/* ---------------- RESET ---------------- */
function reset() {

    clearInterval(interval);
    clearTimeout(timeout);

    zoneJeu.innerHTML = "";

    score = 0;

    scoreLabel.textContent = "Score : 0";
    messageJeu.textContent = "";

    hideMessage(); 
}

/* ---------------- GAME OVER ---------------- */
function gameOver(msg) {

    jeuActif = false;

    clearInterval(interval);
    clearTimeout(timeout);

    showMessage(`${msg}\nScore final : ${score}`);
}

/* =================================================
   🔥 MODE SURVIE
================================================= */

function spawnSurvie() {

    const carre = document.createElement("div");
    carre.classList.add("cible");

    carre.style.backgroundColor = "green";
    carre.style.width = "50px";
    carre.style.height = "50px";
    carre.style.position = "absolute";

    carre.style.left = Math.random() * (zoneJeu.clientWidth - 50) + "px";
    carre.style.top = Math.random() * (zoneJeu.clientHeight - 50) + "px";

    zoneJeu.appendChild(carre);

    let clique = false;

    carre.addEventListener("click", (e) => {
        e.stopPropagation();

        if (!jeuActif) return;

        clique = true;

        score++;
        scoreLabel.textContent = `Score : ${score}`;

        // 🔥 ACCÉLÉRATION PLUS VISIBLE
        vitesseSpawn = Math.max(250, vitesseSpawn - 15);
        dureeCarre = Math.max(500, dureeCarre - 30);

        lancerSurvie();

        carre.remove();
    });

    setTimeout(() => {
        if (!clique && jeuActif) {
            gameOver("❌ Tu as raté un carré !");
        }
        carre.remove();
    }, dureeCarre);
}

function lancerSurvie() {
    clearInterval(interval);

    interval = setInterval(() => {
        spawnSurvie();
    }, vitesseSpawn);
}

function jouerSurvie() {

    reset();

    jeuActif = true;

    niveauLabel.textContent = "Mode : Survie";

    vitesseSpawn = 800;
    dureeCarre = 2000;

    lancerSurvie();
}

/* =================================================
   🟦 MODE NORMAL (AVEC NIVEAUX + COULEURS)
================================================= */

const couleursPieges = [
    "red",
    "blue",
    "yellow",
    "purple",
    "orange",
    "black",
    "pink",
    "cyan",
    "brown"
];

function obtenirCouleursActives() {
    let couleurs = ["green"];

    for (let i = 0; i < niveau - 1 && i < couleursPieges.length; i++) {
        couleurs.push(couleursPieges[i]);
    }

    return couleurs;
}

function spawnNormal() {

    const carre = document.createElement("div");
    carre.classList.add("cible");

    const couleursActives = obtenirCouleursActives();

    let couleur;

    if (Math.random() < 0.7) {
        couleur = "green";
    } else {
        couleur = couleursActives[Math.floor(Math.random() * couleursActives.length)];
    }

    carre.style.backgroundColor = couleur;
    carre.style.position = "absolute";
    carre.style.width = "50px";
    carre.style.height = "50px";

    carre.style.left = Math.random() * (zoneJeu.clientWidth - 50) + "px";
    carre.style.top = Math.random() * (zoneJeu.clientHeight - 50) + "px";

    zoneJeu.appendChild(carre);

    carre.addEventListener("click", (e) => {
        e.stopPropagation();

        if (!jeuActif) return;

        if (couleur === "green") {
            score++;
        } else {
            score--;
        }

        scoreLabel.textContent = `Score : ${score}`;

        carre.remove();
    });

    setTimeout(() => {
        carre.remove();
    }, 2000);
}
function jouerNormal() {

    reset();

    jeuActif = true;

    niveauLabel.textContent = `Niveau : ${niveau}`;

    interval = setInterval(spawnNormal, vitesseSpawn);

    timeout = setTimeout(() => {

        clearInterval(interval);
        jeuActif = false;

       const objectif = 30;

        if (score >= objectif && niveau < 10) {

            showMessage(`🔥 Niveau ${niveau} réussi`);

            setTimeout(() => {

                niveau++;
                hideMessage();

                jouerNormal(); // 🔥 auto next level

            }, 3000);

        } else {

            showMessage(`❌ Perdu ! Score : ${score}`);

        }

    }, 30000);
}

function showMessage(text) {
    overlay.style.display = "block";
    overlay.textContent = text;
}

function hideMessage() {
    overlay.style.display = "none";
}

/* ---------------- CLICK VIDE ---------------- */

zoneJeu.addEventListener("click", () => {
    if (jeuActif && niveauLabel.textContent === "Mode : Survie") {
        gameOver("💥 Tu as cliqué dans le vide !");
    }
});

/* ---------------- BOUTONS ---------------- */

boutonNormal.addEventListener("click", jouerNormal);
boutonSurvie.addEventListener("click", jouerSurvie);