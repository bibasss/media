import  { useEffect } from 'react'
import { checkToken } from '../LOGIC/api.tsx'
import './Music.css'
import { useNavigate } from 'react-router-dom'


export default function Music() {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenStatus = checkToken();
    if (!tokenStatus.valid) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="priends_maincontent"></div>
    </>
  )
}

