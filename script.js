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

function preloadImages() {

  const images =
    document.querySelectorAll("img");

  const promises = [];

  images.forEach(img => {

    if (!img.src) return;

    promises.push(
      new Promise(resolve => {

        if (img.complete) {
          resolve();
          return;
        }

        img.addEventListener(
          "load",
          resolve,
          { once: true }
        );

        img.addEventListener(
          "error",
          resolve,
          { once: true }
        );

      })
    );

  });

  return Promise.all(promises);
}

window.addEventListener("load", async () => {

  await preloadImages();

  const loadingScreen =
    document.getElementById("loading-screen");

  const items =
    document.querySelectorAll(".parallax-item");


  /* Start elements one after another */

  items.forEach((item, index) => {

    item.style.setProperty(
      "--enter-delay",
      `${index * 0.12}s`
    );

    item.classList.add("enter");

  });


  /* Fade out loading screen */

  setTimeout(() => {

    loadingScreen.classList.add("loaded");

  }, 250);

});

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

/*this */
const hairFill =
    document.querySelector(".hair-fill-color");


function setLoadingProgress(percent) {

    hairFill.style.height =
        `${percent}%`;

}
let loaded = 0;
let total = 0;

function updateLoading() {

    const percent =
        Math.round((loaded / total) * 100);

    setLoadingProgress(percent);

}

const images =
    document.querySelectorAll("img");

total = images.length;

images.forEach(img => {

    if (img.complete) {

        loaded++;
        updateLoading();

    } else {

        img.addEventListener("load", () => {

            loaded++;
            updateLoading();

        });

        img.addEventListener("error", () => {

            loaded++;
            updateLoading();

        });

    }

});

window.addEventListener("load", () => {

    setLoadingProgress(100);

    setTimeout(() => {

        document
            .getElementById("loading-screen")
            .classList.add("loaded");

    }, 500);

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