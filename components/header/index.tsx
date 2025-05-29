import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
	{ href: "#", label: "ROOMS & SUITES" },
	{ href: "#", label: "WYNN REWARDS" },
	{ href: "#", label: "OFFERS" },
	{ href: "#", label: "DINING" },
	{ href: "#", label: "ENTERTAINMENT" },
	{ href: "#", label: "MEETINGS & EVENTS" },
];

const Header = () => {
	return (
		<header className="w-full border-b bg-white sticky top-0 z-50">
			<div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
				<Link href="/" className="flex items-center">
					<Image
						src="/wynnlogo.svg"
						alt="Wynn Resorts"
						width={150}
						height={50}
						priority
					/>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden lg:flex items-center space-x-6">
					{navLinks.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className="font-semibold text-sm leading-[17px] tracking-[0.5px] uppercase text-gray-700 hover:text-red-700 transition-colors"
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center space-x-4">
					{/* Desktop Language Selector */}
					<div className="hidden lg:block">
						<Select defaultValue="en">
							<SelectTrigger className="w-[70px] font-semibold text-sm leading-[17px] tracking-[0.5px] uppercase border-none focus:ring-0">
								<SelectValue placeholder="Language" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="en" className="font-semibold text-sm">
									EN
								</SelectItem>
								<SelectItem value="es" className="font-semibold text-sm">
									ES
								</SelectItem>
								<SelectItem value="zh" className="font-semibold text-sm">
									ZH
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Mobile Menu Trigger */}
					<div className="lg:hidden">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon">
									<Menu className="h-6 w-6" />
									<span className="sr-only">Open menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent
								side="right"
								className="w-full max-w-xs sm:max-w-sm"
							>
								<SheetHeader className="mb-6 flex flex-row justify-between items-center">
									<SheetTitle>
										<Image
											src="/wynnlogo.svg"
											alt="Wynn Resorts"
											width={120}
											height={40}
										/>
									</SheetTitle>
								</SheetHeader>
								<nav className="flex flex-col space-y-4 mb-6">
									{navLinks.map((link) => (
										<Link
											key={link.label}
											href={link.href}
											className="font-semibold text-sm leading-[17px] tracking-[0.5px] uppercase text-gray-700 hover:text-red-700 transition-colors py-2"
										>
											{link.label}
										</Link>
									))}
								</nav>
								<div>
									<Select defaultValue="en">
										<SelectTrigger className="w-full font-semibold text-sm leading-[17px] tracking-[0.5px] uppercase">
											<SelectValue placeholder="Language" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="en" className="font-semibold text-sm">
												EN
											</SelectItem>
											<SelectItem value="es" className="font-semibold text-sm">
												ES
											</SelectItem>
											<SelectItem value="zh" className="font-semibold text-sm">
												ZH
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
