const API_PREFIX = "http://localhost:5678/api/"

async function chargerProjets() {
    const reponse = await fetch(API_PREFIX + "works");
    const projets = await reponse.json();
    return projets;
  }
  
  async function initialiserPage() {
    const projets = await chargerProjets();
    genererProjet(projets);
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
