import { readConfig } from '@/lib/config-store';
import { isValidEditKey } from '@/lib/auth';
import { ConfigProvider } from '@/settings/ConfigProvider';
import { PageShell } from '@/components/PageShell';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const editParam = params.edit;
  const candidate = Array.isArray(editParam) ? editParam[0] : editParam;

  // A wrong key renders the public page verbatim - no error, no hint. Telling
  // a stranger they found the right parameter name is the whole risk here.
  const isSettingsMode = isValidEditKey(candidate);

  const config = await readConfig();

  return (
    <main>
      <ConfigProvider
        initialConfig={config}
        isSettingsMode={isSettingsMode}
        // Never handed to the client unless the server already validated it.
        editKey={isSettingsMode ? (candidate ?? null) : null}
      >
        <PageShell />
      </ConfigProvider>
    </main>
  );
}
