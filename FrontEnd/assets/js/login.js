import { API_PREFIX } from './consts.js';

const performLogin = () => {
    // Récupérer les valeurs du formulaire
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // Effectuer une requête vers l'API
    fetch( API_PREFIX + "users/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
    })
    .then(response => response.json())
    .then(data => {
        // Vérifier la réponse de l'API
        if (data.userId && data.token) {
            // Connexion réussie
            localStorage.setItem('token', data.token);
            window.location.href = "index.html";
        } else {
            // Afficher un message d'erreur
            console.log('Réponse de l\'API:', data);
            document.getElementById("errorMessage").innerText = "Email ou mot de passe incorrect.";
        }
    })
    .catch((error) => {
        console.error('Erreur lors de la requête:', error);
    });
}

window.performLogin = performLogin;
