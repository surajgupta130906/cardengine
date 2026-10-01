 
   /** ------------------------------------------------- script file for design.html----------------------------------------------------**/
    if (typeof checkLogin !== 'function') { function checkLogin() { console.log("Auth layer linked."); } }
    if (typeof logout !== 'function') { function logout() { alert("Signing out..."); } }

    checkLogin();
    
    const activeUser = sessionStorage.getItem("currentUser") || "Anthony";
    if(activeUser) {
      document.getElementById("navUserBadge").textContent = `👋 Hello, ${activeUser}!`;
    }

    const cardData = JSON.parse(sessionStorage.getItem(activeUser + "_cardData")) || {
      name: "Anthony",
      designation: "Software Engineer",
      org: "Workspace Innovations",
      email: "anthony@workspace.io",
      mobile: "+1 415 555 2671",
      logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%234f46e5'/><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='20' font-family='sans-serif'>LOGO</text></svg>"
    };

    if (cardData.primary) document.getElementById("primary").value = cardData.primary;
    if (cardData.secondary) document.getElementById("secondary").value = cardData.secondary;
    if (cardData.text) document.getElementById("text").value = cardData.text;

    if (cardData.template) {
      const templateRadio = document.querySelector(`input[name="template"][value="${cardData.template}"]`);
      if(templateRadio) templateRadio.checked = true;
    }
    if (cardData.font) {
      const fontRadio = document.querySelector(`input[name="font"][value="${cardData.font}"]`);
      if(fontRadio) fontRadio.checked = true;
    }

    function updateLivePreview() {
      const cardDiv = document.getElementById('cardPreview');
      const pColor = document.getElementById('primary').value;
      const sColor = document.getElementById('secondary').value;
      const tColor = document.getElementById('text').value;
      
      const fontRadio = document.querySelector('input[name="font"]:checked');
      const fChoice = fontRadio ? fontRadio.value : "'Poppins', sans-serif";
      
      const templateRadio = document.querySelector('input[name="template"]:checked');
      const tChoice = templateRadio ? templateRadio.value : "1";

      cardDiv.style.background = pColor;
      cardDiv.style.color = tColor;
      cardDiv.style.borderColor = sColor;
      cardDiv.style.fontFamily = fChoice;
      
      // Reset specific card style overlays
      cardDiv.style.borderLeft = "";
      cardDiv.style.borderTop = "";
      cardDiv.style.boxShadow = "0 12px 30px rgba(15, 23, 42, 0.08)";

      // Handle card selections actively
      document.querySelectorAll('.option-card').forEach(card => card.classList.remove('active-card'));
      if (fontRadio && fontRadio.closest('.option-card')) fontRadio.closest('.option-card').classList.add('active-card');
      if (templateRadio && templateRadio.closest('.option-card')) templateRadio.closest('.option-card').classList.add('active-card');

      const cleanLogo = cardData.logo || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23cbd5e1' rx='15'/><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-size='14'>No Logo</text></svg>";
      let htmlContent = '';

      switch (tChoice) {
        case "1":
          cardDiv.style.textAlign = "center";
          cardDiv.style.alignItems = "center";
          cardDiv.style.justifyContent = "center";
          htmlContent = `
            <p style="margin: 0 0 8px 0; font-size: 0.75rem; opacity: 0.85;">${cardData.email} &nbsp;&bull;&nbsp; 📞 ${cardData.mobile}</p>
            <img src="${cleanLogo}" style="max-width: 55px; max-height: 55px; object-fit: contain; margin: 4px 0; border-radius: 6px;"><br>
            <p style="margin: 4px 0 2px 0; font-size: 1.2rem; font-weight: 700;">${cardData.name}</p>
            <p style="margin: 0; font-size: 0.8rem; opacity: 0.9;">${cardData.designation}</p>
            <p style="margin: 0; font-size: 0.75rem; opacity: 0.7;">${cardData.org}</p>
          `;
          break;

        case "2":
          cardDiv.style.textAlign = "left";
          cardDiv.style.alignItems = "stretch";
          cardDiv.style.justifyContent = "space-between";
          htmlContent = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700;">${cardData.name}</h2>
                <p style="margin: 2px 0; font-size: 0.8rem; opacity: 0.9;">${cardData.designation}</p>
                <p style="margin: 0; font-size: 0.75rem; opacity: 0.7;">${cardData.org}</p>
              </div>
              <img src="${cleanLogo}" style="max-width: 45px; max-height: 45px; object-fit: contain; border-radius: 6px;">
            </div>
            <div style="border-top: 1px solid rgba(0,0,0,0.1); padding-top: 8px; font-size: 0.75rem; opacity: 0.85; display: flex; justify-content: space-between;">
              <span>📧 ${cardData.email}</span>
              <span>📞 ${cardData.mobile}</span>
            </div>
          `;
          break;

        case "3":
          cardDiv.style.textAlign = "left";
          cardDiv.style.alignItems = "stretch";
          cardDiv.style.justifyContent = "center";
          htmlContent = `
            <div style="display: flex; gap: 15px; align-items: center; height: 100%;">
              <div style="flex-shrink: 0;">
                <img src="${cleanLogo}" style="max-width: 65px; max-height: 65px; object-fit: contain; border-radius: 6px;">
              </div>
              <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 2px;">
                <h2 style="margin: 0; font-size: 1.2rem; font-weight: 700;">${cardData.name}</h2>
                <p style="margin: 0 0 4px 0; font-size: 0.8rem; font-weight: 600; opacity: 0.9;">${cardData.designation}</p>
                <p style="margin: 0 0 6px 0; font-size: 0.75rem; opacity: 0.7;">${cardData.org}</p>
                <p style="margin: 0; font-size: 0.7rem; opacity: 0.85;">📞 ${cardData.mobile}</p>
                <p style="margin: 0; font-size: 0.7rem; opacity: 0.85; word-break: break-all;">📧 ${cardData.email}</p>
              </div>
            </div>
          `;
          break;

        case "4":
          cardDiv.style.textAlign = "center";
          cardDiv.style.alignItems = "center";
          cardDiv.style.justifyContent = "space-between";
          htmlContent = `
            <div style="width: 100%;"><img src="${cleanLogo}" style="max-width: 50px; max-height: 50px; object-fit: contain; border-radius: 6px;"></div>
            <div style="width: 100%;">
              <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700;">${cardData.name}</h2>
              <p style="margin: 2px 0; font-size: 0.8rem; opacity: 0.9;">${cardData.designation}</p>
              <p style="margin: 0 0 8px 0; font-size: 0.75rem; opacity: 0.7;">${cardData.org}</p>
              <p style="margin: 0; font-size: 0.75rem; opacity: 0.85; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 6px;">
                📧 ${cardData.email} &nbsp;|&nbsp; 📞 ${cardData.mobile}
              </p>
            </div>
          `;
          break;

        case "5":
          cardDiv.style.textAlign = "left";
          cardDiv.style.alignItems = "stretch";
          cardDiv.style.justifyContent = "space-between";
          cardDiv.style.borderLeft = `8px solid ${sColor}`;
          htmlContent = `
            <div style="display: flex; justify-content: space-between; height: 100%; flex-direction: column;">
              <div>
                <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700;">${cardData.name}</h2>
                <p style="margin: 2px 0; font-size: 0.85rem; font-weight: 600; color: ${sColor}; text-transform: uppercase; letter-spacing: 0.5px;">${cardData.designation}</p>
                <p style="margin: 2px 0; font-size: 0.8rem; opacity: 0.8;">${cardData.org}</p>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="font-size: 0.7rem; opacity: 0.75; line-height: 1.3;">
                  <span>📧 ${cardData.email}</span><br><span>📞 ${cardData.mobile}</span>
                </div>
                <img src="${cleanLogo}" style="max-width: 45px; max-height: 45px; object-fit: contain; border-radius: 4px;">
              </div>
            </div>
          `;
          break;

        case "6":
          cardDiv.style.textAlign = "left";
          cardDiv.style.alignItems = "stretch";
          cardDiv.style.justifyContent = "space-between";
          cardDiv.style.background = `linear-gradient(135deg, ${pColor} 72%, ${sColor} 72%)`;
          htmlContent = `
            <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700;">${cardData.name}</h2>
                  <p style="margin: 2px 0; font-size: 0.8rem; opacity: 0.8;">${cardData.designation}</p>
                  <p style="margin: 0; font-size: 0.75rem; opacity: 0.6;">${cardData.org}</p>
                </div>
                <img src="${cleanLogo}" style="max-width: 45px; max-height: 45px; background: rgba(255,255,255,0.2); padding: 2px; object-fit: contain; border-radius: 4px;">
              </div>
              <div style="font-size: 0.75rem; font-weight: 500; max-width: 65%; line-height: 1.4;">
                <span style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">📧 ${cardData.email}</span>
                <span>📞 ${cardData.mobile}</span>
              </div>
            </div>
          `;
          break;

        case "7":
          cardDiv.style.textAlign = "center";
          cardDiv.style.alignItems = "center";
          cardDiv.style.justifyContent = "center";
          htmlContent = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; width: 100%;">
              <img src="${cleanLogo}" style="max-width: 45px; max-height: 45px; object-fit: contain; border-radius: 50%; border: 2px solid ${sColor}; padding: 2px; background: white;">
              <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700;">${cardData.name}</h2>
              <div style="font-size: 0.8rem; color: ${sColor}; border-top: 1px solid rgba(128,128,128,0.2); width: 75%; padding-top: 4px; font-weight: 600; text-transform: uppercase;">
                ${cardData.designation}
              </div>
              <p style="margin: 0; font-size: 0.75rem; opacity: 0.7;">${cardData.org} &nbsp;&bull;&nbsp; 📞 ${cardData.mobile}</p>
            </div>
          `;
          break;

        case "8":
          cardDiv.style.textAlign = "left";
          cardDiv.style.alignItems = "stretch";
          cardDiv.style.justifyContent = "space-between";
          cardDiv.style.borderTop = `8px solid ${sColor}`;
          htmlContent = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
              <div>
                <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700;">${cardData.name}</h2>
                <p style="margin: 2px 0; font-size: 0.8rem; color: ${sColor}; font-weight: bold;">${cardData.designation}</p>
              </div>
              <img src="${cleanLogo}" style="max-width: 45px; max-height: 45px; object-fit: contain; border-radius: 4px;">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.75rem; opacity: 0.85;">
              <span>🏢 ${cardData.org}</span>
              <div style="text-align: right; font-size: 0.7rem; line-height: 1.3;">
                <span>${cardData.email}</span><br><span>${cardData.mobile}</span>
              </div>
            </div>
          `;
          break;

        case "9": // Neon Tech Dark
          cardDiv.style.background = "#0f172a";
          cardDiv.style.color = "#38bdf8";
          cardDiv.style.borderColor = sColor;
          cardDiv.style.textAlign = "left";
          cardDiv.style.justifyContent = "space-between";
          htmlContent = `
            <div>
              <h2 style="margin: 0; font-size: 1.4rem; font-weight: 700; color: #fff; letter-spacing: 1px;">${cardData.name}</h2>
              <p style="margin: 2px 0; font-size: 0.8rem; color: #38bdf8; text-transform: uppercase;">// ${cardData.designation}</p>
            </div>
            <div style="font-size: 0.75rem; color: #94a3b8; font-family: monospace; line-height: 1.5;">
              <div>SYS_ORG: ${cardData.org}</div>
              <div>CONTACT: ${cardData.mobile}</div>
              <div>EMAIL: ${cardData.email}</div>
            </div>
          `;
          break;

        case "10": // Clean Corporate Light
          cardDiv.style.background = "#ffffff";
          cardDiv.style.color = "#334155";
          cardDiv.style.borderColor = "#e2e8f0";
          cardDiv.style.textAlign = "left";
          cardDiv.style.justifyContent = "space-between";
          htmlContent = `
            <div style="border-left: 4px solid #0284c7; padding-left: 12px;">
              <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #0f172a;">${cardData.name}</h2>
              <p style="margin: 2px 0; font-size: 0.85rem; color: #0284c7; font-weight: 500;">${cardData.designation}</p>
              <p style="margin: 0; font-size: 0.75rem; color: #64748b;">${cardData.org}</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px; font-size: 0.75rem; color: #475569; border-top: 1px solid #f1f5f9; padding-top: 8px;">
              <span>💼 Phone: ${cardData.mobile}</span>
              <span>✉️ Email: ${cardData.email}</span>
            </div>
          `;
          break;

        case "11": // Luxury Minimal Gold
          cardDiv.style.background = "#1e1e1e";
          cardDiv.style.color = "#d4af37";
          cardDiv.style.borderColor = "#d4af37";
          cardDiv.style.textAlign = "center";
          cardDiv.style.alignItems = "center";
          cardDiv.style.justifyContent = "center";
          htmlContent = `
            <div style="border: 1px solid rgba(212,175,55,0.3); padding: 15px; width: 90%; height: 80%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <h2 style="margin: 0 0 4px 0; font-size: 1.4rem; font-weight: 500; color: #fff; letter-spacing: 2px; text-transform: uppercase;">${cardData.name}</h2>
              <p style="margin: 0 0 12px 0; font-size: 0.75rem; color: #d4af37; letter-spacing: 1px; text-transform: uppercase;">${cardData.designation}</p>
              <div style="width: 30px; height: 1px; background: #d4af37; margin-bottom: 12px;"></div>
              <p style="margin: 0; font-size: 0.7rem; color: #a3a3a3; font-weight: 300;">${cardData.org} &nbsp;|&nbsp; ${cardData.mobile}</p>
              <p style="margin: 2px 0 0 0; font-size: 0.7', color: #a3a3a3; font-weight: 300;">${cardData.email}</p>
            </div>
          `;
          break;

        case "12": // Emerald Fresh
          cardDiv.style.background = "#f0fdf4";
          cardDiv.style.color = "#166534";
          cardDiv.style.borderColor = "#15803d";
          cardDiv.style.textAlign = "left";
          cardDiv.style.justifyContent = "space-between";
          htmlContent = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #14532d;">${cardData.name}</h2>
                <p style="margin: 2px 0; font-size: 0.8rem; color: #16a34a; font-weight: 600;">${cardData.designation}</p>
              </div>
              <span style="font-size: 1.5rem;">🌿</span>
            </div>
            <div style="font-size: 0.75rem; color: #166534; line-height: 1.4;">
              <div style="font-weight: 600; margin-bottom: 4px;">${cardData.org}</div>
              <div>📞 ${cardData.mobile}</div>
              <div>📧 ${cardData.email}</div>
            </div>
          `;
          break;
      }

      cardDiv.innerHTML = htmlContent;
    }

    document.getElementById('designForm').addEventListener('submit', function(e) {
      e.preventDefault();
      cardData.primary = document.getElementById('primary').value;
      cardData.secondary = document.getElementById('secondary').value;
      cardData.text = document.getElementById('text').value;
      
      const selectedFont = document.querySelector('input[name="font"]:checked');
      cardData.font = selectedFont ? selectedFont.value : "'Poppins', sans-serif";
      
      const selectedTemplate = document.querySelector('input[name="template"]:checked');
      cardData.template = selectedTemplate ? selectedTemplate.value : "1";

      sessionStorage.setItem(activeUser + "_cardData", JSON.stringify(cardData));
      alert("Configuration saved successfully!");
    });

    // Run preview automatically when components compile inside viewports
    window.onload = function() {
      updateLivePreview();
    };
