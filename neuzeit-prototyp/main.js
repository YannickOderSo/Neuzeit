/* ==========================================================================
   neuzeit · Website-Prototyp
   Kleine Interaktionen ohne Framework: Navigation, Einblenden, Farbvarianten,
   Formularprüfung. Ohne JavaScript bleibt die Seite vollständig lesbar.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var desktopNav = window.matchMedia("(min-width: 60rem)");

  /* ------------------------------------------------------------------------
     Kopfzeile: feine Linie, sobald gescrollt wird
     ------------------------------------------------------------------------ */
  var header = document.querySelector("[data-header]");

  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  /* ------------------------------------------------------------------------
     Mobiles Menü
     ------------------------------------------------------------------------ */
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-menu]");
  var menuLabel = document.querySelector("[data-menu-label]");

  var behindMenu = Array.prototype.slice.call(document.querySelectorAll(".skip-link, main, .site-footer, .palette"));

  function setBackgroundInert(inert) {
    behindMenu.forEach(function (el) { el.inert = inert; });
  }

  function menuFocusables() {
    return [menuToggle].concat(Array.prototype.slice.call(menu.querySelectorAll("a[href], button")));
  }

  function openMenu() {
    menu.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    if (menuLabel) menuLabel.textContent = "Schließen";
    root.classList.add("menu-open");
    setBackgroundInert(true);
    var firstLink = menu.querySelector("a[href]");
    if (firstLink) firstLink.focus();
    document.addEventListener("keydown", onMenuKeydown);
  }

  function closeMenu(returnFocus) {
    if (menu.hidden) return;
    menu.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    if (menuLabel) menuLabel.textContent = "Menü";
    root.classList.remove("menu-open");
    setBackgroundInert(false);
    document.removeEventListener("keydown", onMenuKeydown);
    if (returnFocus) menuToggle.focus();
  }

  function onMenuKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }
    if (event.key !== "Tab") return;

    /* Fokus im geöffneten Menü halten */
    var items = menuFocusables();
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function () {
      if (menu.hidden) openMenu();
      else closeMenu(false);
    });

    header.addEventListener("click", function (event) {
      if (event.target.closest('a[href^="#"]')) closeMenu(false);
    });

    var onBreakpointChange = function (mq) {
      if (mq.matches) closeMenu(false);
    };
    if (desktopNav.addEventListener) desktopNav.addEventListener("change", onBreakpointChange);
    else if (desktopNav.addListener) desktopNav.addListener(onBreakpointChange);
  }

  /* ------------------------------------------------------------------------
     Aktiver Menüpunkt beim Scrollen
     ------------------------------------------------------------------------ */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var spySections = Array.prototype.slice.call(document.querySelectorAll("main > section"));

  function updateActiveNav() {
    var probe = window.innerHeight * 0.4;
    var current = null;
    for (var i = 0; i < spySections.length; i++) {
      var rect = spySections[i].getBoundingClientRect();
      if (rect.top <= probe && rect.bottom > probe) {
        current = spySections[i].getAttribute("data-spy");
        break;
      }
    }
    navLinks.forEach(function (link) {
      if (current && link.getAttribute("data-nav") === current) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  var scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      updateHeader();
      updateActiveNav();
      scrollTicking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateHeader();
  updateActiveNav();

  /* ------------------------------------------------------------------------
     Sanftes Einblenden der Sektionen
     Nur Elemente unterhalb des sichtbaren Bereichs werden zunächst verborgen.
     ------------------------------------------------------------------------ */
  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove("is-pending");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });

    var viewportHeight = window.innerHeight;
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      if (el.getBoundingClientRect().top > viewportHeight * 0.94) {
        el.classList.add("is-pending");
        revealObserver.observe(el);
      }
    });
  }

  /* Der Sonnenaufgang im Hero startet erst, wenn die Horizontlinie sichtbar ist.
     Auf schmalen Handys liegt sie beim Laden unterhalb des Bildschirms. */
  var heroVisual = document.querySelector(".hero__visual");
  var horizonLine = heroVisual && heroVisual.querySelector(".horizon__line");
  if (horizonLine && !reduceMotion.matches && "IntersectionObserver" in window &&
      horizonLine.getBoundingClientRect().top > window.innerHeight - 24) {
    heroVisual.classList.add("is-waiting");
    var heroObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        heroVisual.classList.remove("is-waiting");
        heroObserver.disconnect();
      }
    }, { rootMargin: "0px 0px -24px 0px" });
    heroObserver.observe(horizonLine);
  }

  /* Sanftes Scrollen erst nach dem Laden der Schriften einschalten. Sonst
     landet ein direkter Aufruf mit #anker an der falschen Stelle. */
  window.addEventListener("load", function () {
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontsReady.then(function () { root.classList.add("is-ready"); });
  });

  /* ------------------------------------------------------------------------
     Farbvarianten (nur für den Prototyp)
     ------------------------------------------------------------------------ */
  var PALETTES = ["warm", "klar", "frisch"];
  var paletteButtons = Array.prototype.slice.call(document.querySelectorAll("[data-palette-choice]"));
  var themeColor = document.querySelector('meta[name="theme-color"]');

  function applyPalette(name, persist) {
    if (PALETTES.indexOf(name) === -1) name = "warm";
    root.setAttribute("data-palette", name);
    paletteButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-palette-choice") === name));
    });
    if (themeColor) {
      var bg = getComputedStyle(root).getPropertyValue("--color-bg").trim();
      if (bg) themeColor.setAttribute("content", bg);
    }
    if (persist) {
      try { localStorage.setItem("neuzeit-palette", name); } catch (e) { /* Speicher nicht verfügbar */ }
    }
  }

  paletteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      applyPalette(button.getAttribute("data-palette-choice"), true);
    });
  });
  applyPalette(root.getAttribute("data-palette") || "warm", false);

  /* ------------------------------------------------------------------------
     Hinweis-Toast für Platzhalter-Links
     ------------------------------------------------------------------------ */
  var toast = document.querySelector("[data-toast]");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.hidden = true;
    toast.textContent = message;
    /* neu einblenden, damit Screenreader die Meldung erneut ansagen */
    window.requestAnimationFrame(function () {
      toast.hidden = false;
    });
    toastTimer = window.setTimeout(function () {
      toast.hidden = true;
    }, 3600);
  }

  document.querySelectorAll("[data-placeholder]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      showToast(link.getAttribute("data-placeholder") + " folgt. Im Prototyp ist das ein Platzhalter.");
    });
  });

  /* ------------------------------------------------------------------------
     Kontaktformular: Prüfung im Browser, kein Versand
     ------------------------------------------------------------------------ */
  var form = document.querySelector("[data-form]");
  var status = document.querySelector("[data-form-status]");

  var rules = {
    name: function (value) { return value.trim().length > 0; },
    email: function (value) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()); },
    nachricht: function (value) { return value.trim().length > 0; }
  };

  function errorFor(field) {
    return document.getElementById(field.id + "-error");
  }

  function setError(field, visible) {
    var error = errorFor(field);
    if (visible) {
      field.setAttribute("aria-invalid", "true");
      if (error) field.setAttribute("aria-describedby", error.id);
    } else {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    }
    if (error) error.hidden = !visible;
  }

  function validateField(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var valid = rule(field.value);
    setError(field, !valid);
    return valid;
  }

  if (form) {
    /* Ohne JavaScript prüft der Browser die Pflichtfelder selbst. */
    form.noValidate = true;
    var fields = Array.prototype.slice.call(form.querySelectorAll("input, textarea"));
    var attempted = false;

    fields.forEach(function (field) {
      field.addEventListener("input", function () {
        if (attempted || field.getAttribute("aria-invalid") === "true") validateField(field);
      });
      field.addEventListener("blur", function () {
        if (attempted) validateField(field);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      attempted = true;

      var firstInvalid = null;
      fields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        status.textContent = "";
        firstInvalid.focus();
        return;
      }

      var name = form.elements.name.value.trim();
      status.textContent = "";
      var title = document.createElement("strong");
      title.textContent = "Danke, " + name + ".";
      var text = document.createElement("span");
      text.textContent = "Im fertigen Auftritt ginge Ihre Anfrage jetzt an Neuzeit. Dieser Prototyp versendet nichts.";
      status.appendChild(title);
      status.appendChild(text);

      form.reset();
      attempted = false;
      fields.forEach(function (field) {
        setError(field, false);
      });
    });
  }

  /* „Erstgespräch vereinbaren“ im Kontaktbereich springt direkt ins Formular */
  document.querySelectorAll("[data-focus-form]").forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      var target = document.getElementById("kontakt-name");
      if (!target || !form) return;
      event.preventDefault();
      form.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
      target.focus({ preventScroll: true });
    });
  });
})();
