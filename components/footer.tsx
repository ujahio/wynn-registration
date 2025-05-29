import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Apple, Smartphone } from "lucide-react"; // Using Smartphone for Android as a generic representation

const Footer = () => {
	return (
		<footer className="bg-[#5A3A27] text-white">
			{/* Newsletter Section */}
			<div className="bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
				<div className="container mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
						<div>
							{/* Placeholder for Big Calson font */}
							<h2 className="text-3xl md:text-4xl font-serif mb-2 text-[#1D1F22]">
								Get News & Updates
							</h2>
						</div>
						<div>
							{/* Placeholder for Avenir LT Std font */}
							<p className="text-sm text-gray-600 font-sans">
								Get latest developments and exciting news on how we are shaping
								the future!
							</p>
						</div>
						<form className="flex flex-col col-span-2 sm:flex-row gap-3 border border-[#E8E9E9]-1.5 p-4">
							<Input
								type="email"
								placeholder="Your email address"
								className="flex-grow font-sans border-none"
							/>
							<Button
								type="submit"
								variant="outline"
								className="font-sans uppercase border-green-700 text-green-700 hover:bg-green-700 hover:text-white tracking-wider"
							>
								Join The Newsletter
							</Button>
						</form>
					</div>
				</div>
			</div>

			{/* Main Footer Content */}
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm font-sans">
					{/* Column 1 */}
					<div>
						<h3 className="font-semibold mb-4 uppercase">Explore</h3>
						<ul className="space-y-2">
							<li>
								<Link href="#" className="hover:text-gray-300">
									Shop Home Collection
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-gray-300">
									Gift Cards
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-gray-300">
									Wynn Stories
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-gray-300">
									Wynn Slots App
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-gray-300">
									Mobile App
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-gray-300">
									Responsible Gaming
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 2 */}
					<div>
						<h3 className="font-semibold mb-4 uppercase">About Wynn</h3>
						<ul className="space-y-2">
							<li>
								<Link href="#" className="hover:text-gray-300">
									About Us
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-gray-300">
									Careers
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-gray-300">
									Investor Relations
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-gray-300">
									Privacy Notice
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-gray-300">
									Cookie Notice
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-gray-300">
									Terms of Use
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-gray-300">
									Hotel Information & Directory
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 3 */}
					<div>
						<h3 className="font-semibold mb-4 uppercase">Our Resorts</h3>
						<ul className="space-y-2">
							<li>
								<Link href="#" className="hover:text-gray-300">
									Wynn Palace Cotai
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-gray-300">
									Encore Boston Harbor
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-gray-300">
									Wynn Macau
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 4 */}
					<div>
						<h3 className="font-semibold mb-4 uppercase">
							Wynn and Encore Las Vegas
						</h3>
						<address className="not-italic space-y-1">
							<p>3131 Las Vegas Blvd. Las Vegas, NV 89109</p>
							<p>
								<a href="tel:+17027707000" className="hover:text-gray-300">
									+1 (702) 770-7000
								</a>
							</p>
						</address>
						<div className="mt-6">
							<h3 className="font-semibold mb-3 uppercase">Connect with us.</h3>
							<div className="flex space-x-3">
								<Link href="#" className="text-white hover:text-gray-300">
									<Facebook size={20} />
								</Link>
								<Link href="#" className="text-white hover:text-gray-300">
									<Smartphone size={20} />
								</Link>{" "}
								{/* Android Icon */}
								<Link href="#" className="text-white hover:text-gray-300">
									<Apple size={20} />
								</Link>
								<Link href="#" className="text-white hover:text-gray-300">
									<Instagram size={20} />
								</Link>
								<Link href="#" className="text-white hover:text-gray-300">
									<Twitter size={20} />
								</Link>{" "}
								{/* X Icon */}
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-12 pt-8 border-t border-gray-700 text-center text-xs font-sans">
					<p className="mb-2">
						<Link href="#" className="hover:text-gray-300">
							Do Not Sell Or Share My Data
						</Link>
					</p>
					<p>
						&copy; {new Date().getFullYear()} Wynn Resorts Holdings, LLC. All
						rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
