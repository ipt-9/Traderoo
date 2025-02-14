document.addEventListener("DOMContentLoaded", function () {
    const registerButton = document.getElementById("registerButton");

    registerButton.addEventListener("click", async function () {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!username || !email || !password) {
            document.getElementById("message").innerText = "Bitte fülle alle Felder aus!";
            return;
        }

        const response = await fetch("http://localhost/traderoo_project/backend/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (data.message) {
            document.getElementById("message").innerText = "Registrierung erfolgreich!";
        } else {
            document.getElementById("message").innerText = data.error;
        }
    });
});
