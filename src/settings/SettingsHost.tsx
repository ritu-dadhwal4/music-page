'use client';

import { useConfig } from './ConfigProvider';
import { GearButton } from './GearButton';
import { SettingsPanel } from './SettingsPanel';

/**
 * Renders nothing at all in public mode. Both `isSettingsMode` and `editKey`
 * were decided on the server against `process.env.EDIT_KEY` - this component
 * never inspects the URL itself, so the gear is present in the server-rendered
 * markup rather than appearing a beat after hydration. Every write is still
 * re-checked server-side.
 */
export function SettingsHost() {
  const { isSettingsMode, editKey, settingsOpen, setSettingsOpen } = useConfig();

  if (!isSettingsMode || !editKey) return null;

  return (
    <>
      <GearButton onClick={() => setSettingsOpen(true)} />
      {settingsOpen ? (
        <SettingsPanel editKey={editKey} onClose={() => setSettingsOpen(false)} />
      ) : null}
    </>
  );
}
