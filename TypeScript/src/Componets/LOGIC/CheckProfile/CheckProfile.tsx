import { useEffect, useState } from 'react'
import { checkToken, getAllPosts, RequestToFriends, CheckFriendRequest, CancelFriendRequest  } from '../api.tsx'
import { useNavigate, Link,useParams  } from 'react-router-dom'
import { formatDate2 } from '../../../Algorithm/Algorithm.tsx'
import ModalImage from "react-modal-image";
import './CheckProfile.css'
import { useUserStore } from '../../Store/useUserStore/useUserStore.ts'
import {Button, Modal} from 'antd';
import toast, { Toaster } from 'react-hot-toast';

export default function CheckProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([])
  const { users, fetchUsers } = useUserStore();
  const OpenedUserName: string | undefined = users.find(user => user._id === id)?.username;
  const OpenedUserAva: string  = users.find(user => user._id === id)?.ava;
  const [requestSent, setRequestSent] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") as string);
  const [sender_id, setSenderId] = useState("");
  const [UserLocation, setUserLocation] = useState("");
  const [userAva, setUserAva] = useState("");
  const [userName, setUserName] = useState("");
  const [user_id, setUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const tokenStatus = checkToken();
    if (!tokenStatus.valid) {
      navigate("/login");
    } else{
      setSenderId(user.id);
      setUserLocation(user.city);
      setUserAva(user.ava);
      setUserName(user.username);
    }
    if (id) {
      setUserId(id as any);

      const checkRequest = async () => {
        const exists = await CheckFriendRequest(id, user.id);
        setRequestSent(exists);
      };
      checkRequest();
    } else {
      alert("hi!");
    }
  }, []);

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const { success, data } = await getAllPosts();
        if (success) {
          setPosts(data);
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

  const handleFriendRequest = async (e: any) => {
    e.preventDefault();
    setIsModalOpen(false);

    if (requestSent) {
      // ✅ Если заявка уже отправлена – отменяем её
      const { success } = await CancelFriendRequest(user_id, sender_id);
      if (success) {
        setRequestSent(false);
        toast.error("Заявка отменена!");
      } else {
        toast.error("Ошибка при отмене заявки");
      }
    } else {
      // ✅ Отправляем новую заявку
      const { success } = await RequestToFriends(user_id, UserLocation, userAva, userName, sender_id);
      if (success) {
        setRequestSent(true);
        toast.success("Заявка отправлена!");
      } else {
        toast.error("Ошибка при отправке заявки");
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="checkProfile_info_about_user">
        <ModalImage
            small={OpenedUserAva}
            medium={OpenedUserAva}
            className="profile_user_ava"
        />
        <div className="profile_user_name">{OpenedUserName}</div>

        <Link className="profile_user_about" to={`/friends/chat/${id}`}>
          <Button type="default">Message</Button>
        </Link>

        <Button
            className="profile_user_addToFriends"
            onClick={requestSent ? showModal : handleFriendRequest}
        >
          {requestSent ? "Submitted" : "Add to Friends"}
        </Button>


      </div>

      <div className="chech_profile_posts">

        {
          isLoading ? (
              <div className="Profile_user_posts">
                <img className="profile_post_ava" />
              <img className="profile_post_image" />

            </div>
          ) : (
            posts
              .filter(posts =>
                (posts.user_id === id) )
              .length === 0 ? (
                <div className=""></div>
            ) : ( posts
            .filter(posts => posts.user_id === id)
            .map((posts) => (

              <div key={posts._id} className="Profile_user_posts">

                <img className="profile_post_ava" src={posts.user_ava} />
                <div className="profile_post_name">{posts.username}</div>
                <div className="profile_post_time"> {formatDate2(posts.createdAt)}</div>
                <img className="profile_post_image" src={posts.img_src} /><br />
              </div>
            ))))}
      </div>

      <Modal title="Cancel request" open={isModalOpen} onOk={handleFriendRequest} onCancel={handleCancel}>Are you sure?</Modal>

    </>
  )
}
