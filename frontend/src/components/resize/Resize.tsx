import { useState, useRef, useEffect } from "react";
import { DragHandle, SidebarContainer } from "./Resize.Styles";

const MIN_WIDTH = 180;
const MAX_WIDTH = 500;

export const ResizableSidebar = ({ children }: { children: React.ReactNode }) => {
    const [width, setWidth] = useState(240); // initial width in px
    const isResizing = useRef(false);
  
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current) return;
  
        const newWidth = Math.min(Math.max(e.clientX, MIN_WIDTH), MAX_WIDTH);
        setWidth(newWidth);
      };
  
      const stopResizing = () => {
        isResizing.current = false;
      };
  
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopResizing);
  
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", stopResizing);
      };
    }, []);
  
    return (
        <SidebarContainer style={{ width }}>
            {children}
            <DragHandle
                onMouseDown={() => {
                isResizing.current = true;
                }}
            />
        </SidebarContainer>
    );
  };