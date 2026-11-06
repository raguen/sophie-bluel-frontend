//Sélection du formulaire

const formulaire = document.querySelector("#login form");

//Ecoute l'envoi du formulaire
formulaire.addEventListener("submit", async function (event) {
    event.preventDefault();




    //Récupération des données écrites par l'utilisateur
    const emailValue = document.querySelector("#email").value;
    const passwordValue = document.querySelector("#password").value;

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ //conversion du Javascript en JSON pour l'envoyer en requête serveur
            email: emailValue,
            password: passwordValue
        })
    });
    console.log(response.status);
    console.log(response.ok);
    //récupération du token de connexion
    const donnees = await response.json();
    if (response.ok) {
        sessionStorage.setItem("token", donnees.token);
        window.location.href = "./index.html";
    } else {
        alert("Adresse e-mail ou mot de passe incorrect.");
    }
    console.log(Object.keys(donnees)); //Permet de récupérer les noms des propriéts d'un objet Javascript (sous forme de tableau)
});