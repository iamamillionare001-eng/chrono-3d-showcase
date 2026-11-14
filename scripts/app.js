// Main application logic for the luxury product showcase website

// Initialize scene when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle modal functionality
    const openModalButtons = document.querySelectorAll('[data-modal-open]');
    const closeModalButtons = document.querySelectorAll('.close');
    const modals = document.querySelectorAll('.modal');
    
    // Open modal
    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-open');
            document.getElementById(modalId).style.display = 'block';
        });
    });
    
    // Close modal
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside of content
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Handle material switcher
    const switchButtons = document.querySelectorAll('.switch-btn');
    switchButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            switchButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get material type
            const materialType = this.textContent.trim();
            
            // Here you would typically update the 3D model or content based on material selection
            console.log(`Material switched to: ${materialType}`);
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const preorderForm = document.getElementById('preorder-form');
    
    if (preorderForm) {
        preorderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(preorderForm);
            const userData = {};
            
            for (let [key, value] of formData.entries()) {
                userData[key] = value;
            }
            
            // In a real application, you would send this data to a server
            console.log('Pre-order form submitted:', userData);
            
            // Show success message or handle submission
            alert('Thank you for your interest! We will contact you soon.');
            
            // Reset form
            preorderForm.reset();
        });
    }
});