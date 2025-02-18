document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");
    const messageBox = document.createElement("p"); // Nachrichtenelement für Fehler/Erfolg
    loginForm.appendChild(messageBox);

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Verhindert das Neuladen der Seite

        // Eingabewerte abrufen
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Erwartete Login-Daten
        const validEmail = "test@123";
        const validPassword = "1234567890";

        // Validierung der Eingaben
        if (!email || !password) {
            showMessage("Bitte fülle alle Felder aus!", "error");
            return;
        }

        if (email !== validEmail || password !== validPassword) {
            showMessage("Falsche E-Mail oder falsches Passwort!", "error");
            return;
        }

        showMessage("Login erfolgreich! Weiterleitung...", "success");

        // Nach 2 Sekunden zur Startseite weiterleiten
        setTimeout(() => {
            window.location.href = "Home.html";
        }, 2000);
    });

    // Funktion zur Anzeige von Nachrichten
    function showMessage(text, type) {
        messageBox.textContent = text;
        messageBox.style.color = type === "error" ? "red" : "green";
    }
});
