document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector("[data-burger]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const isHidden = mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden", !isHidden);
      mobileMenu.classList.toggle("flex", isHidden);
    });
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");
      });
    });
  }

  const WEBHOOK_URL = "https://samparke.app.n8n.cloud/webhook/dirt-punch-quote";

  document.querySelectorAll("[data-booking-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const card = form.closest(".float-card");
      const success = card ? card.querySelector("[data-form-success]") : null;
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : "";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then((res) => {
          if (!res.ok) throw new Error("Webhook responded with " + res.status);
          form.style.display = "none";
          if (success) success.classList.add("show");
        })
        .catch((err) => {
          console.error("Quote form submission failed:", err);
          alert("Something went wrong sending your request. Please try again or call us directly.");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        });
    });
  });
});
