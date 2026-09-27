import React, { createContext, useState, useContext, useEffect } from "react";
import { router } from "expo-router";
import { login as loginApi, register as registerApi, logout as logoutApi, RegisterRequest } from "@/integration/authCookieIntegration";
import { setUnauthorizedHandlerCookie } from "@/integration/httpClientCookie";
import { User } from "@/@types/user";

type AuthResult = { ok: boolean; error?: string };

type AuthCookieContextData = {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    signIn: (username: string, password: string) => Promise<AuthResult>;
    signUp: (data: RegisterRequest) => Promise<AuthResult>;
    signOut: () => Promise<void>;
};

const AuthCookieContext = createContext<AuthCookieContextData>({} as AuthCookieContextData);

function isNetworkError(err: any) {
    return !err?.response;
}

export const AuthCookieProvider = ({ children }: { children: React.ReactNode }) => {
    // A sessão fica só em memória: o JWT está num cookie HttpOnly, que o JS não
    // consegue ler, e a API não tem rota "quem sou eu" para restaurar a sessão.
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    function clearSession() {
        setUser(null);
    }

    useEffect(() => {
        setUnauthorizedHandlerCookie(() => {
            clearSession();
            router.replace("/");
        });
    }, []);

    async function signIn(username: string, password: string): Promise<AuthResult> {
        setIsLoading(true);
        try {
            const response = await loginApi({ username, password });
            setUser(response);
            return { ok: true };
        } catch (err: any) {
            if (isNetworkError(err)) {
                return { ok: false, error: 'Servidor indisponível. Tente novamente em instantes.' };
            }
            return { ok: false, error: 'Usuário ou senha incorretos.' };
        } finally {
            setIsLoading(false);
        }
    }

    async function signUp(data: RegisterRequest): Promise<AuthResult> {
        setIsLoading(true);
        try {
            // O /create já devolve o usuário e o cookie: a pessoa entra direto.
            const response = await registerApi(data);
            setUser(response);
            return { ok: true };
        } catch (err: any) {
            if (isNetworkError(err)) {
                return { ok: false, error: 'Servidor indisponível. Tente novamente em instantes.' };
            }
            return { ok: false, error: 'Não foi possível criar a conta. O usuário pode já existir.' };
        } finally {
            setIsLoading(false);
        }
    }

    async function signOut() {
        try {
            await logoutApi();
        } catch {
            // Cookie já expirado: a sessão local é limpa do mesmo jeito.
        } finally {
            clearSession();
        }
    }

    return (
        <AuthCookieContext.Provider value={{ isAuthenticated: !!user, user, isLoading, signIn, signUp, signOut }}>
            {children}
        </AuthCookieContext.Provider>
    );
};

export const useAuthCookie = () => useContext(AuthCookieContext);
