import { useEffect, useState } from 'react';
import './Chat.css';
import { checkToken, getAllUsers,getMessage } from '../api.tsx'
import { useNavigate, useParams, NavLink} from 'react-router-dom';
import { formatDate2 } from '../../../Algorithm/Algorithm'
import { HiChevronLeft } from "react-icons/hi2";
import { BiSend } from "react-icons/bi";

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user") as string);
  const navigate = useNavigate();
  const { id } = useParams();
  const getter_id = id;
  const [sender_id, setMyId] = useState('');
  const [messages, setMessages] = useState<any[]>([])
  const [DataMessages, setDataMessages] = useState<any[]>([])
  const [messageText, setMessageText] = useState('');
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true); // Новое состояние для загрузки



  useEffect(() => {
    const tokenStatus = checkToken();
    if (!tokenStatus.valid) {
      navigate("/login");
    } else {
      setMyId(user.id);
    }

    console.log("OpenChat with:", getter_id);
  }, [id, navigate]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const { success, data } = await getAllUsers();
        if (success) {
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching my posts:", error);
      }
      try {
        setIsLoading(true);
        const {success, data} = await getMessage();
        if (success) {
          setDataMessages(data);
        }
      } catch (error) {
        console.error("Error fetching my posts:", error);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  useEffect(() => {
    if (!sender_id) return;

    const ws = new WebSocket("wss://media-vcft.onrender.com");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      ws.send(JSON.stringify({ type: "auth", userId: sender_id }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        setMessages((prev) => [...prev, data]);
      }
    };

    // @ts-ignore
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [sender_id]);

  const sendMessage = () => {
    if (!messageText.trim() || !socket) return;

    const messageData = {
      type: "message",
      sender_id: sender_id,
      getter_id: getter_id,
      text: messageText,
      createdAt: new Date().toISOString(),
      sender_ava: user.ava,
      sender_name: user.username,
    };

    // @ts-ignore
    socket.send(JSON.stringify(messageData));
    setMessages((prev) => [...prev, messageData]);
    setMessageText('');
  };

  return (
    <>

      <div className="message_user_interface">
        {users
          .filter(user => user._id === getter_id)
          .map((users) => (

            <div key={users.id} className=".friends-container">

              <NavLink className="message_interface_item1" to={'/profile'}>
                <HiChevronLeft className="message_interface_item2" />
                <div className="message_interface_item3">back</div>
              </NavLink>

              <img src={users.ava} className="message_user_interface_ava" />

              <div className="message_user_interface-username">{users.username}</div>
              <div className="offline">Offline</div>

            </div>
          ))}
      </div>


      <div className="message_interface">
        <br /><br />
        <div className="message_interface_sender_message">
          {
            isLoading ? (
              <div className="no_message">Загрузка...</div>
            ) : (
              DataMessages
                .filter(messages =>
                  (messages.sender_id === sender_id && messages.getter_id === getter_id) ||
                  (messages.sender_id === getter_id && messages.getter_id === sender_id)
                )
                .length === 0 && messages.length ===0 ? (
                <div className="no_message">No message</div>
              ) : (
                DataMessages
                  .filter(messages =>
                    (messages.sender_id === sender_id && messages.getter_id === getter_id) ||
                    (messages.sender_id === getter_id && messages.getter_id === sender_id)
                  )
                  .map((DataMessages) => (
                    <div key={DataMessages.id}>
                      <div className="message_interface_all" key={DataMessages.id}><br />
                        <img src={DataMessages.sender_ava} className="message_interface_sender_ava_into" />
                        <div className="message_interface_sender_name_into">{DataMessages.sender_name}</div>
                        <div className="message_interface_sender_time_into">{formatDate2(DataMessages.createdAt)}</div>
                        <div className="message_interface_sender_message_into">{DataMessages.message}</div>
                      </div>
                    </div>
                  ))))}


          {messages.map((msg, index) => (
            <div key={index} className="message_interface_message2">
              <img src={msg.sender_ava} alt="avatar" className="message_interface_sender_ava_into" />
              <div className="message_interface_sender_name_into">{msg.sender_name}</div>
              <div className="message_interface_sender_time_into">{formatDate2(msg.createdAt)}</div><br/>
              <div className="message_interface_sender_message_into2">{msg.text}</div>
            </div>
          ))}


        </div>
      </div>

      <div className="chat-input">
        <input
          className="message_write_message"
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
        />
        <BiSend className="ico_for_send-inmessage" onClick={sendMessage} />
      </div>

    </>
  );
}


