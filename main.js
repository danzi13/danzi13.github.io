const SUPPORT_EMAIL = "danzimichael13@gmail.com";
const CONTACT_LINKS = {
  email: `https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}&su=Play%20Crown%20Feedback`,
  linkedin: "https://www.linkedin.com/in/michael-danzi-/"
};

const legalTabs = document.getElementById("legal-tabs");
const legalContent = document.getElementById("legal-content");
const contactStrip = document.getElementById("contact-strip");

let activeDocKey = "privacy";

function renderContactStrip() {
  const entries = [
    { label: "Email Support", href: CONTACT_LINKS.email }
  ];

  if (CONTACT_LINKS.linkedin) {
    entries.push({ label: "LinkedIn", href: CONTACT_LINKS.linkedin });
  }

  contactStrip.innerHTML = entries
    .map(
      (entry) =>
        `<a class="chip" href="${entry.href}" ${
          entry.href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""
        }>${entry.label}</a>`
    )
    .join("");
}

function renderTabs(content) {
  const labels = {
    privacy: "Privacy Policy",
    tos: "Terms of Service"
  };

  legalTabs.innerHTML = Object.keys(content)
    .map((key) => {
      const activeClass = key === activeDocKey ? "legal-tab is-active" : "legal-tab";
      return `<button class="${activeClass}" type="button" data-doc="${key}">${labels[key] || key}</button>`;
    })
    .join("");

  legalTabs.querySelectorAll("[data-doc]").forEach((button) => {
    button.addEventListener("click", () => {
      activeDocKey = button.dataset.doc;
      renderTabs(content);
      renderLegalContent(content);
    });
  });
}

function renderLegalContent(content) {
  const doc = content[activeDocKey];
  if (!doc) {
    legalContent.innerHTML = "<p>Legal document unavailable.</p>";
    return;
  }

  legalContent.innerHTML = `
    <div class="legal-section">
      <h3>${doc.title}</h3>
      <p>${escapeHtml(doc.sections[0]?.body || "")}</p>
    </div>
    ${doc.sections
      .slice(1)
      .map(
        (section) => `
          <article class="legal-section">
            ${section.header ? `<h3>${escapeHtml(section.header)}</h3>` : ""}
            <p>${escapeHtml(section.body)}</p>
          </article>
        `
      )
      .join("")}
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadLegalContent() {
  try {
    const response = await fetch("./legal-content.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const content = await response.json();
    renderTabs(content);
    renderLegalContent(content);
  } catch (error) {
    legalContent.innerHTML =
      "<p>Could not load the Terms or Privacy Policy. Please contact support by email.</p>";
  }
}

renderContactStrip();
loadLegalContent();
