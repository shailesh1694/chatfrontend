import Header from "@/components/Header";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Chat App",
    description: "social media chat app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <> {children}</>
    );
}