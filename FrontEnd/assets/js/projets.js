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

    var previousBtn = document.createElement("button");
    previousBtn.id = "previousBtn";
    var iconePreviousModal = document.createElement('i')
    iconePreviousModal.className = 'fa-solid fa-arrow-left'
    previousBtn.appendChild(iconePreviousModal)
    previousBtn.addEventListener("click", () => {
        openModal();
    });  
    modal.appendChild(previousBtn);  

    const tileAddPhoto = document.createElement("h3");
    tileAddPhoto.textContent = "Ajout Photo";
    modal.appendChild(tileAddPhoto);
    
    const addPhotoContainer = document.createElement("container");
    addPhotoContainer.id = "add-photo-container";
    modal.appendChild(addPhotoContainer)

    const addPhotoDiv = document.createElement("div");
    addPhotoDiv.id = "add-photo-div";
    addPhotoContainer.appendChild(addPhotoDiv)

    const iconeAddPhoto = document.createElement('i');
    iconeAddPhoto.className = 'fa-regular fa-image';
    addPhotoDiv.appendChild(iconeAddPhoto);

    const btnAddPhoto = document.createElement("button");
    btnAddPhoto.id = "button-add-photo";
    btnAddPhoto.innerHTML = "+ Ajouter photo";
    addPhotoDiv.appendChild(btnAddPhoto);

    btnAddPhoto.addEventListener("click", function () {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".jpg, .jpeg, .png";
    fileInput.maxSize = 4 * 1024 * 1024;

    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (allowedTypes.includes(file.type)) {
                if (file.size <= fileInput.maxSize) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = new Image();
                        img.src = e.target.result;

                        img.onload = function () {
                            var aspectRatio = img.width / img.height;

                            var targetWidth = addPhotoDiv.clientWidth;
                            var targetHeight = targetWidth / aspectRatio;

                            if (targetHeight > addPhotoDiv.clientHeight) {
                                targetHeight = addPhotoDiv.clientHeight;
                                targetWidth = targetHeight * aspectRatio;
                            }

                            addPhotoDiv.innerHTML = "";
                            addPhotoDiv.style.backgroundImage = `url(${img.src})`;
                            addPhotoDiv.style.backgroundSize = `${targetWidth}px ${targetHeight}px`;
                            addPhotoDiv.style.backgroundRepeat = "no-repeat";
                            addPhotoDiv.style.backgroundPosition = "center center";
                        };
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert("La taille du fichier dépasse la limite de 4 Mo.");
                }
            } else {
                alert("Veuillez sélectionner un fichier au format jpg, jpeg ou png.");
            }
        }
    });

    fileInput.click();
});

    const photoFormat = document.createElement("p");
    photoFormat.textContent = "jpg, png : 4mo max";    
    addPhotoDiv.appendChild(photoFormat)

    const infoPhotoContainer = document.createElement("container");
    infoPhotoContainer.id = "info-photo-container";
    addPhotoContainer.appendChild(infoPhotoContainer)

    const titleAddPhoto = document.createElement("h4");
    titleAddPhoto.innerHTML = "Titre";
    const inputTitleAddPhoto = document.createElement("input");
    inputTitleAddPhoto.className = "input-new-project";
    const categoryAddPhoto = document.createElement("h4");
    categoryAddPhoto.innerHTML = "Catégorie";
    const selectCategoryAddPhoto = document.createElement("select");
    selectCategoryAddPhoto.className = "input-new-project";

    infoPhotoContainer.appendChild(titleAddPhoto);
    infoPhotoContainer.appendChild(inputTitleAddPhoto);
    infoPhotoContainer.appendChild(categoryAddPhoto);
    infoPhotoContainer.appendChild(selectCategoryAddPhoto);
    
    fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
        selectCategoryAddPhoto.innerHTML = "";
        
        data.forEach(category => {
            const optionElement = document.createElement("option");
            optionElement.value = category.id;
            optionElement.text = category.name;
            selectCategoryAddPhoto.appendChild(optionElement);
            });

        })
        .catch(error => console.error('Erreur lors de la récupération des catégories depuis l\'API:', error));

    const separatorLine = document.createElement("div");
    separatorLine.id = "separator-line";
    addPhotoContainer.appendChild(separatorLine);

    const btnSubmitProject = document.createElement("button");
    btnSubmitProject.id = "button-submit-project";
    btnSubmitProject.innerHTML = "Valider"

    inputTitleAddPhoto.addEventListener("input", function () {
        validateForm();
    });

    selectCategoryAddPhoto.addEventListener("change", function () {
        validateForm();
    });

    function validateForm() {
        const isTitleFilled = inputTitleAddPhoto.value.trim() !== "";
        const isCategorySelected = selectCategoryAddPhoto.value !== "";

        btnSubmitProject.disabled = !(isTitleFilled && isCategorySelected);
    }

    addPhotoContainer.appendChild(btnSubmitProject);

    btnSubmitProject.addEventListener("click", () => {
        const title = inputTitleAddPhoto.value.trim();
        const category = selectCategoryAddPhoto.value;
        const image = addPhotoDiv.style.backgroundImage.replace('url("', '').replace('")', '');

    if (title && category && image) {
        const newProjectData = {
            title: title,
            category: category,
            image: image,
        };

        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(newProjectData),
            })
            .then(response => {
                if (response.ok) {
                    // La requête a réussi, vous pouvez gérer la suite ici
                    console.log("Projet ajouté avec succès !");
                    // Vous pouvez également mettre à jour l'interface utilisateur ou effectuer d'autres actions nécessaires
                } else {
                    // La requête a échoué, gérer les erreurs ici
                    console.error('Erreur lors de l\'ajout du projet à l\'API:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la requête POST vers l\'API:', error);
            });
        } else {
            // Afficher un message d'erreur si certaines données sont manquantes
            alert("Veuillez remplir tous les champs avant de valider le projet.");
        }
    }});

};

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

