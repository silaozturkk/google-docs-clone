import Link from "next/link"
import Image from "next/image"
import DocumentInput from "./document-input";
import MenubarComponent from "./menubar-component";

export const Navbar = () => {
    return (
        <nav className="flex items-center justify-between">
            <div className="flex">
                <Link href="/">
                    <Image src="/logo.svg" alt="logo" width={36} height={36} />
                </Link>
                <div className="flex flex-col">
                    <DocumentInput />
                    <MenubarComponent />
                </div>
            </div>
        </nav>
    );
}