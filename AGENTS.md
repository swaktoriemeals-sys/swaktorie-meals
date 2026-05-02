# 🤖 Agent Collaboration Guide: Swaktorie Meals

This document is designed for AI agents (Antigravity, Claude, etc.) to collaborate effectively on the **Swaktorie Meals** platform.

## 📋 Project Purpose
A premium, high-converting meal prep subscription service based in the Philippines. It features calorie-based filtering, BMI calculators, personalized meal recommendations, and an AI nutritional coach.

## 🛠️ Tech Stack & Conventions
- **Language**: HTML5, Vanilla CSS3, Vanilla JavaScript.
- **Design Philosophy**: Glassmorphism, premium micro-animations, mobile-first.
- **Reference Doc**: Consult [claude.md](file:///e:/New%20plan/New%20Plan/claude.md) for the "Fresh Health" design system and nutritional logic formulas.

## 🤝 How to Collaborate
1. **Sync with `task.md`**: Before starting any work, read the current state in the `brain` directory's `task.md`.
2. **Follow the Design Spec**: Adhere to the [ux_ui_design_spec.md](file:///C:/Users/ADMIN/.gemini/antigravity/brain/e631ce6d-c607-4157-8c5a-7ba85b6a0203/ux_ui_design_spec.md).
3. **Atomic Edits**: Use `multi_replace_file_content` for non-contiguous changes to maintain file integrity.
4. **Verification**: Always run verification steps (checking responsiveness, logic accuracy) before marking a task as complete.

## 🧭 Directory Structure
- `swaktorie_flagship.html`: **PRIMARY** — Main website file. All HTML, CSS, and JS are inline in this single file (~4800+ lines).
- `swaktorie_printable_labels.html`: Printable sticker template for meal containers.
- `swaktorie_logo_v4.png`: Complex brand illustration logo (used in footer).
- `swaktorie_logo_text_v6.png`: Scripted text logo (used in navigation header).
- `claude.md`: Source of truth for formulas and colors.

## 💰 Current Pricing Model (Fixed)
Prices are fixed per duration. The 4-Week (1-Month) plan includes a built-in 10% discount:

| Plan | 5-Day | 7-Day | 2-Week | 1-Month (10% Off) |
|------|-------|-------|--------|-------------------|
| 1200 kcal (Weight Loss) | ₱2,199 | ₱3,199 | ₱6,398 | ₱11,516 |
| 1500 kcal (Maintenance) | ₱2,349 | ₱3,349 | ₱6,698 | ₱12,056 |
| 1800 kcal (Performance) | ₱2,499 | ₱3,499 | ₱6,998 | ₱12,596 |

> [!IMPORTANT]
> The AI Coach handles these pricing calculations dynamically in `swaktorie_flagship.html`. Do not revert to the old daily multiplier logic.

## 🧠 Live AI Coach (Gemini 2.5 Flash)
The website's AI Chat is NOT rule-based. It is directly wired to the Google Gemini API using the `@google/generative-ai` ESM import.
- **Do not break the System Prompt**: The prompt dynamically injects the `companyData` object on load.
- If you need to update business logic, update the `companyData` JSON object, and the Gemini AI will automatically learn the new rules.

## 🔗 Social & Contact
- **Facebook**: https://web.facebook.com/Swaktorie.Meals
- **Phone**: (0999) 123-4567

## ⏰ Business Rules
- **Order Cutoff**: Every Thursday for the following Monday delivery.
- **Free Delivery**: San Rafael & Baliwag City.
- **Standard Delivery**: Other Bulacan areas (+₱50/day), Metro Manila (+₱100/day).

## 🚀 Active Roadmap
Refer to the `task.md` in the conversation's brain folder for real-time progress. Current focus: **Website Polish & AI Enhancement**.
