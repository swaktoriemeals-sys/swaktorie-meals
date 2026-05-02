# Swaktorie Meals | Premium Health Mealprep Platform

This document outlines the nutritional logic, design philosophy, and technical structure of the Fresh Prep platform.

## 🥗 Nutritional Logic Guidelines

### 1. BMI (Body Mass Index)
- **Formula**: `Weight (kg) / (Height (m)^2)`
- **Categories**:
  - Underweight: < 18.5
  - Normal: 18.5 - 24.9
  - Overweight: 25.0 - 29.9
  - Obese: >= 30.0

### 2. TDEE (Total Daily Energy Expenditure)
Uses the **Mifflin-St Jeor Equation** for maximum accuracy:
- **BMR (Male)**: `(10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5`
- **BMR (Female)**: `(10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161`
- **Calculated TDEE**: `BMR × Activity Multiplier` (1.2 for Sedentary to 1.9 for Extra Active).

### 3. Macronutrient Precision
- **Protein**: 4 kcal/g
- **Carbohydrates**: 4 kcal/g
- **Fats**: 9 kcal/g

## 🎨 Design System: "Fresh Health"
- **Primary**: Deep Forest Green (`#2D3E40`) - Represents trust and health.
- **Accent 1**: Fresh Coral (`#F27A54`) - Vibrant protein/energy theme.
- **Accent 2**: Leaf Green (`#76B947`) - Freshness and vitality.
- **Background**: Soft Cream (`#FDFDF8`) - Premium, clean feel.
- **Typography**: 'Outfit' (Headings) & 'Inter' (Body).

## 🛠️ Technical Stack
- **Core**: HTML5, Vanilla CSS3 (Custom Design System).
- **Logic**: Vanilla JavaScript for dynamic rendering and calculators.
- **Assets**: High-resolution, appetizing food photography (Unsplash placeholders).

## 🚀 Key Features
- **Dynamic Catalog**: Filtered meal view with real-time calorie/macro badges.
- **Interactive Calculators**: Sliding drawer UI for BMI/TDEE with health category feedback.
- **Premium Order Flow**: Micro-interacted cart and frictionless single-page layout.
