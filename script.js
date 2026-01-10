// ==================================================
// 1. ELEMENTS SELECTION (Modal & Buttons)
// ==================================================
const parentModal = document.getElementById("parentModal");
// --- MISSING HERO BUTTONS SELECTION ---
const heroParentBtn = document.getElementById("heroParentBtn");
const heroTeacherBtn = document.getElementById("heroTeacherBtn");
const teacherModal = document.getElementById("teacherModal");
const callbackModal = document.getElementById("callbackModal");

// Close Buttons
const closeParent = document.getElementById("closeParent");
const closeTeacher = document.getElementById("closeTeacher");

// NEW: backend script URL (paste your deployed Apps Script URL here)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9BQHjcAYq4d1ZjO_lj4Db8iUZFBvaGPC-NuBc_3uJCYsgeq7Eh6-mMqw7I0eKM96XEQ/exec';

/* Consolidated DOM references (forms, selects, buttons) - declared once */
const parentForm = document.getElementById('parentForm');
const parentSuccess = document.getElementById('parentSuccess');
const parentCitySelect = document.getElementById('parentCitySelect');
const parentZoneSelect = document.getElementById('parentZoneSelect');

const teacherForm = document.getElementById('teacherForm');
const teacherPaymentIntro = document.getElementById('teacherPaymentIntro');
const teacherModalHeader = document.getElementById('teacherModalHeader');
const teacherCitySelect = document.getElementById('teacherCitySelect');
const teacherZoneSelect = document.getElementById('teacherZoneSelect');

const callbackForm = document.getElementById('callbackForm');

// Navigation elements (declared here to avoid ReferenceError in isMenuOpen)
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-item');
const navCta = document.querySelector('.btn-nav-cta');

// Scroll lock helpers (preserve/restore page scroll position)
let __savedScrollY = 0;
function lockScroll() {
    if (document.body.dataset.scrollLocked === 'true') return;
    __savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.dataset.scrollLocked = 'true';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${__savedScrollY}px`;
    document.body.style.width = '100%';
}

function unlockScroll() {
    if (document.body.dataset.scrollLocked !== 'true') return;
    document.body.dataset.scrollLocked = 'false';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, __savedScrollY);
}

// ==================================================
// BACK BUTTON HANDLER (Mobile UX Fix)
// ==================================================
let modalStack = []; // Track which modal is currently open

function pushModalState(modalName) {
    /* Push a history state when modal opens.
       This creates a "virtual" navigation step so the back button
       will trigger popstate instead of navigating away. */
    modalStack.push(modalName);
    window.history.pushState({ modal: modalName }, '', window.location.href);
}

function popModalState() {
    /* Called when back button is pressed.
       Removes the last modal from stack. */
    if (modalStack.length > 0) {
        modalStack.pop();
        return true;
    }
    return false;
}

function isModalOpen() {
    /* Check if any modal is currently visible. */
    return (
        (parentModal && parentModal.style.display === 'block') ||
        (teacherModal && teacherModal.style.display === 'block') ||
        (callbackModal && callbackModal.style.display === 'block')
    );
}

function isMenuOpen() {
    /* Check if the hamburger menu is currently open. */
    return navLinks && navLinks.classList.contains('active');
}

// Intercept browser back button
window.addEventListener('popstate', (event) => {
    /* When user presses back:
       - If a menu is open, close it first.
       - If a modal is open, close it.
       - Otherwise, allow normal navigation (browser will go back). */
    
    // Priority 1: Close menu if open (prevents routing away from page)
    if (isMenuOpen()) {
        event.preventDefault();
        closeHamburgerMenu();
        return;
    }
    
    // Priority 2: Close modal if open
    if (isModalOpen()) {
        event.preventDefault();
        
        // Close the currently open modal
        if (parentModal && parentModal.style.display === 'block') {
            parentModal.style.display = 'none';
            unlockScroll();
        } else if (teacherModal && teacherModal.style.display === 'block') {
            teacherModal.style.display = 'none';
            unlockScroll();
        } else if (callbackModal && callbackModal.style.display === 'block') {
            callbackModal.style.display = 'none';
            unlockScroll();
        }
        
        // Remove from modal stack
        popModalState();
        return;
    }
    
    /* If neither menu nor modal is open, the back event proceeds normally. */
});

// ==================================================
// UNIFIED MENU CLOSE LOGIC (Applies scroll unlock & history pop)
// ==================================================
function closeHamburgerMenu() {
    /* Cleanly close the hamburger menu and restore page state. */
    if (!navLinks) return;
    
    navLinks.classList.remove('active');
    document.body.classList.remove('menu-open');
    unlockScroll();
    
    // Reset Icon
    const icon = hamburgerBtn.querySelector('i');
    if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }
    
    // Remove from modal stack (menu is treated as a "modal" state)
    popModalState();
}

// ==================================================
// 2. OPEN/CLOSE FUNCTIONS
// ==================================================

// Open Parent Form
function openParentForm() {
    if(parentModal) {
        parentModal.style.display = "block";
        lockScroll(); /* Lock background scroll */
        pushModalState('parent'); /* Push back button state */
        // Reset to show form (agar pehle submit kiya tha to wapas form dikhaye)
        document.getElementById("parentForm").style.display = "block";
        const successBox = document.getElementById("parentSuccess");
        if(successBox) successBox.style.display = "none";
    }
}

// Open Teacher Form
function openTeacherForm() {
    if(teacherModal) {
        teacherModal.style.display = "block";
        lockScroll(); /* Lock background scroll */
        pushModalState('teacher'); /* Push back button state */
        // Reset to show form
        document.getElementById("teacherForm").style.display = "block";
        document.getElementById("teacherPaymentIntro").style.display = "none";
        document.getElementById("paymentSection").style.display = "none";
        
        // Reset Header (Form screen: heading only, no sub-copy)
        const header = document.getElementById("teacherModalHeader");
        if(header) header.innerHTML = '<h2 style="text-align: center; margin-bottom: 10px;">Join <span class="text-accent">Neo Shiksha</span></h2>';
    }
}

// Open Callback Form
function openCallbackForm() {
    if(callbackModal) {
        callbackModal.style.display = "block";
        lockScroll(); /* Lock background scroll */
        pushModalState('callback'); /* Push back button state */
        
        // FIX: Reset visibility states AND clear form inputs
        const mainContent = document.getElementById("callbackMainContent");
        const form = document.getElementById("callbackForm");
        const success = document.getElementById("callbackSuccess");
        
        if(mainContent) mainContent.style.display = "block";
        if(form) {
            form.style.display = "block";
            form.reset(); /* Clear all input fields */
        }
        if(success) success.style.display = "none";
    }
}

// Close Callback Form
function closeCallbackForm() {
    if(callbackModal) {
        callbackModal.style.display = "none";
        unlockScroll(); /* Unlock background scroll */
        popModalState(); /* Remove from modal stack */
    }
}

// Close Logic (Clicking X)
if(closeParent) {
    closeParent.onclick = function() {
        parentModal.style.display = "none";
        unlockScroll(); /* Unlock background scroll */
        popModalState(); /* Remove from modal stack */
    }
}
if(closeTeacher) {
    closeTeacher.onclick = function() {
        teacherModal.style.display = "none";
        unlockScroll(); /* Unlock background scroll */
        popModalState(); /* Remove from modal stack */
    }
}

// Window Click (Outside Click to Close)
window.onclick = function(event) {
    if (event.target == parentModal) {
        parentModal.style.display = "none";
        unlockScroll(); /* Unlock background scroll */
        popModalState(); /* Remove from modal stack */
    }
    if (event.target == teacherModal) {
        teacherModal.style.display = "none";
        unlockScroll(); /* Unlock background scroll */
        popModalState(); /* Remove from modal stack */
    }
    if (event.target == callbackModal) {
        callbackModal.style.display = "none";
        unlockScroll(); /* Unlock background scroll */
        popModalState(); /* Remove from modal stack */
    }
}

// ==================================================
// 3. DYNAMIC ZONE LOGIC (For Both Forms)
// ==================================================
const zoneData = {
    "Delhi": ["East Delhi", "West Delhi", "North Delhi", "South Delhi", "Central Delhi"],
    "Tricity": ["Chandigarh", "Mohali", "Panchkula"]
};

// Parent Form Zone Logic

if(parentCitySelect && parentZoneSelect) {
    parentCitySelect.addEventListener('change', function() {
        const selectedCity = this.value;
        parentZoneSelect.innerHTML = '<option value="" disabled selected>Select Zone</option>';
        
        if (selectedCity && zoneData[selectedCity]) {
            parentZoneSelect.disabled = false;
            parentZoneSelect.style.borderColor = "var(--accent-color)";
            zoneData[selectedCity].forEach(function(zone) {
                const option = document.createElement('option');
                option.value = zone;
                option.textContent = zone;
                parentZoneSelect.appendChild(option);
            });
        } else {
            parentZoneSelect.disabled = true;
            parentZoneSelect.style.borderColor = "#333";
        }
    });
}

/* =====================================================
   SECTION: ABOUT – GALLERY
   FILE: script.js
   PURPOSE: Duplicate gallery content for a seamless vertical loop.
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Select the gallery track, which holds the animation
    const galleryTrack = document.querySelector('.about-section .gallery-track');

    // Only run this logic if the gallery track exists on the page
    if (galleryTrack) {
        const galleryItems = galleryTrack.querySelectorAll('.gallery-item');

        if (galleryItems.length > 0) {
            /*
            * WHAT IT DOES: Duplicates the entire set of gallery items and appends them to the track.
            * WHY IT EXISTS: The CSS animation (`scrollGallery`) translates the track by -50%.
            * For this to create a seamless loop, the track's content must be duplicated.
            * This script provides the necessary duplicated content for the CSS animation to work correctly.
            * We clone it twice (for a total of 3 sets) to ensure the content is always taller than the viewport.
            */
            galleryItems.forEach(item => {
                galleryTrack.appendChild(item.cloneNode(true));
            });
            galleryItems.forEach(item => {
                galleryTrack.appendChild(item.cloneNode(true));
            });
        }
    }
});

// Teacher Form Zone Logic

if(teacherCitySelect && teacherZoneSelect) {
    teacherCitySelect.addEventListener('change', function() {
        const selectedCity = this.value;
        teacherZoneSelect.innerHTML = '<option value="" disabled selected>Select Zone</option>';
        
        if (selectedCity && zoneData[selectedCity]) {
            teacherZoneSelect.disabled = false;
            teacherZoneSelect.style.borderColor = "var(--accent-color)";
            zoneData[selectedCity].forEach(function(zone) {
                const option = document.createElement('option');
                option.value = zone;
                option.textContent = zone;
                teacherZoneSelect.appendChild(option);
            });
        } else {
            teacherZoneSelect.disabled = true;
            teacherZoneSelect.style.borderColor = "#333";
        }
    });
}

// ==================================================
// 4. FORM SUBMISSION LOGIC
// Unified handler below wires up existing forms (see handler implementation further down).
// ==================================================

// --- C. Teacher "Proceed to Pay" Click (Show QR) ---
function showQrCode() {
    // Hide Intro
    if(teacherPaymentIntro) teacherPaymentIntro.style.display = 'none';
    
    // Show QR Section
    const paymentSection = document.getElementById('paymentSection');
    if(paymentSection) paymentSection.style.display = 'block';
    
    // Update Header (Payment screen: heading + payment copy)
    if(teacherModalHeader) {
        teacherModalHeader.innerHTML = '<h2 style="text-align: center; margin-bottom: 10px;">Join <span class="text-accent">Neo Shiksha</span></h2><p style="text-align: center; color: #aaa; font-size: 0.9rem; margin-bottom: 30px;">Good teaching, done consistently, leads to better income here.</p>';
    }
}

// ==================================================
// 5. EVENT LISTENERS (Buttons Click Logic)
// ==================================================

// Hero Section: Find a Tutor
if(heroParentBtn) {
    heroParentBtn.addEventListener('click', openParentForm);
}

// Hero Section: Join as Teacher
if(heroTeacherBtn) {
    heroTeacherBtn.addEventListener('click', openTeacherForm);
}

// About Section: Demo Button (Agar ye button exist karta hai)
const aboutDemoBtn = document.getElementById("aboutDemoBtn");
if(aboutDemoBtn) {
    aboutDemoBtn.addEventListener('click', openParentForm);
}

// Transition Continue wiring: show existing payment intro when user continues
const teacherTransitionContinue = document.getElementById('teacherTransitionContinue');
const teacherTransition = document.getElementById('teacherTransition');
if (teacherTransitionContinue) {
    teacherTransitionContinue.addEventListener('click', () => {
        if (teacherTransition) teacherTransition.style.display = 'none';
        // Skip the intermediate intro and directly open the final payment (QR + WhatsApp)
        showQrCode();
    });
}

// Payment helper dismiss functionality
const paymentHelper = document.getElementById('paymentHelper');
const paymentHelperClose = document.getElementById('paymentHelperClose');

// Dismiss helper and remember closure for this session
if (paymentHelperClose) {
    paymentHelperClose.addEventListener('click', () => {
        if (paymentHelper) paymentHelper.style.display = 'none';
        try { sessionStorage.setItem('paymentHelperClosed', 'true'); } catch (e) {}
    });
}

// Show QR Button: Toggle QR visibility on mobile
const showQrBtn = document.getElementById('showQrBtn');
const qrContainer = document.getElementById('qrContainer');
const qrHelperText = document.getElementById('qrHelperText');
const whatsappPaymentBtn = document.getElementById('whatsappPaymentBtn');

// Trigger subtle attention on WhatsApp CTA (blink border 2–3 times)
function triggerWhatsappAttention() {
    if (!whatsappPaymentBtn) return;
    // Restart animation if already applied
    whatsappPaymentBtn.classList.remove('whatsapp-attention');
    // Force reflow to allow re-adding class to restart animation
    void whatsappPaymentBtn.offsetWidth;
    whatsappPaymentBtn.classList.add('whatsapp-attention');
    // Remove class after animation completes (0.9s x 3 iterations)
    setTimeout(() => {
        whatsappPaymentBtn.classList.remove('whatsapp-attention');
    }, 2700);
}

if (showQrBtn) {
    showQrBtn.addEventListener('click', () => {
        // Toggle visibility classes
        if (qrContainer) qrContainer.classList.toggle('visible-mobile');
        if (qrHelperText) qrHelperText.classList.toggle('visible-mobile');
        
        // Toggle active state for button styling
        showQrBtn.classList.toggle('qr-active');
        
        // Update button text based on visibility state
        if (qrContainer && qrContainer.classList.contains('visible-mobile')) {
            showQrBtn.textContent = 'Hide QR Code';
            // Draw attention to WhatsApp after revealing QR
            triggerWhatsappAttention();
        } else {
            showQrBtn.textContent = 'Show QR Code';
        }
    });
}

// Mobile QR preference link: Reuse existing QR toggle logic
const preferQrLink = document.getElementById('preferQrLink');
if (preferQrLink && showQrBtn) {
    preferQrLink.addEventListener('click', () => {
        showQrBtn.click(); // Trigger same toggle as the button
    });
}

// Copy UPI Number - Mobile-optimized with trusted gesture + iOS fallback
function initCopyButton() {
    const copyUpiBtn = document.getElementById('copyUpiBtn');
    const copyConfirmation = document.getElementById('copyConfirmation');
    
    if (!copyUpiBtn) {
        console.warn('Copy button not found in DOM');
        return;
    }

    // Single click event - works on desktop and mobile (maintains trusted gesture)
    copyUpiBtn.addEventListener('click', function() {
        const upiNumber = '9555577801';
        
        // Try modern clipboard API first (Android Chrome, desktop)
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(upiNumber)
                .then(() => {
                    showCopySuccess();
                })
                .catch(() => {
                    // Fallback for iOS Safari and restricted contexts
                    fallbackCopy(upiNumber);
                });
        } else {
            // Older browsers or restricted context - use fallback
            fallbackCopy(upiNumber);
        }
        
        function showCopySuccess() {
            // Show button feedback only (no toast message)
            
            // Update button text temporarily
            const originalText = copyUpiBtn.innerHTML;
            copyUpiBtn.innerHTML = '<span>✓</span><span>Copied</span>';
            copyUpiBtn.style.color = '#25D366';
            copyUpiBtn.style.borderColor = '#25D366';
            
            setTimeout(() => {
                copyUpiBtn.innerHTML = originalText;
                copyUpiBtn.style.color = 'var(--accent-color)';
                copyUpiBtn.style.borderColor = 'var(--accent-color)';
            }, 2000);

            // Nudge attention to WhatsApp CTA
            triggerWhatsappAttention();
        }
        
        function fallbackCopy(text) {
            try {
                // Create temporary input element
                const input = document.createElement('input');
                input.type = 'text';
                input.value = text;
                input.style.position = 'fixed';
                input.style.top = '-9999px';
                input.style.left = '-9999px';
                
                document.body.appendChild(input);
                input.select();
                input.setSelectionRange(0, 99999); // For mobile
                
                // Execute copy command
                const success = document.execCommand('copy');
                
                // Clean up
                document.body.removeChild(input);
                
                if (success) {
                    showCopySuccess();
                } else {
                    throw new Error('execCommand copy failed');
                }
            } catch (err) {
                console.error('Fallback copy failed:', err);
                // Silent fail - no error message shown to user
            }
        }
    });
}

// Initialize copy button when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButton);
} else {
    initCopyButton();
}

// ==================================================
// 6. TOGGLE LOGIC (Why Neo Shiksha Section)
// ==================================================
function showParents() {
    const buttons = document.querySelectorAll('.toggle-btn');
    const contentParents = document.getElementById('content-parents');
    const contentTeachers = document.getElementById('content-teachers');

    // Button Active State (Gold Color Switch)
    if(buttons.length >= 2) {
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    }

    // Show Parents Content, Hide Teachers
    if(contentParents) contentParents.style.display = 'flex';
    if(contentTeachers) contentTeachers.style.display = 'none';
}

function showTeachers() {
    const buttons = document.querySelectorAll('.toggle-btn');
    const contentParents = document.getElementById('content-parents');
    const contentTeachers = document.getElementById('content-teachers');

    // Button Active State (Gold Color Switch)
    if(buttons.length >= 2) {
        buttons[0].classList.remove('active');
        buttons[1].classList.add('active');
    }

    // Show Teachers Content, Hide Parents
    if(contentParents) contentParents.style.display = 'none';
    if(contentTeachers) contentTeachers.style.display = 'flex';
}

// ==================================================
// 7. NEW SECTION LOGIC: HOW IT WORKS & FAQs
// ==================================================

// --- A. Process Section Toggle (Unique Logic) ---
function showProcessParents() {
    // Buttons
    document.getElementById('btn-process-parent').classList.add('active');
    document.getElementById('btn-process-teacher').classList.remove('active');
    
    // Content
    document.getElementById('process-parents').style.display = 'block';
    document.getElementById('process-teachers').style.display = 'none';
}

function showProcessTeachers() {
    // Buttons
    document.getElementById('btn-process-parent').classList.remove('active');
    document.getElementById('btn-process-teacher').classList.add('active');
    
    // Content
    document.getElementById('process-parents').style.display = 'none';
    document.getElementById('process-teachers').style.display = 'block';
}

// --- B. FAQ Accordion Logic ---
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        // Toggle Active Class
        question.classList.toggle('active');
        
        // Toggle Panel
        const answer = question.nextElementSibling;
        
        if (question.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = 0;
        }
    });
});

// ==================================================
// 8. MOBILE NAVBAR LOGIC (Hamburger & Scroll Lock) — UPDATED
// ==================================================
// Toggle Menu
if(hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
        const isCurrentlyOpen = navLinks.classList.contains('active');
        
        if (!isCurrentlyOpen) {
            // OPENING MENU
            navLinks.classList.add('active');
            document.body.classList.add('menu-open');
            lockScroll(); /* Lock background scroll — NEW */
            pushModalState('menu'); /* Push back button state — NEW */
            
            // Toggle Hamburger Icon (Bars → Times)
            const icon = hamburgerBtn.querySelector('i');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            // CLOSING MENU
            closeHamburgerMenu();
        }
    });
}

// Close Menu when a Link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if(navLinks.classList.contains('active')) {
            closeHamburgerMenu();
        }
    });
});

// Close Menu when CTA is clicked
if(navCta) {
    navCta.addEventListener('click', () => {
        if(navLinks.classList.contains('active')) {
            closeHamburgerMenu();
        }
    });
}

// ==================================================
// Unified form submit handler (sends to Google Apps Script)
// ==================================================
async function handleFormSubmit(event, formType = 'Form', userType = 'Inquiry') {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : null;
    
    // UI: Show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';
    }

    // SPECIAL LOGIC: Callback User Type
    if (formType === 'CallbackForm') {
        const selectedRadio = event.target.querySelector('input[name="callbackUserType"]:checked');
        if (selectedRadio) userType = selectedRadio.value;
        console.log("📞 Callback User Type Selected:", userType);
    }

    // Data collection
    const fd = new FormData(form);
    const payload = {};
    fd.forEach((value, key) => {
        if (payload.hasOwnProperty(key)) {
            if (!Array.isArray(payload[key])) payload[key] = [payload[key]];
            payload[key].push(value);
        } else {
            payload[key] = value;
        }
    });

    payload.source = 'Website';
    payload.user_type = userType;
    payload.form_type = formType;

    // Normalize name key
    if (payload.parentName) { payload.name = payload.parentName; delete payload.parentName; }
    if (payload.teacherName) { payload.name = payload.teacherName; delete payload.teacherName; }

    // Handle "All Subjects" toggle: if selected, keep only "All Subjects" and remove individual subjects
    if (payload.allSubjects && payload.subjects) {
        // If "All Subjects" is checked, replace subjects array with just ["All Subjects"]
        if (Array.isArray(payload.subjects)) {
            payload.subjects = ['All Subjects'];
        } else {
            payload.subjects = ['All Subjects'];
        }
        delete payload.allSubjects; // Remove the allSubjects field from payload
    } else if (payload.allSubjects) {
        // If only allSubjects is set (no individual subjects selected, which shouldn't happen)
        delete payload.allSubjects;
    }

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // SUCCESS: Reset form
        form.reset();

        // UI UPDATES BASED ON FORM TYPE
        if (formType === 'TeacherForm' || userType === 'Teacher') {
            // Teacher Logic: Show transition screen
            if (form) form.style.display = 'none';
            const paymentIntro = document.getElementById('teacherPaymentIntro');
            if (paymentIntro) paymentIntro.style.display = 'none';
            const paymentSection = document.getElementById('paymentSection');
            if (paymentSection) paymentSection.style.display = 'none';
            
            const trans = document.getElementById('teacherTransition');
            if (trans) trans.style.display = 'block';

        } else if (formType === 'ParentForm') {
            // Parent Logic: Hide form, show success
            const pForm = document.getElementById('parentForm');
            const pSuccess = document.getElementById('parentSuccess');
            if (pForm) pForm.style.display = 'none';
            if (pSuccess) pSuccess.style.display = 'block';

        } else if (formType === 'CallbackForm') {
            // Callback Logic: Hide header + form wrapper, show success
            const mainContent = document.getElementById('callbackMainContent');
            if (mainContent) mainContent.style.display = 'none'; 

            // Show success message
            const cSuccess = document.getElementById('callbackSuccess');
            if (cSuccess) cSuccess.style.display = 'block';
            
        } else {
            // Fallback (Generic Close)
            alert('Thank you! We will contact you soon.');
            const modalRoot = form.closest('.modal');
            if (modalRoot) modalRoot.style.display = 'none';
            unlockScroll();
            popModalState();
        }

    } catch (err) {
        console.error('Form submit error:', err);
        alert('Something went wrong. Please try again.');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }
}

// --------------------------------------------------
// Replace existing submit handlers with unified handler
// --------------------------------------------------

// Parent Form wiring
if (parentForm) {
    parentForm.onsubmit = null;
    parentForm.addEventListener('submit', (e) => handleFormSubmit(e, 'ParentForm', 'Parent'));
}

// Teacher Form wiring
if (teacherForm) {
    teacherForm.onsubmit = null;
    teacherForm.addEventListener('submit', (e) => handleFormSubmit(e, 'TeacherForm', 'Teacher'));
}

// "All Subjects" is an independent option for generalist teachers.
// No auto-selection logic needed — it works like any other checkbox.

// Callback Form wiring (defaults to Inquiry)
if (callbackForm) {
    callbackForm.onsubmit = null;
    callbackForm.addEventListener('submit', (e) => handleFormSubmit(e, 'CallbackForm', 'Inquiry'));
}

// ==================================================
// Smart URL param handling: open modals via ?open=parent|teacher|callback
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
    // Check URL parameters to auto-open forms
    // Supports both hash-based (#parent-form, #teacher-form) and query params (?open=parent)
    
    let formToOpen = null;
    
    // First check hash-based URLs (cleaner for sharing on WhatsApp)
    if (window.location.hash === '#parent-form') {
        formToOpen = 'parent';
    } else if (window.location.hash === '#teacher-form') {
        formToOpen = 'teacher';
    } else {
        // Fall back to query parameters (?open=parent, ?open=teacher)
        const params = new URLSearchParams(window.location.search);
        const open = params.get('open');
        if (open === 'parent' || open === 'teacher' || open === 'callback') {
            formToOpen = open;
        }
    }
    
    // Auto-open the form if a valid parameter was found
    if (formToOpen === 'parent') {
        openParentForm();
    } else if (formToOpen === 'teacher') {
        openTeacherForm();
    } else if (formToOpen === 'callback') {
        openCallbackForm();
    }
});

function doPost(e) {
  var lock = LockService.getScriptLock();
  var lockAcquired = false;
  
  try {
    lockAcquired = lock.tryLock(10000);

    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName('MASTER_DATA');

    // approvedHeaders is used ONLY for first-time sheet creation (fallback default).
    // After creation, mapping relies entirely on live sheet headers from row 1.
    var approvedHeaders = [
      'Timestamp', 'Source', 'User_Type', 'Name', 'Phone', 'City', 'Zone', 'Locality', 'Pincode',
      'Gender_Info', 'Qualification', 'Experience', 'Subject', 'Class', 'Board', 'Status', 'Full_JSON_Data'
    ];

    // Create sheet with approved headers if it doesn't exist
    if (!sheet) {
      sheet = doc.insertSheet('MASTER_DATA');
      sheet.appendRow(approvedHeaders);
    }

    // Parse incoming payload
    var requestBody = e.postData.contents;
    var data = JSON.parse(requestBody);

    // Read headers dynamically from row 1 (case-sensitive)
    var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var headerMap = {}; // Maps header name to column index (0-based)
    for (var i = 0; i < headerRow.length; i++) {
      headerMap[headerRow[i]] = i;
    }

    // Create new row array with same length as current headers
    var newRow = new Array(headerRow.length);

    // Helper: Set value in row by header name (case-sensitive, exact match)
    function setRowValueByHeader(headerName, value) {
      if (headerName in headerMap) {
        newRow[headerMap[headerName]] = (value !== undefined && value !== null) ? value : '';
      }
    }

    // ========== SERVER-SIDE TIMESTAMP ==========
    setRowValueByHeader('Timestamp', new Date());

    // ========== SOURCE ==========
    setRowValueByHeader('Source', data.source || 'Web');

    // ========== USER_TYPE NORMALIZATION (CRITICAL BUSINESS RULE) ==========
    // If form_type is "CallbackForm", override user_type with Callback_Parent or Callback_Teacher
    var userType = data.user_type || '';
    if (data.form_type === 'CallbackForm' && data.callbackUserType) {
      if (data.callbackUserType === 'Parent') {
        userType = 'Callback_Parent';
      } else if (data.callbackUserType === 'Teacher') {
        userType = 'Callback_Teacher';
      }
    }
    setRowValueByHeader('User_Type', userType);

    // ========== NAME NORMALIZATION ==========
    // Try multiple sources in order of priority
    var finalName = data.name || data.teacherName || data.parentName || '';
    setRowValueByHeader('Name', finalName);

    // ========== FIELD MAPPINGS (payload field → sheet header) ==========
    // Maps single-value fields only; arrays are left blank and stored in Full_JSON_Data.
    // Note: 'class' (scalar, ParentForm) is mapped to Class header; 'classes' (array, TeacherForm) is intentionally skipped.
    var fieldMappings = {
      'phone': 'Phone',
      'city': 'City',
      'zone': 'Zone',
      'locality': 'Locality',
      'pincode': 'Pincode',
      'gender': 'Gender_Info',
      'qualification': 'Qualification',
      'experience': 'Experience',
      'board': 'Board',
      'class': 'Class'
    };

    // Apply field mappings (case-sensitive)
    for (var payloadField in fieldMappings) {
      if (payloadField in data) {
        var headerName = fieldMappings[payloadField];
        var value = data[payloadField];
        
        // Skip arrays; they are included in Full_JSON_Data only
        if (Array.isArray(value)) {
          continue;
        }
        
        setRowValueByHeader(headerName, value);
      }
    }

    // ========== STATUS (SERVER-SIDE DEFAULT) ==========
    setRowValueByHeader('Status', 'New');

    // ========== FULL_JSON_DATA (COMPLETE RAW PAYLOAD) ==========
    // Stores entire payload as stringified JSON, including arrays, metadata, and all fields
    setRowValueByHeader('Full_JSON_Data', JSON.stringify(data));

    // Append the row to the sheet
    sheet.appendRow(newRow);
    SpreadsheetApp.flush();
    
    if (lockAcquired) {
      lock.releaseLock();
    }

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    if (lockAcquired) {
      lock.releaseLock();
    }
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}