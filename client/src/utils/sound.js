let enabled = true;

function createTone(frequency, duration = 0.09, type = "sine") {
  if (!enabled || typeof window === "undefined") {
    return;
  }

  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gainNode.gain.value = 0.035;

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  oscillator.stop(context.currentTime + duration);
}

export const sound = {
  toggle() {
    enabled = !enabled;
    return enabled;
  },
  isEnabled() {
    return enabled;
  },
  success() {
    createTone(620, 0.12, "triangle");
  },
  error() {
    createTone(210, 0.18, "sawtooth");
  },
  click() {
    createTone(420, 0.06, "square");
  }
};
