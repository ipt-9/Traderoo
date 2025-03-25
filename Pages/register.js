document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm"); // Falls du `id="registerForm"` nutzt → `document.getElementById("registerForm")`
    const messageBox = document.createElement("p"); // Nachrichtenelement für Fehler/Erfolg
    registerForm.appendChild(messageBox);

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Seite nicht neuladen

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Validierung
        if (!username || !email || !password) {
            showMessage("Bitte fülle alle Felder aus!", "error");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            console.log("Server Response:", data); // Debug

            if (data.success) {
                showMessage("✅ Registrierung erfolgreich! Weiterleitung...", "success");

                // Speichern des Tokens in localStorage
                localStorage.setItem("userToken", data.token);
                localStorage.setItem("loggedInUser", JSON.stringify({ username })); // Username speichern

                setTimeout(() => {
                    window.location.href = "index.html"; // Weiterleitung
                }, 2000);
            
            }
        } catch (error) {
            console.error("❌ Fehler bei der Registrierung:", error);
            showMessage("Serverfehler. Bitte versuche es später erneut!", "error");
        }
    });

    function showMessage(text, type) {
        messageBox.textContent = text;
        messageBox.style.color = type === "error" ? "red" : "green";
    }
});
