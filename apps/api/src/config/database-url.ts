type DatabaseUrlInput = {
  databaseUrl?: string;
  host?: string;
  port?: string | number;
  username?: string;
  password?: string;
  name?: string;
};

const assertValue = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing required database env: ${key}`);
  }
  return value;
};

const parsePort = (value: string | number | undefined): number => {
  if (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value > 0 &&
    value <= 65535
  ) {
    return value;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim();
    if (!/^\d+$/.test(normalizedValue)) {
      throw new Error('Missing or invalid database env: DATABASE_PORT');
    }

    const parsedPort = Number(normalizedValue);
    if (Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535) {
      return parsedPort;
    }
  }

  throw new Error('Missing or invalid database env: DATABASE_PORT');
};

export const buildDatabaseUrl = (input: DatabaseUrlInput): string => {
  const directUrl = input.databaseUrl?.trim();
  if (directUrl) {
    return directUrl;
  }

  const host = assertValue(input.host, 'DATABASE_HOST');
  const username = assertValue(input.username, 'DATABASE_USERNAME');
  const password = assertValue(input.password, 'DATABASE_PASSWORD');
  const name = assertValue(input.name, 'DATABASE_NAME');
  const port = parsePort(input.port);

  const url = new URL('postgresql://localhost');
  url.hostname = host;
  url.port = String(port);
  url.username = username;
  url.password = password;
  url.pathname = `/${encodeURIComponent(name)}`;

  return url.toString();
};
