/**
 * Mirror a submitted lead into the owner's Google Sheet.
 *
 * The form already emails the owner through Web3Forms, and that path stays
 * exactly as it was: it is a real HTML post that works with scripting off,
 * and nothing here can break it. This adds a second, best-effort copy into a
 * spreadsheet, which is what turns a pile of notification emails into a lead
 * list you can sort, keep, and draft replies from.
 *
 * Deliberately silent. If the sheet write fails, the visitor must not see an
 * error and the submission must not be retried: the lead has already been
 * emailed, so the worst case is a row that has to be pasted in by hand, and
 * that is not worth showing a homeowner a red box over.
 *
 * The receiving end is the Apps Script in the lead-followup repo, under
 * tools/sheet-endpoint/. It runs in the site owner's own Google account, so
 * the lead data goes to the owner and to nobody else.
 *
 * Set PUBLIC_SHEET_ENDPOINT to switch this on. With it unset, which is how
 * the repository ships, this does nothing at all.
 */

const ENDPOINT = import.meta.env.PUBLIC_SHEET_ENDPOINT ?? "";

/**
 * Form field names, in the order they appear on the form, mapped to the keys
 * the sheet endpoint expects.
 *
 * Kept as an explicit table rather than derived from the form, so renaming a
 * label on the page cannot quietly change the shape of the spreadsheet.
 */
const FIELD_MAP: ReadonlyArray<readonly [formName: string, payloadKey: string]> = [
  ["Name", "name"],
  ["Phone", "phone"],
  ["Email", "email"],
  ["Project type", "projectType"],
  ["City or ZIP", "city"],
  ["Timeline", "timeline"],
  ["Project details", "details"],
  ["How they heard", "source"],
  ["Budget", "budget"],
  ["Prefers text", "prefersText"],
  ["botcheck", "botcheck"],
];

/** Read one field's value out of the form, as a trimmed string. */
function valueOf(form: HTMLFormElement, name: string): string {
  const data = new FormData(form);
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Send the lead to the sheet.
 *
 * Uses sendBeacon, which is built for exactly this: the page is about to
 * navigate to the thank-you page, and a normal fetch would be cancelled
 * mid-flight. The browser takes the payload and delivers it regardless.
 *
 * The body goes as text/plain so the request stays a simple one. A JSON
 * content type would trigger a CORS preflight, and Apps Script does not
 * answer preflights, so the row would never arrive.
 *
 * Parameters:
 *   form (HTMLFormElement): The submitted quote form.
 */
export function mirrorToSheet(form: HTMLFormElement): void {
  if (!ENDPOINT) return;

  try {
    const payload: Record<string, string> = {};
    for (const [formName, payloadKey] of FIELD_MAP) {
      payload[payloadKey] = valueOf(form, formName);
    }

    const body = new Blob([JSON.stringify(payload)], { type: "text/plain;charset=UTF-8" });

    if (typeof navigator.sendBeacon === "function" && navigator.sendBeacon(ENDPOINT, body)) {
      return;
    }

    // Older browsers, or a beacon the browser declined to queue. keepalive
    // gives the request the same chance of outliving the navigation.
    void fetch(ENDPOINT, {
      method: "POST",
      body,
      keepalive: true,
      mode: "no-cors",
    }).catch(() => {
      // Nothing to do, and nothing worth telling the visitor.
    });
  } catch {
    // A sheet copy is a convenience. It never gets in the way of a lead.
  }
}
