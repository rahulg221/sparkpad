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
      animate={{ x: isOpen ? 0 : "-100%" }}
      initial={{ x: "-100%" }}
      transition={{ duration: 0.25 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "80vw",
        zIndex: 1000,
        touchAction: "none", // 👈 prevents motion/scroll gesture clash
        background: "var(--sidebar-bg)",
      }}
    >
      {/* ✅ Inner scrollable container */}
      <div
        style={{
          height: "100%",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: "1rem", // optional for spacing
        }}
      >
        {children}
      </div>
    </MotionSidebar>
  ) : (
    <SidebarContainer style={{ width: 300 }}>
      {children}
    </SidebarContainer>
  );
};
