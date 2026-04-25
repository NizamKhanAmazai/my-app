const missingEnvMessage = (keys: string[]) =>
  [
    "Missing required environment variables:",
    ...keys.map((key) => `- ${key}`),
    "Add them to your .env file and restart the dev server.",
  ].join("\n");

const globalForEnv = globalThis as unknown as {
  __envValidated?: boolean;
};

export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value || !value.trim()) {
    throw new Error(missingEnvMessage([key]));
  }
  return value;
}

export function validateStartupEnv() {
  if (globalForEnv.__envValidated) {
    return;
  }

  const requiredKeys = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ];

  const missingKeys = requiredKeys.filter((key) => {
    const value = process.env[key];
    return !value || !value.trim();
  });

  if (missingKeys.length > 0) {
    throw new Error(missingEnvMessage(missingKeys));
  }

  globalForEnv.__envValidated = true;
}
