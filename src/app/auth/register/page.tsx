import RegisterForm from "@/components/auth/RegisterForm";
import Image from "next/image";
export const metadata = {
  title: "Create Account - TechNews",
  description: "Sign up for TechNews to get access to the latest technology news and personalized content",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 flex flex-col justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <Image
          src="/thongtinkhcn/Logo_PTIT.png"
          alt="TechNews Logo"
          width={200}   
          height={48}
          className="h-12 w-auto mx-auto"
        />
        <h2 className="mt-4 text-lg font-medium text-white">TechNews</h2>
      </div>
      
      <RegisterForm />
    </div>
  );
}
