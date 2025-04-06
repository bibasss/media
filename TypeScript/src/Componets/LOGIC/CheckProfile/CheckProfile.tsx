import { useEffect, useState } from 'react'
import { checkToken, getAllPosts  } from '../api.tsx'
import { useNavigate, Link,useParams  } from 'react-router-dom'
import { formatDate2 } from '../../../Algorithm/Algorithm.tsx'
import ModalImage from "react-modal-image";
import './CheckProfile.css'
import { useUserStore } from '../../Store/useUserStore/useUserStore.ts'
import { Button } from 'antd';

export default function CheckProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([])
  const { users, fetchUsers } = useUserStore();
  const OpenedUserName: string | undefined = users.find(user => user._id === id)?.username;
  const OpenedUserAva: string  = users.find(user => user._id === id)?.ava;


  useEffect(() => {
    const tokenStatus = checkToken();
    if (!tokenStatus.valid) {
      navigate("/login");
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
  console.log(OpenedUserName)
  return (
    <>

      <div className="Profile_info_about_me">
        <ModalImage
          small={OpenedUserAva}
          medium={OpenedUserAva}
          className="profile_user_ava"
        />
        <div className="profile_user_name">{OpenedUserName}</div>

        <Link className="profile_user_about" to={`/friends/chat/${id}`}>
          <Button type="default">Message</Button>
        </Link>
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
              <div className="Profile_user_posts">
                <div className="">no_post</div>
              </div>
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


    </>
  )
}
