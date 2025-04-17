import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SidebarContainer } from "./_styles";
import { SidebarContent } from "./SidebarContent";
import { useActions } from "../../context/ActionsContext";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const MotionWrapper = motion.div;

export const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <>
      { isOpen && (
      <MotionWrapper
        drag="x"
        dragConstraints={{ left: 0, right: 0 }} // constrain to horizontal drag
        onDragEnd={(_event, info) => {
          if (info.offset.x > 20) {
            setIsOpen(false); // close if swiped right enough
          }
        }}
        animate={{ x: isOpen ? 0 : "100%" }}
        initial={{ x: "100%" }}
        transition={{ duration: 0.25 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "75vw",
          height: "100vh",
          zIndex: 1000,
          touchAction: "none",
        }}
      >
        <SidebarContainer>
          <SidebarContent/>
          </SidebarContainer>
        </MotionWrapper>
      )}
      </>
    )
  }

  return (
    <SidebarContainer style={{ width: '250px' }}>
      <SidebarContent/>
    </SidebarContainer>
  );
};
