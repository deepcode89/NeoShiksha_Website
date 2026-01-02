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

// ==================================================
// 2. OPEN/CLOSE FUNCTIONS
// ==================================================

// Open Parent Form
function openParentForm() {
    if(parentModal) {
        parentModal.style.display = "block";
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
    if(callbackModal) callbackModal.style.display = "block";
}

// Close Callback Form
function closeCallbackForm() {
    if(callbackModal) callbackModal.style.display = "none";
}

// Close Logic (Clicking X)
if(closeParent) {
    closeParent.onclick = function() { parentModal.style.display = "none"; }
}
if(closeTeacher) {
    closeTeacher.onclick = function() { teacherModal.style.display = "none"; }
}

// Window Click (Outside Click to Close)
window.onclick = function(event) {
    if (event.target == parentModal) parentModal.style.display = "none";
    if (event.target == teacherModal) teacherModal.style.display = "none";
    if (event.target == callbackModal) callbackModal.style.display = "none";
}

// ==================================================
// 3. DYNAMIC ZONE LOGIC (For Both Forms)
// ==================================================
const zoneData = {
    "Delhi": ["East Delhi", "West Delhi", "North Delhi", "South Delhi", "Central Delhi"],
    "Tricity": ["Chandigarh", "Mohali", "Panchkula"]
};

// Parent Form Zone Logic
const parentCitySelect = document.getElementById('parentCitySelect');
const parentZoneSelect = document.getElementById('parentZoneSelect');

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
const teacherCitySelect = document.getElementById('teacherCitySelect');
const teacherZoneSelect = document.getElementById('teacherZoneSelect');

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
// 4. FORM SUBMISSION LOGIC (Ye missing tha)
// ==================================================

// --- A. Parent Form Submit (Show Social Links) ---
const parentForm = document.getElementById('parentForm');
const parentSuccess = document.getElementById('parentSuccess');

if(parentForm) {
    parentForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Page refresh hone se rokega
        
        // Hide Form
        parentForm.style.display = 'none';
        
        // Show Success Box
        if(parentSuccess) parentSuccess.style.display = 'block';
        
        // Scroll to top
        const modalContent = document.querySelector('#parentModal .modal-content');
        if(modalContent) modalContent.scrollTop = 0;
    });
}

// --- B. Teacher Form Submit (Show Payment Intro) ---
const teacherForm = document.getElementById('teacherForm');
const teacherPaymentIntro = document.getElementById('teacherPaymentIntro');
const teacherModalHeader = document.getElementById('teacherModalHeader');

if(teacherForm) {
    teacherForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Page refresh hone se rokega
        
        // Hide Form
        teacherForm.style.display = 'none';
        
        // Show Comfort Screen
        if(teacherPaymentIntro) teacherPaymentIntro.style.display = 'block';
        
        // Update Header
        if(teacherModalHeader) {
            teacherModalHeader.innerHTML = '<h2 style="text-align: center; color: var(--accent-color);">Almost There!</h2>';
        }
        
        // Scroll to top
        const modalContent = document.querySelector('#teacherModal .modal-content');
        if(modalContent) modalContent.scrollTop = 0;
    });
}

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
// 8. MOBILE NAVBAR LOGIC (Hamburger & Scroll Lock)
// ==================================================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-item'); // All links inside nav
const navCta = document.querySelector('.btn-nav-cta'); // CTA button

// Toggle Menu
if(hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Toggle Hamburger Icon (Bars <-> Times)
        const icon = hamburgerBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.classList.add('menu-open'); // Lock Scroll
        } else {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            document.body.classList.remove('menu-open'); // Unlock Scroll
        }
    });
}

// Close Menu when a Link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if(navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Reset Icon
            const icon = hamburgerBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
});

// Close Menu when CTA is clicked
if(navCta) {
    navCta.addEventListener('click', () => {
        if(navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
             // Reset Icon
            const icon = hamburgerBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
}