import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Instrument+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-root {
    min-height: 100vh;
    display: flex;
    background: #0a0a0f;
    font-family: 'Instrument Sans', sans-serif;
    color: #e8e8f0;
    overflow: hidden;
  }

  .auth-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 52px 56px;
    position: relative;
    background: linear-gradient(135deg, #0d0d1a 0%, #111128 100%);
    overflow: hidden;
  }

  .auth-panel::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
    top: -150px; left: -150px;
    pointer-events: none;
  }

  .auth-panel::after {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%);
    bottom: -80px; right: -80px;
    pointer-events: none;
  }

  .auth-brand {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 28px;
    letter-spacing: -0.5px;
    color: #fff;
    z-index: 1;
  }
  .auth-brand span { color: #818cf8; }

  .auth-tagline { z-index: 1; }
  .auth-tagline h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 4vw, 56px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -2px;
    color: #fff;
    margin-bottom: 20px;
  }
  .auth-tagline h2 em {
    font-style: normal;
    background: linear-gradient(90deg, #818cf8, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .auth-tagline p {
    font-size: 16px;
    color: rgba(232,232,240,0.5);
    font-weight: 300;
    max-width: 340px;
    line-height: 1.7;
  }

  .auth-dots { display: flex; gap: 8px; z-index: 1; }
  .auth-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(232,232,240,0.2); }
  .auth-dot.active { background: #818cf8; width: 24px; border-radius: 4px; }

  .auth-form-wrap {
    width: 460px;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 48px;
    background: #0f0f1a;
    border-left: 1px solid rgba(255,255,255,0.06);
  }

  .auth-form-inner {
    width: 100%;
    animation: fadeUp 0.5s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .auth-toggle {
    display: flex;
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 36px;
  }
  .auth-toggle button {
    flex: 1;
    padding: 10px;
    border: none;
    background: transparent;
    color: rgba(232,232,240,0.45);
    font-family: 'Instrument Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 9px;
    transition: all 0.25s;
  }
  .auth-toggle button.active {
    background: #818cf8;
    color: #fff;
    box-shadow: 0 4px 20px rgba(129,140,248,0.35);
  }

  .auth-heading {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.8px;
    color: #fff;
    margin-bottom: 6px;
  }
  .auth-sub {
    font-size: 14px;
    color: rgba(232,232,240,0.4);
    margin-bottom: 32px;
  }

  .auth-field { margin-bottom: 16px; }
  .auth-field label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: rgba(232,232,240,0.5);
    letter-spacing: 0.6px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .auth-field input {
    width: 100%;
    padding: 13px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    color: #e8e8f0;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .auth-field input:focus {
    border-color: #818cf8;
    box-shadow: 0 0 0 3px rgba(129,140,248,0.15);
  }
  .auth-field input::placeholder { color: rgba(232,232,240,0.25); }

  .auth-error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3);
    color: #f87171;
    font-size: 13px;
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .auth-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #818cf8, #6366f1);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 8px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
  }
  .auth-btn:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(99,102,241,0.45); }
  .auth-btn:active { transform: translateY(0); }
  .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .auth-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
    color: rgba(232,232,240,0.2);
    font-size: 12px;
    letter-spacing: 0.5px;
  }
  .auth-divider::before, .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }

  .auth-google {
    width: 100%;
    padding: 13px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #e8e8f0;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: background 0.2s, border-color 0.2s;
  }
  .auth-google:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.18); }
  .auth-google:disabled { opacity: 0.5; cursor: not-allowed; }
  .google-icon { width: 18px; height: 18px; flex-shrink: 0; }

  @media (max-width: 768px) {
    .auth-panel { display: none; }
    .auth-form-wrap { width: 100%; border-left: none; padding: 32px 24px; }
  }
`;

const GoogleIcon = () => (
  <svg className="google-icon" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

function getFirebaseError(code) {
  const map = {
    "auth/user-not-found": "Пользователь не найден",
    "auth/wrong-password": "Неверный пароль",
    "auth/invalid-credential": "Неверный email или пароль",
    "auth/email-already-in-use": "Email уже используется",
    "auth/weak-password": "Пароль слишком слабый (минимум 6 символов)",
    "auth/invalid-email": "Некорректный email",
    "auth/popup-closed-by-user": "Окно входа было закрыто",
    "auth/too-many-requests": "Слишком много попыток. Попробуй позже",
    "auth/network-request-failed": "Ошибка сети. Проверь подключение",
  };
  return map[code] || "Произошла ошибка. Попробуй снова.";
}

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearError = () => setError("");

  const handleGoogle = async () => {
    setLoading(true);
    clearError();
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (e) {
      setError(getFirebaseError(e.code));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
      }
      navigate("/dashboard");
    } catch (e) {
      setError(getFirebaseError(e.code));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    clearError();
    setName(""); setEmail(""); setPassword("");
  };

  return (
    <>
      <style>{css}</style>
      <div className="auth-root">
        <div className="auth-panel">
          <div className="auth-brand">my<span>TON</span></div>
          <div className="auth-tagline">
            <h2>Войди.<br /><em>Создавай.</em><br />Побеждай.</h2>
            <p>Всё, что тебе нужно — в одном месте. Начни прямо сейчас.</p>
          </div>
          <div className="auth-dots">
            <div className="auth-dot active" />
            <div className="auth-dot" />
            <div className="auth-dot" />
          </div>
        </div>

        <div className="auth-form-wrap">
          <div className="auth-form-inner">
            <div className="auth-toggle">
              <button className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>
                Войти
              </button>
              <button className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>
                Регистрация
              </button>
            </div>

            <h1 className="auth-heading">
              {mode === "login" ? "С возвращением 👋" : "Создать аккаунт"}
            </h1>
            <p className="auth-sub">
              {mode === "login" ? "Введи данные для входа" : "Заполни форму, это займёт минуту"}
            </p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              {mode === "register" && (
                <div className="auth-field">
                  <label>Имя</label>
                  <input
                    type="text"
                    placeholder="Carol Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="auth-field">
                <label>Пароль</label>
                <input
                  type="password"
                  placeholder={mode === "register" ? "Минимум 6 символов" : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
              </button>
            </form>

            <div className="auth-divider">или</div>

            <button className="auth-google" onClick={handleGoogle} disabled={loading}>
              <GoogleIcon />
              Продолжить с Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
}