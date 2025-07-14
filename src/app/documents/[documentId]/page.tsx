import { Editor } from "./editor";

interface DocumentIdPageProps {
    params: Promise<{ documentId: string }>;
}
// promise gelecekte tanımlanacak suandd olamayan veriyi temsil eder
// burda asağıda vereceğimiz özelliğin tipini veriyoruz


// async bu fonksiyon çalısırken zaman alacak demek.
const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
    const { documentId } = await params;
    return ( 
    <div>
        <p>Document Id: {documentId}</p>
        <Editor />
    </div> 
    );
}
 
export default DocumentIdPage;