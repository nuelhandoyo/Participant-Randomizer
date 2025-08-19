import { Participant } from '../types';

export function getRandomParticipant(participants: Participant[]): Participant | null {
  const unselectedParticipants = participants.filter(p => !p.selected);
  if (unselectedParticipants.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * unselectedParticipants.length);
  return unselectedParticipants[randomIndex];
}

export function createParticleEffect(element: HTMLElement) {
  const particles = 20;
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < particles; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: linear-gradient(45deg, #00D4FF, #8B5FFF);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleFloat ${2 + Math.random() * 3}s infinite ease-in-out;
    `;
    fragment.appendChild(particle);
  }
  
  element.appendChild(fragment);
  
  // Clean up particles after animation
  setTimeout(() => {
    const particles = element.querySelectorAll('.particle');
    particles.forEach(particle => particle.remove());
  }, 5000);
}