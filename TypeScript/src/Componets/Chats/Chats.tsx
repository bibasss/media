import React, { useEffect, useState } from 'react'
import { checkToken, getMessage } from '../LOGIC/api.tsx'
import './Chats.css'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate2 } from '../../Algorithm/Algorithm.tsx'


  function Chats() {
  const navigate = useNavigate();
  const [DataMessages, setDataMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Новое состояние для загрузки
  const [userId, setUserId] = useState(null); // Начальное значение null, чтобы избежать раннего рендера
  const user = JSON.parse(localStorage.getItem("user") as string);


  useEffect(() => {
    const tokenStatus = checkToken();
    if (!tokenStatus.valid) {
      navigate("/login");
    } else{
      setUserId(user.id); // Устанавливаем userId
    }
  }, []);


  useEffect(() => {
    const fetchMyPosts = async () => {
      setIsLoading(true);
      try {
        const {success, data} = await getMessage();
        if (success) {
          setDataMessages(data);
        }
      } catch (error) {
        console.error("Error fetching my posts:", error);
      } finally {
        setIsLoading(false);
      }

    };

    fetchMyPosts();
  }, []);


  return (
    <>
      <div className="chats_maincontent">
        {
          isLoading ? (
              <>
                <div className="center3">Loading...</div>
              </>
            ) :
            Object.values(DataMessages.reduce((acc, message) => {
          // @ts-ignore
              acc[message.sender_id] = message;
          return acc;
        }, {}))
              .map((msg: any) => (
          <div key={msg.sender_id}>
            <Link to={`/friends/chat/${msg.sender_id}`}>
              <div className="ne_xoty_pridymat">
                <img className="chats_sender_ava" src={msg.sender_ava} />
                <div className="chats_sender_name">{msg.sender_name}</div>
                <div className="chats_sender_message">{msg.message}</div>
                <div className="chats_sender_mesage_time">{formatDate2(msg.createdAt)}</div>
              </div>
            </Link><br />
          </div>
          ))}


      </div>
    </>
  )
}

export default React.memo(Chats);
