import { forwardToAuthApi } from '@/utils/authProxy';

// Proxy (Web): POST /api/login/v1/logout → API de login /fatec/login/v1/logout
export function POST(request: Request) {
  return forwardToAuthApi(request, '/logout');
}
