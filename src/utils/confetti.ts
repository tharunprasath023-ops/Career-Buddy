import confetti from 'canvas-confetti';

export function triggerCelebration() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#4f46e5', '#7c3aed', '#2563eb', '#38bdf8'],
    });
  } catch {
    // Graceful fallback if canvas is restricted
  }
}
