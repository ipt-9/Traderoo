document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("userToken");

    if (!token) {
        console.log("⚠ Kein Token gefunden. Bitte einloggen!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/user/profile", {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (data.success && data.user) {
            const usernameElements = document.querySelectorAll(".username");
            usernameElements.forEach(el => el.textContent = data.user.Username || "Unbekannter Benutzer");

            const emailElement = document.getElementById("email");
            if (emailElement) emailElement.textContent = data.user.Email || "Keine E-Mail verfügbar";
        } else {
            console.log("⚠ Fehler beim Laden des Profils:", data.message);
        }
    } catch (error) {
        console.error("❌ Fehler beim Abrufen der Profil-Daten:", error);
    }
});
