import { forwardToAuthApi } from '@/utils/authProxy';

// Proxy (Web): POST /api/login/v1/auth → API de login /fatec/login/v1/auth
export function POST(request: Request) {
  return forwardToAuthApi(request, '/auth');
}
