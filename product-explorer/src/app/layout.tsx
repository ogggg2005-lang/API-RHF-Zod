import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
	title: "Product Explorer",
	description: "สำรวจรายการสินค้า",
};

export default function RootLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="th">
			<body suppressHydrationWarning>
				{children}
			</body>
		</html>
	);
}
