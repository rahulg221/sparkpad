import { useState, useRef, useEffect } from "react";
import { DragHandle, SidebarContainer } from "../resize/Resize.Styles.ts";
import { motion, useMotionValue, useAnimation } from "framer-motion";

const MIN_WIDTH = 180;
const MAX_WIDTH = 500;

interface ResizableSidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export const ResizableSidebar = ({ children, isOpen, setIsOpen }: ResizableSidebarProps) => {
  const [width, setWidth] = useState(300); // desktop width
  const isResizing = useRef(false);
  const controls = useAnimation();
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const MotionSidebarContainer = motion(SidebarContainer);

  // Detect mobile once
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  // Desktop resizing
  useEffect(() => {
    if (isMobile) return;

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
  }, [isMobile]);

  // Mobile drag toggle logic
  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (info.offset.x < -100) {
      setIsOpen(false);
      controls.start({ x: "-100%" });
    } else if (info.offset.x > 100) {
      setIsOpen(true);
      controls.start({ x: 0 });
    } else {
      controls.start({ x: isOpen ? 0 : "-100%" });
    }
  };

  return isMobile ? (
    <MotionSidebarContainer
      ref={sidebarRef}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ x: "-100%" }}
      style={{
        x: 0,
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "80vw",
        zIndex: 1000,
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        touchAction: "pan-y",
        overflowY: "auto",
        background: "var(--sidebar-bg)"
      }}
    >
      <button
        onClick={() => setIsOpen(false)}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
          zIndex: 1100,
        }}
        aria-label="Close sidebar"
      >
        ×
      </button>
  
      {children}
    </MotionSidebarContainer>
  ) : (
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
