import Header from "@/components/header";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex h-screen flex-col bg-gray-100">
			<Header />
			<main className="flex-1 wrapper">{children}</main>
			{/* <Footer /> */}
		</div>
	);
}
