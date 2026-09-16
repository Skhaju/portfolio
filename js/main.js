document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Workstation 3D tilt
  const workstation = document.querySelector(".workstation");
  const core = document.getElementById("ws-core");

  if (workstation && core) {
    workstation.addEventListener("pointermove", (e) => {
      const r = workstation.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      core.style.transform = `rotateY(${x * 13}deg) rotateX(${-y * 10}deg)`;
    });

    workstation.addEventListener("pointerleave", () => {
      core.style.transform = "rotateY(0) rotateX(0)";
    });
  }

  // Project cards tilt
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-5px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  // Animated counters
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".counter").forEach((el) => {
          const goal = +el.dataset.target;
          let n = 0;
          const tick = () => {
            n = Math.min(goal, n + Math.ceil(goal / 24));
            el.textContent = n + "+";
            if (n < goal) requestAnimationFrame(tick);
          };
          tick();
        });
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  const statGrid = document.querySelector(".stat-grid");
  if (statGrid) counterObserver.observe(statGrid);

  // Design filters
  document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      document.querySelectorAll(".design-item").forEach((item) => {
        item.style.display =
          filter === "all" || item.dataset.category.includes(filter) ? "block" : "none";
      });
    });
  });

  // Modal viewer
  const modal = document.getElementById("viewer");
  const viewerImage = document.getElementById("viewer-image");

  function openViewer(title, type, img) {
    document.getElementById("viewer-title").textContent = title;
    document.getElementById("viewer-type").textContent = type;
    viewerImage.src = img || "";
    viewerImage.alt = title;
    modal.classList.add("open");
  }

  document.querySelectorAll(".design-item").forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      openViewer(item.dataset.name, item.dataset.type, img ? img.src : "");
    });
  });

  document.querySelectorAll(".video").forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      openViewer(item.dataset.video, "MOTION / VISUAL STORYTELLING", img ? img.src : "");
    });
  });

  const closeBtn = document.getElementById("close-viewer");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal) modal.classList.remove("open");
  });
});
