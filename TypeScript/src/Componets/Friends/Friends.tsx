import React, { useEffect, useState } from 'react'
import { checkToken } from '../LOGIC/api.tsx'
import './Friends.css'
import { useNavigate, NavLink, Link } from 'react-router-dom'
import { SlLocationPin, SlMagnifier } from "react-icons/sl";
import { Input } from 'antd'
import { useUserStore } from '../Store/useUserStore/useUserStore.ts'

  function Friends() {
  const user = JSON.parse(localStorage.getItem("user") as string);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null); // Начальное значение null, чтобы избежать раннего рендера
  const { users, isLoading2, fetchUsers } = useUserStore();

  useEffect(() => {
    const tokenStatus = checkToken();
    if (!tokenStatus.valid) {
      navigate("/login");
    }else{
      setUserId(user.id); // Устанавливаем userId
    }
  }, []);

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, []);

  return (
    <>

      <div className="priends_maincontent">


        <Input rootClassName="search_friend_inblock"/>

        <button className="search_button_infriends">
          <SlMagnifier/>
        </button>
        <NavLink className="requesttofriends_infriends" to={`/request_to_friends`}>
          Requests to friends: 0
        </NavLink>

        {
          isLoading2 ? (
              <>
                <div className="friends_list_of_friends"><img className="friends_user_avatar" /></div>
                <div className="friends_list_of_friends"><img className="friends_user_avatar" /></div>
                <div className="friends_list_of_friends"><img className="friends_user_avatar" /></div>
                <div className="friends_list_of_friends"><img className="friends_user_avatar" /></div>
                <div className="friends_list_of_friends"><img className="friends_user_avatar" /></div>

              </>
            ) :
            users
              .filter(user => user._id !== userId)
              .map((users) => (
            <div key={users._id} className="friends_list_of_friends">

              <img
                className="friends_user_avatar"
                src={users.ava}
                onError={(e) => e.currentTarget.src = "/docker.png"}
              />
              <Link to={`/check_profile/${users._id}`}>
                <div className="friends_name">{users.username}</div>
              </Link>
              <div className="friends_location">
                <SlLocationPin/> {users.city}
              </div>
            </div>
          ))}<br/><br/><br/><br/>

      </div>
    </>
  )
}


export default React.memo(Friends);
