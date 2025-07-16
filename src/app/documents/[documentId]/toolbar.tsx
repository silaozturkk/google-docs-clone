"use client"
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
// cn: tailwind class'larını koşullu şekilde birleştiren yardımcı bir fonksiyondur.
import { LucideIcon, Undo2Icon } from "lucide-react";


// özellik tanımlaması yaptık burda
interface ToolbarButtonProps {
    onClick?: () => void;
    isActive?: boolean;
    icon: LucideIcon;
};

// tek bir butonu temsil eder.
const ToolbarButton = ({onClick, isActive, icon: Icon}: ToolbarButtonProps) => {
    return (
        <button
            onClick= {onClick}

            // burda cn kullanmamızın amacı isActive true ise bir seyi daha dahil ediyoruz.
            // cn kosullu durumlarda kullanılır.
            className={cn(
                "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
                isActive && "bg-neutral-200/80"
            )}
        >
            <Icon className="size-4" />
        </button>
    );
}

// burda da butonları tanımlıyoruz.
const Toolbar = () => {
    const {editor} = useEditorStore();
    console.log("Toolbar editor", {editor})

    const sections: { 
        label: string; 
        icon: LucideIcon
        onClick: () => void;
        isActive?: boolean;
    }[][] = [
        [
            {
                label:"Undo",
                icon: Undo2Icon, 
                // butona tıklanınca eger editor varsa onu odakla geri al komutunu çalıstır ve zinciri tamamla
                onClick: () => editor?.chain().focus().undo().run(),
            },
        ],
    ];


    return ( 
        // sağa dogru butun butonlar listekenir
        <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
            {sections[0].map((item) =>(
                <ToolbarButton key={item.label} {...item} />
            ))}
        </div>
     );
}
 
export default Toolbar;