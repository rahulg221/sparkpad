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
        height: "100vh",
        overflowY: "auto", 
        WebkitOverflowScrolling: "touch", 
      }}
    >
      {children}
    </MotionSidebar>
  ) : (
    <SidebarContainer style={{ width: 300 }}>{children}</SidebarContainer>
  );
};
