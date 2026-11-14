// GSAP Animations for scroll-triggered effects
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animate hero section on page load
gsap.from('.hero-title', {
    duration: 1.5,
    y: 50,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.5
});

gsap.from('.hero-subtitle', {
    duration: 1.5,
    y: 30,
    opacity: 0,
    ease: 'power3.out',
    delay: 1
});

gsap.from('.cta-button', {
    duration: 1,
    y: 20,
    opacity: 0,
    ease: 'power3.out',
    delay: 1.5
});

// Animate feature chapters on scroll
const featureChapters = document.querySelectorAll('.feature-chapter');
featureChapters.forEach((chapter, index) => {
    gsap.from(chapter, {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: chapter,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Animate material switcher on scroll
gsap.from('.material-switcher', {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.5,
    scrollTrigger: {
        trigger: '.features-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    }
});