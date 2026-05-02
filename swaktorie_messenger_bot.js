/**
 * SWAKTORIE MEALS — MESSENGER BMI BOT (WEBHOOK)
 * 
 * This is a standalone Node.js Express server to handle Facebook Messenger automations.
 * It asks customers for their details and automatically recommends a meal plan.
 */

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express().use(bodyParser.json());

// --- CONFIGURATION ---
const VERIFY_TOKEN = 'SWAKTORIE_SECRET_TOKEN'; // Set this in Meta Developer Portal
const PAGE_ACCESS_TOKEN = 'EAAeZCrU6bb1kBQ7Nq6nMRLg70fVeZAXuyvL9CkkonJPiWGfakPv6fT2KtsPsjoo0XJZB1ne3MxeKZAbdrVdxEJEEwJHdFuoclZBktbNZBWlk94UB2gp2XyhlwrHUvASnAPGv157lcNfyAGQ4ePN2GEX6bowsCHZCVfofEfYKRNRTADdbingBOJW9jbOOqFqk6WZC6GUHqpI5diy4929fegZCJtZAvIhgZDZD'; // Updated Page Access Token

// --- COMPANY DATA ---
const COMPANY = {
    plans: [
        { name: "Weight Loss", kcal: 1200, icon: "🔥", desc: "Fat loss & calorie deficit.", durations: { 5: 2199, 7: 3199, 14: 6398, 28: 11516 } },
        { name: "Maintenance", kcal: 1500, icon: "⚖️", desc: "Energy balance & lean muscle.", durations: { 5: 2349, 7: 3349, 14: 6698, 28: 12056 } },
        { name: "Performance", kcal: 1800, icon: "💪", desc: "High-protein for active users.", durations: { 5: 2499, 7: 3499, 14: 6998, 28: 12596 } }
    ],
    websiteUrl: "https://www.swaktoriemeals.shop",
    paymentMethods: "GCash and Maya only"
};

// --- IN-MEMORY STATE TRACKER ---
// Note: In production, use Redis or a Database.
const sessions = {};

app.listen(process.env.PORT || 1337, () => console.log('Swaktorie Webhook is live!'));

// 1. Webhook Verification (for Meta Setup)
app.get('/webhook', (req, res) => {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    console.log('--- Incoming Webhook Verification ---');
    console.log('Mode:', mode);
    console.log('Token Received:', token);
    console.log('Expected Token:', VERIFY_TOKEN);

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED ✅');
            res.status(200).send(challenge);
        } else {
            console.log('WEBHOOK_FAILED ❌ (Token Mismatch)');
            res.sendStatus(403);
        }
    } else {
        console.log('WEBHOOK_FAILED ❌ (Missing Mode or Token)');
        res.status(400).send('Missing Parameters');
    }
});

// 2. Message Handling
app.post('/webhook', (req, res) => {
    let body = req.body;

    console.log('--- Incoming Webhook Event ---');
    console.log(JSON.stringify(body, null, 2));

    if (body.object === 'page') {
        body.entry.forEach(function(entry) {
            if (entry.messaging && entry.messaging.length > 0) {
                let webhook_event = entry.messaging[0];
                let sender_psid = webhook_event.sender.id;
                console.log('Sender PSID:', sender_psid);

                if (webhook_event.message) {
                    console.log('Message Content:', webhook_event.message.text);
                    handleMessage(sender_psid, webhook_event.message);
                }
            } else {
                console.log('Event received but no messaging data found.');
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        console.log('Event received but object is not "page":', body.object);
        res.sendStatus(404);
    }
});

// 3. Conversation Logic
function handleMessage(sender_psid, received_message) {
    let text = received_message.text ? received_message.text.toLowerCase().trim() : "";
    
    // Initialize session if new
    if (!sessions[sender_psid]) {
        sessions[sender_psid] = { step: 'WELCOME', is_human_needed: true };
    }

    let session = sessions[sender_psid];

    // --- ESCAPE COMMANDS (always work, never get stuck) ---
    if (text === 'cancel' || text === 'back' || text === 'stop' || text === 'exit') {
        session.step = 'WELCOME';
        session.is_human_needed = false;
        return sendWelcome(sender_psid);
    }

    if (text.includes('skip') || text === 'no' || text === 'skip bmi') {
        session.step = 'WELCOME';
        session.is_human_needed = false;
        return callSendAPI(sender_psid, { 
            "text": "No worries! 😊 Hindi naman required ang BMI — pwede ka nang umorder directly!\n\n🛒 Visit our website para mag-order:\n" + COMPANY.websiteUrl + "\n\nOr type 'Order' para sa instructions dito sa Messenger." 
        });
    }

    // --- AGENT HANDOVER ---
    if (text.includes('agent') || text.includes('human') || text.includes('talk to')) {
        session.is_human_needed = true;
        return callSendAPI(sender_psid, { "text": "Got it! 🤝 I-papause ko muna ang auto-replies. One of our Swaktorie team will reply to you shortly!\n\n(Type 'start' anytime para bumalik sa AI menu)" });
    }

    // --- KEYWORD CHECK ---
    const isKeyword = text.includes('bmi') || 
                      text.includes('menu') || 
                      text.includes('plan') || 
                      text.includes('order') || 
                      text.includes('start') || 
                      text.includes('reset') ||
                      text.includes('presyo') ||
                      text.includes('price') ||
                      text.includes('delivery') ||
                      text.includes('hi') ||
                      text.includes('hello') ||
                      text.includes('hey') ||
                      text.includes('weight loss') ||
                      text.includes('maintenance') ||
                      text.includes('performance');

    if (isKeyword) {
        session.is_human_needed = false;
        
        // BMI — clearly optional
        if (text.includes('bmi')) {
            session.step = 'ASK_HEIGHT';
            return callSendAPI(sender_psid, { "text": "Sure thing! Tulungan kita mahanap ang perfect plan! 🥗\n\n⚠️ DISCLAIMER: Hindi required ang BMI para mag-order. This is 100% optional lang! Type 'skip' or 'cancel' anytime para dumiretso sa ordering.\n\nOkay, let's go! Ano ang HEIGHT mo in cm? (Example: 170)" });
        }

        // PRICING
        if (text.includes('price') || text.includes('presyo')) {
            let msg = "🚀 SOFT LAUNCH SALE — 30% OFF! 💰\n\n";
            COMPANY.plans.forEach(p => {
                msg += `${p.icon} ${p.name.toUpperCase()} (${p.kcal} kcal)\n`;
                msg += `• 5-Day: ₱${p.durations[5].toLocaleString()}\n`;
                msg += `• 7-Day: ₱${p.durations[7].toLocaleString()}\n`;
                msg += `• 1-Month: ₱${p.durations[28].toLocaleString()} (Extra 10% OFF!)\n\n`;
            });
            msg += `⚠️ Cutoff: Every Thursday para sa Sunday delivery!\n\n🛒 Order here: ${COMPANY.websiteUrl}`;
            return callSendAPI(sender_psid, { "text": msg });
        }

        // DELIVERY
        if (text.includes('delivery')) {
            return callSendAPI(sender_psid, { "text": "🚗 Delivery Info:\n\nNagde-deliver kami sa buong Bulacan at Metro Manila!\nDelivery fees depend sa exact location mo.\n\n📦 Schedule: Every Sunday\n⚠️ Cutoff: Every Thursday\n💳 Payment: GCash & Maya only\n\nTaga-saan ka po? 📍" });
        }
        
        // PLAN INQUIRIES
        if (text.includes('weight loss')) {
            let p = COMPANY.plans[0];
            return callSendAPI(sender_psid, { "text": `${p.icon} ${p.name.toUpperCase()} PLAN (${p.kcal} kcal)\n\nIdeal para sa fat loss!\n💰 5-Day: ₱${p.durations[5].toLocaleString()}\n💰 7-Day: ₱${p.durations[7].toLocaleString()}\n💰 1-Month: ₱${p.durations[28].toLocaleString()} (10% OFF!)\n\n🛒 Order: ${COMPANY.websiteUrl}\n\nOr type 'Order' for manual instructions.` });
        }
        if (text.includes('maintenance')) {
            let p = COMPANY.plans[1];
            return callSendAPI(sender_psid, { "text": `${p.icon} ${p.name.toUpperCase()} PLAN (${p.kcal} kcal)\n\nMaintain weight & build lean muscle!\n💰 5-Day: ₱${p.durations[5].toLocaleString()}\n💰 7-Day: ₱${p.durations[7].toLocaleString()}\n💰 1-Month: ₱${p.durations[28].toLocaleString()} (10% OFF!)\n\n🛒 Order: ${COMPANY.websiteUrl}` });
        }
        if (text.includes('performance')) {
            let p = COMPANY.plans[2];
            return callSendAPI(sender_psid, { "text": `${p.icon} ${p.name.toUpperCase()} PLAN (${p.kcal} kcal)\n\nHigh-protein fuel para sa active lifestyle!\n💰 5-Day: ₱${p.durations[5].toLocaleString()}\n💰 7-Day: ₱${p.durations[7].toLocaleString()}\n💰 1-Month: ₱${p.durations[28].toLocaleString()} (10% OFF!)\n\n🛒 Order: ${COMPANY.websiteUrl}` });
        }

        // MENU
        if (text.includes('menu') || text.includes('plan')) {
            return callSendAPI(sender_psid, { "text": "🍱 Our Meal Plans:\n\n🔥 Weight Loss (1200 kcal) — from ₱2,199\n⚖️ Maintenance (1500 kcal) — from ₱2,349\n💪 Performance (1800 kcal) — from ₱2,499\n\n🚀 All plans are 30% OFF for our Soft Launch Sale!\n\n🛒 Order here: " + COMPANY.websiteUrl + "\n\n💡 Optional: Type 'BMI' for a personalized recommendation based on your body stats." });
        }

        // ORDER - direct to website
        if (text.includes('order')) {
            return callSendAPI(sender_psid, { 
                "text": `🛒 Ready to order? You have 2 options:\n\n✅ Option 1: Order directly on our website — fast, easy, and automated!\n🔗 ${COMPANY.websiteUrl}\n\n✅ Option 2: Order here sa Messenger — one of our agents will personally assist you!\n\nAlin ang gusto mo?`,
                "quick_replies": [
                    { "content_type": "text", "title": "🌐 Go to Website", "payload": "WEBSITE" },
                    { "content_type": "text", "title": "🧑‍💼 Talk to Agent", "payload": "TALK_TO_AGENT" }
                ]
            });
        }

        // GREETINGS & START/RESET
        if (text.includes('start') || text.includes('reset') || text.includes('hi') || text.includes('hello') || text.includes('hey')) {
            session.step = 'WELCOME';
            return sendWelcome(sender_psid);
        }
    }

    // --- BMI FLOW (only if they are already inside it) ---
    const isBmiFlow = ['ASK_HEIGHT', 'ASK_WEIGHT', 'ASK_AGE', 'ASK_GENDER', 'ASK_GOAL'].includes(session.step);
    
    if (!isKeyword && !isBmiFlow) {
        console.log(`Silence Mode: User typed "${text}". No robot response needed. Human can take over.`);
        return; 
    }

    switch (session.step) {
        case 'WELCOME':
            sendWelcome(sender_psid);
            break;

        case 'ASK_HEIGHT':
            let h = parseFloat(text);
            if (isNaN(h) || h < 50 || h > 250) {
                return callSendAPI(sender_psid, { "text": "Pakisulat lang ang height mo in cm (Example: 165).\n\n💡 Type 'skip' kung gusto mo nang mag-order without BMI." });
            }
            session.height = h;
            session.step = 'ASK_WEIGHT';
            callSendAPI(sender_psid, { "text": "Got it! Next, ano ang WEIGHT mo in kg? (Example: 65)\n\n💡 Type 'skip' anytime to skip BMI." });
            break;

        case 'ASK_WEIGHT':
            let w = parseFloat(text);
            if (isNaN(w) || w < 20 || w > 300) {
                return callSendAPI(sender_psid, { "text": "Pakisulat lang ang weight mo in kg (Example: 70).\n\n💡 Type 'skip' anytime to skip BMI." });
            }
            session.weight = w;
            session.step = 'ASK_AGE';
            callSendAPI(sender_psid, { "text": "Malapit na tayo! Ilang taon ka na po?\n\n💡 Type 'skip' anytime to skip BMI." });
            break;

        case 'ASK_AGE':
            let age = parseInt(text);
            if (isNaN(age) || age < 5 || age > 100) {
                return callSendAPI(sender_psid, { "text": "Paki-enter ang iyong tamang edad.\n\n💡 Type 'skip' anytime to skip BMI." });
            }
            session.age = age;
            session.step = 'ASK_GENDER';
            callSendAPI(sender_psid, { 
                "text": "Ano ang iyong gender? 👦👧",
                "quick_replies": [
                    { "content_type": "text", "title": "Male / Lalaki", "payload": "MALE" },
                    { "content_type": "text", "title": "Female / Babae", "payload": "FEMALE" },
                    { "content_type": "text", "title": "⏭️ Skip BMI", "payload": "SKIP" }
                ]
            });
            break;

        case 'ASK_GENDER':
            if (!text.includes('male') && !text.includes('lalaki') && !text.includes('female') && !text.includes('babae')) {
                return callSendAPI(sender_psid, { "text": "Paki-pili po: Male or Female?\n\n💡 Type 'skip' to skip BMI and order directly." });
            }
            session.gender = (text.includes('male') || text.includes('lalaki')) ? 'male' : 'female';
            session.step = 'ASK_GOAL';
            callSendAPI(sender_psid, { 
                "text": "Last step! Ano ang fitness goal mo? 🎯",
                "quick_replies": [
                    { "content_type": "text", "title": "💪 Lose Weight", "payload": "LOSE" },
                    { "content_type": "text", "title": "⚖️ Maintain", "payload": "MAINTAIN" },
                    { "content_type": "text", "title": "🔥 Gain Muscle", "payload": "GAIN" }
                ]
            });
            break;

        case 'ASK_GOAL':
            let goal = null;
            if (text.includes('lose') || text.includes('weight')) goal = 'lose';
            if (text.includes('maintain')) goal = 'maintain';
            if (text.includes('gain') || text.includes('muscle')) goal = 'gain';

            if (!goal) return callSendAPI(sender_psid, { "text": "Paki-pili ng goal mo from the buttons above.\n\n💡 Type 'skip' to skip BMI and order directly." });
            
            session.goal = goal;
            generateResult(sender_psid, session);
            delete sessions[sender_psid];
            break;

        default:
            sendWelcome(sender_psid);
    }
}

// Welcome Message Helper
function sendWelcome(sender_psid) {
    sessions[sender_psid] = { step: 'WELCOME', is_human_needed: false };
    callSendAPI(sender_psid, { 
        "text": "Kumusta! 🥗 Welcome sa Swaktorie Meals!\n\nWe offer ready-to-eat, calorie-controlled meal plans delivered to your door every Sunday!\n\n🚀 SOFT LAUNCH SALE: 30% OFF all plans!\n\nAno ang gusto mong gawin?",
        "quick_replies": [
            { "content_type": "text", "title": "🛒 Order Now", "payload": "ORDER" },
            { "content_type": "text", "title": "💰 See Prices", "payload": "PRICES" },
            { "content_type": "text", "title": "📖 View Plans", "payload": "VIEW_MENU" },
            { "content_type": "text", "title": "🚗 Delivery Info", "payload": "DELIVERY_INFO" },
            { "content_type": "text", "title": "📊 BMI Check (Optional)", "payload": "BMI" }
        ]
    });
}

// 4. BMI & TDEE Calculation Logic
function generateResult(psid, s) {
    const hM = s.height / 100;
    const bmi = (s.weight / (hM * hM)).toFixed(1);
    
    // BMR (Mifflin-St Jeor)
    let bmr = (10 * s.weight) + (6.25 * s.height) - (5 * s.age);
    bmr = (s.gender === 'male') ? bmr + 5 : bmr - 161;
    
    const tdee = Math.round(bmr * 1.375); // Assuming moderate activity
    
    let targetCals = tdee;
    if (s.goal === 'lose') targetCals -= 500;
    if (s.goal === 'gain') targetCals += 300;

    let plan;
    if (s.goal === 'lose') plan = COMPANY.plans[0];
    else if (s.goal === 'gain') plan = COMPANY.plans[2];
    else plan = COMPANY.plans[1];

    let category = "";
    if (bmi < 17.5) category = "Needs more food fuel! (Kulang sa eat levels)";
    else if (bmi < 18.5) category = "Gaining phase na ito (Almost normal!)";
    else if (bmi <= 20.0) category = "Lean and sexy (Low normal level)";
    else if (bmi <= 23.0) category = "Swak na swak! Ideal weight reached ✨";
    else if (bmi <= 24.9) category = "Medyo heavier ng light (Above Ideal)";
    else if (bmi <= 29.9) category = "Time to focus on health! (Above normal)";
    else category = "Intense health management needed (High levels)";

    const response = {
        "text": `Assessment Complete! ✨\n\n📊 BMI: ${bmi} (${category})\n🔥 Maintenance Calories: ~${tdee} kcal\n🎯 Target for Goal: ~${targetCals} kcal/day\n\nBase sa iyong info, ang recommend ko sa'yo ay ang ${plan.icon} ${plan.name.toUpperCase()} PLAN!\n\nIto ay may ${plan.kcal} calories per day, designed para sa ${plan.desc}\n\n🚀 SOFT LAUNCH SALE — 30% OFF!\n💰 5-Day: ₱${plan.durations[5].toLocaleString()}\n💰 7-Day: ₱${plan.durations[7].toLocaleString()}\n💰 1-Month: ₱${plan.durations[28].toLocaleString()} (Extra 10% OFF!)\n\n🛒 Order now: ${COMPANY.websiteUrl}\n\nOr type "Order" para mag-order dito sa Messenger!`
    };

    callSendAPI(psid, response);
}

// 5. Send Message API
function callSendAPI(sender_psid, response) {
    let request_body = {
        "recipient": { "id": sender_psid },
        "message": response
    };

    console.log('--- Sending Reply to PSID:', sender_psid, '---');

    request({
        "uri": "https://graph.facebook.com/v21.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            if (body.error) {
                console.error("--- Facebook API Error ---");
                console.error(JSON.stringify(body.error, null, 2));
            } else {
                console.log('Reply sent successfully!');
            }
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}
