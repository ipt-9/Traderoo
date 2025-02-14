import { useState } from "react";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5173/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem("userToken", data.token);
            setMessage("Registrierung erfolgreich! Du wirst weitergeleitet...");
            setTimeout(() => (window.location.href = "/"), 2000);
        } else {
            setMessage(data.error);
        }
    };

    return (
        <div className="register-container">
            <h2>Registrieren</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="E-Mail"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Passwort"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Konto erstellen</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
