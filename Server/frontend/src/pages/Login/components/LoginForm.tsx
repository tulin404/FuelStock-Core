import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { login } from "@login/actions/login.action";
import { ErrorToast } from "@/components/ErrorToast";
import FuelStockTransparent from "/FuelStock-Transparent.webp";
import bgImage from "../assets/login-background.webp";

export function LoginForm() {
    const setLoading = useAuthStore((state) => state.setLoading);
    const setAuth = useAuthStore((state) => state.setAuth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState<Error | null>(null);

    useLayoutEffect(() => {
        document.documentElement.classList.add("overflow-hidden");

        return () => document.documentElement.classList.remove("overflow-hidden");
    }, []);
    
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        };
    }, [isAuthenticated, navigate]);

    async function handleLogin(formData: FormData) {
        try {
            setLoading(true);
            const data = await login(formData);
            setAuth(data.user, data.token);
            // WILL BE NAVIGATED BY THE SET AUTH/USE EFFECT
        } catch (error) {
            setLoginError(error);
        } finally {
            setLoading(false);
        };
    };

    return (
        <main className="min-h-screen flex isolate flex-col items-center justify-center bg-transparent overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center z-0 bg-black!"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    top: 0, left: 0, right: 0, bottom: 0,
                    width: '100vw',
                    height: '100dvh'
                }}
            ></div>
            <div className="sm:hidden absolute left-0 right-0 top-20 bottom-0 bg-linear-to-t from-black via-transparent to-transparent" />
            <section>
                <form action={handleLogin} id="login" className="relative bg-surface py-8 px-4 lg:px-6 rounded-md border-2 border-border hover:border-border-hover transition-colors duration-200 flex flex-col gap-6">
                    <img className="h-48 lg:h-56 self-center" src={FuelStockTransparent} />
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-lg font-medium font-main text-text">Email</label>
                            <input name="email" type="email" placeholder="joao.silva@empresa.com.br" id="email" required className="border-2 border-input-border focus:border-input-border-focus transition-colors duration-200 rounded-md py-0.5 px-1" />
                        </div>
                        <div className="flex flex-col relative">
                            <label htmlFor="password" className="text-lg font-medium font-main text-text">Senha</label>
                            <input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required className="border-2 pr-9 box-border border-border focus:border-input-border-focus transition-colors duration-200 rounded-md py-0.5 pl-1" />
                            <button onClick={() => {setShowPassword(prev => !prev)}} className="z-10 absolute bottom-1.5 right-2 transition-opacity duration-200" type="button">
                                {showPassword ? <div><span className="-left-1.5 absolute bg-border w-0.5 h-full rounded-full" /><EyeOff strokeWidth={1.5} size={20} /></div> : <div><span className="-left-1.5 absolute bg-border w-0.5 h-full rounded-full" /><Eye strokeWidth={1.5} size={20} /></div>}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="bg-button font-secondary font-semibold text-2xl text-button-text w-[80%] py-1 lg:py-2 rounded-lg self-center hover:bg-button-hover sm:hover:-translate-y-1 active:scale-95 active:bg-button-active transition-all duration-200">Entrar</button>
                    {loginError && <ErrorToast error={loginError} onClose={setLoginError} />}
                </form>
            </section>
        </main>
    );
};