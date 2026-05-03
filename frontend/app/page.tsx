import SignInForm from "../components/auth/SignInForm";

export default function HomePage() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
			<SignInForm />
		</main>
	);
}
