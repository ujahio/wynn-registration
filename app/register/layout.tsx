import Header from "@/components/header";
import { RegisterContextProvider } from "./registerContext";
import Footer from "@/components/footer";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<RegisterContextProvider>
			<div className="flex h-screen flex-col bg-gray-100">
				<Header />
				<main className="flex-1 wrapper">{children}</main>
				<Footer />
			</div>
		</RegisterContextProvider>
	);
}
