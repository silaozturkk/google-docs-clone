import Link from "next/link"
import Image from "next/image"
import DocumentInput from "./document-input";
import MenubarComponent from "./menubar-component";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Avatars } from "./avatars";

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
            <div className="flex gap-3 items-center pl-6">
                {/* organizasyon islemlerinden sonra yapılacak islem için */}
                <Avatars />
                <OrganizationSwitcher
                    afterCreateOrganizationUrl="/"
                    afterLeaveOrganizationUrl="/"
                    afterSelectOrganizationUrl="/"
                    afterSelectPersonalUrl="/"
                />
                <UserButton />
            </div>
        </nav>
    );
}