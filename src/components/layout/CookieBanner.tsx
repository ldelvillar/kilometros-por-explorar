import { useState, useEffect } from 'preact/hooks';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already given consent
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    } else if (consent === 'accepted') {
      // If consent was given, load Google Analytics
      loadGoogleAnalytics();
    }
  }, []);

  const loadGoogleAnalytics = () => {
    // Load GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-ZZJC1BHPKM';
    document.head.appendChild(script);

    // Inicializar GA
    script.onload = () => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', 'G-ZZJC1BHPKM');
      (window as any).gtag = gtag;
    };
  };

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    loadGoogleAnalytics();
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      class="fixed right-0 bottom-0 left-0 z-50 border-t-2 border-primary bg-white shadow-2xl"
      role="dialog"
      aria-live="polite"
      aria-label="Consentimiento de cookies"
    >
      <div class="container mx-auto max-w-6xl px-4 py-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex-1">
            <h3 class="mb-2 text-lg font-bold text-gray-900">
              🍪 Usamos cookies
            </h3>
            <p class="text-sm text-gray-600">
              Este sitio utiliza cookies analíticas (Google Analytics) para
              mejorar tu experiencia. Puedes aceptarlas o rechazarlas.{' '}
              <a
                href="/politica-de-privacidad-y-cookies"
                class="text-primary underline hover:text-primary/80"
              >
                Más información
              </a>
            </p>
          </div>
          <div class="flex flex-shrink-0 gap-3">
            <button
              onClick={handleReject}
              class="rounded-lg border-2 border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              aria-label="Rechazar cookies"
            >
              Rechazar
            </button>
            <button
              onClick={handleAccept}
              class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              aria-label="Aceptar cookies"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
