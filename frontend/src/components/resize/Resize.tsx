import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SidebarContainer } from "../resize/Resize.Styles";

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
        touchAction: "none", // 🛡️ prevent gesture conflict on mobile
      }}
    >
      <div
        style={{
          height: "100%",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
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
