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
var overlay;
var projets;
var btnAddProject;

document.addEventListener("DOMContentLoaded", function() { 
    modal = document.createElement("div");
    modal.id = "projectModal";
    document.body.appendChild(modal);

    overlay = document.createElement("div");
    overlay.id = "modalOverlay";
    document.body.appendChild(overlay);

    if (isLoggedIn()) {
        creerBtnModify();
        var btnModify = document.getElementById("btnModify");
        btnModify.addEventListener("click", openModal);
    }

    overlay.addEventListener("click", function(event) {
        if (event.target === overlay) {
            closeModal();
            btnModify.disabled = false;
        }
    });
});

function openModal() {
    modal.innerHTML = "";

    btnModify.disabled = true;
    var closeBtn = document.createElement("button");
    closeBtn.id = "closeBtn";
    var iconeCloseModal = document.createElement('i')
    iconeCloseModal.className = 'fa-solid fa-xmark'
    closeBtn.appendChild(iconeCloseModal)
    closeBtn.addEventListener("click", () => {
        closeModal();
        btnModify.disabled = false;
    });

    modal.appendChild(closeBtn);

    const galerieText = document.createElement("h3");
    galerieText.textContent = "Galerie Photo";
    modal.appendChild(galerieText);

    const miniatureContainer = document.createElement("container");
    miniatureContainer.id = "miniature-container";

    modal.appendChild(miniatureContainer)

    const miniatureGallery = document.createElement("div");
    miniatureGallery.id = "miniature-gallery";

    miniatureContainer.appendChild(miniatureGallery);

    projets.forEach((projet) => {
        const miniature = creerMiniature(projet);
        miniatureGallery.appendChild(miniature);
    });

    const separatorLine = document.createElement("div");
    separatorLine.id = "separator-line";
    miniatureContainer.appendChild(separatorLine);

    const btnAddProject = document.createElement("button");
    btnAddProject.id = "button-add-project";
    btnAddProject.innerHTML = "Ajouter une photo"

    miniatureContainer.appendChild(btnAddProject);

    btnAddProject.addEventListener("click", () => {
        addNewProject();
    });

    modal.style.display = "block";
    overlay.style.display = "block";
}

function addNewProject() {
    modal.innerHTML = ""

    const tileAddPhoto = document.createElement("h3");
    tileAddPhoto.textContent = "Ajout Photo";
    modal.appendChild(tileAddPhoto);
    
    const addPhotoContainer = document.createElement("container");
    addPhotoContainer.id = "add-photo-container";
    modal.appendChild(addPhotoContainer)

    const addPhotoLabel = document.createElement("label");
    addPhotoLabel.id = "add-photo-label";
    addPhotoContainer.appendChild(addPhotoLabel)

    const iconeAddPhoto = document.createElement('i');
    iconeAddPhoto.className = 'fa-regular fa-image';
    addPhotoLabel.appendChild(iconeAddPhoto);

    const btnAddPhoto = document.createElement("button");
    btnAddPhoto.id = "button-add-photo";
    btnAddPhoto.innerHTML = "+ Ajouter photo";
    addPhotoLabel.appendChild(btnAddPhoto);

    const photoFormat = document.createElement("p");
    photoFormat.textContent = "jpg, png : 4mo max";    
    addPhotoLabel.appendChild(photoFormat)
}

function creerMiniature(projet) {
    const miniatureElement = document.createElement("div");
    miniatureElement.classList.add("miniature");

    const miniatureImage = document.createElement("img");
    miniatureImage.src = projet.imageUrl;
    miniatureImage.alt = projet.title;

    miniatureElement.appendChild(miniatureImage);

    return miniatureElement;
}

function closeModal() {
    modal.style.display = "none";

    overlay.style.display = "none";
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
projets = await chargerProjets();
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
    chargerProjets().then(projetsCharge => {
        document.querySelector(".gallery").innerHTML = "";
        genererProjet(projetsCharge);
        if (callback) {
            callback(projetsCharge);
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

