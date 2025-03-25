document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page reload

        const username = document.getElementById("username").value.trim(); // 🟢 Use username field
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("⚠️ Please fill in all fields!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }) // 🟢 Send username instead of email
            });

            const data = await response.json();
            console.log("✅ Login Response:", data); // Debugging

            if (data.success && data.user) {
                alert("✅ Login successful!");

                // ✅ Store user object in `localStorage`
                localStorage.setItem("loggedInUser", JSON.stringify({
                    username: data.user.username,
                    email: data.user.email
                }));

                window.location.href = "Home.html"; // Redirect to home page
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            console.error("❌ Login Error:", error);
            alert("Server error. Try again later.");
        }
    });
});
