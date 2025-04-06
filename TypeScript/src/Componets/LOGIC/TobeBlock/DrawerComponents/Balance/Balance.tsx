import  { useEffect } from 'react'
import { checkToken } from '../../../api.tsx'
import './Balance.css'
import { useNavigate } from 'react-router-dom'


export default function Balance() {
  const navigate = useNavigate();
  const balance:number = 55;

  useEffect(() => {
    const tokenStatus = checkToken();
    if (!tokenStatus.valid) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="priends_maincontent">
        Ваш баланс {balance}
      </div>
    </>
  )
}

