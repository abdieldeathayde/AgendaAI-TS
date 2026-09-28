import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main>
      <div className="container">
        <h1>Entrar</h1>
        <p className="muted">Use um usuário criado pelo seed ou pelo cadastro.</p>
        <LoginForm />
      </div>
    </main>
  );
}
