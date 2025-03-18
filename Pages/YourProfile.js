document.addEventListener("DOMContentLoaded", async function () {
    const userToken = localStorage.getItem("userToken"); // Token aus dem Local Storage holen
    if (!userToken) {
        window.location.href = "index.html"; // Falls nicht eingeloggt, weiterleiten
        return;
    }

    try {
        // Benutzerinformationen abrufen
        const userResponse = await fetch("http://localhost:5000/api/auth/user", {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            }
        });

        const userData = await userResponse.json();
        if (!userResponse.ok) throw new Error(userData.message);

        // Benutzername in das Profil einfügen
        document.querySelector(".subtitle").textContent = `Hello, I'm ${userData.name}`;
        document.getElementById("username").textContent = userData.name;

        // Profil-Card aktualisieren
        document.querySelector(".profile-card .name").textContent = userData.name;
        document.querySelector(".profile-card .username").textContent = userData.email;

        // Trades des Benutzers abrufen
        const tradesResponse = await fetch(`http://localhost:5000/api/trades?userId=${userData.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            }
        });

        const tradesData = await tradesResponse.json();
        if (!tradesResponse.ok) throw new Error(tradesData.message);

        // Container für Trades leeren und mit neuen Daten befüllen
        const cardContainer = document.querySelector(".card-container");
        cardContainer.innerHTML = ""; // Bestehende Karten entfernen

        tradesData.forEach(trade => {
            const tradeCard = document.createElement("div");
            tradeCard.classList.add("card");

            tradeCard.innerHTML = `
                
                <h4>${trade.title}</h4>
                <p>${trade.description}</p>
                <button class="match-button">Edit</button>
                <p>${trade.views} Views</p>
            `;

            cardContainer.appendChild(tradeCard);
        });

    } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
    }
});
