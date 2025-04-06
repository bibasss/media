import React, { useEffect, useState } from 'react'
import './Profile.css'
import { checkToken } from '../LOGIC/api.tsx'
import { useNavigate, Link, NavLink } from 'react-router-dom'
import { formatDate2 } from '../../Algorithm/Algorithm.tsx'
import { IoAddOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import ModalImage from "react-modal-image";
import { BiChevronDown } from "react-icons/bi";
import { SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { UsePostStore } from '../Store/usePostStore/usePostStore.ts'
import { useUserStore } from '../Store/useUserStore/useUserStore.ts'

function Profile() {
  const { posts, isLoading, fetchPost } = UsePostStore();
  const { users, isLoading2, fetchUsers } = useUserStore();
  const [userName, setUsername] = useState(null)
  const [userAva, setUserAva] = useState("https://res.cloudinary.com/dm7cuhmda/image/upload/v1743782772/posts/iisbjwprc8uiajw2gvcv.jpg")
  const navigate = useNavigate();
  const [id, setId] = useState('')
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item (disabled)
        </a>
      ),
      icon: <SmileOutlined />,
      disabled: true,
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
    {
      key: '4',
      danger: true,
      label: 'a danger item',
    },
  ];


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    const tokenStatus = checkToken();
    if (!tokenStatus.valid) {
      navigate("/login");
    } else {
      setUsername(user.username);
      setUserAva(user.ava);
      setId(user.id);
    }
  }, []);

  useEffect(() => {
    if (posts.length === 0) {
      fetchPost();
    }
  }, [fetchPost, posts.length]);

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, users.length]);

  return (
    <>


      <div className="Profile_info_about_me">
        <ModalImage
          small = {userAva}
          medium={userAva}
          className="profile_user_ava"
        />
        <div className="profile_user_name">{userName}</div>
        <div className="profile_user_about">nothing</div>
        <NavLink className="profile_user_edit_profile" to={"#"}>
          <div className="profile_user_edit_profile_tetx"> Edit Profile </div>
        </NavLink>

        <Dropdown menu={{ items }}>
          <div className="profile_user_more">
            <div className="profile_user_more_text">
                <a onClick={(e) => e.preventDefault()}>
                  More
                </a>
            </div>
            <div className="profile_user_more_ico"><BiChevronDown /></div>
          </div>
        </Dropdown>
      </div>


      <Link to = '/create_post' className="profile_createpost_block">
        <div className = "profile_createpost_block_ico_add">
          <IoAddOutline />
        </div>
        <div className="profile_createpost_block_text">
          Create post
        </div>
      </Link>


      <div className="profil_friends_block">
        <div className="profil_friends_block_text">
          Friends: 9
        </div>
          <div className="friends-container">
          {
            isLoading2 ? (
                <div className="friend-item">
                  <img className="profil_friends_block_ava" />
                </div>
              ) :
              users
                .filter(users => users._id !== id)
                .slice(0, 9)
                .map((users) => (
                  <div key={users._id} className="friend-item">
                    <Link to={`/check_profile/${users._id}`}>
                      <img className="profil_friends_block_ava" src={users.ava} />
                      <div className="">{users.username}</div>
                    </Link>
                  </div>
                ))
          }
          </div>


      </div>

      <div className="profile_home_posts">
      {
          isLoading ? (
            <div className="Profile_user_posts">
              <img className="profile_post_ava" />
              <img className="profile_post_image"/>

            </div>
          ): (
            posts
              .filter(posts =>
                (posts.user_id === id) )
              .length === 0 ? (
                <div className="Profile_user_posts">
                  <div className="">no_post</div>
                </div>
              ) : ( posts
            .filter(posts => posts.user_id === id)
            .map((posts) => (


            <div key={posts._id} className="Profile_user_posts">

              <Link className="profile_post_editing" to={`/check_profile/${posts._id}`}>
                <CiEdit />

              </Link>

              <img className="profile_post_ava" src={userAva} />
              <div className="profile_post_name">{userName}</div>
              <div className="profile_post_time"> {formatDate2(posts.createdAt)}</div>
              <img className="profile_post_image" src={posts.img_src} /><br />
            </div>
            ))))}
      </div>


    </>
  )
}

export default React.memo(Profile);



