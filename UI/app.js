const API_BASE = "http://localhost:8000";

let mode = "login";

const username = document.getElementById("username")
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPW = document.getElementById("confirm-pw");

const errorUsername = document.getElementById("error-username");
const errorPassword = document.getElementById("error-password");
const errorConfirmPW = document.getElementById("error-confirmpw");
const errorEmail = document.getElementById("error-email");
const errorBirthday = document.getElementById("error-birthday");

const buttonMode = document.getElementById("button-mode");
const textMode = document.getElementById("text-mode");
const switchMode = document.getElementById("switch-mode");

const authMessage = document.getElementById("auth-message");
const succesMessage = document.getElementById("succes-message");

const registerFields = document.getElementById("register-only");
registerFields.classList.add("hidden");

const selectYear = document.getElementById("year");
const selectMonth = document.getElementById("month");
const selectDay = document.getElementById("day");

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
const currentDay = today.getDate();

selectYear.innerHTML = '<option value="">Year</option>';
for (let y = currentYear; y >= 1920; y--) {
  const option = document.createElement("option");
  option.value = y;
  option.textContent = y;
  selectYear.appendChild(option);
}

function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function updateMonths() {
  const year = parseInt(selectYear.value, 10);
  selectMonth.innerHTML = '<option value="">Month</option>';
  selectDay.innerHTML = '<option value="">Day</option>';

  if (!year) return;

  const maxMonth = (year === currentYear) ? currentMonth : 12;

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    for (let m = 1; m <= maxMonth; m++) {
        const option = document.createElement("option");
        option.value = m;
        option.textContent = monthNames[m - 1];
        selectMonth.appendChild(option);
    }

  selectMonth.disabled = false;
  selectDay.disabled = true;
}

function updateDays() {
  const year = parseInt(selectYear.value, 10);
  const month = parseInt(selectMonth.value, 10);

  selectDay.innerHTML = '<option value="">Day</option>';
  if (!year || !month) return;

  let maxDay = getDaysInMonth(month, year);

  if (year === currentYear && month === currentMonth) {
    maxDay = Math.min(maxDay, currentDay);
  }

  for (let d = 1; d <= maxDay; d++) {
    const option = document.createElement("option");
    option.value = d;
    option.textContent = d;
    selectDay.appendChild(option);
  }

  selectDay.disabled = false;
}

selectMonth.disabled = true;
selectDay.disabled = true;

selectYear.addEventListener("change", updateMonths);
selectMonth.addEventListener("change", updateDays);

username.addEventListener("keydown", (e) => {
    if(e.key === "Enter")
        validateUsername();
});

password.addEventListener("keydown", (e) => {
    if(e.key === "Enter")
        validatePassword();
});

confirmPW.addEventListener("keydown", (e) => {
    if(e.key === "Enter")
        validateConfirmPW();
});

email.addEventListener("keydown", (e) => {
    if(e.key === "Enter")
        validateEmail();
});

function auth() {
    let isValid = true;
    clearErrors();
    
    if(mode === "login") {
        if(username.value === "") {
            errorUsername.textContent = "Error: Please enter you username!";
            isValid = false;
        }
        if(password.value === "") {
            errorPassword.textContent = "Error: Please enter your password!";
            isValid = false;
        }

        if(!isValid) return;

        fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                username: username.value.trim(),
                password: password.value
            })
        })
        .then(async (res) => {
            const data = await res.json().catch(() => ({}));
            if(!res.ok) throw data;
            succesMessage.textContent = `You succesfully login, ${data.user.username}`;
        })
        .catch((err) => {
            const msg = err?.error || err?.message || "Login Failed";
            const field = err?.field || null;

            if(!field) {
                errorUsername.textContent = msg;
                return;
            }

            if(field === "useranme") errorUsername.textContent = msg;
            else if(field === "password") errorPassword.textContent = msg;
            else errorUsername.textContent = msg;
        })
    }
    
    if(mode === "register") {
        const year = parseInt(selectYear.value, 10);
        const month = parseInt(selectMonth.value, 10);
        const day = parseInt(selectDay.value, 10);

        if(!validateUsername())
            isValid = false;

        if(!validatePassword()) 
            isValid = false;

        if(!validateConfirmPW())
            isValid = false;

        if(!validateEmail()) 
            isValid = false;

        if(!year || !month || !day) {
            errorBirthday.textContent = "Error: Select year, month and day!";
            isValid = false;
        }

        if(!isValid) return;
        
        const birthday = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
        
        fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username.value.trim(),
                password: password.value,
                confirmPW: confirmPW.value,
                email: email.value.trim(),
                birthdate: birthday
            })
        })
        .then(async (res) => {
            const data = await res.json().catch(() => ({}));
            if(!res.ok) throw data;
            succesMessage.textContent = "You succesfully registered! Now login";
            switchAuth();
        })
        .catch((err) => {
            const msg = err?.error || err?.message || "Register Failed";
            const field = err?.field || null;

            if(!field) {
                errorUsername.textContent = msg;
                return;
            }

            if(field === "useranme") errorUsername.textContent = msg;
            else if(field === "password") errorPassword.textContent = msg;
            else if(field === "confirmPW") errorConfirmPW.textContent = msg;
            else if(field === "email") errorEmail.textContent = msg;
            else if(field === "birthdate") errorBirthday.textContent = msg;
            else errorUsername.textContent = msg;
        });

        return;
    }
}

function switchAuth() {
    clearErrors();

    if(mode === "login") {
        mode = "register";
        registerFields.classList.remove("hidden");
        buttonMode.textContent = "Register";
        authMessage.textContent = "Welcome, please register";
    }
    else {
        mode = "login";
        registerFields.classList.add("hidden");
        buttonMode.textContent = "Login"
        authMessage.textContent = "Welcome back, please login";
    }   
}

function clearErrors() {
    errorUsername.textContent = "";
    errorPassword.textContent = "";
    errorConfirmPW.textContent = "";
    errorEmail.textContent = "";
    errorBirthday.textContent = "";
    succesMessage.textContent = "";
    return true;
}

function isUppercase(str) {
    if(str.length === 0) return false;
    return str.charAt(0) === str.charAt(0).toUpperCase();
}

function containsNumbers(str) {
  return /\d/.test(str);
}

function containsSpecialChars(str) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
}

function isValidEmailAddress(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validateUsername() {
    errorUsername.textContent = "";
    if(mode === "login") {
        if(username.value === "") {
            errorUsername.textContent = "Error: Please enter you username!";
            return false;
        }
        return true;
    }
    
    if(mode === "register") {
        if (username.value === "") {
            errorUsername.textContent = "Error: Username cannot be empty!";
            return false;
        }
        
        if(username.value.length < 6 || username.value.length > 64) {
            errorUsername.textContent = "Error: Username length is too small or too big!";
            return false;
        }
        return true;
    }
    return;  
}

function validatePassword() {
    errorPassword.textContent = "";
    if(mode === "login") {
        if(password.value === "") {
            errorPassword.textContent = "Error: Password cannot be empty!";
            return false;
        }
        return true;
    }

    if(mode === "register") {
        if(password.value === "") {
            errorPassword.textContent = "Error: Password cannot be empty!";
            return false;
        }
        
        if(password.value.length < 8 || password.value.length> 64) {
            errorPassword.textContent = "Error: Password length is too small or too big!";
            return false;
        }
        
        if(!isUppercase(password.value)) {
            errorPassword.textContent = "Error: First letter need to be a uppercase!"; 
            return false;
        }
        
        if(!containsNumbers(password.value)) {
            errorPassword.textContent = "Error: Your password need to contains minimum one digit!"; 
            return false;
        }
        
        if(!containsSpecialChars(password.value)) {
            errorPassword.textContent = "Error: Your password need to contains minimum one special character!"; 
            return false;
        }
        return true;
    }
    return;
}

function validateConfirmPW() {
    errorConfirmPW.textContent = "";
    if(confirmPW.value != password.value) {
        errorConfirmPW.textContent = "Error: Password dosen't match!";
        return false;
    }
    return true;
}

function validateEmail() {
    errorEmail.textContent = "";
    if(!isValidEmailAddress(email.value)) {
        errorEmail.textContent = "Error: The email is not valid!";
        isValid = false;
    }
    return true;
}

buttonMode.addEventListener("click", auth);
if(textMode) {
    textMode.addEventListener("click", (e) => {
        if(e.target && e.target.id === "switch-mode") {
            e.preventDefault();
            switchAuth();
        }
    });
}