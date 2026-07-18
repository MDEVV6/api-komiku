/* =============================================
   Komiku REST API Docs — Interactive App
   ============================================= */

/* ---- Access Gate ---- */
(function () {
  const KEY = "komiku_access";
  const CODE = "KOMIKONLIN26";

  if (sessionStorage.getItem(KEY) === "ok") return;

  // Sembunyikan konten utama
  document.documentElement.style.visibility = "hidden";

  // Buat overlay prompt
  const overlay = document.createElement("div");
  overlay.style.cssText = [
    "position:fixed;inset:0;z-index:9999",
    "background:#0f1117",
    "display:flex;flex-direction:column;align-items:center;justify-content:center",
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  ].join(";");

  overlay.innerHTML = `
    <div style="background:#1a1d27;border:1px solid #2a2d3e;border-radius:12px;padding:36px 32px;max-width:360px;width:90%;text-align:center;">
      <div style="width:44px;height:44px;background:#6c63ff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#fff;margin:0 auto 16px;">K</div>
      <h2 style="color:#e2e8f0;font-size:18px;font-weight:600;margin:0 0 6px;">Komiku API Docs</h2>
      <p style="color:#94a3b8;font-size:13px;margin:0 0 24px;">Masukkan kode akses untuk melanjutkan.</p>
      <input id="accessInput" type="password" placeholder="Kode akses..." autocomplete="off"
        style="width:100%;background:#0d1117;border:1px solid #2a2d3e;border-radius:8px;padding:10px 14px;color:#e2e8f0;font-size:14px;outline:none;box-sizing:border-box;margin-bottom:10px;letter-spacing:.1em;text-transform:uppercase;" />
      <p id="accessError" style="color:#ef4444;font-size:12px;margin:0 0 12px;min-height:16px;"></p>
      <button id="accessBtn"
        style="width:100%;background:#6c63ff;color:#fff;border:none;border-radius:8px;padding:10px;font-size:14px;font-weight:600;cursor:pointer;">
        Masuk
      </button>
    </div>`;

  document.body.appendChild(overlay);
  document.documentElement.style.visibility = "visible";

  const input = overlay.querySelector("#accessInput");
  const btn = overlay.querySelector("#accessBtn");
  const err = overlay.querySelector("#accessError");

  function tryAccess() {
    if (input.value.trim().toUpperCase() === CODE) {
      sessionStorage.setItem(KEY, "ok");
      overlay.remove();
    } else {
      err.textContent = "Kode akses salah. Coba lagi.";
      input.value = "";
      input.focus();
      input.style.borderColor = "#ef4444";
      setTimeout(() => { input.style.borderColor = "#2a2d3e"; }, 1500);
    }
  }

  btn.addEventListener("click", tryAccess);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") tryAccess(); });
  setTimeout(() => input.focus(), 100);
})();

const BASE_URL = window.location.origin;

/* ---- Sidebar active link on scroll ---- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll(".nav-item[data-section]").forEach((el) => {
          el.classList.toggle("active", el.dataset.section === id);
        });
      }
    });
  },
  { rootMargin: "-20% 0px -70% 0px" }
);

document.querySelectorAll(".section[id]").forEach((el) => observer.observe(el));

/* ---- Nav item click → smooth scroll ---- */
document.querySelectorAll(".nav-item[data-section]").forEach((item) => {
  item.addEventListener("click", () => {
    const target = document.getElementById(item.dataset.section);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // close sidebar on mobile
    document.querySelector(".sidebar").classList.remove("open");
    document.querySelector(".overlay").classList.remove("active");
  });
});

/* ---- Mobile menu ---- */
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("active");
  });
}

if (overlay) {
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  });
}

/* ---- Sidebar search filter ---- */
const sidebarSearchInput = document.getElementById("sidebarSearch");
if (sidebarSearchInput) {
  sidebarSearchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll(".nav-item[data-section]").forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? "" : "none";
    });
    document.querySelectorAll(".nav-section").forEach((section) => {
      const visible = [...section.querySelectorAll(".nav-item")].some(
        (i) => i.style.display !== "none"
      );
      section.style.display = visible ? "" : "none";
    });
  });
}

/* ---- Endpoint accordion ---- */
document.querySelectorAll(".endpoint-header").forEach((header) => {
  header.addEventListener("click", () => {
    const card = header.closest(".endpoint-card");
    const wasOpen = card.classList.contains("open");
    // close all
    document.querySelectorAll(".endpoint-card.open").forEach((c) => {
      if (c !== card) c.classList.remove("open");
    });
    card.classList.toggle("open", !wasOpen);
  });
});

/* ---- Tabs ---- */
document.querySelectorAll(".tabs").forEach((tabGroup) => {
  tabGroup.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const panel = tab.dataset.panel;
      const container = tabGroup.closest(".tab-container");
      tabGroup.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      container.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const target = container.querySelector(`[data-panel-id="${panel}"]`);
      if (target) target.classList.add("active");
    });
  });
});

/* ---- Copy button ---- */
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.copy
      ? document.getElementById(btn.dataset.copy)
      : btn.previousElementSibling;
    const text = target ? target.textContent : "";
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = "&#10003; Copied";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove("copied");
      }, 1800);
    });
  });
});

/* ---- JSON syntax highlighter ---- */
function highlightJson(json) {
  if (typeof json !== "string") {
    try {
      json = JSON.stringify(json, null, 2);
    } catch {
      return String(json);
    }
  }
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = "json-number";
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? "json-key" : "json-string";
        } else if (/true|false/.test(match)) {
          cls = "json-boolean";
        } else if (/null/.test(match)) {
          cls = "json-null";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
}

/* ---- Try-It runner ---- */
async function runEndpoint(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  // url lives on the .try-it child, not the card itself
  const tryItEl = card.querySelector(".try-it");
  if (!tryItEl) return;

  const inputs = card.querySelectorAll(".try-input-group input");
  let url = tryItEl.dataset.url;

  inputs.forEach((input) => {
    const key = input.dataset.key;
    const val = input.value.trim();
    if (input.dataset.type === "path") {
      url = url.replace(`{${key}}`, encodeURIComponent(val || input.placeholder));
    } else if (input.dataset.type === "path-optional" && val) {
      // append as extra path segment only when provided
      url = url.replace(/\/?$/, "/" + encodeURIComponent(val));
    } else if (input.dataset.type === "query" && val) {
      url += (url.includes("?") ? "&" : "?") + `${key}=${encodeURIComponent(val)}`;
    }
  });

  const fullUrl = BASE_URL + url;
  const responseSection = card.querySelector(".try-response");
  const statusEl = card.querySelector(".status-pill");
  const timeEl = card.querySelector(".response-time");
  const bodyEl = card.querySelector(".try-response-body");
  const runBtn = card.querySelector(".btn-run");

  responseSection.classList.add("visible");
  statusEl.className = "status-pill status-loading";
  statusEl.textContent = "Loading…";
  timeEl.textContent = "";
  bodyEl.innerHTML = '<span style="color:var(--text-faint)">Fetching...</span>';
  runBtn.disabled = true;
  runBtn.innerHTML = '<span class="spinner"></span> Running';

  const t0 = Date.now();

  try {
    const res = await fetch(fullUrl);
    const elapsed = Date.now() - t0;
    const text = await res.text();

    let parsed;
    try {
      parsed = JSON.parse(text);
      bodyEl.innerHTML = highlightJson(parsed);
    } catch {
      bodyEl.textContent = text;
    }

    statusEl.textContent = res.status + " " + res.statusText;
    statusEl.className =
      "status-pill " +
      (res.status < 300 ? "status-2xx" : res.status < 500 ? "status-4xx" : "status-5xx");
    timeEl.textContent = elapsed + "ms";
  } catch (err) {
    const elapsed = Date.now() - t0;
    statusEl.textContent = "Network Error";
    statusEl.className = "status-pill status-5xx";
    timeEl.textContent = elapsed + "ms";
    bodyEl.textContent = err.message;
  }

  runBtn.disabled = false;
  runBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Run';
}

/* ---- Expose to inline onclick ---- */
window.runEndpoint = runEndpoint;

/* ---- Base URL display ---- */
// Replace <span class="dynamic-base-url"> elements (outside pre blocks)
document.querySelectorAll(".dynamic-base-url").forEach((el) => {
  el.textContent = BASE_URL;
});

// Replace __BASE_URL__ placeholder text inside <pre> and <code> blocks
function replaceTextNodes(root) {
  if (root.nodeType === Node.TEXT_NODE) {
    if (root.textContent.includes("__BASE_URL__")) {
      root.textContent = root.textContent.replaceAll("__BASE_URL__", BASE_URL);
    }
  } else {
    root.childNodes.forEach(replaceTextNodes);
  }
}
document.querySelectorAll("pre, code").forEach(replaceTextNodes);

/* ---- Copy base URL ---- */
const copyBaseBtn = document.getElementById("copyBaseUrl");
if (copyBaseBtn) {
  copyBaseBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(BASE_URL).then(() => {
      copyBaseBtn.textContent = "Copied!";
      setTimeout(() => (copyBaseBtn.textContent = "Copy"), 1800);
    });
  });
}
