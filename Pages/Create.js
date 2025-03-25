document.addEventListener("DOMContentLoaded", async function () {
    const imageUploadInput = document.getElementById("imageUpload");
    const addImageBox = document.getElementById("addImageBox");
    const imageContainer = document.querySelector(".image-upload");
    const productConditionDropdown = document.getElementById("productCondition");

    // 🔹 Lade Produktbedingungen aus der DB
    try {
        const response = await fetch("http://localhost:5000/api/products/conditions");
        const conditions = await response.json();
        productConditionDropdown.innerHTML = "<option value=''>Select Condition</option>";
        conditions.forEach(condition => {
            const option = document.createElement("option");
            option.value = condition.Condition_Name;
            option.textContent = condition.Condition_Name;
            productConditionDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Error loading conditions:", error);
        productConditionDropdown.innerHTML = "<option value=''>Error loading</option>";
    }

    // 🔹 Token prüfen
    const token = localStorage.getItem("userToken");
    if (!token) {
        alert("❌ Kein Login-Token gefunden. Bitte erneut einloggen.");
        window.location.href = "index.html";
        return;
    }

    // 🔹 Bilder-Upload (optional)
    addImageBox.addEventListener("click", () => imageUploadInput.click());
    imageUploadInput.addEventListener("change", event => {
        const files = event.target.files;
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = e => {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.classList.add("image-preview");

                const imageBox = document.createElement("div");
                imageBox.classList.add("image-box");
                imageBox.appendChild(img);

                imageContainer.insertBefore(imageBox, addImageBox);
            };
            reader.readAsDataURL(file);
        }
    });

    // 🔹 Trade erstellen
    document.getElementById("createTradeButton").addEventListener("click", async function () {
        const title = document.getElementById("title").value.trim();
        const estimatedValue = document.getElementById("estimatedValue").value.trim();
        const fk_Productcondition = document.getElementById("productCondition").value;

        if (!title || !estimatedValue || !fk_Productcondition) {
            alert("⚠️ Bitte fülle alle Pflichtfelder aus!");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", document.getElementById("description").value.trim());
        formData.append("brand", document.getElementById("brand").value.trim());
        formData.append("estimatedValue", estimatedValue);
        formData.append("weight", document.getElementById("weight").value.trim());
        formData.append("height", document.getElementById("height").value.trim());
        formData.append("depth", document.getElementById("depth").value.trim());
        formData.append("width", document.getElementById("width").value.trim());
        formData.append("fk_Productcondition", fk_Productcondition);

        for (let file of imageUploadInput.files) {
            formData.append("images", file);
        }

        try {
            const response = await fetch("http://localhost:5000/api/products/create", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}` // 🟢 WICHTIG!
                },
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                alert("✅ Trade erstellt!");
                window.location.href = "Create.html";
            } else {
                alert(`❌ Fehler: ${result.message}`);
            }
        } catch (error) {
            console.error("❌ Fehler beim Upload:", error);
            alert("Serverfehler. Versuche es später erneut.");
        }
    });
});
