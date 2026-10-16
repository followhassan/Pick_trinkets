import { SettingsForm } from "@/components/admin/settings-form";
import { getShopSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getShopSettings();

  return (
    <div>
      <h1 className="font-serif text-4xl">Shop settings</h1>
      <p className="mt-2 max-w-xl text-muted">
        The pink bar, homepage words, WhatsApp button, and delivery charge all come from here.
        Prices stay in BDT.
      </p>
      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}