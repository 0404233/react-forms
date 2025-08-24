import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { baseSchema } from '../utils/validation';
import { validateImageFile, fileToBase64 } from '../utils/image';
import { useAppDispatch, useCountries } from '../hooks';
import { addSubmission } from '../store/submissionsSlice';
import Autocomplete from '../components/Autocomplete';
import { GenderField, PasswordStrength } from './shared';
import type { Gender } from '../types';

export default function HookForm({ onSuccess }: { onSuccess: () => void }) {
  const dispatch = useAppDispatch();
  const countries = useCountries();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
    getValues,
    control,
  } = useForm({
    resolver: zodResolver(baseSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'male',
      acceptedTC: true,
      country: '',
      pictureFile: undefined,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const imgValid = validateImageFile(data.pictureFile);
    if (!imgValid.ok) return;

    const pictureBase64 = data.pictureFile
      ? await fileToBase64(data.pictureFile)
      : undefined;

    dispatch(
      addSubmission({
        name: data.name,
        age: Number(data.age),
        email: data.email,
        password: data.password,
        gender: data.gender,
        acceptedTC: data.acceptedTC,
        pictureBase64,
        country: data.country,
        source: 'react-hook-form',
      })
    );

    onSuccess();
  });

  const pw = watch('password') || '';

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="r-name">Name</label>
        <input id="r-name" {...register('name')} />
        <div className="error">{errors.name?.message || '\u00A0'}</div>
      </div>

      <div className="field">
        <label htmlFor="r-age">Age</label>
        <input id="r-age" inputMode="numeric" {...register('age')} />
        <div className="error">{errors.age?.message || '\u00A0'}</div>
      </div>

      <div className="field">
        <label htmlFor="r-email">Email</label>
        <input id="r-email" type="email" {...register('email')} />
        <div className="error">{errors.email?.message || '\u00A0'}</div>
      </div>

      <div className="field">
        <label htmlFor="r-password">Password</label>
        <input
          id="r-password"
          data-testid="password"
          type="password"
          {...register('password')}
        />
        <PasswordStrength value={pw} />
        <div className="error">{errors.password?.message || '\u00A0'}</div>
      </div>

      <div className="field">
        <label htmlFor="r-cpassword">Confirm password</label>
        <input
          id="r-cpassword"
          data-testid="confirm-password"
          type="password"
          {...register('confirmPassword')}
        />
        <div className="error">
          {errors.confirmPassword?.message || '\u00A0'}
        </div>
      </div>

      <GenderField
        value={getValues('gender')}
        onChange={(v) =>
          setValue('gender', v as Gender, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        error={errors.gender?.message}
      />

      <div className="field inline">
        <label className="checkbox">
          <input id="r-tc" type="checkbox" {...register('acceptedTC')} /> Accept
          Terms & Conditions
        </label>
        <div className="error">{errors.acceptedTC?.message || '\u00A0'}</div>
      </div>

      <div className="field">
        <Autocomplete
          id="r-country"
          label="Country"
          value={getValues('country') || ''}
          onChange={(v) =>
            setValue('country', v, { shouldValidate: true, shouldDirty: true })
          }
          options={countries}
          error={errors.country?.message}
        />
      </div>

      <div className="field">
        <label htmlFor="r-picture">Picture (PNG/JPEG ≤ 2MB)</label>
        <Controller
          name="pictureFile"
          control={control}
          render={({ field }) => (
            <input
              id="r-picture"
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => field.onChange(e.target.files?.[0])}
            />
          )}
        />
        <div className="error">{errors.pictureFile?.message || '\u00A0'}</div>
      </div>

      <div className="actions">
        <button type="submit" disabled={!isValid}>
          Submit
        </button>
      </div>
    </form>
  );
}
