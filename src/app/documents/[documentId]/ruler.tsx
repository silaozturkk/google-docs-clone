import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";


//0-82 arası dizi olustu ve her elemeana index atandı
const markers = Array.from({ length:83 }, (_,i) => i)

const Ruler = () => {
    //işaretci konumları
    const [leftMargin, setLeftMargin] = useState(56);
    const [rightMargin, setRightMargin] = useState(56);

    //kullanıcı sürüklüyor mu kontrolu
    const [isDraggingLeft, setIsDraggingLeft] = useState(false);
    const [isDraggingRight, setIsDraggingRight] = useState(false);
    
    // bileşenlerin pozisyonu
    const rulerRef = useRef<HTMLDivElement>(null);

    //tıklandıgında sağa sola surukleme açık
    const handleLeftMouseDown = () => {
        setIsDraggingLeft(true);
    };
    const handleRightMouseDown = () => {
        setIsDraggingRight(true);
    };
    
    // eger sag veya sol isaretciyi sürüklüyorsa içerik varsa içeri girer.
    const handleMouseMove = (e: React.MouseEvent) => {
        const PAGE_WIDTH = 816;
        const MINIMUM_SPACE = 100;

        if((isDraggingLeft || isDraggingRight) && rulerRef.current) {
            // cetvelin içindeki #ruler-container ı bul
            const container = rulerRef.current.querySelector("#ruler-container");
            if(container) {
                const containerRect = container.getBoundingClientRect();
                const relativeX = e.clientX - containerRect.left;
                // pozisyonu sayfa dısına tasmasın diye sıfırlıyoruz
                const rawPosition = Math.max(0, Math.min(PAGE_WIDTH, relativeX));

                // sol ya da sag surukleniyorsa
                if(isDraggingLeft) {
                    const maxLeftPosition = PAGE_WIDTH- rightMargin -MINIMUM_SPACE;
                    const newLeftPosition = Math.min(rawPosition, maxLeftPosition);
                    setLeftMargin(newLeftPosition);
                } else if(isDraggingRight) {
                    const maxRightPosition = PAGE_WIDTH- (leftMargin+MINIMUM_SPACE);
                    const newRightPosition = Math.max(PAGE_WIDTH - rawPosition, 0);
                    const constrainedRightPosition = Math.min(newRightPosition, maxRightPosition);
                    setRightMargin(constrainedRightPosition);
                }
            }
        }
    }
    // mouse bırakıldıgında
    const handleMouseUp=() => {
        setIsDraggingLeft(false);
        setIsDraggingRight(false);
    };
    // çift tıklandıgında sıfırlanacak
    const handleLeftDoubleClick = () => {
        setLeftMargin(56)
    }
    const handleRightDoubleClick = () => {
        setRightMargin(56)
    }

    return ( 
        <div 
            ref={rulerRef}
            onMouseMove={handleMouseMove} //fare hareket ettiğinde çalısır
            onMouseUp={handleMouseUp} // fareyi bıraktıgında
            onMouseLeave={handleMouseUp} //sürükleme iptali için dısarı cıkarsa çalısır.
            className="w-[816px] mx-auto h-6 border-b border-gray-300 flex items-end relative select-none print:hidden"
        >
            <div
                id="ruler-container"
                className="w-full h-full relative"
            >
                <Marker 
                    position={leftMargin}
                    isLeft={true}
                    isDragging={isDraggingLeft}
                    onMouseDown={handleLeftMouseDown}
                    onDoubleClick={handleLeftDoubleClick}
                />
                <Marker 
                    position={rightMargin}
                    isLeft={false}
                    isDragging={isDraggingRight}
                    onMouseDown={handleRightMouseDown}
                    onDoubleClick={handleRightDoubleClick}
                />
                <div className="absolute inset-x-0 bottom-0 h-full">
                    <div className="relative h-full w-[816px]">
                        {markers.map((marker) => {
                            const position = (marker * 816) /82;

                            return (
                                <div
                                    key={marker}
                                    className="absolute bottom-0 "
                                    //left-[${position}] bu sekilde className de de yazabilirdim
                                    //ama dinamik oldugub için bu sekilde daha güvenli
                                    style={{left: `${position}px`}}
                                >
                                    {marker % 10 === 0 && (
                                        <>
                                            <div className="absolute bottom-0 x-[1px] h-2 bg-neutral-500"  />
                                            <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                                                {marker / 10 + 1}
                                            </span>
                                        </>
                                    )}
                                    {marker % 5 === 0 && marker % 10 !== 0 &&(
                                        <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500"/>
                                    )}
                                    {marker % 5 !== 0 && (
                                        <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Ruler;

interface MarkerProps {
    position: number;
    isLeft: boolean;
    isDragging: boolean;
    onMouseDown: () => void;
    onDoubleClick: () => void;
};

const Marker = ({
    position,
    isLeft,
    isDragging,
    onMouseDown,
    onDoubleClick,
}: MarkerProps) => {
    return (
        <div
            className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
            style={{ [isLeft ? "left" : "right"]: `${position}px` }}
            onMouseDown={onMouseDown}
            onDoubleClick={onDoubleClick}
        >
            <FaCaretDown className="absolute keft-1/2 top-0 h-full fill-blue-500 transform translate-x-1/2"/>
            {/*takip çizgisi*/}
            <div 
                className="absolute left-1/2 top-4 transform -translate-x-1/2 transition-opacity "
                style={{
                    height: "100vh",
                    width: "1px",
                    transform: "scaleX(0.5)",
                    backgroundColor: "#3b72f6",
                    display: isDragging ? "block":"none",
                }}  
            />
        </div>
    );
};