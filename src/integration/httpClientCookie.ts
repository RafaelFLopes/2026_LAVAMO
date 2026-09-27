import axios from 'axios';

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

// Chamadas de login/cadastro respondem 403 quando os dados estão errados,
// isso não significa sessão expirada.
const PUBLIC_ROUTES = ['/auth', '/create'];

export function setUnauthorizedHandlerCookie(handler: UnauthorizedHandler) {
  onUnauthorized = handler;
}

export function createApiCookie(baseURL: string) {
  // withCredentials: o navegador/app guarda e envia o cookie da sessão sozinho.
  // timeout alto porque o servidor gratuito do Render demora para "acordar".
  const instance = axios.create({ baseURL, withCredentials: true, timeout: 60000 });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const isPublicRoute = PUBLIC_ROUTES.includes(error?.config?.url);

      // A API do professor responde 403 (e não 401) quando o cookie é inválido/expirou.
      if ((status === 401 || status === 403) && !isPublicRoute) {
        onUnauthorized?.();
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
