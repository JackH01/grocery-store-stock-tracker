const CSFR_COOKIE_NAME: string = "csrftoken";

export function getCSRFCookie() {
    var b = document.cookie.match(
        "(^|;)\\s*" + CSFR_COOKIE_NAME + "\\s*=\\s*([^;]+)"
    );
    return b ? b.pop() : "";
  }