/**
 * Studio Workspace - Card Engine Script
 * Handles custom parameters, theme variations, template routing, and authentication handshakes.
 */

document.addEventListener('DOMContentLoaded', () => {
    let activeColor = '#d4af37';

    // Target UI Elements
    const nameInput = document.getElementById('sandbox-name');
    const titleInput = document.getElementById('sandbox-title');
    const renderName = document.getElementById('cardRenderName');
    const renderTitle = document.getElementById('cardRenderTitle');
    const previewCard = document.getElementById('previewCard');

    // Sync Text Parameters in Real Time
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

    // Color Theme Palette Customizer
    const colorDots = document.querySelectorAll('.color-dot');
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.style.borderColor = 'transparent');
            dot.style.borderColor = '#ffffff';
            activeColor = dot.getAttribute('data-color');
            document.documentElement.style.setProperty('--accent-gold', activeColor);
        });
    });

    // Surface Environment Toggles (Dark / Light Mode)
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleButtons.forEach(b => { 
                b.classList.remove('active'); 
                b.style.opacity = '0.6'; 
            });
            btn.classList.add('active'); 
            btn.style.opacity = '1';
            
            if (previewCard) {
                if (btn.getAttribute('data-theme') === 'light') {
                    previewCard.style.background = '#ffffff';
                    previewCard.style.color = '#0f172a';
                } else {
                    previewCard.style.background = '#1e1e24';
                    previewCard.style.color = '#ffffff';
                }
            }
        });
    });

    // Live Grid Layout Picker System
    const layouts = document.querySelectorAll('.template-left1, .template-right1, .template-left2, .template-right2');
    layouts.forEach(box => {
        box.addEventListener('click', () => {
            layouts.forEach(b => b.style.borderColor = 'var(--border-color)');
            box.style.borderColor = 'var(--accent-gold)';
            
            const nextLayout = box.getAttribute('data-layout');
            if (previewCard) {
                previewCard.className = `mock-card layout-${nextLayout}`;
            }
            
            // Execute automated template selection workflow
            selectTemplate(nextLayout);
        });
    });
});

// Verification & Session Router Logic
function selectTemplate(templateId) {
    const nameInput = document.getElementById('sandbox-name');
    const titleInput = document.getElementById('sandbox-title');

    // Save current workspace customization values to use later in the form
    localStorage.setItem("selectedTemplate", templateId);
    if (nameInput) localStorage.setItem("draftName", nameInput.value);
    if (titleInput) localStorage.setItem("draftTitle", titleInput.value);
    
    // Check user authentication environment status
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    
    if (isLoggedIn === "true") {
        // Logged in? Proceed straight to detail assembly form
        window.location.href = "card_form.html";
    } else {
        // Not logged in? Store target destination so login can redirect them back here post-auth
        localStorage.setItem("redirectAfterLogin", "card_form.html");
        window.location.href = "login.html";
    }
}

// System Account Management
function handleLogout() {
    // Clear auth token
    sessionStorage.removeItem("isLoggedIn");
    
    // Clear lingering route memory so it doesn't auto-forward you next time
    localStorage.removeItem("redirectAfterLogin");
    
    alert('Signing out from Workspace...');
    window.location.href = "extra.html";
}
