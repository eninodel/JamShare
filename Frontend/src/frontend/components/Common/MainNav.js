import MobileNavBar from "./MobileNavBar";
import NavBar from "./NavBar";
import React from "react";
import { useEffect, useState } from "react";

function MainNav() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 500) setMobile(true);

    window.addEventListener("resize", () => {
      if (window.innerWidth < 500) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    });
    return () => {
      window.removeEventListener("resize", () => {
        if (window.innerWidth < 500) {
          setMobile(true);
        } else {
          setMobile(false);
        }
      });
    };
  }, []);
  return <>{!mobile ? <NavBar /> : <MobileNavBar />}</>;
}

export default MainNav;
