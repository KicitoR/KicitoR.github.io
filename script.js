const items = document.querySelectorAll(".parallax-item");
const screenEffects = document.querySelectorAll(".screen-effect");


/* def */

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


/*screen eff*/

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


/*scrolly*/

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

/*anim*/

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
const floatingNav = document.getElementById("floatingNav");

let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener("scroll", () => {
    if (ticking) return;

    ticking = true;

    requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDifference = currentScrollY - lastScrollY;

        // Always show the navbar near the top
        if (currentScrollY < 80) {
            floatingNav.classList.remove("nav-hidden");
        }
        // Hide when scrolling down
        else if (scrollDifference > 5) {
            floatingNav.classList.add("nav-hidden");
        }
        // Show when scrolling up
        else if (scrollDifference < -5) {
            floatingNav.classList.remove("nav-hidden");
        }

        lastScrollY = currentScrollY;
        ticking = false;
    });
});
window.addEventListener("load", () => {

    setLoadingProgress(100);

    setTimeout(() => {

        document
            .getElementById("loading-screen")
            .classList.add("loaded");

    }, 500);

});

  /*screen effect rev*/

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
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        const targetPage = link.dataset.page;

        pages.forEach(page => {
            page.classList.remove("active");
        });

        navLinks.forEach(nav => {
            nav.classList.remove("active");
        });

        document.getElementById(targetPage).classList.add("active");
        link.classList.add("active");
    });
});
function updateClock() {
    const now = new Date();

    const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(now);

    const date = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Jakarta",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(now);

    document.getElementById("clockTime").textContent = time;
    document.getElementById("clockDate").textContent = date;
}

const homeMenu = document.querySelector(".home-menu");
const homeMenuToggle = document.getElementById("homeMenuToggle");
const homeDropdown = document.getElementById("homeDropdown");

homeMenuToggle.addEventListener("click", () => {
    const isOpen = homeMenu.classList.toggle("is-open");

    homeMenuToggle.setAttribute("aria-expanded", isOpen);
    homeMenuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close home menu" : "Open home menu"
    );
});
document.addEventListener("click", (event) => {
    if (!homeMenu.contains(event.target)) {
        closeHomeMenu();
    }
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeHomeMenu();
    }
});
function closeHomeMenu() {
    homeMenu.classList.remove("is-open");
    homeMenuToggle.setAttribute("aria-expanded", "false");
    homeMenuToggle.setAttribute("aria-label", "Open home menu");
}
homeDropdown.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
        const pageId = button.dataset.page;
        const targetPage = document.getElementById(pageId);

        if (!targetPage) return;

        document.querySelectorAll(".page").forEach(page => {
            page.classList.remove("active");
        });

        targetPage.classList.add("active");

        // Update your regular navigation links, if present
        document.querySelectorAll(".nav-link").forEach(link => {
            link.classList.toggle(
                "active",
                link.dataset.page === pageId
            );
        });

        closeHomeMenu();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
/*photo*/
const photoCard = document.querySelector(".photo-card");
const photoWrap = document.querySelector(".photo-planet-wrap");

if (photoCard && photoWrap) {
    function moveCard(x, y) {
        const rect = photoWrap.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateY = ((x - centerX) / rect.width) * 8;
        const rotateX = -((y - centerY) / rect.height) * 8;

        photoCard.style.transform =
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    window.addEventListener("mousemove", (e) => {
        moveCard(e.clientX, e.clientY);
    });

    window.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        moveCard(touch.clientX, touch.clientY);
    }, { passive: true });

    window.addEventListener("mouseleave", () => {
        photoCard.style.transform =
            "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
}
/*document.querySelectorAll(".gallery-card").forEach(card => {

    const layers = card.querySelectorAll(".parallax-layer");

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 24;
        const rotateX = (0.5 - y) * 24;

        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;

        layers.forEach(layer => {

            const depth = Number(layer.dataset.depth) || 0;

            const moveX = (x - 0.5) * depth;
            const moveY = (y - 0.5) * depth;

            layer.style.transform = `
                translate3d(
                    ${moveX}px,
                    ${moveY}px,
                    ${depth}px
                )
            `;

        });

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
        `;

        layers.forEach(layer => {
            layer.style.transform = "translate3d(0, 0, 0)";
        });

    });

}); */
const cards = document.querySelectorAll(".gallery-card");
let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", e => {

    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;

});

cards.forEach(card => {

    const layers = card.querySelectorAll(".parallax-layer");

    function updateParallax() {

        const rect = card.getBoundingClientRect();

        // Mouse position relative to the card center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = (mouseX * window.innerWidth - centerX) / window.innerWidth;
        const y = (mouseY * window.innerHeight - centerY) / window.innerHeight;
        card.style.transform = `
            perspective(1000px)
            rotateX(${-y * 20}deg)
            rotateY(${x * 20}deg)
        `;
        layers.forEach(layer => {

            const depth = Number(layer.dataset.depth) || 0;
            const rotation = Number(layer.dataset.rotate) || 0;

            const moveX = x * depth;
            const moveY = y * depth;

            layer.style.transform = `
                translate3d(${moveX}px, ${moveY}px, ${depth}px)
                rotateX(${-y * rotation}deg)
                rotateY(${x * rotation}deg)
            `;

        });

    }
    function animate() {
        updateParallax();
        requestAnimationFrame(animate);
    }

    animate();

});
document.querySelectorAll("[img-aspect]").forEach(img => {
    img.style.aspectRatio = img.getAttribute("img-aspect");
});
/*exper*/
