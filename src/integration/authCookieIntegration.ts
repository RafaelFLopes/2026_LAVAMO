import { Platform } from 'react-native';
import { createApiCookie } from './httpClientCookie';
import { User } from '@/@types/user';

const DEFAULT_AUTH_API_URL = 'https://login-p26w.onrender.com/fatec/login/v1';

// Web: chama o proxy do próprio servidor Expo (mesmo endereço do site),
// senão o navegador descarta o cookie SameSite=Lax vindo de outro domínio.
// Android: chama a API direto, o React Native guarda o cookie nativamente.
const AUTH_BASE_URL = Platform.OS === 'web'
  ? '/api/login/v1'
  : process.env.EXPO_PUBLIC_AUTH_API_URL || DEFAULT_AUTH_API_URL;

const authApi = createApiCookie(AUTH_BASE_URL);

export type RegisterRequest = {
  username: string;
  password: string;
  email: string;
  cep: string;
};

export type AuthRequest = {
  username: string;
  password: string;
};

export type AuthCookieResponse = User;

function isAuthCookieResponse(value: unknown): value is AuthCookieResponse {
  if (!value || typeof value !== 'object') return false;

  const data = value as Partial<AuthCookieResponse>;
  return (
    typeof data.userId === 'string' && data.userId.trim() !== '' &&
    typeof data.username === 'string' && data.username.trim() !== '' &&
    Array.isArray(data.roles)
  );
}

function parseSession(data: unknown): AuthCookieResponse {
  if (!isAuthCookieResponse(data)) {
    throw new Error('A API retornou uma sessão inválida.');
  }
  return data;
}

// O /create já devolve o usuário logado e o cookie da sessão.
export const register = async (data: RegisterRequest): Promise<AuthCookieResponse> => {
  const response = await authApi.post<AuthCookieResponse>('/create', data);
  return parseSession(response.data);
};

export const login = async (data: AuthRequest): Promise<AuthCookieResponse> => {
  const response = await authApi.post<AuthCookieResponse>('/auth', data);
  return parseSession(response.data);
};

export const logout = async (): Promise<void> => {
  await authApi.post('/logout');
};
