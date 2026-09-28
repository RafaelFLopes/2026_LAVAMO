# Lavamo

App Android + Web (Expo SDK 57 + Expo Router) para gerenciar a lavanderia comunitária de um condomínio.
O morador lê o QR Code da máquina (Android) ou digita o código (Android e Web), vê se ela está livre e reserva ou libera a máquina.


<img width="1080" height="2316" alt="Screenshot_20260927_225413_Expo Go" src="https://github.com/user-attachments/assets/918b2c91-d5c1-4613-b185-fd52193e4523" />


<img width="1080" height="2316" alt="Screenshot_20260927_225424_Expo Go" src="https://github.com/user-attachments/assets/e9f21901-861e-4235-b9ba-5de9e4d674f7" />

<img width="1080" height="2316" alt="Screenshot_20260927_225433_Expo Go" src="https://github.com/user-attachments/assets/e9974772-e791-4a2f-b6e3-fd06da229986" />

<img width="1080" height="2316" alt="Screenshot_20260927_225441_Expo Go" src="https://github.com/user-attachments/assets/da746c7a-05f9-45c8-96e2-cba041c6f1cd" />




## Telas na versão web

| **Login** | **Cadastro** |
|:---:|:---:|
| <img width="900" src="https://github.com/user-attachments/assets/c96db4e5-b2ad-4ab1-a3aa-c8404ae2d8b6"> | <img width="900" src="https://github.com/user-attachments/assets/c0a1b950-f749-42b3-8a22-4acb57c33d9c"> |

| **Home** | **Perfil** |
|:---:|:---:|
| <img width="900" src="https://github.com/user-attachments/assets/7405ceea-cc30-4321-b6b2-e350b772f137"> | <img width="900" src="https://github.com/user-attachments/assets/d7c5dc57-8dd4-4a73-8aba-c9808d326c55"> |

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
