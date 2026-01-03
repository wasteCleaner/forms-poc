/** Shared primitives */
export type ISODateString = `${number}-${number}-${number}`; // "2025-12-17"
export type CountryCode = string; // e.g. "DE", "US"
export type Locale = string; // e.g. "de-DE", "en-US"

export enum AuthMethod {
  Password = 'password',
  MagicLink = 'magic_link',
  OAuth = 'oauth',
}

export enum OAuthProvider {
  Google = 'google',
  Apple = 'apple',
  Github = 'github',
}

export enum UserRegion {
  EU = 'EU',
  US = 'US',
  UK = 'UK',
  Other = 'Other',
}

/** You will likely render options from this */
export type GameId = string;

export type Game = {
  id: GameId;
  title: string;
  platform?: GamePlatform;
  ageRating?: AgeRating;
};

export enum GamePlatform {
  PC = 'pc',
  PlayStation = 'playstation',
  Xbox = 'xbox',
  Switch = 'switch',
  Mobile = 'mobile',
}

export enum AgeRating {
  E = 'E',
  E10 = 'E10+',
  T = 'T',
  M = 'M',
  AO = 'AO',
}

/** =========================
 *  1) Basic form: Auth / Login
 *  ========================= */

export type LoginFormData =
  | {
      method: AuthMethod.Password;
      email: string;
      password: string;
      rememberMe: boolean;
    }
  | {
      method: AuthMethod.MagicLink;
      email: string;
      rememberMe: boolean;
    }
  | {
      method: AuthMethod.OAuth;
      provider: OAuthProvider;
      redirectTo?: string; // where to return after OAuth
      rememberMe: boolean;
    };

export type LoginFormResult =
  | { ok: true; userId: string; sessionId: string }
  | { ok: false; errorCode: AuthErrorCode; message?: string };

export enum AuthErrorCode {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  UserNotFound = 'USER_NOT_FOUND',
  EmailNotVerified = 'EMAIL_NOT_VERIFIED',
  RateLimited = 'RATE_LIMITED',
  Unknown = 'UNKNOWN',
}

/** =========================
 *  2) Advanced form: Edit User (dynamic + arrays)
 *  ========================= */

export type UserId = string;

export type UserSummary = {
  id: UserId;
  email: string;
  displayName: string;
  region: UserRegion;
  locale: Locale;
};

export enum ContactChannel {
  Email = 'email',
  Phone = 'phone',
}

export type ContactPreference = {
  channel: ContactChannel;
  marketingOptIn: boolean;
  productUpdatesOptIn: boolean;
};

export type Address = {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: CountryCode;
};

export type UserBaseFields = {
  email: string;
  displayName: string;
  region: UserRegion; // drives dynamic fields
  locale: Locale;

  contact: ContactPreference;

  // Non-primitive array field: list of selected games (editable)
  favoriteGames: FavoriteGamesField;

  // Example of nested object that all regions might have
  address?: Address;
};

/**
 * Array field modeled as objects, not string[],
 * because you’ll want per-item metadata and stable keys for UI.
 */
export type FavoriteGamesField = Array<{
  id: GameId;
  /** Optional per-item preference */
  favoriteSince?: ISODateString | '';
  /** UI hint: maybe the user pinned it */
  pinned?: boolean;
  /** Helper for Svelte keyed each blocks */
  key?: string;
}>;

/** Region-specific dynamic fields */
export type RegionSpecificFields =
  | {
      region: UserRegion.EU;
      eu: EUUserFields;
    }
  | {
      region: UserRegion.US;
      us: USUserFields;
    }
  | {
      region: UserRegion.UK;
      uk: UKUserFields;
    }
  | {
      region: UserRegion.Other;
      other: OtherRegionUserFields;
    };

export type EUUserFields = {
  // classic EU-ish: privacy + identifiers
  gdprConsent: boolean;
  vatId?: string;
  nationalId?: string; // depending on product; often not desirable, but for POC it’s fine
};

export type USUserFields = {
  // US-ish: state + tax identifiers
  state: USState;
  zipPlus4?: string;
  ssnLast4?: string;
  taxResidencyConfirmed: boolean;
};

export type UKUserFields = {
  county?: string;
  postcode: string;
  ninLast4?: string;
};

export type OtherRegionUserFields = {
  notes?: string;
  timezone?: string; // e.g. "Europe/Berlin"
};

export enum USState {
  CA = 'CA',
  NY = 'NY',
  TX = 'TX',
  FL = 'FL',
  WA = 'WA',
  // ...for POC достаточно нескольких
}

/**
 * Final advanced form shape:
 * - base fields always present
 * - region-specific block present based on `region`
 */
export type EditUserFormData = UserBaseFields & RegionSpecificFields;

/** Useful for PATCH-like submissions */
export type EditUserPatch = Partial<UserBaseFields> &
  Partial<{
    eu: Partial<EUUserFields>;
    us: Partial<USUserFields>;
    uk: Partial<UKUserFields>;
    other: Partial<OtherRegionUserFields>;
  }>;

/** Example API-ish result */
export type EditUserFormResult =
  | { ok: true; user: UserSummary }
  | { ok: false; fieldErrors?: Record<string, string>; formError?: string };

/**
 * Helper type for form state that needs to hold fields for all regions
 * to avoid type errors when accessing fields not currently active.
 */
export type EditUserFormState = UserBaseFields & {
  eu?: EUUserFields;
  us?: USUserFields;
  uk?: UKUserFields;
  other?: OtherRegionUserFields;
};
