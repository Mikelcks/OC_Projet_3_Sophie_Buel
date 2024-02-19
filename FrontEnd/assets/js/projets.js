import { API_PREFIX } from './consts.js';
import { logOut } from './functions.js';

function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

async function chargerProjets() {
    const reponse = await fetch( API_PREFIX + "works");
    const projets = await reponse.json();
    return projets;
}

function creerBtnModify() {
    var parentElement = document.getElementById('spanBtnModify');
  
    var button = document.createElement('button');
  
    button.id = 'btnModify';
  
    button.className = 'modif_button';
  
    var icone = document.createElement('i');
    icone.className = 'fa-regular fa-pen-to-square'; 
    button.appendChild(icone);
  
    var texteSpan = document.createElement('span');
    texteSpan.innerHTML = ' modifier';
    button.appendChild(texteSpan);

    parentElement.appendChild(button);
}

var modal;

document.addEventListener("DOMContentLoaded", function() { 
    modal = document.createElement("div");
    modal.id = "projectModal";
    modal.innerHTML = "<p>Contenu de la modal</p><button onclick=\"closeModal()\">Fermer la modal</button>";
    document.body.appendChild(modal);

    if (isLoggedIn()) {
        creerBtnModify();
        var btnModify = document.getElementById("btnModify");
        btnModify.addEventListener("click", openModal);
    }
});

function openModal() {
    var closeBtn = document.createElement("button");
    closeBtn.id = "closeBtn";
    closeBtn.innerHTML = "Fermer la modal";
    closeBtn.addEventListener("click", closeModal);

    // Ajouter des éléments à la modal
    modal.innerHTML = "<p>Contenu de la modal</p>";
    modal.appendChild(closeBtn);

    closeBtn.addEventListener("click", closeModal);

    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

function creerHeaderEdition () {
    var headerEditionDiv = document.createElement('div');

    headerEditionDiv .id = 'headerEdition';

    var icone = document.createElement('i')
    icone.className = 'fa-regular fa-pen-to-square'; 
    headerEditionDiv.appendChild(icone);

    var texteSpan = document.createElement('span');
    texteSpan.innerHTML = ' Mode édition';
    headerEditionDiv.appendChild(texteSpan);

    var body = document.getElementById('body')

    body.insertBefore(headerEditionDiv, body.firstChild);
}

async function initialiserPage() {
const projets = await chargerProjets();
genererProjet(projets);

    if (isLoggedIn()) {
        creerHeaderEdition();
        document.getElementById("loginList").innerText = "";
        document.getElementById("loginList").innerText = "logout";
        logOut();
    }

    const boutonTrierTous = document.getElementById("btnTous");
    boutonTrierTous.addEventListener("click", function () {
        chargerEtGenererProjet(async () => {
            const tous = projets.filter(function (projet) {
                return projet.category.id;
            });
            console.log(tous);
        });
    });

    const boutonTrierObjets = document.getElementById("btnObjets");
    boutonTrierObjets.addEventListener("click", function () {
        chargerEtGenererProjet(async () => {
        const objets = projets.filter(function (projet) {
            return projet.category.id === 1;
        });
        document.querySelector(".gallery").innerHTML = "";
        genererProjet(objets)
        console.log(objets);
    });
    });

    const boutonTrierAppartements = document.getElementById("btnAppartements");
    boutonTrierAppartements.addEventListener("click", function () {
        chargerEtGenererProjet(async () => {
        const appartements = projets.filter(function (projet) {
            return projet.category.id === 2;
        });
        document.querySelector(".gallery").innerHTML = "";
        genererProjet(appartements)
        console.log(appartements);
    });
    });

    const boutonTrierHotels_Restaurants = document.getElementById("btnHotels_Restaurants");
    boutonTrierHotels_Restaurants.addEventListener("click", function () {
        chargerEtGenererProjet(async () => {
        const Hotels_Restaurants = projets.filter(function (projet) {
            return projet.category.id === 3;
        });
        document.querySelector(".gallery").innerHTML = "";
        genererProjet(Hotels_Restaurants)
        console.log(Hotels_Restaurants);
    });
    });
}

function chargerEtGenererProjet(callback) {
    chargerProjets().then(projets => {
        document.querySelector(".gallery").innerHTML = "";
        genererProjet(projets);
        if (callback) {
            callback(projets);
        }
    }).catch(error => {
        console.error("Erreur lors du chargement des projets :", error);
    });
}



function genererProjet(projets){
for (let i = 0; i < projets.length; i++) {

    const figure = projets[i];
    const sectionGallery = document.querySelector(".gallery");
    const projetElement = document.createElement("figure");
    projetElement.dataset.id = projets[i].id;
    
    const imageElement = document.createElement("img");

    imageElement.src = figure.imageUrl;
    const descriptionElement = document.createElement("figcaption");
    descriptionElement.innerText = figure.title;

    
    sectionGallery.appendChild(projetElement);
    projetElement.appendChild(imageElement);
    projetElement.appendChild(descriptionElement)
    }
}

// Appel de la fonction pour initialiser la page
initialiserPage();

