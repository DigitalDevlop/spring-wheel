import { getCountries, getCountryCallingCode } from 'libphonenumber-js';

const countries = getCountries(); // e.g., ['US', 'IN', 'LK']

export const countryOptions = countries.map((iso) => ({
  code: `+${getCountryCallingCode(iso)}`,
  iso,
}));
