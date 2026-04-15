/**
 * SOLID Triangle App - SQA Assignment
 * 
 * Principles:
 * - SRP: Single Responsibility Principle
 * - OCP: Open/Closed Principle
 * - LSP: Liskov Substitution Principle
 * - ISP: Interface Segregation Principle
 * - DIP: Dependency Inversion Principle
 */

/* 
================================
Interfaces (Conceptual)
================================
*/

/**
 * @interface IValidator
 * validate(value: string): { isValid: boolean, message?: string }
 */

/**
 * @interface ITriangleClassifier
 * classify(triangle: Triangle): string | null
 */


/* 
================================
Validators (SRP)
================================
*/

class UsernameValidator {
    validate(username) {
        const isValid = /^[A-Za-z]{6}$/.test(username);
        return {
            isValid,
            message: isValid ? "" : "Username must be exactly 6 letters."
        };
    }
}

class PasswordValidator {
    validate(password) {
        const isValid = password.includes("SWUSTCST");
        return {
            isValid,
            message: isValid ? "" : "Password must contain 'SWUSTCST'."
        };
    }
}

class SideValidator {
    validate(value) {
        const num = Number(value);
        const isValid = value !== "" && !isNaN(num) && num > 0;
        return {
            isValid,
            message: isValid ? "" : "Must be a positive number."
        };
    }
}


/* 
================================
Auth Service (SRP)
================================
*/

class AuthService {
    constructor(userValidator, passValidator) {
        this.userValidator = userValidator;
        this.passValidator = passValidator;
    }

    authenticate(username, password) {
        const userRes = this.userValidator.validate(username);
        if (!userRes.isValid) return { success: false, message: userRes.message };

        const passRes = this.passValidator.validate(password);
        if (!passRes.isValid) return { success: false, message: passRes.message };

        return { success: true, message: "Login successful!" };
    }
}


/* 
================================
Triangle Model (SRP)
================================
*/

class Triangle {
    constructor(a, b, c) {
        this.a = Number(a);
        this.b = Number(b);
        this.c = Number(c);
        this.sides = [this.a, this.b, this.c].sort((x, y) => x - y);
    }

    isTriangular() {
        if (isNaN(this.a) || isNaN(this.b) || isNaN(this.c)) return false;
        if (this.a <= 0 || this.b <= 0 || this.c <= 0) return false;
        return (
            this.a + this.b > this.c &&
            this.a + this.c > this.b &&
            this.b + this.c > this.a
        );
    }

    isPythagorean() {
        const [x, y, z] = this.sides;
        // Use a small epsilon for floating point precision if needed, 
        // but for integers it's exact.
        return Math.abs(x * x + y * y - z * z) < 0.000001;
    }
}


/* 
================================
Classifiers (OCP + LSP)
================================
*/

class EquilateralClassifier {
    classify(t) {
        return (t.a === t.b && t.b === t.c) ? "Equilateral" : null;
    }
}

class IsoscelesClassifier {
    classify(t) {
        // Only return Isosceles if it's NOT Equilateral to keep results clean,
        // OR return both if that's the requirement. 
        // Here we return it if at least two sides are equal.
        return ((t.a === t.b || t.b === t.c || t.a === t.c) && !(t.a === t.b && t.b === t.c)) ? "Isosceles" : null;
    }
}

class ScaleneClassifier {
    classify(t) {
        return (t.a !== t.b && t.b !== t.c && t.a !== t.c) ? "Scalene" : null;
    }
}

class RightClassifier {
    classify(t) {
        return t.isPythagorean() ? "Right-angled" : null;
    }
}


/* 
================================
Triangle Service (OCP)
================================
*/

class TriangleService {
    constructor(classifiers) {
        this.classifiers = classifiers;
    }

    analyze(triangle) {
        if (!triangle.isTriangular()) {
            return {
                isTriangular: false,
                isPythagorean: triangle.isPythagorean(), // Can still be Pythagorean numbers even if not triangular? 
                // Actually, Pythagorean numbers (a^2+b^2=c^2) ALWAYS satisfy a+b > c if a,b,c > 0.
                // Proof: (a+b)^2 = a^2 + b^2 + 2ab = c^2 + 2ab > c^2 => a+b > c.
                types: []
            };
        }

        const types = this.classifiers
            .map(c => c.classify(triangle))
            .filter(res => res !== null);

        // Refinement: If Equilateral, we might want to hide Isosceles for clarity,
        // but technically it is both. Let's keep both or filter.
        // For this assignment, showing all applicable types is usually better.

        return {
            isTriangular: true,
            isPythagorean: triangle.isPythagorean(),
            types: types
        };
    }
}


/* 
================================
App Controller (DIP)
================================
*/

class AppController {
    constructor(authService, triangleService, sideValidator) {
        this.authService = authService;
        this.triangleService = triangleService;
        this.sideValidator = sideValidator;
        this.bindEvents();
    }

    bindEvents() {
        // Login
        document.getElementById('loginBtn').addEventListener('click', () => this.handleLogin());
        
        // Real-time validation feedback
        document.getElementById('username').addEventListener('input', (e) => this.validateInput(e.target, this.authService.userValidator));
        document.getElementById('password').addEventListener('input', (e) => this.validateInput(e.target, this.authService.passValidator));

        // Triangle inputs validation
        ['side-a', 'side-b', 'side-c'].forEach(id => {
            document.getElementById(id).addEventListener('input', (e) => this.validateInput(e.target, this.sideValidator));
        });

        // Analysis
        document.getElementById('checkBtn').addEventListener('click', () => this.handleAnalysis());

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
    }

    validateInput(input, validator) {
        const res = validator.validate(input.value);
        if (input.value === "") {
            input.classList.remove('valid', 'invalid');
        } else if (res.isValid) {
            input.classList.add('valid');
            input.classList.remove('invalid');
        } else {
            input.classList.add('invalid');
            input.classList.remove('valid');
        }
    }

    handleLogin() {
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const msgEl = document.getElementById('login-msg');

        const res = this.authService.authenticate(user, pass);

        if (res.success) {
            msgEl.textContent = res.message;
            msgEl.className = "message success";
            
            // Transition to analyzer
            setTimeout(() => {
                document.getElementById('login-section').classList.replace('active', 'hidden');
                document.getElementById('triangle-section').classList.replace('hidden', 'active');
            }, 600);
        } else {
            msgEl.textContent = res.message;
            msgEl.className = "message error";
        }
    }

    handleAnalysis() {
        const sideA = document.getElementById('side-a');
        const sideB = document.getElementById('side-b');
        const sideC = document.getElementById('side-c');

        // Final validation check before analysis
        const valA = this.sideValidator.validate(sideA.value);
        const valB = this.sideValidator.validate(sideB.value);
        const valC = this.sideValidator.validate(sideC.value);

        if (!valA.isValid || !valB.isValid || !valC.isValid) {
            // Trigger visual feedback if not already showing
            this.validateInput(sideA, this.sideValidator);
            this.validateInput(sideB, this.sideValidator);
            this.validateInput(sideC, this.sideValidator);
            
            const container = document.getElementById('result-container');
            const errorEl = document.getElementById('triangle-error');
            const contentEl = document.getElementById('result-content');

            container.classList.remove('hidden');
            errorEl.classList.remove('hidden');
            contentEl.classList.add('hidden');
            
            errorEl.textContent = "Please enter valid positive numbers for all sides.";
            return;
        }

        const triangle = new Triangle(sideA.value, sideB.value, sideC.value);
        const analysis = this.triangleService.analyze(triangle);

        this.displayResults(analysis);
    }

    displayResults(analysis) {
        const container = document.getElementById('result-container');
        const errorEl = document.getElementById('triangle-error');
        const contentEl = document.getElementById('result-content');

        container.classList.remove('hidden');
        errorEl.classList.add('hidden');
        contentEl.classList.remove('hidden');

        const triEl = document.getElementById('is-triangular');
        triEl.textContent = analysis.isTriangular ? "YES" : "NO";
        triEl.className = `value ${analysis.isTriangular ? 'yes' : 'no'}`;

        const pythEl = document.getElementById('is-pythagorean');
        pythEl.textContent = analysis.isPythagorean ? "YES" : "NO";
        pythEl.className = `value ${analysis.isPythagorean ? 'yes' : 'no'}`;

        const typeEl = document.getElementById('triangle-type');
        typeEl.textContent = analysis.types.length > 0 ? analysis.types.join(" & ") : "None";
        typeEl.className = "value";
    }

    handleLogout() {
        document.getElementById('triangle-section').classList.replace('active', 'hidden');
        document.getElementById('login-section').classList.replace('hidden', 'active');
        
        // Reset fields
        document.getElementById('username').value = "";
        document.getElementById('password').value = "";
        document.getElementById('username').classList.remove('valid', 'invalid');
        document.getElementById('password').classList.remove('valid', 'invalid');
        document.getElementById('login-msg').textContent = "";
        
        // Reset triangle section
        document.getElementById('side-a').value = "";
        document.getElementById('side-b').value = "";
        document.getElementById('side-c').value = "";
        ['side-a', 'side-b', 'side-c'].forEach(id => {
            document.getElementById(id).classList.remove('valid', 'invalid');
        });

        document.getElementById('result-container').classList.add('hidden');
        document.getElementById('triangle-error').classList.add('hidden');
        document.getElementById('result-content').classList.remove('hidden');
    }
}


/* 
================================
Initialization (DIP Setup)
================================
*/

const auth = new AuthService(
    new UsernameValidator(),
    new PasswordValidator()
);

const triangleSvc = new TriangleService([
    new EquilateralClassifier(),
    new IsoscelesClassifier(),
    new ScaleneClassifier(),
    new RightClassifier()
]);

// Start the app
new AppController(auth, triangleSvc, new SideValidator());
