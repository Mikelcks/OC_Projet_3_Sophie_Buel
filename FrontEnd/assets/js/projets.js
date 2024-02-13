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
    var parentElement = document.getElementById('divBtnModify');
  
    var bouton = document.createElement('button');
  
    bouton.id = 'btnModify';
  
    bouton.className = 'modif_button';
  
    var icone = document.createElement('i');
    icone.className = 'fa-regular fa-pen-to-square'; 
    bouton.appendChild(icone);
  
    var texteSpan = document.createElement('span');
    texteSpan.innerHTML = ' modifier';

    bouton.appendChild(texteSpan);
    parentElement.appendChild(bouton);
}

async function initialiserPage() {
const projets = await chargerProjets();
genererProjet(projets);

    if (isLoggedIn()) {
        creerBtnModify();
        document.getElementById("loginList").innerText = "";
        document.getElementById("loginList").innerText = "logout";
        logOut();
    }

    const boutonTrierTous = document.getElementById("btnTous");
    boutonTrierTous.addEventListener("click", function () {
        const tous = projets.filter(function (projet) {
            return projet.category.id;
        });
        document.querySelector(".gallery").innerHTML = "";
        genererProjet(tous)
        console.log(tous);
    });

    const boutonTrierObjets = document.getElementById("btnObjets");
    boutonTrierObjets.addEventListener("click", function () {
        const objets = projets.filter(function (projet) {
            return projet.category.id === 1;
        });
        document.querySelector(".gallery").innerHTML = "";
        genererProjet(objets)
        console.log(objets);
    });

    const boutonTrierAppartements = document.getElementById("btnAppartements");
    boutonTrierAppartements.addEventListener("click", function () {
        const appartements = projets.filter(function (projet) {
            return projet.category.id === 2;
        });
        document.querySelector(".gallery").innerHTML = "";
        genererProjet(appartements)
        console.log(appartements);
    });

    const boutonTrierHotels_Restaurants = document.getElementById("btnHotels_Restaurants");
    boutonTrierHotels_Restaurants.addEventListener("click", function () {
        const Hotels_Restaurants = projets.filter(function (projet) {
            return projet.category.id === 3;
        });
        document.querySelector(".gallery").innerHTML = "";
        genererProjet(Hotels_Restaurants)
        console.log(Hotels_Restaurants);
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

