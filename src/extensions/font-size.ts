//tiptap içinde font-size özelliği yok o yuzden 
// biz olusturuyoruz.

import { Extension } from "@tiptap/react";
import "@tiptap/extension-text-style";


// burda ts'e ben yeni komutlar ekliyorum diyoruz.
//yeni komutları tanımlıyoruz.
declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (size: string) => ReturnType
            unsetFontSize: () => ReturnType
        }
    }
}

//tiptapa yeni bir yetenek tanımlıyoruz
export const FontSizeExtension = Extension.create ({
    name: "fontSize",
    // hangi elementlerde calısacağını söylüyoruz.
    addOptions() {
        return {
            types: ["textStyle"],
        }
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types, // hangi öğeye özellik atadıgım
                attributes: {
                    fontSize: {
                        default: null, // baslangıcta font-size yok

                        // yazarken secili stili eklemek için 
                        parseHTML: element => element.style.fontSize,
                        renderHTML: attributes => {
                            if(!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            }
                        }
                    }
                }
            }
        ]
    },
    // uygulamak ve kaldırmak için
    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ chain }) => {
                return chain()
                .setMark("textStyle",{fontSize})
                .run()
            },
            unsetFontSize: () => ({ chain }) => {
                return chain()
                .setMark("textStyle", { fontSize: null})
                .removeEmptyTextStyle()
                .run()
            }
        }
    }
})