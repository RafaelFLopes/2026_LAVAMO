# Lavamo

App Android + Web (Expo SDK 57 + Expo Router) para gerenciar a lavanderia comunitária de um condomínio.
O morador lê o QR Code da máquina (Android) ou digita o código (Android e Web), vê se ela está livre e reserva ou libera a máquina.

- **Login e cadastro com cookie** usando a API do professor (`https://login-p26w.onrender.com/fatec/login/v1`)
- **Recurso nativo:** câmera lendo QR Code (`expo-camera`), só no Android
- **Dados das máquinas:** mockados em `bd.json` e salvos no AsyncStorage do aparelho

---

## Estrutura de Pastas

```
lavamo/
├── bd.json                       # 5 máquinas (carga inicial do "banco")
├── docs/qrcodes/                 # QR Codes das máquinas para a demonstração
├── assets/images/logo-lavamo.png # logo oficial (troque o arquivo para mudar)
└── src/
    ├── app/                      # telas (Expo Router)
    │   ├── _layout.tsx           # AuthCookieProvider
    │   ├── (auth)/               # login e cadastro (públicas)
    │   ├── (app)/_layout.tsx     # guard + Stack (Android)
    │   ├── (app)/_layout.web.tsx # guard + barra superior (Web)
    │   ├── (app)/(tabs)/         # Início, Escanear, Perfil (abas no Android)
    │   ├── (app)/machine/[code]  # detalhe da máquina + reservar/cancelar
    │   └── api/login/v1/         # proxy da API de login (só Web)
    ├── integration/              # acesso a dados (HTTP com cookie e "banco" local)
    ├── context/                  # sessão do usuário (AuthCookieContext)
    ├── hooks/                    # useMachine
    ├── components/               # alert (android/ios/web), button, input, card...
    ├── constants/                # cores (preto e branco)
    ├── utils/                    # authProxy (repasse servidor → API)
    └── @types/                   # Machine, User
```

## Como funciona o cookie

- **Android:** o app chama a API direto e o React Native guarda o cookie `access_token` sozinho.
- **Web:** a API manda o cookie com `SameSite=Lax`. Como o site (`localhost`) e a API (`onrender.com`) são domínios diferentes, o navegador descartaria o cookie. Por isso a Web chama `/api/login/v1/*` no próprio servidor do Expo (API Routes), que repassa para a API. Assim o cookie chega pelo mesmo endereço do site e é aceito.
- O cookie é `HttpOnly`, então o JavaScript nunca lê o JWT. A sessão (userId, username) fica em memória, e recarregar a página volta para o login.

## Como rodar

```bash
npm install
cp .env.example .env     # opcional: sem .env o app usa a API online por padrão
npx expo start
```

- **Web:** pressione `w`, ou abra `http://localhost:8081`
- **Android:** leia o QR Code do terminal com o app **Expo Go**

Para testar a câmera, abra uma imagem de `docs/qrcodes/` na tela do PC e aponte o celular na aba **Escanear**.

> O servidor gratuito do Render "dorme": o primeiro login pode levar até 1 minuto.

## Regras das máquinas

- Cada usuário pode usar **no máximo 1 máquina** por vez.
- Só quem reservou pode cancelar a reserva.
- Os dados ficam em cada aparelho/navegador. Para voltar ao estado do `bd.json`, limpe os dados do site (DevTools → Application → Clear site data) ou os dados do app no Android.
