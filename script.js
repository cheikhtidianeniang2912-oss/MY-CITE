// ========================================
// RÉCUPÉRER LES ÉLÉMENTS HTML
// ========================================

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const refreshBtn =
    document.getElementById("refreshBtn");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

const resultCount =
    document.getElementById("resultCount");

const countriesContainer =
    document.getElementById("countriesContainer");


// ========================================
// URL DE L'API
// ========================================

const API_URL =
    "https://countries.dev/countries?fields=name,capital,region,population,flag,alpha2Code&sort=name";


// ========================================
// VARIABLE POUR STOCKER LES PAYS
// ========================================

let countries = [];


// ========================================
// CHARGER LES PAYS
// ========================================

async function loadCountries() {

    // Afficher le chargement

    loading.style.display = "block";

    loading.textContent =
        "⏳ Chargement...";


    // Nettoyer l'ancienne page

    error.textContent = "";

    resultCount.textContent = "";

    countriesContainer.innerHTML = "";


    try {

        // Envoyer la requête

        const response =
            await fetch(API_URL);


        // Vérifier la réponse

        if (!response.ok) {

            throw new Error(
                "Erreur HTTP : " +
                response.status
            );

        }


        // Transformer en JSON

        countries =
            await response.json();


        // Vérifier les données

        if (!Array.isArray(countries)) {

            throw new Error(
                "Les données reçues sont incorrectes."
            );

        }


        // Afficher tous les pays

        displayCountries(countries);


    } catch (err) {

        console.error(err);

        error.textContent =
            "❌ Impossible de charger les pays. Vérifiez votre connexion Internet.";

    } finally {

        // Cacher le chargement

        loading.style.display = "none";

    }
}


// ========================================
// AFFICHER LES PAYS
// ========================================

function displayCountries(list) {

    // Vider les anciennes cartes

    countriesContainer.innerHTML = "";


    // Effacer le message d'erreur

    error.textContent = "";


    // Afficher le nombre

    resultCount.textContent =
        list.length +
        " pays trouvé(s)";


    // Aucun pays

    if (list.length === 0) {

        error.textContent =
            "❌ Aucun pays trouvé.";

        return;
    }


    // Parcourir les pays

    list.forEach(function(country) {


        // Nom

        const name =
            country.name || "Nom inconnu";


        // Capitale

        const capital =
            country.capital || "Aucune capitale";


        // Région

        const region =
            country.region || "Inconnue";


        // Population

        let population =
            "Inconnue";


        if (
            country.population !== null &&
            country.population !== undefined
        ) {

            population =
                Number(
                    country.population
                ).toLocaleString("fr-FR");

        }


        // Drapeau

        const flag =
            country.flag || "🌍";


        // Créer la carte

        const card =
            document.createElement("div");


        card.className =
            "country-card";


        // Contenu de la carte

        card.innerHTML = `

            <div class="country-flag">
                ${flag}
            </div>

            <div class="country-info">

                <h3>
                    ${name}
                </h3>

                <p>
                    🏛️
                    <strong>Capitale :</strong>
                    ${capital}
                </p>

                <p>
                    🌍
                    <strong>Région :</strong>
                    ${region}
                </p>

                <p>
                    👥
                    <strong>Population :</strong>
                    ${population}
                </p>

                <p>
                    🆔
                    <strong>Code :</strong>
                    ${country.alpha2Code || "N/A"}
                </p>

            </div>

        `;


        // Ajouter la carte

        countriesContainer.appendChild(card);

    });
}


// ========================================
// RECHERCHER UN PAYS
// ========================================

function searchCountry() {

    // Récupérer le texte

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    // Si la barre est vide

    if (search === "") {

        displayCountries(countries);

        return;
    }


    // Rechercher dans les pays

    const results =
        countries.filter(function(country) {


            const name =
                (country.name || "")
                    .toLowerCase();


            const capital =
                (country.capital || "")
                    .toLowerCase();


            const code =
                (country.alpha2Code || "")
                    .toLowerCase();


            return (
                name.includes(search) ||
                capital.includes(search) ||
                code === search
            );

        });


    // Afficher les résultats

    displayCountries(results);

}


// ========================================
// BOUTON RECHERCHER
// ========================================

searchBtn.addEventListener(
    "click",
    function() {

        searchCountry();

    }
);


// ========================================
// RECHERCHE AVEC LA TOUCHE ENTRÉE
// ========================================

searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchCountry();

        }

    }
);


// ========================================
// BOUTON ACTUALISER
// ========================================

refreshBtn.addEventListener(
    "click",
    function() {

        // Vider la recherche

        searchInput.value = "";


        // Recharger les pays

        loadCountries();

    }
);


// ========================================
// LANCER L'APPLICATION
// ========================================

loadCountries();