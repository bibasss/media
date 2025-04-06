import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import "./tobe.css";
import toast, { Toaster } from "react-hot-toast";
import { checkToken } from "../api.tsx";
import { Switch } from "antd";
import { BsMoonStars } from "react-icons/bs";
import { GoSun } from "react-icons/go";
import { Drawer, Modal } from 'antd';


export default function Tobe() {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") as string);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [requestSent, setRequestSent] = useState(() => {
    return JSON.parse(window.localStorage.getItem("MY_APP_STATE") as string) || false;
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (requestSent) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [requestSent]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Вы успешно вышли с аккаунта");
    document.documentElement.classList.remove("dark-mode");
  };

  useEffect(() => {
    const tokenStatus = checkToken();
    if (!tokenStatus.valid) {
      navigate("/login");
    } else {
      setUsername(user?.email || "Гость");
      setEmail(user.username);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("MY_APP_STATE", JSON.stringify(requestSent));
  }, [requestSent]);

  const handleColor = () => {
    // @ts-ignore
    setRequestSent((prev) => {
      const newState = !prev;
      if (newState) {
        document.documentElement.classList.add("dark-mode");
      } else {
        document.documentElement.classList.remove("dark-mode");
      }
      return newState;
    });
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="Tobe">
        <Switch className="tobe_for_changecolor" onChange={handleColor} checked={requestSent} />

        {requestSent ? <BsMoonStars className="Moon" /> : <GoSun className="Moon" />}

        <div className="tobe_show_this_username">
          <button onClick={showDrawer} >{username}</button>
        </div>

        <Drawer title={email} onClose={onClose} open={open}>
          Notification <br /><br />
          Setting <br /><br />
          <Link to={`/balance`}>Balance</Link>   <br /><br />
          Faq <br /><br />
          About <br /><br />
          Help <br /><br />
          Archive <br /><br /> <br /><br />
          <button className="tobe_logout_button" onClick={showModal}>Logout</button>
        </Drawer>
      </div>

      <Modal title="Are you sure?" open={isModalOpen} onOk={logout} onCancel={handleCancel}>Logout</Modal>

    </>
  );
}
