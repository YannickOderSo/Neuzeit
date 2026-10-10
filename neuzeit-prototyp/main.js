/* ==========================================================================
   neuzeit · Website-Prototyp
   Kleine Interaktionen ohne Framework: Navigation, Einblenden, Farbvarianten,
   Formular, Terminbuchung. Ohne JavaScript bleibt jede Seite vollständig lesbar.
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

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a[href]")) closeMenu(false);
    });

    var onBreakpointChange = function (mq) {
      if (mq.matches) closeMenu(false);
    };
    if (desktopNav.addEventListener) desktopNav.addEventListener("change", onBreakpointChange);
    else if (desktopNav.addListener) desktopNav.addListener(onBreakpointChange);
  }

  /* ------------------------------------------------------------------------
     Gleitende Marker: unter dem aktuellen Menüpunkt, beim Zeigen folgen sie
     dem Zeiger und kehren danach zurück
     ------------------------------------------------------------------------ */
  function makeIndicator(box, indicator) {
    if (!box || !indicator) return function () {};
    return function (link) {
      if (!motionOK) return;
      if (!link || !link.offsetWidth) {
        indicator.style.setProperty("--ind-o", "0");
        return;
      }
      var firstTime = !indicator.style.getPropertyValue("--ind-x");
      if (firstTime) indicator.style.transition = "none";
      var boxRect = box.getBoundingClientRect();
      var linkRect = link.getBoundingClientRect();
      indicator.style.setProperty("--ind-x", (linkRect.left - boxRect.left) + "px");
      indicator.style.setProperty("--ind-w", String(linkRect.width));
      if (firstTime) {
        void indicator.offsetWidth;
        indicator.style.transition = "";
      }
      indicator.style.setProperty("--ind-o", "1");
    };
  }

  var nav = document.querySelector(".nav");
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll(".nav__link")) : [];
  var currentNavLink = navLinks.filter(function (link) {
    return link.getAttribute("aria-current") === "page";
  })[0] || null;
  var moveNavIndicator = makeIndicator(nav, nav && nav.querySelector(".nav__indicator"));
  if (nav && currentNavLink) nav.classList.add("has-current");

  function resetNavIndicator() {
    moveNavIndicator(currentNavLink);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("pointerenter", function () { moveNavIndicator(link); });
    link.addEventListener("focus", function () { moveNavIndicator(link); });
    link.addEventListener("blur", resetNavIndicator);
  });
  if (nav) nav.addEventListener("pointerleave", resetNavIndicator);

  /* Sprungmarken auf der Leistungsseite: markieren, welcher Abschnitt gerade
     gelesen wird */
  var subnav = document.querySelector("[data-subnav]");
  var subnavList = subnav && subnav.querySelector(".subnav__list");
  var subnavLinks = subnav ? Array.prototype.slice.call(subnav.querySelectorAll(".subnav__link")) : [];
  var subnavTargets = subnavLinks.map(function (link) {
    return document.getElementById(decodeURIComponent(link.hash.slice(1)));
  });
  var moveSubnavIndicator = makeIndicator(subnav && subnav.querySelector(".subnav__inner"), subnav && subnav.querySelector(".subnav__indicator"));
  var currentSpy = null;

  function updateSpy() {
    if (!subnav) return;
    var subnavBox = subnav.getBoundingClientRect();
    var probe = subnavBox.bottom + window.innerHeight * 0.25;
    var active = null;
    /* erst markieren, wenn die Leiste unter der Kopfzeile klebt */
    var pinned = !header || subnavBox.top <= header.getBoundingClientRect().bottom + 1;
    subnavTargets.forEach(function (target, i) {
      if (pinned && target && target.getBoundingClientRect().top <= probe) active = subnavLinks[i];
    });
    /* am Seitenende gilt der letzte Abschnitt */
    var last = subnavTargets[subnavTargets.length - 1];
    if (last && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2 &&
        last.getBoundingClientRect().top < window.innerHeight) {
      active = subnavLinks[subnavLinks.length - 1];
    }
    if (active === currentSpy) return;
    currentSpy = active;
    subnavLinks.forEach(function (link) {
      if (link === active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    /* auf schmalen Bildschirmen den aktiven Punkt in die Leiste holen */
    if (active && subnavList && subnavList.scrollWidth > subnavList.clientWidth) {
      var listRect = subnavList.getBoundingClientRect();
      var linkRect = active.getBoundingClientRect();
      if (linkRect.left < listRect.left || linkRect.right > listRect.right) {
        subnavList.scrollTo({
          left: subnavList.scrollLeft + linkRect.left - listRect.left - 16,
          behavior: motionOK ? "smooth" : "auto"
        });
      }
    }
    moveSubnavIndicator(active);
  }

  if (subnavList) {
    subnavList.addEventListener("scroll", function () { moveSubnavIndicator(currentSpy); }, { passive: true });
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
      updateSpy();
      if (motionOK) updateMotion();
      scrollTicking = false;
    });
  }

  function onResize() {
    if (motionOK) measureSteps();
    resetNavIndicator();
    moveSubnavIndicator(currentSpy);
    onScroll();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  updateHeader();
  if (motionOK) {
    measureSteps();
    updateMotion();
  }
  updateSpy();
  resetNavIndicator();
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
     Kontaktformular: Prüfung im Browser, Versand an einen Formulardienst
     Ohne Eintrag in data-endpoint bleibt es bei der Vorschau ohne Versand.
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
  var endpoint = form ? (form.getAttribute("data-endpoint") || "").trim() : "";

  function showStatus(kind, heading, message) {
    status.textContent = "";
    status.classList.remove("is-success", "is-error");
    if (kind === "success") {
      var icon = document.createElement("span");
      icon.className = "sunrise";
      icon.setAttribute("aria-hidden", "true");
      status.appendChild(icon);
    }
    var title = document.createElement("strong");
    title.textContent = heading;
    var text = document.createElement("span");
    text.textContent = message;
    status.appendChild(title);
    status.appendChild(text);
    void status.offsetWidth;
    status.classList.add(kind === "success" ? "is-success" : "is-error");
    status.scrollIntoView({ block: "nearest", behavior: motionOK ? "smooth" : "auto" });
  }

  function send(data) {
    /* Formspree, Web3Forms und ähnliche Dienste antworten mit JSON */
    return window.fetch(endpoint, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    }).then(function (response) {
      if (!response.ok) throw new Error("Versand fehlgeschlagen: " + response.status);
    });
  }

  if (form) {
    /* Ohne JavaScript prüft der Browser die Pflichtfelder selbst. */
    form.noValidate = true;
    var fields = Array.prototype.slice.call(form.querySelectorAll("input, textarea, select")).filter(function (field) {
      return !field.closest(".form__trap");
    });
    var attempted = false;

    if (endpoint) {
      var protoNote = form.querySelector("[data-form-proto]");
      if (protoNote) protoNote.hidden = true;
    }

    /* Thema aus dem Link übernehmen, z. B. kontakt.html?thema=compliance */
    var topicField = form.elements.thema;
    if (topicField) {
      var topic = new URLSearchParams(window.location.search).get("thema");
      if (topic && Array.prototype.some.call(topicField.options, function (o) { return o.value === topic; })) {
        topicField.value = topic;
      }
    }

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
        status.classList.remove("is-success", "is-error");
        firstInvalid.focus();
        return;
      }

      var name = form.elements.name.value.trim();
      var data = new FormData(form);
      var isBot = form.elements.website && form.elements.website.value !== "";
      status.textContent = "";

      function setLoading(loading) {
        if (!submitButton) return;
        submitButton.classList.toggle("is-loading", loading);
        if (loading) submitButton.setAttribute("aria-disabled", "true");
        else submitButton.removeAttribute("aria-disabled");
        if (submitLabel) submitLabel.textContent = loading ? "Einen Moment …" : "Anfrage senden";
      }

      function done() {
        setLoading(false);
        showStatus("success", "Danke, " + name + ".", endpoint
          ? "Ihre Anfrage ist bei uns angekommen. Wir melden uns mit Terminvorschlägen."
          : "Im fertigen Auftritt ginge Ihre Anfrage jetzt an Neuzeit. Dieser Prototyp versendet nichts.");
        form.reset();
        attempted = false;
        fields.forEach(function (field) { setError(field, false); });
      }

      function failed() {
        setLoading(false);
        showStatus("error", "Das hat leider nicht geklappt.", "Bitte versuchen Sie es in einem Moment noch einmal oder schreiben Sie uns direkt per E-Mail. Ihre Eingaben sind noch da.");
      }

      /* Ladezustand auch ohne Bewegung: er verhindert doppeltes Absenden */
      setLoading(true);
      if (endpoint && !isBot) {
        send(data).then(done, failed);
      } else {
        window.setTimeout(done, motionOK ? 900 : 400);
      }
    });
  }

  /* ------------------------------------------------------------------------
     Terminbuchung mit Zwei-Klick-Lösung: Der Kalender von Calendly lädt erst,
     wenn jemand ihn aktiv anfordert. Vorher fließen keine Daten in die USA.
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-calendly]").forEach(function (box) {
    var url = (box.getAttribute("data-calendly-url") || "").trim();
    var loadButton = box.querySelector("[data-calendly-load]");
    var consent = box.querySelector("[data-calendly-consent]");
    var frame = box.querySelector("[data-calendly-frame]");
    if (!loadButton || !consent || !frame) return;

    frame.setAttribute("role", "region");
    frame.setAttribute("aria-label", "Buchungskalender");

    function showConsent() {
      frame.hidden = true;
      frame.textContent = "";
      consent.hidden = false;
      loadButton.focus();
    }

    loadButton.addEventListener("click", function () {
      frame.textContent = "";
      if (/^https:\/\/calendly\.com\/[\w-]/.test(url)) {
        var iframe = document.createElement("iframe");
        iframe.src = url + (url.indexOf("?") === -1 ? "?" : "&") + "hide_gdpr_banner=1";
        iframe.title = "Terminbuchung über Calendly";
        frame.appendChild(iframe);
      } else {
        /* Prototyp: noch kein Calendly-Link hinterlegt */
        var box2 = document.createElement("div");
        box2.className = "booking__placeholder";
        var icon = document.createElement("span");
        icon.className = "sunrise";
        icon.setAttribute("aria-hidden", "true");
        var title = document.createElement("strong");
        title.textContent = "Hier erscheint der Buchungskalender.";
        var text = document.createElement("p");
        text.textContent = "Sobald der Calendly-Link hinterlegt ist, lädt an dieser Stelle der Kalender. ";
        var ph = document.createElement("span");
        ph.className = "ph";
        ph.textContent = "[Platzhalter: Calendly-Link]";
        text.appendChild(ph);
        var back = document.createElement("button");
        back.type = "button";
        back.className = "btn btn--ghost btn--small";
        back.textContent = "Zurück";
        back.addEventListener("click", showConsent);
        box2.appendChild(icon);
        box2.appendChild(title);
        box2.appendChild(text);
        box2.appendChild(back);
        frame.appendChild(box2);
      }
      consent.hidden = true;
      frame.hidden = false;
      frame.focus();
    });
  });
})();
