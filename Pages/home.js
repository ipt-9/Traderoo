document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("loggedInUser");
    
    if (!username) {
        console.warn("⚠️ Kein Benutzer eingeloggt.");
    } else {
        console.log("👤 Eingeloggter Benutzer:", username);
    }
});
