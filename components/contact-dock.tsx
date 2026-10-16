import { site } from "@/lib/site";
import { whatsappHref } from "@/lib/whatsapp";

export function ContactDock({ phone }: { phone: string }) {
  const whatsapp = whatsappHref(phone, "Hi Pick Trinkets! I have a question about a charm.");

  return (
    <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2">
      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition duration-200 hover:-translate-y-0.5"
        >
          <WhatsAppIcon />
          WhatsApp
        </a>
      ) : null}
      <a
        href={site.instagram}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white shadow-lg transition duration-200 hover:-translate-y-0.5"
      >
        <InstagramIcon />
        Instagram
      </a>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l6-1.6A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.6.9.9-3.5-.2-.3A9.1 9.1 0 1 1 12 20.5Zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.5 4 5.2 5.2 0 0 0 3.1.8 2.6 2.6 0 0 0 1.8-1.2 2.1 2.1 0 0 0 .1-1.2c-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
