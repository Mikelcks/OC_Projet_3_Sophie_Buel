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
var userId;
var resizedImgDataUrl;

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
        const miniature = createMiniature(projet);
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

    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".jpg, .jpeg, .png";
    fileInput.maxSize = 4 * 1024 * 1024;

    let file
    btnAddPhoto.addEventListener("click", function () {
    let resizedImgDataUrl;

    fileInput.addEventListener("change", function (event) {
        file = event.target.files[0];

        if (file) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (allowedTypes.includes(file.type)) {
                if (file.size <= fileInput.maxSize) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = new Image();
                        img.src = e.target.result;

                        img.onload = function () {
                            var maxWidth = 610;
                            var maxHeight = 814;

                            if (img.width > maxWidth || img.height > maxHeight) {
                                if (img.width / maxWidth > img.height / maxHeight) {
                                    targetWidth = maxWidth;
                                    targetHeight = targetWidth / aspectRatio;
                                } else {
                                    targetHeight = maxHeight;
                                    targetWidth = targetHeight * aspectRatio;
                                }
                            } else {
                                targetWidth = img.width;
                                targetHeight = img.height;
                            }
    
                            var aspectRatio = img.width / img.height;
    
                            var targetWidth = addPhotoDiv.clientWidth;
                            var targetHeight = targetWidth / aspectRatio;
    
                            if (targetHeight > addPhotoDiv.clientHeight) {
                                targetHeight = addPhotoDiv.clientHeight;
                                targetWidth = targetHeight * aspectRatio;
                            }
    
                            var canvas = document.createElement("canvas");
                            var ctx = canvas.getContext("2d");
    
                            canvas.width = targetWidth;
                            canvas.height = targetHeight;
    
                            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    
                            resizedImgDataUrl = canvas.toDataURL(file.type);
    
                            addPhotoDiv.innerHTML = "";
                            addPhotoDiv.style.backgroundImage = `url(${resizedImgDataUrl})`;
                            addPhotoDiv.style.backgroundSize = `${targetWidth}px ${targetHeight}px`;
                            addPhotoDiv.style.width = `${addPhotoDiv.clientWidth}px`;
                            addPhotoDiv.style.height = `${addPhotoDiv.clientHeight}px`;
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
    
    fetch( API_PREFIX + 'categories')
    .then(response => response.json())
    .then(data => {

        const emptyOptionElement = document.createElement("option");
        emptyOptionElement.value = "";
        emptyOptionElement.text = "";
        selectCategoryAddPhoto.appendChild(emptyOptionElement);
        
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

    validateForm();

    inputTitleAddPhoto.addEventListener("input", function () {
        validateForm();
    });

    selectCategoryAddPhoto.addEventListener("change", function () {
        validateForm();
    });

    function validateForm() {
        const isTitleFilled = inputTitleAddPhoto.value.trim() !== "";
        const isCategorySelected = selectCategoryAddPhoto.value !== "";
        const isFileSelected = fileInput.files.length > 0;

        btnSubmitProject.disabled = !(isTitleFilled && isCategorySelected && isFileSelected);

    if (btnSubmitProject.disabled) {
        btnSubmitProject.style.cursor = "not-allowed";
    } else {
        btnSubmitProject.style.cursor = "pointer";
    }
    }

    addPhotoContainer.appendChild(btnSubmitProject);

    btnSubmitProject.addEventListener("click", e => {
        e.preventDefault();
        const title = inputTitleAddPhoto.value;
        const categoryId = selectCategoryAddPhoto.value;
        const accessToken = localStorage.getItem('token');

        const formData = new FormData();

        formData.append('image', file);
        formData.append('title', title);
        formData.append('category', categoryId);
        formData.append('userId', userId);

        fetch(API_PREFIX + 'works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Réponse de l\'API :', data);
            chargerProjets().then(projetsCharge => {
                document.querySelector(".gallery").innerHTML = "";
                genererProjet(projetsCharge);
            });
        })
        .catch(error => {
            console.error('Erreur lors de l\'envoi des données à l\'API :', error);
        });
    });
}

function deleteProject(id) {
    const apiUrl = API_PREFIX + 'works/' + id;
    const accessToken = localStorage.getItem('token');

    fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => {
        if (response.ok) {
            console.log('Projet supprimé avec succès');
        } else if (response.status === 401) {
            console.error('Non autorisé');
        } else {
            console.error('Erreur inattendue:', response.status);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la suppression du projet:', error);
    });
}

function createMiniature(projet) {
    const miniatureElement = document.createElement("div");
    miniatureElement.classList.add("miniature");

    const miniatureImage = document.createElement("img");
    miniatureImage.src = projet.imageUrl;
    miniatureImage.alt = projet.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.id = "deleteBtn";
    const iconeTrashCan = document.createElement('i')
    iconeTrashCan.className = 'fa-solid fa-trash-can'
    deleteBtn.appendChild(iconeTrashCan)

    deleteBtn.addEventListener('click', () => {
        const projectId = projet.id;

        deleteProject(projectId);
    });

    miniatureElement.appendChild(miniatureImage);
    miniatureElement.appendChild(deleteBtn);

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
        userId = "1";
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
