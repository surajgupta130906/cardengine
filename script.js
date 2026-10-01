// ---------- Registration ----------
function register() {
  const username = document.getElementById('regUser').value;
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPass').value;

  if (localStorage.getItem(username)) {
    alert("Username already exists!");
    return;
  }

  const user = { name, email, password };
  localStorage.setItem(username, JSON.stringify(user));
  alert("Registered successfully! Please login.");
}

// ---------- Login ----------
function login() {
  const username = document.getElementById('loginUser').value;
  const password = document.getElementById('loginPass').value;
  const userData = JSON.parse(localStorage.getItem(username));

  if (!userData || userData.password !== password) {
    alert("Invalid credentials!");
    return;
  }

  sessionStorage.setItem("currentUser", username);

  if (typeof handlePostLoginRedirect === "function") {
      handlePostLoginRedirect();
  } else {
      if (sessionStorage.getItem(username + "_cardData")) {
          window.location.href = "design.html";
      } else {
          window.location.href = "card_form.html";
      }
  }
}



// ==========================================
// 1. VISUAL TAB SWITCHING CONTROL
// ==========================================
function switchTab(targetTab) {
  const loginSec = document.getElementById('loginSection');
  const regSec = document.getElementById('registerSection');
  const tabL = document.getElementById('tabLogin');
  const tabR = document.getElementById('tabRegister');

  if (targetTab === 'login') {
    loginSec.classList.add('active');
    regSec.classList.remove('active');
    tabL.classList.add('active');
    tabR.classList.remove('active');
  } else {
    regSec.classList.add('active');
    loginSec.classList.remove('active');
    tabR.classList.add('active');
    tabL.classList.remove('active');
  }
}

// ==========================================
// 2. USER REGISTRATION (Create Account)
// ==========================================
function register() {
  const regUser = document.getElementById('regUser').value.trim();
  const regName = document.getElementById('regName').value.trim();
  const regEmail = document.getElementById('regEmail').value.trim();
  const regPass = document.getElementById('regPass').value;

  if (!regUser || !regName || !regEmail || !regPass) {
    alert("Please fill in all fields to create an account.");
    return;
  }

  // Check if username already exists
  if (localStorage.getItem(regUser)) {
    alert("This username is already taken. Please choose another one.");
    return;
  }

  // Save profile to localStorage
  const userProfile = {
    username: regUser,
    fullName: regName,
    email: regEmail,
    password: regPass
  };

  localStorage.setItem(regUser, JSON.stringify(userProfile));
  alert("Registration successful! You can now log in.");

  // Clear form fields
  document.getElementById('regUser').value = '';
  document.getElementById('regName').value = '';
  document.getElementById('regEmail').value = '';
  document.getElementById('regPass').value = '';

  // Switch back to login page automatically
  switchTab('login');
}

// ==========================================
// 3. USER LOGIN & AUTHRG / ROUTING
// ==========================================
function login() {
  const loginUser = document.getElementById('loginUser').value.trim();
  const loginPass = document.getElementById('loginPass').value;

  if (!loginUser || !loginPass) {
    alert("Please enter both your username and password.");
    return;
  }

  const storedData = localStorage.getItem(loginUser);

  if (!storedData) {
    alert("User profile not found. Please create an account.");
    return;
  }

  const userProfile = JSON.parse(storedData);

  if (userProfile.password === loginPass) {
    sessionStorage.setItem("currentUser", loginUser);
    
    // Process workspace destination
    handlePostLoginRedirect();
  } else {
    alert("Incorrect password. Please try again.");
  }
}

// ==========================================
// 4. POST-LOGIN SMART REDIRECTION WORKFLOW
// ==========================================
function handlePostLoginRedirect() {
  sessionStorage.setItem("isLoggedIn", "true");
  
  // Check if they were intercepted mid-way while designing
  const nextStep = localStorage.getItem("redirectAfterLogin");
  
  if (nextStep) {
    localStorage.removeItem("redirectAfterLogin"); // Clear temporary link path
    window.location.href = nextStep;
  } else {
    // Check if they already have an active saved design draft
    const username = sessionStorage.getItem("currentUser");
    if (sessionStorage.getItem(username + "_cardData")) {
      window.location.href = "design.html";
    } else {
      window.location.href = "card_form.html";
    }
  }
}



// ---------- Save Card Details ----------
if (document.getElementById('cardForm')) {
  document.getElementById('cardForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
      name: document.getElementById('name').value,
      designation: document.getElementById('designation').value,
      org: document.getElementById('org').value,
      email: document.getElementById('email').value,
      mobile: document.getElementById('mobile').value,
    };

    const fileInput = document.getElementById('logo');
    if (fileInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function() {
        data.logo = reader.result;
        const username = sessionStorage.getItem("currentUser");
        sessionStorage.setItem(username + "_cardData", JSON.stringify(data));
        window.location.href = 'design.html';
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      data.logo = '';
      const username = sessionStorage.getItem("currentUser");
      sessionStorage.setItem(username + "_cardData", JSON.stringify(data));
      window.location.href = 'design.html';
    }
  });
}

// ---------- Design Selection ----------
if (document.getElementById('designForm')) {
  document.getElementById('designForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = sessionStorage.getItem("currentUser");
    const card = JSON.parse(sessionStorage.getItem(username + "_cardData"));

    card.primary = document.getElementById('primary').value;
    card.secondary = document.getElementById('secondary').value;
    card.text = document.getElementById('text').value;
    card.font = document.querySelector('input[name="font"]:checked').value;
    card.template = document.querySelector('input[name="template"]:checked').value;
    
    sessionStorage.setItem(username + "_cardData", JSON.stringify(card));
    window.location.href = 'preview.html';
  });
}

function checkLogin() {
    const username = sessionStorage.getItem("currentUser");
    if (!username) {
        window.location.href = "login.html";
    }
}

// ---------- Preview Engine ----------
if (document.getElementById('cardPreview')) {
  const username = sessionStorage.getItem("currentUser");
  const card = JSON.parse(sessionStorage.getItem(username + "_cardData"));
  
  if (!card) {
    console.error("No card design data discovered for user: " + username);
  } else {
    const cardDiv = document.getElementById('cardPreview');

    const nameVal = card.name || "Your Name";
    const designationVal = card.designation || "Job Title";
    const orgVal = card.org || "Company Name";
    const emailVal = card.email || "hello@workspace.io";
    const mobileVal = card.mobile || "+1 000 000 000";
    
    const cleanLogo = card.logo || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23cbd5e1' rx='15'/><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-size='14'>No Logo</text></svg>";

    cardDiv.style.border = "none";
    cardDiv.style.borderLeft = "none";
    cardDiv.style.borderTop = "none";
    cardDiv.style.background = "none";
    cardDiv.style.textAlign = "left";
    cardDiv.style.alignItems = "stretch";
    cardDiv.style.justifyContent = "space-between";
    cardDiv.style.fontFamily = card.font || 'sans-serif';
    
    const currentTemplate = String(card.template);
    cardDiv.className = `card template${currentTemplate}`;

    let htmlContent = '';

    switch (currentTemplate) {
      case "1":
        cardDiv.style.background = card.primary || "#ffffff";
        cardDiv.style.color = card.text || "#0f172a";
        cardDiv.style.border = `4px solid ${card.secondary || '#4f46e5'}`;
        cardDiv.style.textAlign = "center";
        cardDiv.style.alignItems = "center";
        cardDiv.style.justifyContent = "center";
        htmlContent = `
          <p style="margin: 0 0 8px 0; font-size: 0.75rem; opacity: 0.85;">${emailVal} &nbsp;&bull;&nbsp; 📞 ${mobileVal}</p>
          <img src="${cleanLogo}" style="max-width: 60px; max-height: 60px; object-fit: contain; margin: 5px 0; border-radius: 6px;"><br>
          <p style="margin: 4px 0 2px 0; font-size: 1.2rem; font-weight: 700;">${nameVal}</p>
          <p style="margin: 0; font-size: 0.8rem; opacity: 0.9;">${designationVal}</p>
          <p style="margin: 0; font-size: 0.75rem; opacity: 0.7;">${orgVal}</p>
        `;
        break;

      case "2":
        cardDiv.style.background = card.primary || "#ffffff";
        cardDiv.style.color = card.text || "#0f172a";
        cardDiv.style.border = `4px solid ${card.secondary || '#4f46e5'}`;
        htmlContent = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700;">${nameVal}</h2>
              <p style="margin: 2px 0; font-size: 0.8rem; opacity: 0.9;">${designationVal}</p>
              <p style="margin: 0; font-size: 0.75rem; opacity: 0.7;">${orgVal}</p>
            </div>
            <img src="${cleanLogo}" style="max-width: 50px; max-height: 50px; object-fit: contain; border-radius: 6px;">
          </div>
          <div style="border-top: 1px solid rgba(0,0,0,0.1); padding-top: 8px; font-size: 0.75rem; opacity: 0.85; display: flex; justify-content: space-between;">
            <span>📧 ${emailVal}</span>
            <span>📞 ${mobileVal}</span>
          </div>
        `;
        break;

      case "3":
        cardDiv.style.background = card.primary || "#ffffff";
        cardDiv.style.color = card.text || "#0f172a";
        cardDiv.style.border = `4px solid ${card.secondary || '#4f46e5'}`;
        cardDiv.style.justifyContent = "center";
        htmlContent = `
          <div style="display: flex; gap: 20px; align-items: center; height: 100%;">
            <div style="flex-shrink: 0;">
              <img src="${cleanLogo}" style="max-width: 65px; max-height: 65px; object-fit: contain; border-radius: 6px;">
            </div>
            <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 2px;">
              <h2 style="margin: 0; font-size: 1.2rem; font-weight: 700;">${nameVal}</h2>
              <p style="margin: 0 0 4px 0; font-size: 0.8rem; font-weight: 600; opacity: 0.9;">${designationVal}</p>
              <p style="margin: 0 0 6px 0; font-size: 0.75rem; opacity: 0.7;">${orgVal}</p>
              <p style="margin: 0; font-size: 0.7rem; opacity: 0.85;">📞 ${mobileVal}</p>
              <p style="margin: 0; font-size: 0.77rem; opacity: 0.85; word-break: break-all;">📧 ${emailVal}</p>
            </div>
          </div>
        `;
        break;

      case "4":
        cardDiv.style.background = card.primary || "#ffffff";
        cardDiv.style.color = card.text || "#0f172a";
        cardDiv.style.border = `4px solid ${card.secondary || '#4f46e5'}`;
        cardDiv.style.textAlign = "center";
        cardDiv.style.alignItems = "center";
        htmlContent = `
          <div style="width: 100%;">
            <img src="${cleanLogo}" style="max-width: 50px; max-height: 50px; object-fit: contain; border-radius: 6px; margin-bottom: 4px;">
          </div>
          <div style="width: 100%;">
            <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700;">${nameVal}</h2>
            <p style="margin: 2px 0; font-size: 0.8rem; opacity: 0.9;">${designationVal}</p>
            <p style="margin: 0 0 8px 0; font-size: 0.75rem; opacity: 0.7;">${orgVal}</p>
            <p style="margin: 0; font-size: 0.75rem; opacity: 0.85; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 6px;">
              📧 ${emailVal} &nbsp;|&nbsp; 📞 ${mobileVal}
            </p>
          </div>
        `;
        break;

      case "5":
        cardDiv.style.background = card.primary || "#ffffff";
        cardDiv.style.color = card.text || "#0f172a";
        cardDiv.style.border = `1px solid rgba(0,0,0,0.08)`;
        cardDiv.style.borderLeft = `8px solid ${card.secondary || '#4f46e5'}`;
        htmlContent = `
          <div style="display: flex; justify-content: space-between; height: 100%; flex-direction: column; width:100%;">
            <div>
              <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700;">${nameVal}</h2>
              <p style="margin: 2px 0; font-size: 0.85rem; font-weight: 600; color: ${card.secondary || '#4f46e5'}; text-transform: uppercase; letter-spacing: 0.5px;">${designationVal}</p>
              <p style="margin: 2px 0; font-size: 0.8rem; opacity: 0.8;">${orgVal}</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
              <div style="font-size: 0.7rem; opacity: 0.75; line-height: 1.3;">
                <span>📧 ${emailVal}</span><br><span>📞 ${mobileVal}</span>
              </div>
              <img src="${cleanLogo}" style="max-width: 45px; max-height: 45px; object-fit: contain; border-radius: 4px;">
            </div>
          </div>
        `;
        break;

      case "6":
        cardDiv.style.color = card.text || "#0f172a";
        cardDiv.style.border = `1px solid rgba(0,0,0,0.08)`;
        cardDiv.style.background = `linear-gradient(135deg, ${card.primary} 72%, ${card.secondary || '#4f46e5'} 72%)`;
        htmlContent = `
          <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; width:100%;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700;">${nameVal}</h2>
                <p style="margin: 2px 0; font-size: 0.8rem; opacity: 0.8;">${designationVal}</p>
                <p style="margin: 0; font-size: 0.75rem; opacity: 0.6;">${orgVal}</p>
              </div>
              <img src="${cleanLogo}" style="max-width: 45px; max-height: 45px; background: rgba(255,255,255,0.2); padding: 2px; object-fit: contain; border-radius: 4px;">
            </div>
            <div style="font-size: 0.75rem; font-weight: 500; max-width: 65%; line-height: 1.4;">
              <span style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">📧 ${emailVal}</span>
              <span>📞 ${mobileVal}</span>
            </div>
          </div>
        `;
        break;

      case "7":
        cardDiv.style.background = card.primary || "#ffffff";
        cardDiv.style.color = card.text || "#0f172a";
        cardDiv.style.border = `1px solid rgba(0,0,0,0.08)`;
        cardDiv.style.textAlign = "center";
        cardDiv.style.alignItems = "center";
        cardDiv.style.justifyContent = "center";
        htmlContent = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; width: 100%;">
            <img src="${cleanLogo}" style="max-width: 45px; max-height: 45px; object-fit: contain; border-radius: 50%; border: 2px solid ${card.secondary || '#4f46e5'}; padding: 2px; background: white;">
            <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700;">${nameVal}</h2>
            <div style="font-size: 0.8rem; color: ${card.secondary || '#4f46e5'}; border-top: 1px solid rgba(128,128,128,0.2); width: 75%; padding-top: 4px; font-weight: 600; text-transform: uppercase;">
              ${designationVal}
            </div>
            <p style="margin: 0; font-size: 0.75rem; opacity: 0.7;">${orgVal} &nbsp;|&nbsp; 📞 ${mobileVal}</p>
          </div>
        `;
        break;

      case "8":
        cardDiv.style.background = card.primary || "#ffffff";
        cardDiv.style.color = card.text || "#0f172a";
        cardDiv.style.border = `1px solid rgba(0,0,0,0.08)`;
        cardDiv.style.borderTop = `8px solid ${card.secondary || '#4f46e5'}`;
        htmlContent = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
            <div>
              <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700;">${nameVal}</h2>
              <p style="margin: 2px 0; font-size: 0.8rem; color: ${card.secondary || '#4f46e5'}; font-weight: bold;">${designationVal}</p>
            </div>
            <img src="${cleanLogo}" style="max-width: 45px; max-height: 45px; object-fit: contain; border-radius: 4px;">
          </div>
          <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.75rem; opacity: 0.85; width:100%;">
            <span>🏢 ${orgVal}</span>
            <div style="text-align: right; font-size: 0.7rem;">
              <span>${emailVal}</span><br><span>${mobileVal}</span>
            </div>
          </div>
        `;
        break;

      case "9":
        cardDiv.style.background = "#0f172a";
        cardDiv.style.color = "#ffffff";
        cardDiv.style.border = "1px solid #1e293b";
        cardDiv.style.borderLeft = "6px solid #6366f1";
        cardDiv.style.fontFamily = "system-ui, -apple-system, sans-serif";
        htmlContent = `
          <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; width: 100%;">
            <div>
              <h2 style="margin: 0; font-size: 1.35rem; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">${nameVal}</h2>
              <p style="margin: 2px 0 12px 0; font-size: 0.85rem; font-weight: 600; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px;">${designationVal}</p>
              <p style="margin: 0; font-size: 0.8rem; color: #94a3b8;">🏢 ${orgVal}</p>
            </div>
            <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; font-size: 0.75rem; color: #94a3b8; display: flex; justify-content: space-between; width: 100%;">
              <span>📧 ${emailVal}</span>
              <span>📞 ${mobileVal}</span>
            </div>
          </div>
        `;
        break;

      case "10":
        cardDiv.style.background = "#f8fafc";
        cardDiv.style.color = "#334155";
        cardDiv.style.border = "1px solid #e2e8f0";
        cardDiv.style.borderTop = "6px solid #0284c7";
        cardDiv.style.fontFamily = "system-ui, -apple-system, sans-serif";
        htmlContent = `
          <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; width: 100%;">
            <div>
              <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #0f172a;">${nameVal}</h2>
              <p style="margin: 2px 0; font-size: 0.85rem; color: #0284c7; font-weight: 600;">${designationVal}</p>
              <p style="margin: 4px 0 0 0; font-size: 0.8rem; opacity: 0.8;">${orgVal}</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 3px; font-size: 0.75rem; opacity: 0.9; border-left: 2px solid #cbd5e1; padding-left: 8px;">
              <span><b>Email:</b> ${emailVal}</span>
              <span><b>Phone:</b> ${mobileVal}</span>
            </div>
          </div>
        `;
        break;

      case "11":
        cardDiv.style.background = "#111111";
        cardDiv.style.color = "#f4f4f5";
        cardDiv.style.border = "1px solid #27272a";
        cardDiv.style.textAlign = "center";
        cardDiv.style.alignItems = "center";
        cardDiv.style.justifyContent = "center";
        cardDiv.style.fontFamily = "system-ui, -apple-system, sans-serif";
        htmlContent = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; width: 100%;">
            <h2 style="margin: 0; font-size: 1.4rem; font-weight: 600; color: #f4f4f5; letter-spacing: 1px;">${nameVal.toUpperCase()}</h2>
            <div style="font-size: 0.75rem; color: #d4af37; border-top: 1px solid #27272a; border-bottom: 1px solid #27272a; width: 60%; padding: 4px 0; text-transform: uppercase; letter-spacing: 2px;">
              ${designationVal}
            </div>
            <p style="margin: 2px 0 10px 0; font-size: 0.8rem; color: #a1a1aa; font-style: italic;">${orgVal}</p>
            <p style="margin: 0; font-size: 0.7rem; color: #71717a; letter-spacing: 0.5px;">
              ${emailVal} &nbsp;&bull;&nbsp; ${mobileVal}
            </p>
          </div>
        `;
        break;

      case "12":
        cardDiv.style.background = "#ffffff";
        cardDiv.style.color = "#1e293b";
        cardDiv.style.border = "1px solid #e2e8f0";
        cardDiv.style.fontFamily = "system-ui, -apple-system, sans-serif";
        htmlContent = `
          <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
              <div>
                <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #0f172a;">${nameVal}</h2>
                <p style="margin: 2px 0; font-size: 0.8rem; color: #059669; font-weight: 600;">${designationVal}</p>
              </div>
              <span style="font-size: 0.7rem; background: #ecfdf5; color: #065f46; padding: 4px 8px; border-radius: 20px; font-weight: 600;">${orgVal}</span>
            </div>
            <div style="background: #f8fafc; padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; font-size: 0.7rem; color: #64748b; width: 100%; box-sizing: border-box;">
              <span>📧 ${emailVal}</span>
              <span>📞 ${mobileVal}</span>
            </div>
          </div>
        `;
        break;
    }
    cardDiv.innerHTML = htmlContent;
  }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "login.html";
    alert('Signing out from Workspace...');
}

function editDetails(){
    window.location.href="card_form.html";
}

function changeDesign(){
    window.location.href="design.html";
}

// ---------- Dynamic Profile Injection / Page Navigation ----------
document.addEventListener("DOMContentLoaded", function() {
  const currentUser = sessionStorage.getItem("currentUser");
  
  // 1. Scroll To Top UI Feature
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.onscroll = function() {
       if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
          scrollTopBtn.classList.add("show");
       } else {
          scrollTopBtn.classList.remove("show");
       }
    };
  }

  // 2. Landing Page Explore Button Handler
  const exploreBtn = document.getElementById("exploreTemplatesBtn"); 
  if (exploreBtn) {
      exploreBtn.onclick = function(e) {
          e.preventDefault();
          if (currentUser) {
              window.location.href = "design.html";
          } else {
              window.location.href = "login.html"; 
          }
      };
  }

  // 3. User Dropdown Panel setup
  if (!currentUser) return;

  const navLinks = document.querySelectorAll("nav a, .navbar a, .nav-links b, button, .nav-item");
  let aboutItem = null;
  
  navLinks.forEach(el => {
    if (el.textContent.toLowerCase().includes("about")) {
      aboutItem = el;
    }
  });

  if (!aboutItem) return;

  aboutItem.innerHTML = `👤 ${currentUser}`;
  aboutItem.href = "javascript:void(0);";
  aboutItem.removeAttribute("onclick"); 
  aboutItem.style.cursor = "pointer";

  const cardData = JSON.parse(sessionStorage.getItem(currentUser + "_cardData")) || {};
  const profileDropdown = document.createElement("div");
  profileDropdown.id = "dynamicProfileDropdown";
  
  Object.assign(profileDropdown.style, {
    display: "none",
    position: "fixed",
    top: "75px",
    right: "40px",
    width: "300px",
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(16px)",
    webkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
    zIndex: "99999",
    textAlign: "left",
    color: "#ffffff",
    fontFamily: "system-ui, -apple-system, sans-serif",
    boxSizing: "border-box"
  });

  profileDropdown.innerHTML = `
    <h4 style="margin: 0 0 4px 0; font-size: 1.25rem; font-weight: 700;">${cardData.name || currentUser}</h4>
    <p style="margin: 0 0 16px 0; font-size: 0.9rem; color: #818cf8; font-weight: 600; text-transform: uppercase;">${cardData.designation || 'Active Workspace Account'}</p>
    <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 14px; font-size: 0.85rem; color: #94a3b8; display: flex; flex-direction: column; gap: 8px;">
      <div><span style="color: #6366f1;">🏢</span> <b>Org:</b> ${cardData.org || 'Not Configured'}</div>
      <div style="word-break: break-all;"><span style="color: #6366f1;">📧</span> <b>Email:</b> ${cardData.email || 'Not Configured'}</div>
      <div><span style="color: #6366f1;">📞</span> <b>Phone:</b> ${cardData.mobile || 'Not Configured'}</div>
    </div>
    <div style="margin-top: 20px; display: flex; gap: 12px;">
      <button id="dropdownEditBtn" onclick="window.location.href='card_form.html'" style="flex: 1; padding: 10px; font-size: 0.85rem; background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none; border-radius: 8px; cursor: pointer;">Edit Card</button>
      <button id="dropdownLogoutBtn" onclick="logout()" style="flex: 1; padding: 10px; font-size: 0.85rem; background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; cursor: pointer;">Log Out</button>
    </div>
  `;
  document.body.appendChild(profileDropdown);

  aboutItem.addEventListener("click", function(e) {
    e.stopPropagation();
    const isShowing = profileDropdown.style.display === "block";
    profileDropdown.style.display = isShowing ? "none" : "block";
  });

  window.addEventListener("click", function(e) {
    if (!profileDropdown.contains(e.target) && e.target !== aboutItem) {
      profileDropdown.style.display = "none";
    }
  });
});

// ---------- Live Interactive Sandbox UI Controls ----------
document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById('sandbox-name');
    const titleInput = document.getElementById('sandbox-title');
    const renderName = document.getElementById('cardRenderName');
    const renderTitle = document.getElementById('cardRenderTitle');
    const cardAccent = document.getElementById('cardAccent');
    const previewCard = document.getElementById('previewCard');

    if (previewCard) previewCard.className = 'mock-card theme-dark';

    if (nameInput && renderName) {
        nameInput.addEventListener('input', (e) => {
            renderName.textContent = e.target.value || "Your Name";
        });
    }

    if (titleInput && renderTitle) {
        titleInput.addEventListener('input', (e) => {
            renderTitle.textContent = e.target.value || "Your Title";
        });
    }

    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            document.querySelectorAll('.color-dot').forEach(d => {
                d.classList.remove('active');
                d.style.borderColor = 'transparent';
            });
            
            e.target.classList.add('active');
            e.target.style.borderColor = '#ffffff';
            
            const selectedColor = e.target.getAttribute('data-color');
            if (cardAccent) cardAccent.style.background = selectedColor;
            
            document.querySelectorAll('.accent-text-target').forEach(el => {
                el.style.color = selectedColor;
            });
        });
    });

    document.querySelectorAll('.toggle-buttons .toggle-btn, .toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.toggle-btn');
            if (!targetBtn) return;

            document.querySelectorAll('.toggle-btn').forEach(b => {
                b.classList.remove('active');
                b.style.opacity = '0.6';
                b.style.border = '1px solid transparent';
            });
            
            targetBtn.classList.add('active');
            targetBtn.style.opacity = '1';
            
            const selectedTheme = targetBtn.getAttribute('data-theme');
            if (previewCard) {
                if (selectedTheme === 'light') {
                    previewCard.className = 'mock-card theme-light';
                    previewCard.style.setProperty("background", "#ffffff", "important");
                    if (renderName) renderName.style.setProperty("color", "#0f172a", "important");
                    previewCard.style.setProperty("border-color", "#e2e8f0", "important");
                    targetBtn.style.border = '1px solid rgba(0,0,0,0.1)';
                } else {
                    previewCard.className = 'mock-card theme-dark';
                    previewCard.style.setProperty("background", "#1e1e24", "important");
                    if (renderName) renderName.style.setProperty("color", "#ffffff", "important");
                    previewCard.style.setProperty("border-color", "#334155", "important");
                    targetBtn.style.border = '1px solid rgba(255,255,255,0.2)';
                }
            }
        });
    });
});


///////////////////////////////// link.html inline script section //////////////////////////////////


