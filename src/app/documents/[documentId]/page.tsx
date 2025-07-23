import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Room } from "./room";
import Toolbar from "./toolbar";
import { redirect } from "next/navigation";

interface DocumentIdPageProps {
    params: Promise<{ documentId: string }>;
}
// promise gelecekte tanımlanacak suanda olamayan veriyi temsil eder
// burda asağıda vereceğimiz özelliğin tipini veriyoruz

const isValidConvexId = (id: string) => /^[a-z0-9]{15,}$/i.test(id);

// async bu fonksiyon çalısırken zaman alacak demek.
const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
    const { documentId } = await params;
    if (!isValidConvexId(documentId)) {
        redirect("/");
    }
    return ( 
        // canlı takip için
        <Room>
        <div className="min-h-screen bg-[#FAFBFD]">
            <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
                <Navbar />
                <Toolbar />
            </div>
            <div className="pt-[114px] print:pt-0" >
                <Editor />
            </div>
        </div> 
        </Room>
    );
}
 
export default DocumentIdPage;