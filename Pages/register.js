document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector("form");
    const messageBox = document.getElementById("message");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Verhindert das Neuladen der Seite

        // Eingabewerte abrufen
        const username = document.getElementById("Username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Überprüfung der Eingaben
        if (!username || !email || !password) {
            showMessage("Bitte fülle alle Felder aus!", "error");
            return;
        }

        if (!validateEmail(email)) {
            showMessage("Bitte gib eine gültige E-Mail-Adresse ein!", "error");
            return;
        }

        if (password.length < 6) {
            showMessage("Das Passwort muss mindestens 6 Zeichen lang sein!", "error");
            return;
        }

        // Temporäre Speicherung im Local Storage (später mit Datenbank ersetzen)
        const user = { username, email, password };
        localStorage.setItem("registeredUser", JSON.stringify(user));

        showMessage("Registrierung erfolgreich! Du wirst weitergeleitet...", "success");

        // Nach 2 Sekunden zur Login-Seite weiterleiten
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    });

    // Funktion zur E-Mail-Validierung
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Funktion zur Anzeige von Nachrichten
    function showMessage(text, type) {
        messageBox.textContent = text;
        messageBox.style.color = type === "error" ? "red" : "green";
    }
});
