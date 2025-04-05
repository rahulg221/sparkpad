import { useEffect, useState } from "react";
import { SidebarContainer } from "../resize/Resize.Styles";
import { motion } from "framer-motion";

const MotionSidebar = motion(SidebarContainer);

interface ResizableSidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export const ResizableSidebar = ({ children, isOpen, setIsOpen }: ResizableSidebarProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  return isMobile ? (
    <MotionSidebar
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? 0 : "-100%" }}
      transition={{ duration: 0.25 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "80vw",
        zIndex: 1000,
        overflowY: "auto",
        background: "var(--sidebar-bg)",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        touchAction: "pan-y",
      }}
    >
      {/* Optional Close Button */}
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
        }}
      >
        ×
      </button>
      {children}
    </MotionSidebar>
  ) : (
    <SidebarContainer style={{ width: 300 }}>{children}</SidebarContainer>
  );
};
