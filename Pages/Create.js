document.addEventListener("DOMContentLoaded", async function () {
    const productConditionDropdown = document.getElementById("productCondition");

    try {
        const response = await fetch("http://localhost:5000/api/products/conditions"); // Adjust endpoint if needed
        const conditions = await response.json();

        productConditionDropdown.innerHTML = ""; // Clear default loading text

        conditions.forEach(condition => {
            const option = document.createElement("option");
            option.value = condition.Condition_Name; // Foreign Key
            option.textContent = condition.Condition_Name; // Display value
            productConditionDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Error fetching product conditions:", error);
        productConditionDropdown.innerHTML = "<option value=''>Error loading conditions</option>";
    }

    // Handle Trade Creation
    document.getElementById("createTradeButton").addEventListener("click", async function () {
        const tradeData = {
            title: document.getElementById("title").value.trim(),
            description: document.getElementById("description").value.trim(),
            brand: document.getElementById("brand").value.trim(),
            estimatedValue: document.getElementById("estimatedValue").value.trim(),
            weight: document.getElementById("weight").value.trim(),
            height: document.getElementById("height").value.trim(),
            depth: document.getElementById("depth").value.trim(),
            width: document.getElementById("width").value.trim(),
            fk_Productcondition: document.getElementById("productCondition").value // Foreign Key
        };

        if (!tradeData.title || !tradeData.estimatedValue || !tradeData.fk_Productcondition) {
            alert("Please fill out all required fields!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/products/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tradeData)
            });

            const result = await response.json();

            if (result.success) {
                alert("✅ Trade created successfully!");
                window.location.href = "Home.html";
            } else {
                alert(`❌ Error: ${result.message}`);
            }
        } catch (error) {
            console.error("❌ Trade creation failed:", error);
            alert("Server error. Please try again later.");
        }
    });
});
