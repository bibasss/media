import React, { useEffect } from 'react'
import './Home.css'
import { checkToken } from '../LOGIC/api.tsx'
import { useNavigate } from 'react-router-dom'
import { formatDate2 } from '../../Algorithm/Algorithm.tsx'
import { UsePostStore } from '../Store/usePostStore/usePostStore.ts'


  function Home() {
  const { posts, isLoading, fetchPost } = UsePostStore();

  const navigate = useNavigate();

  useEffect(() => {
    const tokenStatus = checkToken();
    if (!tokenStatus.valid) {
      navigate("/login");
    }
  }, []);


    useEffect(() => {
      if (posts.length === 0) {
        fetchPost();
      }
    }, []);
  return (
    <>



      <div className="Home_Posts">
        {
            isLoading ? (
                <>
                  <div className="posts">
                    <div className="center2">Загрузка...</div>
                  </div>
                  <div className="posts">
                    <div className="center2">Загрузка...</div>
                  </div>
                </>

              ) :
              posts
                .map((posts) => (
                  <div key={posts._id} className="posts">

              <img className="home_post_user_ava" src = {posts.user_ava}/>
              <div className="home_post_username">{posts.username}</div>
              <div className="home_post_username">{posts.username}</div>
              <div className="home_post_time"> {formatDate2(posts.createdAt)}</div>


              <img className="home_post_img" src={posts.img_src} /><br />
            </div>
          ))}
      </div>

    </>
  )
}

export default React.memo(Home);
