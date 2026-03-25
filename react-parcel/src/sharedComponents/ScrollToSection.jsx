import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToSection = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Only handle scrolling on home page
    if (pathname !== "/" || !hash) return;

    const id = hash.replace("#", "");
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToSection;
