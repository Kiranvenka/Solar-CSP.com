const loader = document.querySelector(".loader");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const progress = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");
const counters = document.querySelectorAll("[data-count]");
let countersStarted = false;

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 450);
});

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("solar-theme", isDark ? "dark" : "light");
  themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
});

if (localStorage.getItem("solar-theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

function animateCounters() {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    const suffix = target === 95 ? "%" : target >= 1000 ? "+" : "";
    const duration = 1400;
    const start = performance.now();

    function update(now) {
      const progressValue = Math.min((now - start) / duration, 1);
      const value = Math.floor(progressValue * target);
      counter.textContent = `${value}${suffix}`;
      if (progressValue < 1) requestAnimationFrame(update);
      else counter.textContent = `${target}${suffix}`;
    }

    requestAnimationFrame(update);
  });
}

const statObserver = new IntersectionObserver((entries) => {
  if (entries.some((entry) => entry.isIntersecting) && !countersStarted) {
    countersStarted = true;
    animateCounters();
  }
}, { threshold: 0.2 });

document.querySelectorAll(".stats-grid").forEach((grid) => statObserver.observe(grid));

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progress.style.width = `${(scrollTop / height) * 100}%`;
  backToTop.classList.toggle("show", scrollTop > 500);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const alreadyOpen = button.classList.contains("active");
    document.querySelectorAll(".faq-question").forEach((item) => {
      item.classList.remove("active");
      item.querySelector("i").className = "fa-solid fa-plus";
    });
    if (!alreadyOpen) {
      button.classList.add("active");
      button.querySelector("i").className = "fa-solid fa-minus";
    }
  });
});

const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector("img");
const lightboxTitle = lightbox.querySelector("h3");
const lightboxDesc = lightbox.querySelector(".lightbox-desc");
const lightboxBenefits = lightbox.querySelector(".lightbox-benefits");
const lightboxApps = lightbox.querySelector(".lightbox-apps");

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImg.src = item.dataset.img;
    lightboxImg.alt = item.dataset.title;
    lightboxTitle.textContent = item.dataset.title;
    lightboxDesc.textContent = item.dataset.desc;
    lightboxBenefits.textContent = item.dataset.benefits;
    lightboxApps.textContent = item.dataset.apps;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
});
