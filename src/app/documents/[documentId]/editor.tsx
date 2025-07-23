"use client";
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-Cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { Underline } from '@tiptap/extension-underline';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import ImageResize from "tiptap-extension-resize-image"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEditorStore } from '@/store/use-editor-store';
import Color from "@tiptap/extension-color";
import  Highlight  from '@tiptap/extension-highlight';
import { FontSizeExtension } from '@/extensions/font-size';
import { LineHeightExtension } from '@/extensions/line-height';
import Ruler from './ruler';
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { Threads } from './threads';
import { useStorage } from "@liveblocks/react";

export const Editor = () => {
    const liveblocks = useLiveblocksExtension();
    const leftMargin = useStorage((root) => root.leftMargin);
    const rightMargin = useStorage((root) => root.rightMargin);

    const { setEditor } = useEditorStore();
    
    // editörü burda baslatırız içeriğini ve davranısını veririz.
    const editor = useEditor({
        immediatelyRender: false,
        onCreate({ editor }) {
            setEditor(editor);
        },
        onDestroy() {
            setEditor(null);
        },
        onUpdate({ editor }) {
            setEditor(editor);
        },
        onSelectionUpdate({editor}) {
            setEditor(editor);
        },
        onTransaction({editor}) {
            setEditor(editor);
        },
        onFocus({editor}) {
            setEditor(editor);
        },
        onBlur({editor}) {
            setEditor(editor);
        },
        onContentError({editor}) {
            setEditor(editor);
        },


        editorProps: {
            attributes: {
                style: `padding-left: ${leftMargin ?? 56}px; padding-right: ${rightMargin ?? 56}px;`,
                class: "focus:outline-none border print:border-0 bg-white border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text" 
            },
        },
        //editorun neleri destekleyeceğini belirler
        extensions: [
            StarterKit.configure({
                history: false,
            }), //metin yazabilir
            Underline,
            liveblocks,
            FontSizeExtension,
            LineHeightExtension,
            TextAlign.configure({ //hizalama
                types:["heading","paragraph"]
            }),
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            FontFamily,
            TextStyle,
            TaskList,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: "https"
            }),
            Image, //resim ekleyebilir, boyutlandırabilir
            ImageResize,
            Table, //tablo ekleyebilir
            TableCell,
            TableHeader,
            TableRow,
            TaskItem.configure({ // liste olusturabilir.
                nested: true,
            })
        ],
        // baslangıç içeriği
        content:``

    })

    return (
        <div className='size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible'>
            <Ruler />
            <div className='min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0'>
                <EditorContent editor={editor} />
                <Threads editor={editor} />
            </div>
        </div>
    );
};
