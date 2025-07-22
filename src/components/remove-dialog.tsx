"use client";

import { 
    AlertDialog, 
    AlertDialogContent,
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogDescription, 
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

interface RemoveDialogProps {
    documentId: Id<"documents">;
    children: React.ReactNode;
}

export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {
    
    // useMutation sunucu tarafından veri değiştirmek için kullanılır.
    const remove = useMutation(api.documents.removeById); // removeById fonksiyonunu document.ts dosyasında tanımladık.
    // silme işlemi yapılırken butonu disable ediyoruz.
    const [isRemoving, setIsRemoving] = useState(false);

    return (
        // kutunun tamamı 
        <AlertDialog> 
            {/* // kullanıcı tıkladığında kutu açılır. */}
            <AlertDialogTrigger asChild> 
                {children}
            </AlertDialogTrigger>
            {/* // kutunun içeriği */}
            <AlertDialogContent onClick={(e) => e.stopPropagation()}> 
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the document.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {/* // iptal islemi ile kutu kapatılır. */}
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                        Cancel
                    </AlertDialogCancel>
                    {/* // silme islemi ile kutu kapatılır. */}
                    <AlertDialogAction
                        disabled={isRemoving}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsRemoving(true);
                            remove({ id: documentId }) 
                            // silme işlemi yapılır.
                                .finally(() => setIsRemoving(false));
                        }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}