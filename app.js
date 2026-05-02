const meals = [
    {
        id: 1,
        name: "Lean Power Bowl",
        description: "Grilled chicken, sweet potato Mash, and charred greens.",
        calories: 540,
        macros: { protein: 45, carbs: 50, fat: 12 },
        price: 14.99,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Zen Salmon Quinoa",
        description: "Miso-glazed salmon with fluffy quinoa and ginger asparagus.",
        calories: 620,
        macros: { protein: 42, carbs: 48, fat: 28 },
        price: 16.99,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Garden Harvest Buddha",
        description: "Roasted chickpeas, beet hummus, and sprouted kale seeds.",
        calories: 410,
        macros: { protein: 18, carbs: 65, fat: 12 },
        price: 13.99,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop"
    }
];

let cart = [];

function renderMeals() {
    const container = document.getElementById('meal-container');
    container.innerHTML = meals.map(meal => `
        <article class="meal-card" data-id="${meal.id}">
            <div class="meal-image-container">
                <img src="${meal.image}" alt="${meal.name}" loading="lazy">
            </div>
            <div class="meal-content">
                <div class="macro-badge-row">
                    <span class="macro-badge">${meal.calories} kcal</span>
                    <span class="macro-badge">P: ${meal.macros.protein}g</span>
                    <span class="macro-badge">F: ${meal.macros.fat}g</span>
                </div>
                <h3 style="margin-bottom: 0.5rem;">${meal.name}</h3>
                <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; min-height: 48px;">
                    ${meal.description}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; font-size: 1.25rem; color: var(--color-primary-dark)">$${meal.price}</span>
                    <button class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="addToCart(${meal.id})">Add to Cart</button>
                </div>
            </div>
        </article>
    `).join('');
}

function addToCart(id) {
    const meal = meals.find(m => m.id === id);
    cart.push(meal);
    updateCartUI();

    // Simple UI feedback
    const btn = document.querySelector(`.meal-card[data-id="${id}"] .btn-primary`);
    const originalText = btn.innerText;
    btn.innerText = "Added!";
    btn.style.backgroundColor = "var(--color-accent-green)";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = "";
    }, 1500);
}

function toggleCart(show) {
    document.getElementById('cart-drawer').classList.toggle('active', show);
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');

    countEl.innerText = cart.length;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-text-muted);">Your cart is empty.</p>';
        totalEl.innerText = '$0.00';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div style="flex: 1">
                    <h4 style="font-size: 0.9rem;">${item.name}</h4>
                    <p style="font-size: 0.8rem; color: var(--color-text-muted);">$${item.price}</p>
                </div>
                <button onclick="removeFromCart(${index})" style="background: none; border: none; cursor: pointer; color: var(--color-accent-coral); font-weight: bold;">✕</button>
            </div>
        `;
    }).join('');

    totalEl.innerText = `$${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert(`Thank you for your order! Total: ${document.getElementById('cart-total').innerText}\nWe'll prep your fresh meals immediately.`);
    cart = [];
    updateCartUI();
    toggleCart(false);
}

// Calculator Logic
function openCalculator(type) {
    const drawer = document.getElementById('calc-drawer');
    const container = document.getElementById('calc-form-container');
    const resultContainer = document.getElementById('calc-result-container');
    resultContainer.style.display = 'none';

    drawer.classList.add('active');

    if (type === 'bmi') {
        container.innerHTML = `
            <h3 style="margin-bottom: 1.5rem;">BMI Calculator</h3>
            <div class="input-group">
                <label>Height (cm)</label>
                <input type="number" id="bmi-height" placeholder="e.g. 175">
            </div>
            <div class="input-group">
                <label>Weight (kg)</label>
                <input type="number" id="bmi-weight" placeholder="e.g. 70">
            </div>
            <button class="btn-primary" style="width: 100%" onclick="calculateBMI()">Calculate BMI</button>
        `;
    } else {
        container.innerHTML = `
            <h3 style="margin-bottom: 1.5rem;">TDEE Calculator</h3>
            <div class="input-group">
                <label>Gender</label>
                <select id="tdee-gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div class="input-group">
                <label>Age</label>
                <input type="number" id="tdee-age" placeholder="25">
            </div>
            <div class="input-group">
                <label>Height (cm)</label>
                <input type="number" id="tdee-height" placeholder="175">
            </div>
            <div class="input-group">
                <label>Weight (kg)</label>
                <input type="number" id="tdee-weight" placeholder="70">
            </div>
            <div class="input-group">
                <label>Activity Level</label>
                <select id="tdee-activity">
                    <option value="1.2">Sedentary</option>
                    <option value="1.375">Lightly Active</option>
                    <option value="1.55">Moderately Active</option>
                    <option value="1.725">Very Active</option>
                </select>
            </div>
            <button class="btn-primary" style="width: 100%" onclick="calculateTDEE()">Calculate Calories</button>
        `;
    }
}

function closeCalculator() {
    document.getElementById('calc-drawer').classList.remove('active');
}

function calculateBMI() {
    const h = document.getElementById('bmi-height').value / 100;
    const w = document.getElementById('bmi-weight').value;
    if (!h || !w) return;

    const bmi = (w / (h * h)).toFixed(1);
    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    showResult(`Your BMI is <strong>${bmi}</strong>`, `Category: ${category}`);
}

function calculateTDEE() {
    const gender = document.getElementById('tdee-gender').value;
    const age = document.getElementById('tdee-age').value;
    const h = document.getElementById('tdee-height').value;
    const w = document.getElementById('tdee-weight').value;
    const activity = document.getElementById('tdee-activity').value;

    if (!age || !h || !w) return;

    let bmr;
    if (gender === 'male') {
        bmr = (10 * w) + (6.25 * h) - (5 * age) + 5;
    } else {
        bmr = (10 * w) + (6.25 * h) - (5 * age) - 161;
    }

    const tdee = Math.round(bmr * activity);
    showResult(`Maintainance Calories: <strong>${tdee} kcal</strong>`, `To lose weight, aim for ~${tdee - 500} kcal/day.`);
}

function showResult(title, subtitle) {
    const res = document.getElementById('calc-result-container');
    res.style.display = 'block';
    res.innerHTML = `
        <h4 style="color: var(--color-white); margin-bottom: 0.5rem;">${title}</h4>
        <p style="font-size: 0.9rem; opacity: 0.8">${subtitle}</p>
    `;
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderMeals();
});
