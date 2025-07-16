import { Editor } from "./editor";
import Toolbar from "./toolbar";

interface DocumentIdPageProps {
    params: Promise<{ documentId: string }>;
}
// promise gelecekte tanımlanacak suanda olamayan veriyi temsil eder
// burda asağıda vereceğimiz özelliğin tipini veriyoruz


// async bu fonksiyon çalısırken zaman alacak demek.
const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
    const { documentId } = await params;
    return ( 
    <div className="min-h-screen bg-[#FAFBFD]">
        <p>Document Id: {documentId}</p>
        <Toolbar />
        <Editor />
    </div> 
    );
}
 
export default DocumentIdPage;