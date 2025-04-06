import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SidebarContainer } from "../resize/Resize.Styles";

interface ResizableSidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const MotionWrapper = motion.div;

export const ResizableSidebar = ({ children, isOpen, setIsOpen }: ResizableSidebarProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <MotionWrapper
        animate={{ x: isOpen ? 0 : "-100%" }}
        initial={{ x: "-100%" }}
        transition={{ duration: 0.25 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "80vw",
          height: "100vh",
          zIndex: 1000,
          touchAction: "none",
        }}
      >
        <SidebarContainer>{children}</SidebarContainer>
      </MotionWrapper>
    );
  }

  return (
    <SidebarContainer style={{ width: 300 }}>
      {children}
    </SidebarContainer>
  );
};
