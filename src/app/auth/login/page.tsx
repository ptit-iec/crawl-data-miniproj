import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In - TechNews",
  description:
    "Sign in to your TechNews account to access personalized content and features",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 flex flex-col justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <img
          src="/thongtinkhcn/Logo_PTIT.png"
          alt="TechNews Logo"
          className="h-12 w-auto mx-auto"
        />
        <h2 className="mt-4 text-lg font-medium text-white">TechNews</h2>
      </div>

      <LoginForm />
    </div>
  );
}
