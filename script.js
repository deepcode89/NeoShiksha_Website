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
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbylG9MdHEZkTBXaMKO03Bts-EJfcDSLm-c8AUnev8O4Ii7T8SE57b_c5D9v-eLiBKeV0Q/exec';

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
        
        // Reset Header
        const header = document.getElementById("teacherModalHeader");
        if(header) header.innerHTML = '<h2 style="text-align: center; margin-bottom: 10px;">Join <span class="text-accent">Neo Shiksha</span></h2><p style="text-align: center; color: #aaa; font-size: 0.9rem; margin-bottom: 20px;">Fill the form below to start your verification process.</p>';
    }
}

// Open Callback Form
function openCallbackForm() {
    if(callbackModal) {
        callbackModal.style.display = "block";
        lockScroll(); /* Lock background scroll */
        pushModalState('callback'); /* Push back button state */
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
    
    // Update Header
    if(teacherModalHeader) {
        teacherModalHeader.innerHTML = '<h2 style="text-align: center; color: var(--accent-color);">Scan & Verify</h2>';
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
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-item'); // All links inside nav
const navCta = document.querySelector('.btn-nav-cta'); // CTA button

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
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';
    }

    // collect form data (multi-value keys become arrays)
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

    // STANDARDIZE 'name' KEY FOR BACKEND
    // Priority: parentName -> teacherName -> name
    (function normalizeNameKey(obj) {
        const candidates = ['parentName', 'teacherName', 'name'];
        for (const k of candidates) {
            if (obj[k]) {
                obj.name = obj[k];
                break;
            }
        }
        // remove redundant keys if present
        if (obj.parentName) delete obj.parentName;
        if (obj.teacherName) delete obj.teacherName;
    })(payload);

    try {
        // Google Apps Script often requires mode:'no-cors' for simple POSTs from static pages.
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Treat as success (no-cors responses are opaque)
        form.reset();

        // Close parent modal if inside one
        const modalRoot = form.closest('.modal');
        if (modalRoot) modalRoot.style.display = 'none';
        unlockScroll();
        popModalState();

        alert('Thank you! We will contact you soon.');
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
    // remove any inline/older handlers (safe guard)
    parentForm.onsubmit = null;
    parentForm.addEventListener('submit', (e) => handleFormSubmit(e, 'ParentForm', 'Parent'));
}

// Teacher Form wiring
if (teacherForm) {
    teacherForm.onsubmit = null;
    teacherForm.addEventListener('submit', (e) => handleFormSubmit(e, 'TeacherForm', 'Teacher'));
}

// Callback Form wiring (defaults to Inquiry)
if (callbackForm) {
    callbackForm.onsubmit = null;
    callbackForm.addEventListener('submit', (e) => handleFormSubmit(e, 'CallbackForm', 'Inquiry'));
}

// ==================================================
// Smart URL param handling: open modals via ?open=parent|teacher|callback
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const open = params.get('open');
    if (open === 'parent') {
        openParentForm(); // [`openParentForm`](script.js)
    } else if (open === 'teacher') {
        openTeacherForm(); // [`openTeacherForm`](script.js)
    } else if (open === 'callback') {
        openCallbackForm(); // [`openCallbackForm`](script.js)
    }
});