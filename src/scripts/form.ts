/**
 * Quote form upgrade.
 *
 * The markup is a real HTML form with a real Web3Forms action, so it works
 * with this script absent or broken: Web3Forms accepts the post and
 * redirects to the hidden `redirect` URL. With scripting on, this adds:
 *
 *   1. Field-level validation with the message under the offending field,
 *      rather than a browser tooltip that vanishes on the next click.
 *   2. Phone formatting as the visitor types, which is the highest-friction
 *      field on any home services form.
 *   3. A fetch submit that navigates to the thank-you page on success, so
 *      the conversion lands on a real page either way.
 *   4. A pending state, so nobody double-submits.
 */

interface Rule {
  /** The field's name attribute, which is also the email label. */
  name: string;
  message: string;
  test: (value: string) => boolean;
}

// Deliberately loose. The job is catching a typo, not enforcing RFC 5322.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Ten digits, ignoring whatever punctuation the visitor used. */
function digitsOf(value: string): string {
  return value.replace(/\D/g, "");
}

const RULES: Rule[] = [
  { name: "Name", message: "Tell us your name so we know who we are calling.", test: (v) => v.trim().length > 1 },
  { name: "Email", message: "That email does not look right. Check it and try again.", test: (v) => EMAIL.test(v.trim()) },
  {
    name: "Phone",
    message: "We need ten digits so we can call you back.",
    test: (v) => {
      const d = digitsOf(v);
      // Accept a leading US country code rather than rejecting it.
      return d.length === 10 || (d.length === 11 && d.startsWith("1"));
    },
  },
  { name: "City or ZIP", message: "Which city or ZIP is the project in?", test: (v) => v.trim().length > 1 },
  { name: "Project details", message: "A sentence or two about the project is enough to start.", test: (v) => v.trim().length > 9 },
];

/**
 * Format a US number as the visitor types, without fighting them: digits
 * beyond ten are dropped, and any punctuation they typed is replaced rather
 * than rejected.
 */
function formatPhone(raw: string): string {
  let d = digitsOf(raw);
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function setFieldError(form: HTMLFormElement, name: string, message: string | null): void {
  const field = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${CSS.escape(name)}"]`);
  const target = form.querySelector<HTMLElement>(`[data-error-for="${CSS.escape(name)}"]`);
  if (!field) return;

  if (message) {
    field.setAttribute("data-invalid", "true");
    field.setAttribute("aria-invalid", "true");
    if (target) {
      target.textContent = message;
      target.classList.remove("hidden");
    }
  } else {
    field.removeAttribute("data-invalid");
    field.removeAttribute("aria-invalid");
    if (target) {
      target.textContent = "";
      target.classList.add("hidden");
    }
  }
}

function showStatus(status: HTMLElement, message: string, tone: "ok" | "error"): void {
  status.textContent = message;
  status.classList.remove("hidden");
  status.classList.toggle("border-success-line", tone === "ok");
  status.classList.toggle("bg-success-bg", tone === "ok");
  status.classList.toggle("text-success", tone === "ok");
  status.classList.toggle("border-danger-line", tone === "error");
  status.classList.toggle("bg-danger-bg", tone === "error");
  status.classList.toggle("text-danger", tone === "error");
}

export function initQuoteForm(): void {
  const form = document.getElementById("quote-form") as HTMLFormElement | null;
  if (!form) return;

  const status = document.getElementById("form-status");
  const button = form.querySelector<HTMLButtonElement>("[data-submit]");
  const label = form.querySelector<HTMLElement>("[data-submit-label]");
  const defaultLabel = label?.textContent ?? "Send";

  // Where a successful fetch submit navigates. Prefer the relative path, so
  // a preview on any origin stays on that origin; fall back to the absolute
  // URL Web3Forms uses for the no-JS path.
  const redirectTo =
    form.dataset.thanks ||
    form.querySelector<HTMLInputElement>('input[name="redirect"]')?.value ||
    "";

  const phone = form.querySelector<HTMLInputElement>('[name="Phone"]');
  phone?.addEventListener("input", () => {
    const cursorAtEnd = phone.selectionStart === phone.value.length;
    phone.value = formatPhone(phone.value);
    // Only snap the caret when it was already trailing, so editing the
    // middle of a number does not throw the cursor to the end.
    if (cursorAtEnd) phone.setSelectionRange(phone.value.length, phone.value.length);
  });

  RULES.forEach((rule) => {
    const field = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${CSS.escape(rule.name)}"]`);
    // Clear an error the moment it is fixed, not on the next submit.
    field?.addEventListener("input", () => {
      if (field.getAttribute("data-invalid") === "true" && rule.test(field.value)) {
        setFieldError(form, rule.name, null);
      }
    });
    // Validate on blur so problems surface as they move through the form.
    field?.addEventListener("blur", () => {
      if (field.value.trim() === "") return;
      setFieldError(form, rule.name, rule.test(field.value) ? null : rule.message);
    });
  });

  form.addEventListener("submit", async (event) => {
    const failures = RULES.filter((rule) => {
      const field = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${CSS.escape(rule.name)}"]`);
      return !field || !rule.test(field.value);
    });

    RULES.forEach((rule) => {
      setFieldError(form, rule.name, failures.some((f) => f.name === rule.name) ? rule.message : null);
    });

    if (failures.length > 0) {
      event.preventDefault();
      if (status) showStatus(status, "A couple of fields need a look before this can send.", "error");
      form.querySelector<HTMLElement>(`[name="${CSS.escape(failures[0].name)}"]`)?.focus();
      return;
    }

    // Valid past this point. Without fetch, fall through to the native post
    // rather than swallowing the submission.
    if (typeof fetch !== "function") return;

    event.preventDefault();
    if (button) button.disabled = true;
    if (label) label.textContent = "Sending";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        if (redirectTo) {
          window.location.assign(redirectTo);
          return;
        }
        form.reset();
        if (status) showStatus(status, "Got it. We will call you within one business day.", "ok");
        if (label) label.textContent = "Sent";
        return;
      }

      if (status) {
        showStatus(status, "That did not go through. Try again in a moment, or call us instead.", "error");
      }
    } catch {
      if (status) {
        showStatus(status, "Network trouble on the way out. Try again, or call us instead.", "error");
      }
    } finally {
      if (button && label?.textContent !== "Sent") {
        button.disabled = false;
        if (label) label.textContent = defaultLabel;
      }
    }
  });
}
