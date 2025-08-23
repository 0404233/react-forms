import React, { useRef, useState } from 'react';
import { baseSchema } from '../utils/validation';
import { validateImageFile, fileToBase64 } from '../utils/image';
import { useAppDispatch, useCountries } from '../hooks';
import { addSubmission } from '../store/submissionsSlice';
import Autocomplete from '../components/Autocomplete';
import { GenderField, PasswordStrength } from './shared';

export default function UncontrolledForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');

  const dispatch = useAppDispatch();
  const countries = useCountries();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pw, setPw] = useState('');

  const refs = {
    name: useRef<HTMLInputElement>(null),
    age: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirmPassword: useRef<HTMLInputElement>(null),
    country: useRef<HTMLInputElement>(null),
    acceptedTC: useRef<HTMLInputElement>(null),
    genderMale: useRef<HTMLInputElement>(null),
    genderFemale: useRef<HTMLInputElement>(null),
    picture: useRef<HTMLInputElement>(null),
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const pictureFile = refs.picture.current?.files?.[0];
    const data = {
      name: refs.name.current!.value,
      age: refs.age.current!.value,
      email: refs.email.current!.value,
      password: refs.password.current!.value,
      confirmPassword: refs.confirmPassword.current!.value,
      gender: gender,
      acceptedTC: !!refs.acceptedTC.current?.checked,
      pictureFile,
      country: country,
    };
    const imgValid = validateImageFile(pictureFile);
    if (!imgValid.ok) {
      setErrors((prev) => ({ ...prev, pictureFile: imgValid.error! }));
      return;
    }
    const parse = baseSchema.safeParse(data);
    if (!parse.success) {
      const errs: Record<string, string> = {};
      parse.error.issues.forEach((i) => {
        errs[i.path.join('.')] = i.message;
      });
      setErrors(errs);
      return;
    }
    const pictureBase64 = pictureFile
      ? await fileToBase64(pictureFile)
      : undefined;
    dispatch(
      addSubmission({
        name: parse.data.name,
        age: parse.data.age,
        email: parse.data.email,
        password: parse.data.password,
        gender: parse.data.gender,
        acceptedTC: parse.data.acceptedTC,
        pictureBase64,
        country: parse.data.country,
        source: 'uncontrolled',
      })
    );
    onSuccess();
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="u-name">Name</label>
        <input id="u-name" ref={refs.name} />
        <div className="error" aria-live="polite">
          {errors.name || '\u00A0'}
        </div>
      </div>

      <div className="field">
        <label htmlFor="u-age">Age</label>
        <input id="u-age" ref={refs.age} inputMode="numeric" />
        <div className="error" aria-live="polite">
          {errors.age || '\u00A0'}
        </div>
      </div>

      <div className="field">
        <label htmlFor="u-email">Email</label>
        <input id="u-email" ref={refs.email} type="email" />
        <div className="error" aria-live="polite">
          {errors.email || '\u00A0'}
        </div>
      </div>

      <div className="field">
        <label htmlFor="u-password">Password</label>
        <input
          id="u-password"
          ref={refs.password}
          type="password"
          onInput={(e) => setPw((e.target as HTMLInputElement).value)}
        />
        <PasswordStrength value={pw} />
        <div className="error" aria-live="polite">
          {errors.password || '\u00A0'}
        </div>
      </div>

      <div className="field">
        <label htmlFor="u-cpassword">Confirm password</label>
        <input id="u-cpassword" ref={refs.confirmPassword} type="password" />
        <div className="error" aria-live="polite">
          {errors.confirmPassword || '\u00A0'}
        </div>
      </div>

      <GenderField value={gender} onChange={setGender} error={errors.gender} />
      <div style={{ display: 'none' }} aria-hidden>
        <input
          ref={refs.genderMale}
          type="radio"
          name="u-gender"
          value="male"
        />
        <input
          ref={refs.genderFemale}
          type="radio"
          name="u-gender"
          value="female"
        />
      </div>

      <div className="field inline">
        <label className="checkbox">
          <input id="u-tc" ref={refs.acceptedTC} type="checkbox" /> Accept Terms
          & Conditions
        </label>
        <div className="error" aria-live="polite">
          {errors.acceptedTC || '\u00A0'}
        </div>
      </div>

      <div className="field">
        <label htmlFor="u-country">Country</label>
        <Autocomplete
          id="u-country"
          label="Country"
          value={country}
          onChange={(v) => setCountry(v)}
          options={countries}
          error={errors.country}
        />
      </div>

      <div className="field">
        <label htmlFor="u-picture">Picture (PNG/JPEG ≤ 2MB)</label>
        <input
          id="u-picture"
          ref={refs.picture}
          type="file"
          accept="image/png,image/jpeg"
        />
        <div className="error" aria-live="polite">
          {errors.pictureFile || '\u00A0'}
        </div>
      </div>

      <div className="actions">
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
