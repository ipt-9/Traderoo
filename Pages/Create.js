document.addEventListener("DOMContentLoaded", async function () {
    const imageUploadInput = document.getElementById("imageUpload");
    const addImageBox = document.getElementById("addImageBox");
    const imageContainer = document.querySelector(".image-upload");
    const productConditionDropdown = document.getElementById("productCondition");

    // 🟢 Load product conditions from the database
    try {
        console.log("Fetching product conditions...");
        const response = await fetch("http://localhost:5000/api/products/conditions");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const conditions = await response.json();
        console.log("✅ Product conditions received:", conditions);

        productConditionDropdown.innerHTML = "<option value=''>Select Condition</option>"; // Clear previous options

        conditions.forEach(condition => {
            const option = document.createElement("option");
            option.value = condition.Condition_Name; // Foreign Key
            option.textContent = condition.Condition_Name;
            productConditionDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Error fetching product conditions:", error);
        productConditionDropdown.innerHTML = "<option value=''>Error loading conditions</option>";
    }

    console.log("🔍 Checking stored user before parsing:", localStorage.getItem("loggedInUser"));

    let loggedInUser = localStorage.getItem("loggedInUser");

    // ✅ Ensure user is logged in
    if (!loggedInUser) {
        alert("⚠️ No user logged in! Please log in first.");
        window.location.href = "index.html"; // Redirect to login page
        return;
    }

    try {
        loggedInUser = JSON.parse(loggedInUser); // ✅ Parse JSON safely

        // ✅ Ensure required fields exist
        if (!loggedInUser.username || !loggedInUser.email) {
            throw new Error("Missing required user fields.");
        }
    } catch (error) {
        console.error("❌ Error parsing stored user JSON:", error);
        alert("⚠️ Invalid user data stored. Please log in again.");
        localStorage.removeItem("loggedInUser"); // Remove invalid data
        window.location.href = "index.html"; // Redirect to login page
        return;
    }

    console.log("✅ Successfully retrieved user:", loggedInUser);

    const fk_Username = loggedInUser.username; // ✅ Attach Username to FormData
    if (!fk_Username) {
        alert("⚠️ No username found in stored user data!");
        return;
    }

    // 🟢 Image Upload Handling
    addImageBox.addEventListener("click", () => imageUploadInput.click());

    imageUploadInput.addEventListener("change", function (event) {
        const files = event.target.files;
        if (!files.length) return;

        for (let file of files) {
            const reader = new FileReader();
            reader.onload = function (e) {
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

    // 🟢 Handle Trade Creation
    document.getElementById("createTradeButton").addEventListener("click", async function () {
        const title = document.getElementById("title").value.trim();
        const estimatedValue = document.getElementById("estimatedValue").value.trim();
        const fk_Productcondition = document.getElementById("productCondition").value;

        // ✅ Check if user is stored in `localStorage`
        let loggedInUser = localStorage.getItem("loggedInUser");

        if (!loggedInUser) {
            alert("⚠️ No user logged in! Please log in first.");
            window.location.href = "index.html"; // Redirect to login page
            return;
        }

        try {
            loggedInUser = JSON.parse(loggedInUser); // ✅ Parse the stored JSON

            // ✅ Ensure required fields exist
            if (!loggedInUser.username || !loggedInUser.email) {
                throw new Error("Missing required user fields.");
            }
        } catch (error) {
            console.error("❌ Error parsing stored user JSON:", error);
            alert("⚠️ Invalid user data stored. Please log in again.");
            localStorage.removeItem("loggedInUser"); // Remove invalid data
            window.location.href = "index.html"; // Redirect to login page
            return;
        }

        const fk_Username = loggedInUser.username; // ✅ Get Username from stored data

        // ✅ Validate required fields before sending
        if (!title || !estimatedValue || !fk_Productcondition) {
            alert("⚠️ Please fill in all required fields!");
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
        formData.append("fk_Username", fk_Username); // ✅ Attach Username to FormData

        // ✅ Attach images to FormData (if available)
        if (imageUploadInput.files.length > 0) {
            for (let file of imageUploadInput.files) {
                formData.append("images", file);
            }
        }

        // 🟢 Debug: Log form data before sending
        console.log("🔍 Form Data being sent:");
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]); // Check values before sending
        }

        try {
            const response = await fetch("http://localhost:5000/api/products/create", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            console.log("✅ Server Response:", result);

            if (result.success) {
                alert("✅ Trade created successfully!");
                window.location.href = "Create.html";
            } else {
                alert(`❌ Error: ${result.message}`);
            }
        } catch (error) {
            console.error("❌ Error uploading trade:", error);
            alert("Server error. Try again later.");
        }
    });
});
