import { useMemo, useState } from 'react';

interface Props {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  id: string;
  label: string;
  error?: string;
}

export default function Autocomplete({
  options,
  value,
  onChange,
  id,
  label,
  error,
}: Props) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 10);
    return options.filter((o) => o.toLowerCase().includes(q)).slice(0, 10);
  }, [options, query]);

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
        autoComplete="off"
        list={`${id}-list`}
      />
      <datalist id={`${id}-list`}>
        {filtered.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
      <div className="error" aria-live="polite">
        {error || '\u00A0'}
      </div>
    </div>
  );
}
