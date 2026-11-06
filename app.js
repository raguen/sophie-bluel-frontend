let modal = null;

//sélectionne la galerie modale pour y ajouter les travaux
const galerieModale = document.querySelector(".modal-gallery");


function afficherGalerieModale() {
    //vide la gallerie modale avant d'y ajouter les travaux
    galerieModale.innerHTML = "";

    for (let i = 0; i < travaux.length; i++) {

        const figure = document.createElement("figure");
        galerieModale.appendChild(figure);

        const image = document.createElement("img");
        image.src = travaux[i].imageUrl;
        figure.appendChild(image);

        // const legende = document.createElement("figcaption")
        // legende.textContent = travaux[i].title;
        // figure.appendChild(legende);

        const boutonSupprimer = document.createElement("button");
        const iconeCorbeille = document.createElement("img");
        iconeCorbeille.src = "./assets/icons/Corbeille.svg";
        iconeCorbeille.alt = "";
        boutonSupprimer.appendChild(iconeCorbeille);
        figure.appendChild(boutonSupprimer);
        boutonSupprimer.dataset.id = travaux[i].id;
        boutonSupprimer.addEventListener("click", async function () {
            const id = boutonSupprimer.dataset.id;
            const token = sessionStorage.getItem("token");
            if (!confirm("Voulez-vous vraiment supprimer ce travail ?")) {
                return;
            }

            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                figure.remove();
                await recupererTravaux();
                console.log("Suppression confirmée :", id);
            } else {
                console.log("Échec de la suppression :", response.status);
            }
        });
    }
}

const openModal = function (e) {
    e.preventDefault()
    modal = document.querySelector(e.currentTarget.getAttribute('href'))
    modal.style.display = null
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

    afficherGalerieModale();
    modal.setAttribute('aria-modal', 'true');
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    // Annuler l'ajout en cours
    reinitialiserAjoutPhoto();

    // Préparer la prochaine ouverture sur la galerie
    vueAjout.style.display = "none";
    vueGalerie.style.display = "block";    
    document.querySelector(".js-modal").focus();
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}


document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)

})

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }   
})

// Gestion de l'affichage de la vue d'ajout de photo

const boutonAjouterPhoto = document.querySelector(".js-add-photo");
const vueGalerie = document.querySelector(".modal-gallery-view");
const vueAjout = document.querySelector(".modal-add-view");

boutonAjouterPhoto.addEventListener("click", function () {
    vueGalerie.style.display = "none";
    vueAjout.style.display = "block";
});

// Gestion du bouton retour dans la vue d'ajout de photo
const boutonRetour = document.querySelector(".js-modal-back");

boutonRetour.addEventListener("click", function () {
    vueAjout.style.display = "none";
    vueGalerie.style.display = "block";

    reinitialiserAjoutPhoto();

});



async function remplirCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    console.log(categories);
    const selectCategories = document.querySelector("#categorie-photo");
    for (let i = 0; i < categories.length; i++) {

        const option = document.createElement("option");
        option.value = categories[i].id;
        option.textContent = categories[i].name;
        selectCategories.appendChild(option);
        console.log(i, categories[i].name);


    }
}


remplirCategories();

const formulaireAjout = document.querySelector(".add-photo-form");

formulaireAjout.addEventListener("submit", async function (event) {
    event.preventDefault();

    const donnees = new FormData(formulaireAjout);
    const token = sessionStorage.getItem("token");

    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: donnees
    });

    if (response.ok) {
        await recupererTravaux();
        
        reinitialiserAjoutPhoto();
        afficherGalerieModale();

        document.querySelector(".modal-add-view").style.display = "none";
        document.querySelector(".modal-gallery-view").style.display = "block";

        console.log("Photo ajoutée avec succès !");
    } else {
        console.log("Erreur lors de l'ajout :", response.status);
    }
});

// Gestion de l'affichage du lien "Modifier" en fonction de la connexion
const lienModifier = document.querySelector(".js-modal");
const estConnecte = sessionStorage.getItem("token");

if (estConnecte) {
    lienModifier.style.display = "inline";
    document.querySelector(".filters").style.display = "none";
    document.querySelector(".edit-banner").style.display = "flex";
    document.body.classList.add("mode-edition-actif");
} else {
    lienModifier.style.display = "none";
}

// Gestion du lien "login/logout" en fonction de la connexion
const lienAuth = document.querySelector("#auth-link");

if (estConnecte) {
    lienAuth.textContent = "logout";

    lienAuth.addEventListener("click", function (event) {
        event.preventDefault();
        sessionStorage.removeItem("token");
        window.location.reload();
    });
}

const champPhoto = document.querySelector("#photo");

const apercuPhoto = document.querySelector("#photo-preview");

champPhoto.addEventListener("change", function () {
    const fichier = champPhoto.files[0];
    if (fichier && !["image/jpeg", "image/png"].includes(fichier.type)) {
        alert("Seules les images JPG et PNG sont acceptées.");

        champPhoto.value = "";
        apercuPhoto.removeAttribute("src");
        apercuPhoto.style.display = "none";

        verifierFormulaire();
        return;
    }
    if (fichier && fichier.size > 4 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 4 Mo.");

        champPhoto.value = "";
        apercuPhoto.removeAttribute("src");
        apercuPhoto.style.display = "none";

        verifierFormulaire();
        return;
    }

    if (fichier) {
        apercuPhoto.src = URL.createObjectURL(fichier);
        apercuPhoto.style.display = "block";
    }
});

const boutonValider = document.querySelector(".js-submit-photo");
const champTitre = document.querySelector("#titre-photo");
const champCategorie = document.querySelector("#categorie-photo");

function verifierFormulaire() {
    const photoChoisie = champPhoto.files.length > 0;
    const titreRenseigne = champTitre.value.trim() !== "";
    const categorieChoisie = champCategorie.value !== "";

    boutonValider.disabled = !(photoChoisie && titreRenseigne && categorieChoisie);
}

// Ajout des écouteurs d'événements pour vérifier le formulaire à chaque modification

formulaireAjout.addEventListener("input", verifierFormulaire);
formulaireAjout.addEventListener("change", verifierFormulaire);

// Fonction pour réinitialiser le formulaire d'ajout de photo et l'aperçu de la photo sélectionnée

function reinitialiserAjoutPhoto() {
    formulaireAjout.reset();
    apercuPhoto.removeAttribute("src");
    apercuPhoto.style.display = "none";
    verifierFormulaire();
}