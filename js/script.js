document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation Toggle
  const navToggle = document.querySelector(".nav-toggle, .menu-toggle, #menu-btn");
  const navMenu = document.querySelector("nav ul, .nav-links, #nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      navMenu.classList.toggle("active");
    });
  }

  // 2. Dynamic Programme / Service Filter (for programmes.html or index.html)
  const filterButtons = document.querySelectorAll("[data-filter]");
  const filterCards = document.querySelectorAll("[data-category]");

  if (filterButtons.length > 0 && filterCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const category = btn.getAttribute("data-filter");
        filterCards.forEach((card) => {
          if (category === "all" || card.getAttribute("data-category") === category) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // 3. Interactive FAQ Accordion
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      question.classList.toggle("open");
      if (answer) {
        answer.style.display = answer.style.display === "block" ? "none" : "block";
      }
    });
  });

  // 4. Sticky Header Shadow & Back-to-Top Button
  const header = document.querySelector("header");
  const topBtn = document.createElement("button");
  topBtn.id = "backToTop";
  topBtn.textContent = "↑ Top";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.style.cssText =
    "display:none;position:fixed;bottom:24px;right:24px;padding:10px 14px;background:#0F4C5C;color:#fff;border:none;border-radius:6px;cursor:pointer;z-index:999;";
  document.body.appendChild(topBtn);

  window.addEventListener("scroll", () => {
    if (header) {
      header.style.boxShadow = window.scrollY > 40 ? "0 2px 10px rgba(0,0,0,0.12)" : "none";
    }
    topBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 5. Client-Side Validation for All Forms (enquiry.html & contact.html)
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.setAttribute("novalidate", true);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous error messages
      form.querySelectorAll(".error-msg").forEach((el) => el.remove());

      const showError = (input, message) => {
        isValid = false;
        input.style.borderColor = "#d90429";
        const err = document.createElement("small");
        err.className = "error-msg";
        err.style.cssText = "color:#d90429;display:block;margin-top:4px;font-size:0.85rem;";
        err.textContent = message;
        input.insertAdjacentElement("afterend", err);
      };

      const inputs = form.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        input.style.borderColor = "";
        const val = input.value.trim();
        const type = input.type;
        const name = (input.name || input.id || "").toLowerCase();

        if (input.hasAttribute("required") && !val) {
          showError(input, "This field is required.");
          return;
        }

        if (val && (type === "email" || name.includes("email"))) {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(val)) {
            showError(input, "Please enter a valid email address (e.g., name@example.co.za).");
          }
        }

        if (val && (type === "tel" || name.includes("phone") || name.includes("tel"))) {
          const saPhoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
          const cleanPhone = val.replace(/\s+/g, "");
          if (!saPhoneRegex.test(cleanPhone)) {
            showError(input, "Enter a valid 10-digit South African phone number (e.g., 0821234567).");
          }
        }

        if (val && input.tagName === "TEXTAREA" && val.length < 15) {
          showError(input, "Please provide at least 15 characters so we can assist you properly.");
        }
      });

      if (isValid) {
        let successBox = form.querySelector(".form-success");
        if (!successBox) {
          successBox = document.createElement("div");
          successBox.className = "form-success";
          successBox.style.cssText =
            "margin-top:14px;padding:12px 16px;background:#e6f4ea;color:#137333;border-left:4px solid #137333;border-radius:4px;";
          form.appendChild(successBox);
        }
        successBox.textContent =
          "Thank you! Your submission to HealthConnect SA has been validated and received. Our team will respond shortly.";
        form.reset();
      }
    });
  });
});
