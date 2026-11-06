//Variable dont la valeur peut changer, elle est initialisée à null car aucune modale n'est ouverte au départ

let travaux = [];

//Création de la fonction permettant de récupérer les travaux. Usage de Await pour attendre la réponse serveur avant d'engager la suite des lignes de commande. Verification avec console.log

async function recupererTravaux() {
    const response = await fetch("http://localhost:5678/api/works");
    travaux = await response.json();


    const galerie = document.querySelector(".gallery");
    galerie.innerHTML = "";

    for (let i = 0; i < travaux.length; i++) {


        const figure = document.createElement("figure");
        galerie.appendChild(figure);

        const image = document.createElement("img");
        image.src = travaux[i].imageUrl;
        figure.appendChild(image);

        const legende = document.createElement("figcaption")
        legende.textContent = travaux[i].title;
        figure.appendChild(legende);



    }
    


}
//appel de la fonction pour récupérer les travaux et les afficher dans la galerie
recupererTravaux();

async function recupererCategories() {

    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    
    const filters = document.querySelector(".filters");
    const button = document.createElement("button");
    button.textContent = "Tous";
    button.classList.add("active");
    filters.appendChild(button);
    button.addEventListener("click", function () {
        document.querySelectorAll(".filters button").forEach(function (filtre) {
            filtre.classList.remove("active");
        });
        button.classList.add("active");
        recupererTravaux();
    });


for (let i = 0; i < categories.length; i++) {
    const button = document.createElement("button");
    button.textContent = categories[i].name;
    filters.appendChild(button);
    const idCategorie = categories[i].id;
    button.addEventListener("click", function () {
        document.querySelectorAll(".filters button").forEach(function (filtre) {
    filtre.classList.remove("active");
});

button.classList.add("active");
        const galerie = document.querySelector(".gallery");
        galerie.innerHTML = "";
        for (let i = 0; i < travaux.length; i++) {
            if (travaux[i].categoryId === idCategorie) {
                const figure = document.createElement("figure");
                galerie.appendChild(figure);

                const image = document.createElement("img");
                image.src = travaux[i].imageUrl;
                figure.appendChild(image);

                const legende = document.createElement("figcaption")
                legende.textContent = travaux[i].title;
                figure.appendChild(legende);
            }
        }
    });
}
}





recupererCategories();