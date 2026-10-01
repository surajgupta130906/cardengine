if (typeof checkLogin === 'function') { checkLogin(); }

    // Fallback routing if navigation helper functions are missing inside script.js
    if (typeof editDetails !== 'function') { function editDetails() { window.location.href = 'index.html'; } }
    if (typeof changeDesign !== 'function') { function changeDesign() { window.location.href = 'design.html'; } }
    function goHome() { window.location.href = 'index.html'; }

    // Set up global storage pointers
    const activeUser = sessionStorage.getItem("currentUser") || "Anthony";
    const storageKey = activeUser + "_cardData";
    let cardData = JSON.parse(sessionStorage.getItem(storageKey));

    // FEATURE 2: Image Export Generation Logic (Saves to clean high-res PNG)
    function downloadCardImage() {
      const card = document.getElementById('cardPreview');
      
      // Temporary style normalization for perfect pixel rendering capture
      const originalTransform = card.style.transform;
      card.style.transform = 'none';

      html2canvas(card, {
        scale: 3, // Upscales to 3x resolution for high-quality sharp printing
        useCORS: true, // Permits loading external image logos safely
        allowTaint: true,
        backgroundColor: null // Keeps alpha transparency if your background dictates it
      }).then(canvas => {
        card.style.transform = originalTransform; // Restores view hover animations
        
        // Convert canvas output to an invisible click-to-download anchor element
        const imageURI = canvas.toDataURL('image/png');
        const downloadAnchor = document.createElement('a');
        downloadAnchor.href = imageURI;
        downloadAnchor.download = `${cardData.name.replace(/\s+/g, '_')}_Visiting_Card.png`;
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
      }).catch(err => {
        console.error("Canvas rendering pipeline error:", err);
        alert("Could not render card image file. If using a custom logo asset image, please ensure it supports public web access headers.");
      });
    }

    // FEATURE 3: Live Text Mutation Observer & Automatic Synchronization
    function initLiveEditingEngine() {
      const cardDiv = document.getElementById('cardPreview');
      
      // Intercept and flag target text structures inside template blocks
      const textElements = cardDiv.querySelectorAll('p, h2, span, div');
      textElements.forEach(el => {
        // Only target elements that contain direct text nodes, skipping formatting containers
        if (el.children.length === 0 && el.innerText.trim() !== '') {
          el.setAttribute('contenteditable', 'true');
          el.style.outline = 'none';
          el.style.cursor = 'text';
          
          // Subtle workspace background overlay to show which text field is currently focused
          el.addEventListener('focus', () => { el.style.backgroundColor = 'rgba(99, 102, 241, 0.1)'; el.style.borderRadius = '4px'; });
          el.addEventListener('blur', () => { el.style.backgroundColor = 'transparent'; });
        }
      });

      // Hook up an engine listener to automatically update changes back into sessionStorage
      const observer = new MutationObserver(() => {
        const freshCard = document.getElementById('cardPreview');
        
        // Scan standard text blocks safely using semantic elements
        const h2Element = freshCard.querySelector('h2');
        if (h2Element) cardData.name = h2Element.innerText;
        
        // Backup general parsing block to identify email and mobile text revisions
        const paragraphs = Array.from(freshCard.querySelectorAll('p, span'));
        paragraphs.forEach(p => {
          const text = p.innerText.trim();
          if (text.includes('@') && !text.includes('📞')) {
            cardData.email = text.replace('📧', '').trim();
          } else if ((text.match(/\d/g) || []).length >= 7 && !text.includes('@')) {
            cardData.mobile = text.replace('📞', '').trim();
          }
        });

        // Write edits straight back to persistent memory
        sessionStorage.setItem(storageKey, JSON.stringify(cardData));
      });

      observer.observe(cardDiv, { subtree: true, characterData: true, childList: true });
    }

    // Load and populate card data exactly as compiled inside Design page
    window.onload = function() {
      if (!cardData) {
        document.getElementById('cardPreview').innerHTML = "<p style='color:red; text-align:center;'>No card design layout data found. Please return to the design playground dashboard.</p>";
        return;
      }

      const cardDiv = document.getElementById('cardPreview');
      
      // Map global configuration styles
      cardDiv.style.background = cardData.primary || "#ffffff";
      cardDiv.style.color = cardData.text || "#0f172a";
      cardDiv.style.borderColor = cardData.secondary || "#4f46e5";
      cardDiv.style.fontFamily = cardData.font || "'Poppins', sans-serif";

      const cleanLogo = cardData.logo || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23cbd5e1' rx='15'/><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-size='14'>No Logo</text></svg>";
      let htmlContent = '';
      const tChoice = cardData.template || "1";

      // Match all 12 structural template configurations
      switch (tChoice) {
        case "1":
          cardDiv.style.textAlign = "center"; cardDiv.style.alignItems = "center"; cardDiv.style.justifyContent = "center";
          htmlContent = `
            <p style="margin: 0 0 8px 0; font-size: 0.75rem; opacity: 0.85;"><span>${cardData.email}</span> &nbsp;&bull;&nbsp; 📞 <span>${cardData.mobile}</span></p>
            <img src="${cleanLogo}" style="max-width: 55px; max-height: 55px; object-fit: contain; margin: 4px 0; border-radius: 6px;"><br>
            <p style="margin: 4px 0 2px 0; font-size: 1.2rem; font-weight: 700;">${cardData.name}</p>
            <p style="margin: 0; font-size: 0.8rem; opacity: 0.9;">${cardData.designation}</p>
            <p style="margin: 0; font-size: 0.75rem; opacity: 0.7;">${cardData.org}</p>
          `;
          break;
        case "2":
          cardDiv.style.textAlign = "left"; cardDiv.style.alignItems = "stretch"; cardDiv.style.justifyContent = "space-between";
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
              <span>📧 ${cardData.email}</span><span>📞 ${cardData.mobile}</span>
            </div>
          `;
          break;
        case "3":
          cardDiv.style.textAlign = "left"; cardDiv.style.alignItems = "stretch"; cardDiv.style.justifyContent = "center";
          htmlContent = `
            <div style="display: flex; gap: 15px; align-items: center; height: 100%;">
              <img src="${cleanLogo}" style="max-width: 65px; max-height: 65px; object-fit: contain; border-radius: 6px;">
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <h2 style="margin: 0; font-size: 1.2rem; font-weight: 700;">${cardData.name}</h2>
                <p style="margin: 0 0 4px 0; font-size: 0.8rem; font-weight: 600; opacity: 0.9;">${cardData.designation}</p>
                <p style="margin: 0 0 6px 0; font-size: 0.75rem; opacity: 0.7;">${cardData.org}</p>
                <p style="margin: 0; font-size: 0.7rem; opacity: 0.85;">📞 <span>${cardData.mobile}</span> | 📧 <span>${cardData.email}</span></p>
              </div>
            </div>
          `;
          break;
        case "4":
          cardDiv.style.textAlign = "center"; cardDiv.style.alignItems = "center"; cardDiv.style.justifyContent = "space-between";
          htmlContent = `
            <div style="width: 100%;"><img src="${cleanLogo}" style="max-width: 50px; max-height: 50px; object-fit: contain; border-radius: 6px;"></div>
            <div style="width: 100%;">
              <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700;">${cardData.name}</h2>
              <p style="margin: 2px 0; font-size: 0.8rem; opacity: 0.9;">${cardData.designation}</p>
              <p style="margin: 0 0 8px 0; font-size: 0.75rem; opacity: 0.7;">${cardData.org}</p>
              <p style="margin: 0; font-size: 0.75rem; opacity: 0.85; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 6px;">📧 <span>${cardData.email}</span> &nbsp;|&nbsp; 📞 <span>${cardData.mobile}</span></p>
            </div>
          `;
          break;
        case "5":
          cardDiv.style.textAlign = "left"; cardDiv.style.alignItems = "stretch"; cardDiv.style.justifyContent = "space-between";
          cardDiv.style.borderLeft = `8px solid ${cardData.secondary || '#4f46e5'}`;
          htmlContent = `
            <div style="display: flex; justify-content: space-between; height: 100%; flex-direction: column;">
              <div>
                <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700;">${cardData.name}</h2>
                <p style="margin: 2px 0; font-size: 0.85rem; font-weight: 600; color: ${cardData.secondary || '#4f46e5'}; text-transform: uppercase;">${cardData.designation}</p>
                <p style="margin: 2px 0; font-size: 0.8rem; opacity: 0.8;">${cardData.org}</p>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.7rem; opacity: 0.75;">
                <span>📧 <span>${cardData.email}</span><br>📞 <span>${cardData.mobile}</span></span>
                <img src="${cleanLogo}" style="max-width: 45px; max-height: 45px; object-fit: contain; border-radius: 4px;">
              </div>
            </div>
          `;
          break;
        case "6":
          cardDiv.style.textAlign = "left"; cardDiv.style.alignItems = "stretch"; cardDiv.style.justifyContent = "space-between";
          cardDiv.style.background = `linear-gradient(135deg, ${cardData.primary || '#ffffff'} 72%, ${cardData.secondary || '#4f46e5'} 72%)`;
          htmlContent = `
            <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700;">${cardData.name}</h2>
                  <p style="margin: 2px 0; font-size: 0.8rem; opacity: 0.8;">${cardData.designation}</p>
                  <p style="margin: 0; font-size: 0.75rem; opacity: 0.6;">${cardData.org}</p>
                </div>
                <img src="${cleanLogo}" style="max-width: 45px; max-height: 45px; object-fit: contain; border-radius: 4px;">
              </div>
              <div style="font-size: 0.75rem; font-weight: 500; color: inherit;">📧 <span>${cardData.email}</span><br>📞 <span>${cardData.mobile}</span></div>
            </div>
          `;
          break;
        case "7":
          cardDiv.style.textAlign = "center"; cardDiv.style.alignItems = "center"; cardDiv.style.justifyContent = "center";
          htmlContent = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; width: 100%;">
              <img src="${cleanLogo}" style="max-width: 45px; max-height: 45px; object-fit: contain; border-radius: 50%; border: 2px solid ${cardData.secondary}; background: white; padding: 2px;">
              <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700;">${cardData.name}</h2>
              <div style="font-size: 0.8rem; color: ${cardData.secondary}; border-top: 1px solid rgba(128,128,128,0.2); width: 75%; padding-top: 4px; font-weight: 600; text-transform: uppercase;">${cardData.designation}</div>
              <p style="margin: 0; font-size: 0.75rem; opacity: 0.7;">${cardData.org} &nbsp;&bull;&nbsp; 📞 <span>${cardData.mobile}</span></p>
            </div>
          `;
          break;
        case "8":
          cardDiv.style.textAlign = "left"; cardDiv.style.alignItems = "stretch"; cardDiv.style.justifyContent = "space-between";
          cardDiv.style.borderTop = `8px solid ${cardData.secondary}`;
          htmlContent = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
              <div>
                <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700;">${cardData.name}</h2>
                <p style="margin: 2px 0; font-size: 0.8rem; color: ${cardData.secondary}; font-weight: bold;">${cardData.designation}</p>
              </div>
              <img src="${cleanLogo}" style="max-width: 45px; max-height: 45px; object-fit: contain; border-radius: 4px;">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.75rem; opacity: 0.85;">
              <span>🏢 ${cardData.org}</span>
              <div style="text-align: right; font-size: 0.7rem; line-height: 1.3;"><span>${cardData.email}</span><br><span>${cardData.mobile}</span></div>
            </div>
          `;
          break;
        case "9":
          cardDiv.style.background = "#0f172a"; cardDiv.style.color = "#38bdf8"; cardDiv.style.textAlign = "left"; cardDiv.style.justifyContent = "space-between";
          htmlContent = `
            <div>
              <h2 style="margin: 0; font-size: 1.4rem; font-weight: 700; color: #fff; letter-spacing: 1px;">${cardData.name}</h2>
              <p style="margin: 2px 0; font-size: 0.8rem; color: #38bdf8; text-transform: uppercase;">// ${cardData.designation}</p>
            </div>
            <div style="font-size: 0.75rem; color: #94a3b8; font-family: monospace; line-height: 1.5;">
              <div>SYS_ORG: ${cardData.org}</div><div>CONTACT: ${cardData.mobile}</div><div>EMAIL: ${cardData.email}</div>
            </div>
          `;
          break;
        case "10":
          cardDiv.style.background = "#ffffff"; cardDiv.style.color = "#334155"; cardDiv.style.textAlign = "left"; cardDiv.style.justifyContent = "space-between";
          htmlContent = `
            <div style="border-left: 4px solid #0284c7; padding-left: 12px;">
              <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #0f172a;">${cardData.name}</h2>
              <p style="margin: 2px 0; font-size: 0.85rem; color: #0284c7; font-weight: 500;">${cardData.designation}</p>
              <p style="margin: 0; font-size: 0.75rem; color: #64748b;">${cardData.org}</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px; font-size: 0.75rem; color: #475569; border-top: 1px solid #f1f5f9; padding-top: 8px;">
              <span>💼 Phone: <span>${cardData.mobile}</span></span><span>✉️ Email: <span>${cardData.email}</span></span>
            </div>
          `;
          break;
        case "11":
          cardDiv.style.background = "#1e1e1e"; cardDiv.style.color = "#d4af37"; cardDiv.style.textAlign = "center"; cardDiv.style.alignItems = "center"; cardDiv.style.justifyContent = "center";
          htmlContent = `
            <div style="border: 1px solid rgba(212,175,55,0.3); padding: 15px; width: 90%; height: 80%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <h2 style="margin: 0 0 4px 0; font-size: 1.4rem; font-weight: 500; color: #fff; letter-spacing: 2px; text-transform: uppercase;">${cardData.name}</h2>
              <p style="margin: 0 0 12px 0; font-size: 0.75rem; color: #d4af37; letter-spacing: 1px; text-transform: uppercase;">${cardData.designation}</p>
              <div style="width: 30px; height: 1px; background: #d4af37; margin-bottom: 12px;"></div>
              <p style="margin: 0; font-size: 0.7rem; color: #a3a3a3;">${cardData.org} &nbsp;|&nbsp; <span>${cardData.mobile}</span></p>
              <p style="margin: 2px 0 0 0; font-size: 0.7rem; color: #a3a3a3;"><span>${cardData.email}</span></p>
            </div>
          `;
          break;
        case "12":
          cardDiv.style.background = "#f0fdf4"; cardDiv.style.color = "#166534"; cardDiv.style.textAlign = "left"; cardDiv.style.justifyContent = "space-between";
          htmlContent = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h2 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #14532d;">${cardData.name}</h2>
                <p style="margin: 2px 0; font-size: 0.8rem; color: #16a34a; font-weight: 600;">${cardData.designation}</p>
              </div>
              <span style="font-size: 1.5rem;">🌿</span>
            </div>
            <div style="font-size: 0.75rem; color: #166534; line-height: 1.4;">
              <div style="font-weight: 600; margin-bottom: 4px;">${cardData.org}</div><div>📞 <span>${cardData.mobile}</span></div><div>📧 <span>${cardData.email}</span></div>
            </div>
          `;
          break;
        default:
          htmlContent = `<h2>${cardData.name}</h2>`;
      }

      cardDiv.innerHTML = htmlContent;

      // Trigger the interactive inline-editing setup right after compiling text nodes to the view context
      initLiveEditingEngine();
    };
    
       
    // Switches views flawlessly without changing the CSS structure of the elements
function switchCardSide(side) {
  const frontCard = document.getElementById('cardPreview');
  const backCard = document.getElementById('cardBackPreview');
  const frontBtn = document.getElementById('showFrontBtn');
  const backBtn = document.getElementById('showBackBtn');

  if (side === 'front') {
    frontCard.classList.remove('card-hidden');
    backCard.classList.add('card-hidden');
    frontBtn.classList.add('active');
    backBtn.classList.remove('active');
  } else {
    frontCard.classList.add('card-hidden');
    backCard.classList.remove('card-hidden');
    frontBtn.classList.remove('active');
    backBtn.classList.add('active');
    
    // Generate/refresh QR code automatically upon flipping to the back view
    generateContactQRCode();
  }
}

// Compiles your session card data into a universal vCard structure without editing DOM elements
function generateContactQRCode() {
  const qrTarget = document.getElementById('qrCodeDisplay');
  if (!qrTarget) return;
  
  qrTarget.innerHTML = ""; // Wipe previous instances cleanly

  // Build vCard string context from your dynamic data storage object
  const vCardData = 
    `BEGIN:VCARD\n` +
    `VERSION:3.0\n` +
    `N:${cardData.name || ''};;;\n` +
    `FN:${cardData.name || ''}\n` +
    `ORG:${cardData.org || ''}\n` +
    `TITLE:${cardData.designation || ''}\n` +
    `TEL;CELL:${cardData.mobile || ''}\n` +
    `EMAIL;WORK:${cardData.email || ''}\n` +
    `END:VCARD`;

  // Apply visual style options to match your chosen colors on the back card element
  const backDiv = document.getElementById('cardBackPreview');
  if (backDiv && cardData) {
    backDiv.style.background = cardData.primary || "#ffffff";
    backDiv.style.color = cardData.text || "#0f172a";
    backDiv.style.borderColor = cardData.secondary || "#4f46e5";
    backDiv.style.fontFamily = cardData.font || "'Poppins', sans-serif";
    
    const qrLabel = document.getElementById('qrLabelText');
    if (qrLabel) qrLabel.style.color = cardData.text || "#0f172a";
  }

  // Render QR output canvas geometry
  new QRCode(qrTarget, {
    text: vCardData,
    width: 130,
    height: 130,
    colorDark: cardData.text || "#0f172a",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
}
