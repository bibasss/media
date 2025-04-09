import React, { useEffect, useState } from 'react'
import './Profile.css'
import { checkToken } from '../LOGIC/api.tsx'
import { useNavigate, Link } from 'react-router-dom'
import { formatDate2 } from '../../Algorithm/Algorithm.tsx'
import { IoAddOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import ModalImage from "react-modal-image";
import { BiChevronDown } from "react-icons/bi";
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { UsePostStore } from '../Store/usePostStore/usePostStore.ts'
import { useUserStore } from '../Store/useUserStore/useUserStore.ts'
import { FiInbox } from "react-icons/fi";

function Profile() {
  const { posts, isLoading, fetchPost } = UsePostStore();
  const { users, isLoading2, fetchUsers } = useUserStore();
  const [userName, setUsername] = useState(null)
  const [text_about_user, setUserAboutText] = useState(null)
  const [userAva, setUserAva] = useState("https://res.cloudinary.com/dm7cuhmda/image/upload/v1743782772/posts/iisbjwprc8uiajw2gvcv.jpg")
  const navigate = useNavigate();
  const [id, setId] = useState('')
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
          <Link to={'/profile'}>
            Safety
          </Link>
      ),
    },
    {
      key: '2',
      label: (
          <Link to={'/profile'}>
            Privacy
          </Link>
      ),
    },
    {
      key: '3',
      label: (
          <Link to={'/profile'}>
            Notification
          </Link>
      ),
    },
    {
      key: '4',
      label: (
          <Link to={'/profile'}>
            Action
          </Link>
      ),
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
      setUserAboutText(user.text_about_user);
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
          <div className="profile_user_about">{text_about_user || "Nothing"}</div>
          <Link className="profile_user_edit_profile" to = {`/edit_profile/${id}`}>
            <div className="profile_user_edit_profile_tetx"> Edit Profile </div>
          </Link>

          <Dropdown menu={{ items }}>
            <div className="profile_user_more">
              <a onClick={(e) => e.preventDefault()}>
                <div className="profile_user_more_text">
                  More
                </div>

              </a>
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
                              <div className="dakr_mode">{users.username}</div>
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
                      <div className="profile_postPlace_whenNoPostText">
                        There is no post, create it!
                      </div>
                      <div className="profile_postPlace_whenNoPostIco">
                        <FiInbox/>
                      </div>
                    </div>
                ) : (posts
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



