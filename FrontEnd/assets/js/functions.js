import { API_PREFIX } from "./consts.js";

export const logOutEvent = () => {
  const loginList = document.getElementById("loginList");

  if (loginList.textContent === "logout") {
    loginList.addEventListener("click", () => {
      window.localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }
};

export function generateProject(projects) {
  for (let i = 0; i < projects.length; i++) {
    const figure = projects[i];
    const sectionGallery = document.querySelector(".gallery");
    const projectElement = document.createElement("figure");
    projectElement.dataset.id = projects[i].id;

    const imageElement = document.createElement("img");

    imageElement.src = figure.imageUrl;
    const descriptionElement = document.createElement("figcaption");
    descriptionElement.innerText = figure.title;

    sectionGallery.appendChild(projectElement);
    projectElement.appendChild(imageElement);
    projectElement.appendChild(descriptionElement);
  }
}

export async function loadProjects() {
  const reponse = await fetch(API_PREFIX + "works");
  const projects = await reponse.json();
  return projects;
}

export function loadAndGenerateProject(callback) {
  loadProjects()
    .then((projectsCharge) => {
      document.querySelector(".gallery").innerHTML = "";
      generateProject(projectsCharge);
      if (callback) {
        callback(projectsCharge);
      }
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des projects :", error);
    });
}

export function generateButtons(categories, projects) {
  const filtersContainer = document.getElementById("filters");

  categories.forEach((categorie) => {
    const button = document.createElement("button");
    button.textContent = categorie.name;
    button.classList.add("filter_button");
    button.addEventListener("click", function () {
      loadAndGenerateProject(() => {
        const projectsFilters = projects.filter((project) => {
          return project.category.id === categorie.id;
        });
        document.querySelector(".gallery").innerHTML = "";
        generateProject(projectsFilters);
        console.log(projectsFilters);
      });
    });

    filtersContainer.appendChild(button);
  });
}

export function createCustomElement(parentElement, elementType, elementId, className, textContent) {
  const element = document.createElement(elementType);
  if (elementId) {
    element.id = elementId;
  }
  if (className) {
    element.className = className;
  }
  if (textContent) {
    element.textContent = textContent;
  }
  parentElement.appendChild(element);
}
