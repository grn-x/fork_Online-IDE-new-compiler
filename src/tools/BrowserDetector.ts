export type BrowserType = "Opera" | "Edge" | "Chrome" | "Safari" | "Firefox" | "IE" | "unknown";


export class BrowserDetector {
    static getBrowserType(): BrowserType {
        if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
            return 'Opera';
        } else if (navigator.userAgent.indexOf("Edg") != -1) {
            return 'Edge';
        } else if (navigator.userAgent.indexOf("Chrome") != -1) {
            return 'Chrome';
        } else if (navigator.userAgent.indexOf("Safari") != -1) {
            return 'Safari';
        } else if (navigator.userAgent.indexOf("Firefox") != -1) {
            return 'Firefox';
        } else if ((navigator.userAgent.indexOf("MSIE") != -1)) {
            return 'IE';
        } else {
            return 'unknown';
        }
    }
}