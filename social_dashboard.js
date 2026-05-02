/* ===== SWAKTORIE SOCIAL DASHBOARD — COMPLETE ENGINE ===== */

// ===== COMPANY DATA =====
const COMPANY = {
    plans: [
        { name: "Weight Loss", kcal: 1200, daily: 280, desc: "3 meals + 1 snack. Focus on fat loss.", icon: "🔥", durations: { 5: 1699, 7: 2399, 14: 4499, 28: 7999 } },
        { name: "Maintenance", kcal: 1500, daily: 350, desc: "3 hearty meals + recovery snack. Lean gains.", icon: "⚖️", durations: { 5: 2099, 7: 2999, 14: 5499, 28: 9999 } },
        { name: "Performance", kcal: 1800, daily: 415, desc: "Full power fuel + shakes. High-intensity.", icon: "💪", durations: { 5: 2499, 7: 3499, 14: 6499, 28: 11999 } }
    ],
    zones: { free: ["San Rafael", "Baliwag City"], stdFee: 50, metroFee: 100 },
    social: { fb: "https://web.facebook.com/Swaktorie.Meals", phone: "(0999) 123-4567" },
    cutoff: "Every Thursday for Monday delivery",
    hashtags: "#SwaktorieMeals #MealPrepPH #HealthyPinoy #FitFoodPH #BulacanEats #CleanEating"
};

// ===== TAB NAVIGATION =====
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        item.classList.add('active');
        document.getElementById('tab-' + item.dataset.tab).classList.add('active');
        if (window.innerWidth <= 1024) toggleSidebar();
    });
});

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('dark-toggle').innerText = isDark ? '☀️' : '🌙';
    const m = document.querySelector('.dark-toggle-mobile');
    if (m) m.innerText = isDark ? '☀️' : '🌙';
}

// ===== TOAST =====
function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    t.classList.add('active');
    setTimeout(() => t.classList.remove('active'), 2500);
}

function copyToClipboard(elId) {
    const el = document.getElementById(elId);
    const text = el.innerText || el.textContent;
    navigator.clipboard.writeText(text).then(() => showToast('📋 Copied to clipboard!')).catch(() => {
        const range = document.createRange(); range.selectNode(el);
        window.getSelection().removeAllRanges(); window.getSelection().addRange(range);
        document.execCommand('copy'); window.getSelection().removeAllRanges();
        showToast('📋 Copied!');
    });
}

// ===== POST GENERATOR =====
let currentTone = 'friendly';
function selectTone(btn) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    currentTone = btn.dataset.tone;
}

const POST_TEMPLATES = {
    'meal-spotlight': {
        friendly: (t, d) => `🥗 Say hello to our ${t || 'chef-curated meal'}! 😍\n\n${d || 'Perfectly balanced macros, bursting with flavor, and ready to fuel your day.'}\n\nFresh. Clean. Swaktorie. ✨\n\n📩 DM us to order or visit our page!\n📞 ${COMPANY.social.phone}\n\n${COMPANY.hashtags}`,
        professional: (t, d) => `Introducing: ${t || 'Our Latest Meal Creation'}\n\n${d || 'Precision-crafted with clinically accurate macronutrients for optimal performance.'}\n\nAvailable in our Weight Loss, Maintenance, and Performance plans.\n\n📩 Message us to get started.\n\n${COMPANY.hashtags}`,
        hype: (t, d) => `🔥🔥🔥 THIS JUST DROPPED! 🔥🔥🔥\n\n${t ? t.toUpperCase() + '!!!' : 'OUR NEWEST BANGER MEAL!!!'}\n\n${d || 'Your taste buds are NOT ready for this one. Premium ingredients, insane macros, zero guilt.'}\n\n💪 DM "ORDER" to grab yours NOW!\n⏰ Cutoff: ${COMPANY.cutoff}\n\n${COMPANY.hashtags}`,
        educational: (t, d) => `📖 Did you know?\n\n${t ? `Our ${t} is designed with` : 'Each Swaktorie meal is crafted with'} precise macro ratios to support your fitness goals.\n\n${d || '✅ High protein for muscle recovery\n✅ Complex carbs for sustained energy\n✅ Healthy fats for hormone balance'}\n\nLearn more — DM us anytime!\n\n${COMPANY.hashtags}`
    },
    'customer-testimonial': {
        friendly: (t, d) => `⭐⭐⭐⭐⭐\n\n"${d || 'Sobrang sarap and healthy pa! Hindi ko inexpect na ganito ka-delicious ang meal prep. Legit!'}" — ${t || 'Happy Customer'} 💚\n\nThank you for trusting Swaktorie! Your health journey is our mission. 🙏\n\n📩 Start yours today — DM us!\n\n${COMPANY.hashtags}`,
        professional: (t, d) => `Client Testimonial:\n\n"${d || 'The consistency and quality of Swaktorie Meals has been exceptional. Perfect for my fitness regimen.'}" — ${t || 'Valued Client'}\n\nWe take pride in delivering clinical-grade nutrition with chef-quality taste.\n\n📩 Experience it yourself.\n\n${COMPANY.hashtags}`,
        hype: (t, d) => `🗣️ ANOTHER HAPPY SWAKTORIE FAM MEMBER!\n\n"${d || 'GRABE YUNG LASA! Parang restaurant-quality pero may perfect macros pa!'}" — ${t || 'Satisfied Customer'} 🔥\n\nJOIN THE MOVEMENT! 💪\nDM "START" to begin your transformation!\n\n${COMPANY.hashtags}`,
        educational: (t, d) => `Real Results from Real People 📊\n\n${t || 'One of our clients'} shares:\n"${d || 'After 4 weeks of Swaktorie, I lost 3kg while maintaining my energy levels. The macro tracking made all the difference.'}"\n\nOur plans are based on the Mifflin-St Jeor equation for accurate calorie targets.\n\n📩 Get your personalized plan today.\n\n${COMPANY.hashtags}`
    },
    'health-tip': {
        friendly: (t, d) => `💡 Health Tip of the Day!\n\n${t ? `${t}: ` : ''}${d || 'Drinking water before meals can help you eat less and stay hydrated! Aim for 8 glasses a day. 💧'}\n\nSmall habits, big results! Let Swaktorie handle your nutrition so you can focus on living. ✨\n\n${COMPANY.hashtags}`,
        professional: (t, d) => `💡 Nutrition Insight\n\n${t ? `Topic: ${t}\n\n` : ''}${d || 'Research shows that meal prepping increases dietary adherence by up to 60%. Consistent nutrition is the foundation of any fitness goal.'}\n\nSwaktorie Meals — science-backed, chef-prepared.\n\n${COMPANY.hashtags}`,
        hype: (t, d) => `⚡ GAME-CHANGER ALERT! ⚡\n\n${t ? t.toUpperCase() + '\n\n' : ''}${d || 'Stop guessing your calories! Every Swaktorie meal comes with EXACT macro counts. No more calorie counting apps. We did the math FOR YOU. 🧮'}\n\n🔥 DM us NOW!\n\n${COMPANY.hashtags}`,
        educational: (t, d) => `📖 Nutrition Science\n\n${t ? `${t}\n\n` : ''}${d || 'Your TDEE (Total Daily Energy Expenditure) determines how many calories you need.\n\n🔬 BMR × Activity Level = TDEE\n🔥 Deficit = Weight Loss\n⚖️ Maintenance = Stay Same\n💪 Surplus = Muscle Gain'}\n\nWe calculate this for you! DM for a free assessment.\n\n${COMPANY.hashtags}`
    },
    'promo-sale': {
        friendly: (t, d) => `🔥 SPECIAL PROMO ALERT! 🔥\n\n${t || 'Limited Time Offer'}\n\n${d || 'Get amazing discounts on your first Swaktorie subscription!'}\n\n✅ Plans start at ₱280/day\n✅ Free delivery in San Rafael & Baliwag\n⏰ ${COMPANY.cutoff}\n\n📩 DM "PROMO" to claim!\n\n${COMPANY.hashtags}`,
        professional: (t, d) => `${t || 'Special Promotion'}\n\n${d || 'We are offering an exclusive discount for new subscribers.'}\n\nPlans:\n• Weight Loss — ₱280/day\n• Maintenance — ₱350/day\n• Performance — ₱415/day\n\nTerms apply. Message us for details.\n\n${COMPANY.hashtags}`,
        hype: (t, d) => `🚨🚨🚨 AYAW MO MA-MISS 'TO! 🚨🚨🚨\n\n${t ? t.toUpperCase() : 'MEGA SALE!'}\n\n${d || 'BIGGEST DEAL WE HAVE EVER DONE! 💰'}\n\n🏃‍♂️ LIMITED SLOTS ONLY!\nDM "CLAIM" NOW NOW NOW!\n\n${COMPANY.hashtags}`,
        educational: (t, d) => `📢 ${t || 'Promotional Offer'}\n\n${d || 'Investing in meal prep saves an average of ₱3,000/month compared to eating out — and you get precise nutrition.'}\n\nSwaktorie Plans from ₱280/day. DM to learn more.\n\n${COMPANY.hashtags}`
    },
    'behind-scenes': {
        friendly: (t, d) => `🎬 Behind the Scenes at Swaktorie Kitchen! 👨‍🍳\n\n${d || 'Here is a peek at how we prep your meals with love and precision! Every ingredient is weighed, every macro is counted. 🥦⚖️'} \n\n${COMPANY.hashtags}`,
        professional: (t, d) => `Inside Swaktorie Kitchen\n\n${d || 'Our preparation process follows strict hygiene protocols and precise nutritional measurements.'} \n\n${COMPANY.hashtags}`,
        hype: (t, d) => `👀 SNEAK PEEK ALERT! 👀\n\n${d || 'Check out what is cooking in the Swaktorie lab! 🔬🍳'} \n\n${COMPANY.hashtags}`,
        educational: (t, d) => `🎬 Process Spotlight\n\n${d || 'Each Swaktorie meal goes through precision weighing and vacuum sealing for maximum freshness.'} \n\n${COMPANY.hashtags}`
    },
    'motivational': {
        friendly: (t, d) => `💪 ${t || 'You got this!'}\n\n${d || 'Every healthy meal is a step closer to your goal. Small changes, big results! 🌟'} \n\n${COMPANY.hashtags}`,
        professional: (t, d) => `${t || 'Commitment to Health'}\n\n${d || 'Consistency is the most underrated factor in health transformation.'} \n\n${COMPANY.hashtags}`,
        hype: (t, d) => `🔥 NO EXCUSES! 🔥\n\n${t ? t.toUpperCase() + '!\n\n' : ''}${d || 'JUST SHOW UP. WE HANDLE THE REST.'} \n\n${COMPANY.hashtags}`,
        educational: (t, d) => `📖 ${t || 'Mindset + Nutrition'}\n\n${d || 'Studies show that people who meal prep are 2x more likely to achieve their goals.'} \n\n${COMPANY.hashtags}`
    },
    'poll-engagement': {
        friendly: (t, d) => `📊 Quick Poll Time! 🤔\n\n${t || 'Which Swaktorie meal is your favorite?'}\n\n${d || 'Drop your answer below! 👇'} \n\n${COMPANY.hashtags}`,
        professional: (t, d) => `We would love your input.\n\n${t || 'Which plan feature matters most to you?'}\n\n${d || 'Share your preference in the comments.'} \n\n${COMPANY.hashtags}`,
        hype: (t, d) => `🗳️ VOTE NOW! 🗳️\n\n${t ? t.toUpperCase() + '?!\n\n' : ''}${d || 'COMMENT YOUR PICK! 💪'} \n\n${COMPANY.hashtags}`,
        educational: (t, d) => `📊 Health Check Poll\n\n${t || 'What is your current calorie awareness level?'}\n\n${d || 'Share below! We will help you level up. 📈'} \n\n${COMPANY.hashtags}`
    }
};

function generatePost() {
    const type = document.getElementById('post-type').value;
    const topic = document.getElementById('post-topic').value.trim();
    const detail = document.getElementById('post-detail').value.trim();
    const template = POST_TEMPLATES[type]?.[currentTone];
    if (template) {
        document.getElementById('post-preview-text').innerText = template(topic, detail);
    }
}
function updatePostPreview() { generatePost(); }

// ===== PROMO ENGINE =====
const PROMO_TEMPLATES = {
    'first-time': (d, c, e, t) => ({
        post: `🎉 FIRST-TIME BUYER SPECIAL! 🎉\n\nNew to Swaktorie Meals? Here is a warm welcome! 💚\n\n🏷️ Get ${d}% OFF your first subscription!\n📌 Use code: ${c}\n⏰ Valid until: ${e}\n${t ? `📋 Terms: ${t}\n` : ''}\nPlans start at just ₱280/day — now even more affordable!\n\n📩 DM us with code "${c}" to claim!\n📞 ${COMPANY.social.phone}\n\n${COMPANY.hashtags}`,
        messenger: `Hi there! 👋 Welcome to Swaktorie Meals!\n\nAs a first-time customer, you get ${d}% OFF with code "${c}"! 🎉\n\nOur plans:\n🔥 Weight Loss — ₱280/day (1200 kcal)\n⚖️ Maintenance — ₱350/day (1500 kcal)\n💪 Performance — ₱415/day (1800 kcal)\n\nJust tell me which plan interests you and I will set you up! 💚\n\nValid until ${e}.`
    }),
    'refer-friend': (d, c, e, t) => ({
        post: `👫 REFER-A-FRIEND PROMO! 👫\n\nLove Swaktorie? Share the love! 💚\n\nRefer a friend and BOTH of you get ${d}% OFF your next order! 🤝\n\n📌 Referrer code: ${c}\n⏰ Valid until: ${e}\n${t ? `📋 ${t}\n` : ''}\nTag your gym buddy, officemate, or health-conscious friend below! 👇\n\n${COMPANY.hashtags}`,
        messenger: `Hey! 👋 Thanks for spreading the Swaktorie love!\n\nHere is how the Refer-a-Friend promo works:\n\n1️⃣ Share your code "${c}" with a friend\n2️⃣ They use it on their first order\n3️⃣ You BOTH get ${d}% OFF! 🎉\n\nValid until ${e}. No limit on referrals!`
    }),
    'payday': (d, c, e, t) => ({
        post: `💰 PAYDAY TREAT! 💰\n\nSweldo na? Invest in your HEALTH! 🏋️\n\n🏷️ ${d}% OFF all plans this payday!\n📌 Code: ${c}\n⏰ Until: ${e}\n${t ? `📋 ${t}\n` : ''}\n✅ Weight Loss — ₱280/day\n✅ Maintenance — ₱350/day\n✅ Performance — ₱415/day\n\n📩 DM "${c}" to order!\n\n${COMPANY.hashtags}`,
        messenger: `💰 Happy Payday!\n\nCelebrate with ${d}% OFF your Swaktorie subscription!\n\nUse code: "${c}"\nValid until: ${e}\n\nWhich plan would you like? I can set up your order right now! 😊`
    }),
    'weekly-bundle': (d, c, e, t) => ({
        post: `📦 WEEKLY BUNDLE DEAL! 📦\n\nGet your whole week sorted! 🗓️\n\n🏷️ ${d}% OFF any 7-day plan!\n📌 Code: ${c}\n⏰ Valid until: ${e}\n${t ? `📋 ${t}\n` : ''}\n7 days of chef-prepared, macro-perfect meals delivered to your door! 🚗\n\n📩 DM to claim!\n\n${COMPANY.hashtags}`,
        messenger: `📦 Weekly Bundle Alert!\n\nGet ${d}% OFF any 7-day plan with code "${c}"!\n\n7-day options:\n🔥 Weight Loss — ₱2,399\n⚖️ Maintenance — ₱2,999\n💪 Performance — ₱3,499\n\nWant me to set up your bundle? 😊`
    }),
    'holiday': (d, c, e, t) => ({
        post: `🎉 HOLIDAY SPECIAL! 🎉\n\nCelebrate the season with healthy, delicious meals! 🎄✨\n\n🏷️ ${d}% OFF all plans!\n📌 Code: ${c}\n⏰ Until: ${e}\n${t ? `📋 ${t}\n` : ''}\nGive yourself the gift of health this holiday! 🎁💚\n\n📩 DM to order!\n\n${COMPANY.hashtags}`,
        messenger: `🎉 Happy Holidays from Swaktorie!\n\nEnjoy ${d}% OFF with code "${c}"!\n\nTreat yourself or gift a loved one with a healthy meal plan. Which plan would you like to try? 💚`
    }),
    'birthday': (d, c, e, t) => ({
        post: `🎂 BIRTHDAY MONTH PROMO! 🎂\n\nIs it your birthday? We got you! 🥳\n\n🏷️ ${d}% OFF for all birthday celebrants!\n📌 Code: ${c}\n⏰ Valid until: ${e}\n${t ? `📋 ${t}\n` : ''}\nJust show valid ID with your birth month! 🎈\n\n📩 DM us to claim your birthday treat!\n\n${COMPANY.hashtags}`,
        messenger: `🎂 Happy Birthday!\n\nAs our gift to you, enjoy ${d}% OFF your Swaktorie order!\n\nUse code: "${c}"\nJust send us a photo of your ID showing your birth month to validate.\n\nWhich plan would you like? 😊🎉`
    })
};

function generatePromo() {
    const type = document.getElementById('promo-type').value;
    const disc = document.getElementById('promo-discount').value || '15';
    const code = document.getElementById('promo-code').value || 'SWAK15';
    const expiry = document.getElementById('promo-expiry').value ? new Date(document.getElementById('promo-expiry').value).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }) : 'End of Month';
    const terms = document.getElementById('promo-terms').value;
    const tmpl = PROMO_TEMPLATES[type];
    if (tmpl) {
        const result = tmpl(disc, code, expiry, terms);
        document.getElementById('promo-preview-text').innerText = result.post;
        document.getElementById('promo-messenger-text').innerText = result.messenger;
    }
}
function updatePromoPreview() { generatePromo(); }

// ===== CONTENT CALENDAR =====
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let calendarData = {};

function initCalendar() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    DAYS.forEach(day => {
        const col = document.createElement('div');
        col.className = 'cal-day';
        col.innerHTML = `<div class="cal-day-name">${day.slice(0, 3)}</div><div class="cal-posts" id="cal-${day}"></div><button class="cal-add-btn" onclick="addCalPost('${day}')">+ Add</button>`;
        grid.appendChild(col);
        if (!calendarData[day]) calendarData[day] = [];
    });
    renderCalendar();
}

function renderCalendar() {
    DAYS.forEach(day => {
        const container = document.getElementById('cal-' + day);
        if (!container) return;
        container.innerHTML = calendarData[day].map((post, i) =>
            `<div class="cal-post ${post.type}" title="${post.text}"><span>${post.icon}</span> ${post.label} <span onclick="removeCalPost('${day}',${i})" style="margin-left:auto;cursor:pointer;opacity:0.5;">✕</span></div>`
        ).join('');
    });
}

function addCalPost(day) {
    const types = [
        { type: 'meal', icon: '🥗', label: 'Meal Spotlight' },
        { type: 'tip', icon: '💡', label: 'Health Tip' },
        { type: 'promo', icon: '🔥', label: 'Promo' },
        { type: 'engage', icon: '📊', label: 'Engagement' },
        { type: 'bts', icon: '🎬', label: 'Behind Scenes' }
    ];
    const choice = types[calendarData[day].length % types.length];
    calendarData[day].push({ ...choice, text: `${choice.label} post for ${day}` });
    renderCalendar();
}

function removeCalPost(day, index) {
    calendarData[day].splice(index, 1);
    renderCalendar();
}

function populateSuggested() {
    calendarData = {
        Monday: [{ type: 'meal', icon: '🥗', label: 'Meal Spotlight', text: 'Start the week with a feature meal!' }],
        Tuesday: [{ type: 'tip', icon: '💡', label: 'Health Tip', text: 'Share a nutrition fact' }],
        Wednesday: [{ type: 'engage', icon: '📊', label: 'Poll', text: 'Engagement post — ask a question' }],
        Thursday: [{ type: 'promo', icon: '🔥', label: 'Order Reminder', text: 'Cutoff day! Remind to order' }, { type: 'bts', icon: '🎬', label: 'Kitchen Prep', text: 'Show Thursday kitchen prep' }],
        Friday: [{ type: 'meal', icon: '🥗', label: 'Weekend Menu', text: 'Preview weekend meals' }],
        Saturday: [{ type: 'engage', icon: '📊', label: 'Customer Story', text: 'Share a testimonial' }],
        Sunday: [{ type: 'tip', icon: '💡', label: 'Meal Prep Sunday', text: 'Motivational + meal prep tips' }]
    };
    renderCalendar();
    showToast('✨ Calendar auto-filled with suggested schedule!');
}

function clearCalendar() {
    DAYS.forEach(d => calendarData[d] = []);
    renderCalendar();
    showToast('🗑️ Calendar cleared!');
}

function exportCalendarCSV() {
    let csv = 'Day,Post Type,Label,Description\n';
    DAYS.forEach(day => {
        calendarData[day].forEach(post => {
            csv += `"${day}","${post.type}","${post.label}","${post.text}"\n`;
        });
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'swaktorie_content_calendar.csv'; a.click();
    showToast('📥 CSV exported!');
}

// ===== COMMENT & MESSENGER TEMPLATES =====
const COMMENT_TEMPLATES = [
    { title: "🆕 New Inquiry", text: "Hi! 👋 Welcome to Swaktorie Meals! We offer chef-prepared, macro-perfect meal plans:\n\n🔥 Weight Loss — ₱280/day (1200 kcal)\n⚖️ Maintenance — ₱350/day (1500 kcal)\n💪 Performance — ₱415/day (1800 kcal)\n\nFree delivery in San Rafael & Baliwag! Would you like to know more? 😊" },
    { title: "💰 Pricing Question", text: "Great question! Here are our plan prices:\n\n📦 5-Day Plans: ₱1,699 – ₱2,499\n📦 7-Day Plans: ₱2,399 – ₱3,499\n📦 2-Week Plans: ₱4,499 – ₱6,499\n📦 4-Week Plans: ₱7,999 – ₱11,999\n\nPricing depends on your calorie tier. DM us your goal and we'll recommend the best fit! 💚" },
    { title: "📋 Menu Question", text: "We have a 4-week rotating menu crafted by our chef! 🧑‍🍳\n\nSample meals: Sesame Chicken Bowl, Tofu Sisig, Ground Beef Stir-Fry, PB Frozen Yogurt, and many more!\n\nWe also have a Build-Your-Own-Box (BYOB) option at ₱320 per box where you pick your protein and carb. 🥙" },
    { title: "🚗 Delivery Area", text: "We deliver across Bulacan and Metro Manila! 🚗\n\n🟢 FREE delivery: San Rafael & Baliwag City\n🟡 Standard delivery (+₱50/day): Malolos, Bocaue, Guiguinto, Plaridel, Pulilan, and more\n🔵 Metro Manila (+₱100/day)\n\nWhere are you located? I'll check if you're in our coverage area! 📍" },
    { title: "✅ Order Confirmation", text: "Thank you for your order! 🎉\n\nHere is what happens next:\n1️⃣ We'll confirm your plan and delivery address\n2️⃣ Payment via GCash, Maya, or Bank Transfer\n3️⃣ Meals start on the next Monday after cutoff (every Thursday)\n\nIf you have any questions, just message us anytime! 💚" },
    { title: "😟 Complaint Handling", text: "We're really sorry to hear about your experience. 😔 Your feedback means a lot to us.\n\nCan you please DM us the details so we can look into this right away? We want to make it right.\n\nThank you for your patience and for giving us the chance to improve. 🙏" },
    { title: "⭐ Positive Review Reply", text: "Wow, thank you so much for the kind words! 😍💚\n\nIt makes our day knowing you are enjoying your Swaktorie meals! We'll keep delivering fresh, healthy, and delicious food for you. 🥗✨\n\nSee you next week! Tag a friend who might love this too! 👫" }
];

const MESSENGER_FLOW = [
    { title: "1️⃣ Welcome Message (Instant Reply)", text: "Hi there! 👋 Welcome to Swaktorie Meals!\n\nWe're your premium meal prep partner in Bulacan — chef-prepared, macro-perfect meals delivered daily! 🥗✨\n\nHow can I help you today?\n\n🔹 View our PLANS\n🔹 Learn about DELIVERY\n🔹 Check our MENU\n🔹 Talk to our TEAM" },
    { title: "2️⃣ Plans Quick Reply", text: "Here are our meal plans! 🍽️\n\n🔥 WEIGHT LOSS (1200 kcal) — ₱280/day\n3 meals + 1 snack. Perfect for fat loss.\n\n⚖️ MAINTENANCE (1500 kcal) — ₱350/day\n3 hearty meals + recovery snack. For lean gains.\n\n💪 PERFORMANCE (1800 kcal) — ₱415/day\nFull power fuel + shakes. For athletes.\n\nAvailable in 5-day, 7-day, 2-week, and 4-week durations!\n\nWhich plan interests you? 😊" },
    { title: "3️⃣ Delivery Quick Reply", text: "🚗 Delivery Info:\n\n🟢 FREE: San Rafael & Baliwag City\n🟡 Standard (+₱50/day): Other Bulacan areas\n🔵 Metro Manila (+₱100/day)\n\n📅 Cutoff: Every Thursday for Monday delivery\n\nWhat is your location? I'll confirm your delivery fee! 📍" },
    { title: "4️⃣ Away Message", text: "Thanks for reaching out! 🙏\n\nWe're currently away but will get back to you within a few hours.\n\nIn the meantime, check out our plans at our Facebook page!\n\n— Team Swaktorie 💚" }
];

function initTemplates() {
    const grid = document.getElementById('comment-templates-grid');
    grid.innerHTML = COMMENT_TEMPLATES.map((t, i) =>
        `<div class="template-card"><h4>${t.title}</h4><p>${t.text}</p><button class="template-copy" onclick="copyTemplateText(${i})">📋 Copy</button></div>`
    ).join('');

    const flow = document.getElementById('messenger-flow-container');
    flow.innerHTML = MESSENGER_FLOW.map((s, i) =>
        `<div class="flow-step"><h4>${s.title}</h4><p>${s.text}</p><button class="template-copy" onclick="copyFlowText(${i})" style="margin-top:0.8rem;">📋 Copy</button></div>`
    ).join('');
}

function copyTemplateText(i) {
    navigator.clipboard.writeText(COMMENT_TEMPLATES[i].text).then(() => showToast('📋 Template copied!'));
}
function copyFlowText(i) {
    navigator.clipboard.writeText(MESSENGER_FLOW[i].text).then(() => showToast('📋 Flow step copied!'));
}

// ===== ANALYTICS TRACKER =====
let analyticsData = [];
try {
    const rawData = localStorage.getItem('swaktorie_analytics');
    if (rawData) {
        analyticsData = JSON.parse(rawData);
    }
} catch (e) {
    console.error("Failed to parse analytics from localStorage", e);
    analyticsData = [];
}

function initAnalytics() {
    renderChart();
    updateAnalyticsSummary();
}

function logAnalytics() {
    const week = document.getElementById('ana-week').value || 'Week ' + (analyticsData.length + 1);
    const reach = parseInt(document.getElementById('ana-reach').value) || 0;
    const engagement = parseInt(document.getElementById('ana-engagement').value) || 0;
    const likes = parseInt(document.getElementById('ana-likes').value) || 0;
    const msgs = parseInt(document.getElementById('ana-messenger').value) || 0;
    const orders = parseInt(document.getElementById('ana-orders').value) || 0;

    analyticsData.push({ week, reach, engagement, likes, msgs, orders });
    if(analyticsData.length > 8) analyticsData.shift(); /* Keep last 8 weeks */
    
    localStorage.setItem('swaktorie_analytics', JSON.stringify(analyticsData));
    
    // Clear form
    ['ana-week', 'ana-reach', 'ana-engagement', 'ana-likes', 'ana-messenger', 'ana-orders'].forEach(id => document.getElementById(id).value = '');
    
    showToast('📊 Week logged successfully!');
    renderChart();
    updateAnalyticsSummary();
}

function renderChart() {
    const ctx = document.getElementById('analytics-chart');
    if (!ctx) return;
    
    const canvas = ctx;
    const c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    if (analyticsData.length === 0) {
        c.fillStyle = '#94a3b8';
        c.font = '14px Inter';
        c.textAlign = 'center';
        c.fillText('No data yet. Log your first week!', canvas.width/2, canvas.height/2);
        return;
    }
    
    let maxVal = 100;
    analyticsData.forEach(d => {
        if (d.reach > maxVal) maxVal = d.reach;
        if (d.engagement > maxVal) maxVal = d.engagement;
    });
    
    const padding = 40;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    const barWidth = Math.min(30, (chartWidth / analyticsData.length) * 0.4);
    const spacing = chartWidth / analyticsData.length;
    
    // Draw axes
    c.beginPath();
    c.moveTo(padding, padding);
    c.lineTo(padding, canvas.height - padding);
    c.lineTo(canvas.width - padding, canvas.height - padding);
    c.strokeStyle = '#e2e8f0';
    c.lineWidth = 2;
    c.stroke();
    
    analyticsData.forEach((data, i) => {
        const x = padding + (i * spacing) + (spacing / 2);
        
        // Reach Bar
        const reachHeight = (data.reach / maxVal) * chartHeight;
        c.fillStyle = 'rgba(5, 150, 105, 0.6)';
        c.fillRect(x - barWidth, canvas.height - padding - reachHeight, barWidth, reachHeight);
        
        // Engagement Bar
        const engHeight = (data.engagement / maxVal) * chartHeight;
        c.fillStyle = 'rgba(245, 158, 11, 0.8)';
        c.fillRect(x + 2, canvas.height - padding - engHeight, barWidth, engHeight);
        
        // Label
        c.fillStyle = '#64748b';
        c.font = '10px Inter';
        c.textAlign = 'center';
        c.fillText(data.week.substring(0, 8), x, canvas.height - padding + 15);
    });
}

function updateAnalyticsSummary() {
    const summary = document.getElementById('analytics-summary');
    if (analyticsData.length === 0) {
        summary.innerHTML = 'No data available.';
        return;
    }
    
    const latest = analyticsData[analyticsData.length - 1];
    let prev = analyticsData.length > 1 ? analyticsData[analyticsData.length - 2] : null;
    
    let html = '<strong>Latest Week (' + latest.week + '):</strong><br>';
    html += 'Reach: ' + latest.reach.toLocaleString() + ' | Engagement: ' + latest.engagement.toLocaleString() + ' | Rate: ' + (latest.reach > 0 ? ((latest.engagement/latest.reach)*100).toFixed(1) : 0) + '%<br>';
    html += 'Orders: ' + latest.orders + ' | Msgs: ' + latest.msgs;
    
    if (prev) {
        const orderDiff = latest.orders - prev.orders;
        html += '<br><br><em>Trend: ' + (orderDiff >= 0 ? '+' + orderDiff : orderDiff) + ' orders compared to previous week.</em>';
    }
    
    summary.innerHTML = html;
}

// ===== CAPTION LIBRARY =====
const RAW_CAPTIONS = [
    { cat: "Morning", tags: ["morning", "breakfast"], text: "Good morning, Bulacan! ☀️ Start your day right with a balanced breakfast. A high-protein start sets the tone for all-day energy and prevents cravings later. Check out our Morning Power Bowls! 🍳" },
    { cat: "Evening", tags: ["night", "recovery"], text: "Winding down after a long day? 🌙 Your body recovers and rebuilds while you sleep so that last meal matters! Our Maintenance Plan ensures you get the right slow-digesting proteins for overnight recovery. 💪" },
    { cat: "Feature", tags: ["meal", "promo"], text: "Have you tried our Sesame Chicken Bowl? 🤤 It is a fan favorite for a reason! Tender chicken, crisp veggies, and our signature light sesame glaze. All the flavor, none of the guilt. 🥗" },
    { cat: "Health", tags: ["tips", "water"], text: "Hydration Check! 💧 Did you know thirst is often mistaken for hunger? Before reaching for an extra snack, try drinking a glass of water and wait 10 minutes. Stay hydrated, stay healthy! 🧊" },
    { cat: "Love", tags: ["testimonial", "results"], text: "Nothing makes us happier than seeing your results! ❤️ Hearing how Swaktorie Meals gives you more time, energy, and confidence is why we do what we do. Thank you for letting us be part of your journey! 🙏" },
    { cat: "Weekend", tags: ["cheat meal", "balance"], text: "Happy Weekend! 🎉 Remember, one cheat meal won't ruin your progress, just like one healthy meal won't make you fit. It is all about consistency! Enjoy your weekend, we will prep your meals for Monday. ✅" },
    { cat: "Health", tags: ["protein", "muscle"], text: "Why is Protein so important? 🥩 Not only does it build muscle, but it also has the highest thermic effect of food (TEF) — meaning your body burns more calories just digesting it compared to carbs or fats! 🔥" },
    { cat: "Feature", tags: ["menu", "byob"], text: "Picky eater? Or strictly tracking macros? 🧮 Our Build-Your-Own-Box (BYOB) is perfect for you! Choose your exact protein and carb base. Total control, zero prep time. Starting at just ₱320! 🍱" },
    { cat: "Love", tags: ["community", "bulacan"], text: "Proudly serving Bulacan! 📍 From San Rafael to Malolos, we are delivering health daily to our amazing community. Let us handle the cooking and traffic — you just enjoy the food! 🚗💨" },
    { cat: "Morning", tags: ["monday", "motivation"], text: "Monday check-in! 🗓️ A new week means new goals. If you fell off track this weekend, today is the perfect day to reset. Let's get it! 💯" }
];

let favCaptions = [];
try {
    const rawFavs = localStorage.getItem('swaktorie_fav_captions');
    if (rawFavs) {
        favCaptions = JSON.parse(rawFavs);
    }
} catch (e) {
    console.error("Failed to parse favorites from localStorage", e);
    favCaptions = [];
}

function initCaptionLibrary() {
    const filters = document.getElementById('caption-filters');
    const cats = [...new Set(RAW_CAPTIONS.map(c => c.cat))];
    filters.innerHTML = '<button class="chip active" onclick="setCaptionFilter(this, \'all\')">All</button>' + 
        cats.map(c => '<button class="chip" onclick="setCaptionFilter(this, \'' + c + '\')">' + c + '</button>').join('') + 
        '<button class="chip" onclick="setCaptionFilter(this, \'fav\')">⭐️ Favorites</button>';
    
    renderCaptions(RAW_CAPTIONS);
}

let activeCaptionFilter = 'all';
function setCaptionFilter(btn, filter) {
    document.querySelectorAll('#caption-filters .chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    activeCaptionFilter = filter;
    filterCaptions();
}

function filterCaptions() {
    const query = document.getElementById('caption-search').value.toLowerCase();
    let filtered = RAW_CAPTIONS;
    
    if (activeCaptionFilter === 'fav') {
        filtered = filtered.filter((_, i) => favCaptions.includes(i));
    } else if (activeCaptionFilter !== 'all') {
        filtered = filtered.filter(c => c.cat === activeCaptionFilter);
    }
    
    if (query) {
        filtered = filtered.filter(c => c.text.toLowerCase().includes(query) || c.tags.some(t => t.includes(query)));
    }
    
    renderCaptions(filtered);
}

function renderCaptions(caps) {
    const grid = document.getElementById('caption-grid');
    if(caps.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; color: var(--text-muted);">No captions found.</p>';
        return;
    }
    
    grid.innerHTML = caps.map(c => {
        const rawIndex = RAW_CAPTIONS.indexOf(c);
        const isFav = favCaptions.includes(rawIndex);
        return '<div class="caption-card">' +
            '<button class="caption-fav ' + (isFav ? 'active' : '') + '" onclick="toggleFavCaption(' + rawIndex + ')">' + (isFav ? '⭐️' : '☆') + '</button>' +
            '<span class="caption-badge" style="background:rgba(5,150,105,0.1);color:var(--emerald)">' + c.cat + '</span>' +
            '<div class="caption-text" id="cap-' + rawIndex + '">' + c.text + '\n\n' + COMPANY.hashtags + '</div>' +
            '<div class="caption-meta">' +
                '<span>Tags: ' + c.tags.join(', ') + '</span>' +
                '<button class="btn-sm btn-outline" style="padding: 0.3rem 0.6rem; font-size:0.7rem;" onclick="copyToClipboard(\'cap-' + rawIndex + '\')">Copy</button>' +
            '</div></div>';
    }).join('');
}

function toggleFavCaption(index) {
    if (favCaptions.includes(index)) {
        favCaptions = favCaptions.filter(i => i !== index);
    } else {
        favCaptions.push(index);
    }
    localStorage.setItem('swaktorie_fav_captions', JSON.stringify(favCaptions));
    filterCaptions();
}


// ===== BMI -> MEAL PLAN RECOMMENDER =====
function calculateAndRecommend() {
    const name = document.getElementById('bmi-name').value || 'there';
    const gender = document.getElementById('bmi-gender').value;
    const age = parseInt(document.getElementById('bmi-age').value);
    const h = parseFloat(document.getElementById('bmi-height').value);
    const w = parseFloat(document.getElementById('bmi-weight').value);
    const activity = parseFloat(document.getElementById('bmi-activity').value);
    const goalPreference = document.getElementById('bmi-goal').value;
    
    if (!age || !h || !w) {
        showToast('⚠️ Please enter height, weight, and age.');
        return;
    }
    
    // 1. BMI Calculation
    const hMeters = h / 100;
    const bmi = (w / (hMeters * hMeters)).toFixed(1);
    
    let category = '';
    let goal = 'maintain';
    
    if (bmi < 18.5) { category = 'Underweight'; goal = 'gain'; }
    else if (bmi < 24.9) { category = 'Normal weight'; goal = 'maintain'; }
    else if (bmi < 29.9) { category = 'Overweight'; goal = 'lose'; }
    else { category = 'Obese'; goal = 'lose'; }
    
    // Override goal
    if (goalPreference !== 'auto') {
        goal = goalPreference;
    }
    
    // 2. TDEE Calculation (Mifflin-St Jeor)
    let bmr;
    if (gender === 'male') {
        bmr = (10 * w) + (6.25 * h) - (5 * age) + 5;
    } else {
        bmr = (10 * w) + (6.25 * h) - (5 * age) - 161;
    }
    
    const tdee = Math.round(bmr * activity);
    
    let recCals = tdee;
    if(goal === 'lose') recCals -= 500;
    if(goal === 'gain') recCals += 300;
    
    // 3. Plan Matching
    let recommendedPlan;
    if (goal === 'lose') recommendedPlan = COMPANY.plans.find(p => p.name === 'Weight Loss');
    else if (goal === 'maintain') recommendedPlan = COMPANY.plans.find(p => p.name === 'Maintenance');
    else if (goal === 'gain') recommendedPlan = COMPANY.plans.find(p => p.name === 'Performance');
    
    if (!recommendedPlan) recommendedPlan = COMPANY.plans[1];
    
    // 4. Update UI
    document.getElementById('bmi-results').style.display = 'block';
    document.getElementById('res-bmi').innerText = bmi;
    document.getElementById('res-category').innerText = category;
    document.getElementById('res-tdee').innerText = tdee + ' kcal';
    
    document.getElementById('res-plan-card').innerHTML = '<h4>' + recommendedPlan.icon + ' Recommended: ' + recommendedPlan.name + ' Plan</h4>' +
        '<div class="plan-price">₱' + recommendedPlan.daily + '/day</div>' +
        '<div class="plan-desc">Target: ' + recommendedPlan.kcal + ' kcal/day</div>' +
        '<div class="plan-desc" style="margin-top:0.8rem;">' + recommendedPlan.desc + '</div>';
    
    // 5. Generate Messenger Reply
    const msg = 'Hi ' + name + '! 👋 Thanks for reaching out to Swaktorie Meals.\n\nBased on your info (Height: ' + h + 'cm, Weight: ' + w + 'kg, Age: ' + age + '), here is your custom nutritional assessment:\n\n📊 BMI: ' + bmi + ' (' + category + ')\n🔥 Daily Energy Burn (TDEE): ~' + tdee + ' calories\n🎯 Target for your goal: ~' + recCals + ' calories/day\n\nBased on this, the perfect fit for you is our ' + recommendedPlan.icon + ' **' + recommendedPlan.name.toUpperCase() + ' PLAN**!\n\nIt provides ' + recommendedPlan.kcal + ' calories per day, designed specifically for your goals (' + recommendedPlan.desc + ').\n\n💰 Pricing:\n• 5-Day Trial: ₱' + recommendedPlan.durations[5].toLocaleString() + '\n• 7-Day Box: ₱' + recommendedPlan.durations[7].toLocaleString() + '\n• 2-Week Plan: ₱' + recommendedPlan.durations[14].toLocaleString() + '\n• 4-Week Plan: ₱' + recommendedPlan.durations[28].toLocaleString() + '\n\nDelivery is FREE to ' + COMPANY.zones.free.join(' and ') + ' (Standard fee for other Bulacan areas).\n\nWould you like me to process an order for you to start this coming Monday? 🥗✨';
    
    document.getElementById('bmi-messenger-reply').innerText = msg;
}
function updateBmiPreview() {
    if (document.getElementById('bmi-results').style.display === 'block') {
        calculateAndRecommend();
    }
}

// ==== INITIALIZATION ====
document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
    initTemplates();
    initCaptionLibrary();
    initAnalytics();
    generatePost();
});

// Listen for message from Parent Hub
window.addEventListener('message', (event) => {
    if (event.data.type === 'toggleDarkMode') {
        const isDark = event.data.isDark;
        const currentlyDark = document.body.classList.contains('dark-mode');
        if (isDark !== currentlyDark) {
            toggleDarkMode();
        }
    }
});
