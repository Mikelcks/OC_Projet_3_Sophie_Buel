const reponse = await fetch("projets-design.json")
const projets = await reponse.json();


for (let i = 0; i < projets.length; i++) {

    const figure = projets[i];
    const sectionGallery = document.querySelector(".gallery");
    const projetElement = document.createElement("figure");
    projetElement.dataset.id = projets[i].id;
    
    const imageElement = document.createElement("img");
    imageElement.src = figure.img;
    const descriptionElement = document.createElement("figcaption");
    descriptionElement.innerText = figure.description;


    sectionGallery.appendChild(projetElement);
    projetElement.appendChild(imageElement);
    projetElement.appendChild(descriptionElement)
}

