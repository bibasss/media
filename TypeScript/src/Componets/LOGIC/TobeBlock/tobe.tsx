import { Link, useNavigate } from 'react-router-dom'
import  { useEffect, useState } from "react";
import "./tobe.css";
import toast, { Toaster } from "react-hot-toast";
import { checkToken } from "../api.tsx";
import { Switch } from "antd";
import { BsMoonStars } from "react-icons/bs";
import { GoSun } from "react-icons/go";
import { Drawer, Modal } from 'antd';
import {BiChevronDown} from "react-icons/bi";


export default function Tobe() {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") as string);
  const [userava, setAva] = useState("");
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
      setAva(user?.ava || "Гость");
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

            <img className="tobe_show_this_username" onClick={showDrawer} src={userava}/>
            <BiChevronDown onClick={showDrawer} className="tobe_show_this_username_ico"/>

        <Drawer title={email} onClose={onClose} open={open}>
          <Link to={`/balance`}>Notification</Link>  <br /><br />
          <Link to={`/balance`}>Setting</Link>  <br /><br />
          <Link to={`/balance`}>Balance</Link>   <br /><br />
          <Link to={`/balance`}>Faq</Link>  <br /><br />
          <Link to={`/balance`}>About</Link>  <br /><br />
          <Link to={`/balance`}>Help</Link>  <br /><br />
          <Link to={`/balance`}>Archive</Link>  <br /><br /> <br /><br />
          <button className="tobe_logout_button" onClick={showModal}>Logout</button>
        </Drawer>
      </div>

      <Modal title="Are you sure?" open={isModalOpen} onOk={logout} onCancel={handleCancel}>Logout</Modal>

    </>
  );
}
