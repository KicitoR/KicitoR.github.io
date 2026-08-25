const items = document.querySelectorAll(".parallax-item");
const screenEffects = document.querySelectorAll(".screen-effect");


/* ================================
   NORMAL CONTENT
   ================================ */

const layers = [];

items.forEach(item => {

  layers.push({
    element: item,

    strength: parseFloat(
      item.dataset.strength || 0.1
    ),

    current: 0,
    target: 0,
    velocity: 0
  });

});


/* ================================
   SCREEN EFFECTS
   ================================ */

const effects = [];

screenEffects.forEach(effect => {

  effects.push({
    element: effect,

    strength: parseFloat(
      effect.dataset.strength || 0.1
    ),

    current: 0,
    target: 0,
    velocity: 0
  });

});


/* ================================
   SCROLL
   ================================ */

let lastScroll = window.scrollY;

window.addEventListener("scroll", () => {

  const currentScroll = window.scrollY;

  const delta =
    currentScroll - lastScroll;


  /* Normal website elements */

  layers.forEach(layer => {

    layer.target +=
      delta * layer.strength;

  });


  /* Full-screen effects */

  effects.forEach(effect => {

    effect.target +=
      delta * effect.strength;

  });


  lastScroll = currentScroll;

}, { passive: true });


/* ================================
   ANIMATION
   ================================ */

function animate() {


  /* Website elements */

  layers.forEach(layer => {

    const force =
      layer.target - layer.current;

    layer.velocity +=
      force * 0.08;

    layer.velocity *= 0.82;

    layer.current +=
      layer.velocity;

    layer.element.style.transform =
      `translateY(${layer.current}px)`;

  });


  /* Screen effects */

  effects.forEach(effect => {

    const force =
      effect.target - effect.current;

    effect.velocity +=
      force * 0.08;

    effect.velocity *= 0.82;

    effect.current +=
      effect.velocity;

    effect.element.style.transform =
      `translate(-50%, calc(-50% + ${effect.current}px))`;

  });


  requestAnimationFrame(animate);

}


animate();