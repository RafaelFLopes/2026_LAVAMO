import { forwardToAuthApi } from '@/utils/authProxy';

// Proxy (Web): POST /api/login/v1/create → API de login /fatec/login/v1/create
export function POST(request: Request) {
  return forwardToAuthApi(request, '/create');
}
