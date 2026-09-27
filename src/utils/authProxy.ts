// Proxy usado pelas API routes (src/app/api/login/v1/*+api.ts), roda no servidor Expo.
//
// Na Web o site está em localhost e a API em onrender.com: o cookie SameSite=Lax
// vindo de outro domínio é descartado pelo navegador. Passando pelo servidor do
// próprio site, para o navegador o cookie vem do mesmo endereço e é aceito.
// Entre servidor e API não existe SameSite nem CORS.
const AUTH_API_URL = process.env.AUTH_API_URL || 'https://login-p26w.onrender.com/fatec/login/v1';

export async function forwardToAuthApi(request: Request, path: string): Promise<Response> {
  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  const cookie = request.headers.get('cookie');
  if (contentType) headers.set('content-type', contentType);
  if (cookie) headers.set('cookie', cookie);

  const body = await request.text();

  try {
    const upstream = await fetch(`${AUTH_API_URL}${path}`, {
      method: 'POST',
      headers,
      body: body || undefined,
    });

    const responseHeaders = new Headers();
    const upstreamType = upstream.headers.get('content-type');
    if (upstreamType) responseHeaders.set('content-type', upstreamType);
    // Repassa o cookie da sessão para o navegador (sem Domain → fica em localhost).
    for (const setCookie of upstream.headers.getSetCookie()) {
      responseHeaders.append('set-cookie', setCookie);
    }

    return new Response(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json({ message: 'API de login indisponível.' }, { status: 502 });
  }
}
