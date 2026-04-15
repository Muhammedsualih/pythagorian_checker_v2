# SOLID-Based Triangle Analyzer Web App

## 📌 Overview

This project is a **web-based application** developed as part of a Software Quality Assurance assignment. It demonstrates both **functional correctness** and **software engineering best practices**, particularly the application of **SOLID principles** in frontend JavaScript.

The system performs:

* **User authentication**
* **Triangle validation (triangularity check)**
* **Triangle classification (Equilateral, Isosceles, Scalene)**
* **Pythagorean (Right Triangle) detection**

---

## 🚀 Features

### 🔐 Authentication

* Username must be **exactly 6 letters**
* Password must **contain `SWUSTCST`**
* Real-time validation with visual feedback

### 📐 Triangle Analysis

* Validates triangle using **triangle inequality theorem**
* Classifies triangle into:

  * Equilateral
  * Isosceles
  * Scalene
* Detects **Right Triangle (Pythagorean condition)**

### 🎨 UI/UX

* Modern **glassmorphism design**
* Responsive layout
* Side-by-side result panels:

  * Pythagorean Check
  * Triangle Type
* Smooth animations and transitions

---

## 🏗️ Project Structure

```
project/
│
├── index.html      # UI structure
├── style.css       # Styling and layout
├── app.js          # Application logic (SOLID architecture)
└── README.md       # Documentation
```

---

## 🧠 Software Design Principles (SOLID)

### 1. Single Responsibility Principle (SRP)

Each class has a single responsibility:

* `Triangle` → geometric logic
* `AuthService` → authentication
* `AppController` → UI coordination

---

### 2. Open-Closed Principle (OCP)

Triangle classification is **extensible**:

* New classifiers (e.g., ObtuseTriangle) can be added without modifying existing code.

---

### 3. Liskov Substitution Principle (LSP)

All classifiers implement the same interface:

```js
classify(triangle)
```

They can be used interchangeably.

---

### 4. Interface Segregation Principle (ISP)

Small, focused abstractions:

* `Validator`
* `TriangleClassifier`

No unnecessary dependencies.

---

### 5. Dependency Injection (DI)

Dependencies are injected into the controller:

```js
new AppController(authService, triangleService);
```

This improves:

* Testability
* Flexibility
* Maintainability

---

## ⚙️ How It Works

### Step 1: Login

User enters:

* Username (validated with regex)
* Password (validated with substring check)

### Step 2: Input Triangle Sides

User inputs three numbers.

### Step 3: Processing

* Triangle validity is checked
* Classification is performed
* Pythagorean condition is evaluated

### Step 4: Output

Results are displayed side-by-side:

* Triangle Type
* Pythagorean Result

---

## 🧪 Sample Test Cases

| Input   | Expected Output |
| ------- | --------------- |
| 3, 4, 5 | Scalene + Right |
| 5, 5, 5 | Equilateral     |
| 5, 5, 3 | Isosceles       |
| 1, 2, 3 | Not a Triangle  |

---

## ▶️ How to Run

1. Clone or download the repository
2. Open `index.html` in any modern browser
3. No additional setup required

---

## 📈 Possible Improvements

* Add **unit testing framework**
* Visualize triangle using **Canvas API**
* Extend classification:

  * Acute triangle
  * Obtuse triangle
* Convert to **React or Vue architecture**
* Add **backend authentication**

---

## 🎯 Purpose

This project is designed to:

* Demonstrate **clean code architecture**
* Apply **SOLID principles in practice**
* Improve **UI/UX design skills**
* Prepare for **software inspection and evaluation**

---

## 👨‍💻 Author

Muhammed Ahmed

---

## 📄 License

This project is for educational purposes.
