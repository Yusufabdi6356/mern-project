import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <p className="text-lg font-bold">Finance Tracker</p>
      <RegisterForm />
    </div>
  );
}
