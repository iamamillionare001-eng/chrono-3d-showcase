import '../styles/main.css';
import { switchMaterial } from './scene3d.js';
import './animations.js';

document.addEventListener('DOMContentLoaded', () => {
    const openModalButtons = document.querySelectorAll('[data-modal-open]');
    const closeModalButtons = document.querySelectorAll('.close');
    const modals = document.querySelectorAll('.modal');

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-open');
            const target = document.getElementById(modalId);
            if (target) target.style.display = 'block';
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    });

    const switchButtons = document.querySelectorAll('.switch-btn');
    switchButtons.forEach(button => {
        button.addEventListener('click', function () {
            switchButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const materialType = this.getAttribute('data-material');
            switchMaterial(materialType);
        });
    });

    const preorderForm = document.getElementById('preorder-form');
    if (preorderForm) {
        preorderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Reservation received. Our concierge will contact you shortly.');
            preorderForm.reset();
            const modal = preorderForm.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    }
});