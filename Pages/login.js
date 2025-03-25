document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");
    const messageBox = document.createElement("p"); // Message box for errors/success
    loginForm.appendChild(messageBox);

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page reload

        // Get input values
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        // Validate input
        if (!username || !password) {
            showMessage("Bitte fülle alle Felder aus!", "error");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("Server Response:", data); // Debugging

            if (data.success) {
                showMessage("✅ Login erfolgreich! Weiterleitung...", "success");

                // Save token in local storage
                console.log("Username from response:", data.username);


                localStorage.setItem("loggedInUser", data.username );
                


                setTimeout(() => {
                    window.location.href = "Home.html"; // Redirect to dashboard
                }, 2000);
            } else {
                showMessage(`❌ ${data.message}`, "error");
            }
        } catch (error) {
            console.error("❌ Fehler beim Login:", error);
            showMessage("Serverfehler. Bitte versuche es später erneut!", "error");
        }
    });

    // Function to show messages
    function showMessage(text, type) {
        messageBox.textContent = text;
        messageBox.style.color = type === "error" ? "red" : "green";
    }
});
