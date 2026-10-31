/* ==========================================================================
   Yulong Gao — homepage interactions
   1. Email obfuscation (address never appears in the HTML source)
   2. Publication filter (all / first author / co-author)
   3. Mobile nav toggle, scrollspy, back-to-top, footer year
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- 1. Email obfuscation --------------------------------------
     The address is stored as character codes and only assembled in the
     browser, so address-harvesting crawlers that read the raw HTML do not
     see it. If JS is disabled, the <noscript>-style fallback text
     "yulong [at] qhu [dot] edu [dot] cn" (already in the HTML) stays. */
  var USER = String.fromCharCode(121, 117, 108, 111, 110, 103);        // yulong
  var HOST = String.fromCharCode(113, 104, 117, 46, 101, 100, 117,     // qhu.edu.cn
    46, 99, 110);
  var EMAIL = USER + String.fromCharCode(64) + HOST;

  var emailText = document.getElementById("emailText");
  var emailBtn = document.getElementById("emailBtn");
  var copyBtn = document.getElementById("copyEmail");

  if (emailText) { emailText.textContent = EMAIL; }

  function openMail() { window.location.href = "mailto:" + EMAIL; }
  if (emailBtn) { emailBtn.addEventListener("click", openMail); }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var done = function () {
        copyBtn.textContent = "Copied ✓";
        setTimeout(function () { copyBtn.textContent = "Copy"; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = EMAIL;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) { /* noop */ }
        document.body.removeChild(ta);
        done();
      }
    });
  }

  /* ---------- 2. Publication filter -------------------------------------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var pubItems = document.querySelectorAll("#pubList .pub-item");
  var yearHeads = document.querySelectorAll("#pubList .pub-year");
  var pubCount = document.getElementById("pubCount");

  function applyFilter(mode) {
    var shown = 0;
    pubItems.forEach(function (item) {
      var isFirst = item.classList.contains("first-author");
      var visible = mode === "all" || (mode === "first" && isFirst) || (mode === "co" && !isFirst);
      item.style.display = visible ? "" : "none";
      if (visible) { shown++; }
    });
    // Hide year headers whose every paper is filtered out
    yearHeads.forEach(function (head) {
      var next = head.nextElementSibling;
      var anyVisible = false;
      while (next && !next.classList.contains("pub-year")) {
        if (next.classList.contains("pub-item") && next.style.display !== "none") {
          anyVisible = true;
          break;
        }
        next = next.nextElementSibling;
      }
      head.style.display = anyVisible ? "" : "none";
    });
    if (pubCount) { pubCount.textContent = shown + (shown === 1 ? " paper" : " papers"); }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      applyFilter(btn.dataset.filter);
    });
  });
  applyFilter("all");

  /* ---------- 3. Nav: mobile toggle -------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 3b. Scrollspy ---------------------------------------------- */
  var sections = ["news", "research", "publications", "schedule", "cv", "contact"];
  var navA = {};
  navLinks && navLinks.querySelectorAll("a").forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    navA[id] = a;
  });

  function onScroll() {
    var pos = window.scrollY + 140;
    var current = null;
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= pos) { current = id; }
    });
    sections.forEach(function (id) {
      if (navA[id]) { navA[id].classList.toggle("active", id === current); }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3c. Back to top -------------------------------------------- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 3d. Footer year --------------------------------------------- */
  var year = document.getElementById("year");
  if (year) { year.textContent = String(new Date().getFullYear()); }
})();
