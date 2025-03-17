document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        console.error("❌ Error: The form with ID 'registerForm' was not found!");
        return;
    }

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page reload

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !email || !password) {
            alert("Please fill out all fields!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (data.success) {
                alert("✅ Registration successful! Redirecting...");
                localStorage.setItem("userToken", data.token);
                setTimeout(() => { window.location.href = "index.html"; }, 2000);
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            console.error("❌ Registration failed:", error);
            alert("Server error. Please try again later.");
        }
    });
});
