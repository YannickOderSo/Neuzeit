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
  var wideLayout = window.matchMedia("(min-width: 48rem)");

  /* Bewegung nur, wenn niemand reduzierte Bewegung eingestellt hat.
     Ohne die Klasse bleibt die ruhige Endfassung stehen. */
  var motionOK = !reduceMotion.matches;
  if (motionOK) root.classList.add("motion");
  function onMotionPreference() {
    motionOK = !reduceMotion.matches;
    root.classList.toggle("motion", motionOK);
  }
  if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", onMotionPreference);
  else if (reduceMotion.addListener) reduceMotion.addListener(onMotionPreference);

  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

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
  var nav = document.querySelector(".nav");
  var indicator = nav && nav.querySelector(".nav__indicator");
  var lastCurrent;

  /* Marker unter dem aktiven Menüpunkt gleitet von Punkt zu Punkt */
  function moveIndicator(link) {
    if (!indicator || !motionOK) return;
    if (!link || !link.offsetWidth) {
      indicator.style.setProperty("--ind-o", "0");
      return;
    }
    var firstTime = !indicator.style.getPropertyValue("--ind-x");
    if (firstTime) indicator.style.transition = "none";
    var navBox = nav.getBoundingClientRect();
    var linkBox = link.getBoundingClientRect();
    indicator.style.setProperty("--ind-x", (linkBox.left - navBox.left) + "px");
    indicator.style.setProperty("--ind-w", String(linkBox.width));
    if (firstTime) {
      void indicator.offsetWidth;
      indicator.style.transition = "";
    }
    indicator.style.setProperty("--ind-o", "1");
  }

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
    if (!current && spySections.length) {
      var lastSection = spySections[spySections.length - 1];
      if (lastSection.getBoundingClientRect().bottom <= probe) current = lastSection.getAttribute("data-spy");
    }
    if (current === lastCurrent) return;
    lastCurrent = current;
    var active = null;
    navLinks.forEach(function (link) {
      if (current && link.getAttribute("data-nav") === current) {
        link.setAttribute("aria-current", "true");
        active = link;
      } else {
        link.removeAttribute("aria-current");
      }
    });
    moveIndicator(active);
  }

  /* ------------------------------------------------------------------------
     Bewegung beim Scrollen: Werte von 0 bis 1 als Custom Properties.
     Erst alle Maße lesen, dann schreiben, damit nichts ruckelt.
     ------------------------------------------------------------------------ */
  var progressBar = document.querySelector(".scroll-progress");
  var hero = document.querySelector(".hero");
  var steps = document.querySelector(".steps");
  var stepItems = steps ? Array.prototype.slice.call(steps.querySelectorAll(".step")) : [];
  var stepThresholds = [];
  var heroLayers = hero ? Array.prototype.slice.call(hero.querySelectorAll(".horizon__lift, .horizon__rings-lift")) : [];
  var stance = document.querySelector(".stance");
  var stanceRise = stance && stance.querySelector(".stance__rise");
  var quote = document.querySelector(".stance__quote blockquote");
  var footerMark = document.querySelector(".footer-mark");
  var footerRise = footerMark && footerMark.querySelector(".footer-mark__rise");
  var FOOTER_LINE = 0.866; /* Lage der Horizontlinie im Schlusslogo (Anteil der Höhe) */

  /* Position jedes Schritt-Markers entlang der Linie (0 bis 1) */
  function measureSteps() {
    if (!steps) return;
    var box = steps.getBoundingClientRect();
    var horizontal = wideLayout.matches;
    var inset = horizontal ? 0 : parseFloat(getComputedStyle(root).fontSize) * 0.4;
    var length = horizontal ? box.width : box.height - 2 * inset;
    stepThresholds = stepItems.map(function (item) {
      var m = item.querySelector(".step__marker").getBoundingClientRect();
      var pos = horizontal ? m.left + m.width / 2 - box.left : m.top + m.height / 2 - box.top - inset;
      return clamp01(pos / length);
    });
  }

  function updateMotion() {
    var vh = window.innerHeight;
    var maxScroll = document.documentElement.scrollHeight - vh;
    var heroBox = hero && hero.getBoundingClientRect();
    var stepsBox = steps && steps.getBoundingClientRect();
    var stanceBox = stanceRise && stance.getBoundingClientRect();
    var markBox = footerRise && footerMark.getBoundingClientRect();

    if (progressBar) progressBar.style.setProperty("--page-p", (maxScroll > 0 ? clamp01(window.scrollY / maxScroll) : 0).toFixed(4));
    if (heroBox) {
      var heroP = clamp01(-heroBox.top / heroBox.height).toFixed(4);
      heroLayers.forEach(function (layer) { layer.style.setProperty("--hero-p", heroP); });
    }
    if (stepsBox) {
      var tl = clamp01((vh * 0.8 - stepsBox.top) / (vh * 0.25 + stepsBox.height));
      steps.style.setProperty("--tl", tl.toFixed(4));
      steps.classList.toggle("is-complete", tl >= 0.99);
      stepItems.forEach(function (item, i) {
        item.classList.toggle("is-reached", tl > 0 && tl >= (stepThresholds[i] || 0) - 0.005);
      });
    }
    if (stanceBox) stanceRise.style.setProperty("--sp", clamp01((vh - stanceBox.bottom) / (vh * 0.45)).toFixed(4));
    if (markBox) {
      /* Die Sonne geht auf, sobald die Horizontlinie im Bild ist, und steht am Seitenende */
      var lineIn = vh - (markBox.top + markBox.height * FOOTER_LINE);
      var remaining = Math.max(0, maxScroll - window.scrollY);
      footerRise.style.setProperty("--fm", (lineIn <= 0 ? 0 : clamp01(lineIn / (lineIn + remaining))).toFixed(4));
    }
  }

  /* Zitat in Wörter teilen; Screenreader lesen weiter den ganzen Satz */
  if (quote && motionOK) {
    var quoteP = quote.querySelector("p");
    var fullText = quoteP.textContent;
    var visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    var count = 0;
    fullText.split(/(\s+)/).forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        visual.appendChild(document.createTextNode(part));
        return;
      }
      var word = document.createElement("span");
      word.className = "qw";
      word.style.setProperty("--i", String(count++));
      word.textContent = part;
      visual.appendChild(word);
    });
    var spoken = document.createElement("span");
    spoken.className = "visually-hidden";
    spoken.textContent = fullText;
    quoteP.textContent = "";
    quoteP.appendChild(spoken);
    quoteP.appendChild(visual);
  }

  var scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      updateHeader();
      updateActiveNav();
      if (motionOK) updateMotion();
      scrollTicking = false;
    });
  }

  function onResize() {
    if (motionOK) measureSteps();
    lastCurrent = undefined;
    onScroll();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  updateHeader();
  if (motionOK) {
    measureSteps();
    updateMotion();
  }
  updateActiveNav();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(onResize);
  }

  /* ------------------------------------------------------------------------
     Sanftes Einblenden der Sektionen
     Nur Elemente unterhalb des sichtbaren Bereichs werden zunächst verborgen.
     ------------------------------------------------------------------------ */
  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      /* Was gleichzeitig sichtbar wird, erscheint leicht gestaffelt */
      entries.filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) {
          return (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left);
        })
        .forEach(function (entry, i) {
          var el = entry.target;
          if (i > 0) {
            el.style.transitionDelay = Math.min(i * 90, 450) + "ms";
            window.setTimeout(function () { el.style.transitionDelay = ""; }, 1600);
          }
          el.classList.remove("is-pending");
          revealObserver.unobserve(el);
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

  /* Leistungskarten: ein weicher Lichtkegel folgt dem Zeiger (nur Maus/Trackpad) */
  if (motionOK && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".service__card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var box = card.getBoundingClientRect();
        card.style.setProperty("--mx", (event.clientX - box.left) + "px");
        card.style.setProperty("--my", (event.clientY - box.top) + "px");
      }, { passive: true });
    });
  }

  /* Der Sonnenaufgang im Hero startet erst, wenn die Horizontlinie sichtbar ist.
     Auf schmalen Handys liegt sie beim Laden unterhalb des Bildschirms. */
  var heroVisual = document.querySelector(".hero__visual");
  var horizonLine = heroVisual && heroVisual.querySelector(".horizon__line");
  var horizonRings = heroVisual && heroVisual.querySelector(".horizon__rings");
  if (horizonLine && horizonRings && motionOK && "IntersectionObserver" in window &&
      horizonRings.getBoundingClientRect().top > window.innerHeight - 24) {
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
      var name = button.getAttribute("data-palette-choice");
      if (!motionOK || !document.startViewTransition || name === root.getAttribute("data-palette")) {
        applyPalette(name, true);
        return;
      }
      /* neue Farben breiten sich kreisförmig vom gewählten Knopf aus */
      var box = button.getBoundingClientRect();
      var x = box.left + box.width / 2;
      var y = box.top + box.height / 2;
      var radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      root.style.setProperty("--vt-x", x + "px");
      root.style.setProperty("--vt-y", y + "px");
      root.style.setProperty("--vt-r", radius + "px");
      root.classList.add("vt-palette");
      var transition = null;
      function done() {
        if (paletteTransition !== transition) return; /* ein neuerer Wechsel läuft schon */
        paletteTransition = null;
        root.classList.remove("vt-palette");
      }
      try {
        transition = document.startViewTransition(function () { applyPalette(name, true); });
        paletteTransition = transition;
        transition.finished.then(done, done);
      } catch (e) {
        paletteTransition = null;
        applyPalette(name, true);
        root.classList.remove("vt-palette");
      }
    });
  });

  /* Während der Enthüllung landen Klicks auf <html>; Klicks auf einen Farbknopf weiterreichen */
  var paletteTransition = null;
  document.addEventListener("click", function (event) {
    if (!paletteTransition || event.target !== root) return;
    paletteButtons.some(function (button) {
      var b = button.getBoundingClientRect();
      if (event.clientX >= b.left && event.clientX <= b.right && event.clientY >= b.top && event.clientY <= b.bottom) {
        button.click();
        return true;
      }
      return false;
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

  var submitButton = form && form.querySelector(".btn--submit");
  var submitLabel = form && form.querySelector("[data-submit-label]");

  function showSuccess(name) {
    status.textContent = "";
    status.classList.remove("is-success");
    var icon = document.createElement("span");
    icon.className = "sunrise";
    icon.setAttribute("aria-hidden", "true");
    var title = document.createElement("strong");
    title.textContent = "Danke, " + name + ".";
    var text = document.createElement("span");
    text.textContent = "Im fertigen Auftritt ginge Ihre Anfrage jetzt an Neuzeit. Dieser Prototyp versendet nichts.";
    status.appendChild(icon);
    status.appendChild(title);
    status.appendChild(text);
    void status.offsetWidth;
    status.classList.add("is-success");
    status.scrollIntoView({ block: "nearest", behavior: motionOK ? "smooth" : "auto" });
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
      if (submitButton && submitButton.classList.contains("is-loading")) return;
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

      function finish() {
        if (submitButton) {
          submitButton.classList.remove("is-loading");
          submitButton.removeAttribute("aria-disabled");
          if (submitLabel) submitLabel.textContent = "Anfrage senden";
        }
        showSuccess(name);
        form.reset();
        attempted = false;
        fields.forEach(function (field) {
          setError(field, false);
        });
      }

      /* kurzer Ladezustand, damit sich der Prototyp wie das Original anfühlt */
      /* Ladezustand auch ohne Bewegung: er verhindert doppeltes Absenden */
      if (submitButton) {
        submitButton.classList.add("is-loading");
        submitButton.setAttribute("aria-disabled", "true");
        if (submitLabel) submitLabel.textContent = "Einen Moment …";
        window.setTimeout(finish, motionOK ? 900 : 400);
      } else {
        finish();
      }
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
