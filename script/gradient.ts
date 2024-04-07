const targetColors = [
    "#101004",
    "#401010",
    "#104010",
    "#101040",
    "#041010",
    "#100410",
];
const cycleTime = 5_000; // ms

// TODO: This is AI generated, I should probably make my own
window.onload = () => {
  const targetElement = document.getElementById("gradient");

  if (!targetElement) return;

  function tick() {
    const now = Date.now();
    const cycle = Math.floor(now / cycleTime) % targetColors.length;
    const cycleProgress = (now % cycleTime) / cycleTime;

    const startColor = targetColors[cycle];
    const endColor = targetColors[(cycle + 1) % targetColors.length];

    const r1 = parseInt(startColor.substring(1, 3), 16);
    const g1 = parseInt(startColor.substring(3, 5), 16);
    const b1 = parseInt(startColor.substring(5, 7), 16);

    const r2 = parseInt(endColor.substring(1, 3), 16);
    const g2 = parseInt(endColor.substring(3, 5), 16);
    const b2 = parseInt(endColor.substring(5, 7), 16);

    const r = Math.floor(r1 + (r2 - r1) * cycleProgress);
    const g = Math.floor(g1 + (g2 - g1) * cycleProgress);
    const b = Math.floor(b1 + (b2 - b1) * cycleProgress);

    targetElement!.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
};
