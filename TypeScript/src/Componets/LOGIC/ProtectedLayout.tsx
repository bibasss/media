import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {checkToken} from "./api.tsx";
import Tobe from "./TobeBlock/tobe.tsx";
import LeviBlock from './LeviBlock/leviblock.tsx'


// @ts-ignore
export default function ProtectedLayout({children}) {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenStatus = checkToken();
    if (!tokenStatus.valid) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Tobe/>
      <LeviBlock/>

      {children}
    </>
  );
}
