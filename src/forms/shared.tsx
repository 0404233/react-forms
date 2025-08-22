import { passwordStrengthChecks } from '../utils/validation';

export function PasswordStrength({ value }: { value: string }) {
  const checks = [
    { label: 'Number', ok: passwordStrengthChecks.hasNumber.test(value) },
    { label: 'Uppercase', ok: passwordStrengthChecks.hasUpper.test(value) },
    { label: 'Lowercase', ok: passwordStrengthChecks.hasLower.test(value) },
    { label: 'Special', ok: passwordStrengthChecks.hasSpecial.test(value) },
  ];
  const met = checks.filter((c) => c.ok).length;
  return (
    <div className="pw-strength" aria-live="polite">
      <div className={`bar met-${met}`} />
      <ul>
        {checks.map((c) => (
          <li key={c.label} aria-checked={c.ok} className={c.ok ? 'ok' : 'no'}>
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const GenderField = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: "" | "male" | "female") => void;
  error?: string;
}) => (
  <div className="field">
    <span>Gender</span>
    <div className="row">
      {['male', 'female'].map((g) => (
        <label key={g} className="radio">
          <input
            type="radio"
            name="gender"
            value={g}
            checked={value === g}
            onChange={(e) => onChange(e.target.value  as "male" | "female")}
          />
          <span>{g}</span>
        </label>
      ))}
    </div>
    <div className="error" aria-live="polite">
      {error || '\u00A0'}
    </div>
  </div>
);
