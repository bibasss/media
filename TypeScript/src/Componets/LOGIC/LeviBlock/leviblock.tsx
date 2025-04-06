import { NavLink } from 'react-router-dom'
import "./leviblock.css";
import { CgProfile } from "react-icons/cg";
import { BiDockTop } from "react-icons/bi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaRegImage, FaPhotoVideo, FaUserFriends} from "react-icons/fa";
import { MdOutlineLibraryMusic, MdOutlineBookmarks} from "react-icons/md";


export default function LeviBlock () {


  return (
    <>
      <div className="LeviBlock">

        <div className="profile_profile_ico"><CgProfile /></div>
        <div className="profile_levi">
          <NavLink to={"/profile"}>Profile</NavLink>
        </div>

        <div className="profile_posts_ico"><BiDockTop /></div>
        <div className="Home_levi">
          <NavLink to={"/"}>Posts</NavLink>
        </div>

        <div className="profile_friends_ico"><FaUserFriends /></div>
        <div className="Friends_levi">
          <NavLink to={"/friends"}>Users</NavLink>
        </div>

        <div className="profile_chat_ico"><IoChatbubbleEllipsesOutline /></div>
        <div className="Chat_levi">
          <NavLink to={"/chats"}>Chat</NavLink>
        </div>

        <div className="profile_image_ico"><FaRegImage /></div>
        <div className="Album-levi">
          <NavLink to={"/"}>Album</NavLink>
        </div>

        <div className="profile_vieos_ico"><FaPhotoVideo /></div>
        <div className="Video_levi">
          <NavLink to={"/"}>Video</NavLink>
        </div>

        <div className="profile_music_ico"><MdOutlineLibraryMusic /></div>
        <div className="Music_levi">
          <NavLink to={"/Music"}>Music</NavLink>
        </div>

        <div className="profile_bookmarks_ico"><MdOutlineBookmarks /></div>
        <div className="Book-levi">
          <NavLink to={"/bookmarks"}>Bookmarks</NavLink>
        </div>

        <div className="profile_bookmarks_ico"></div>
        <div className="Book-levi">
          <NavLink to={"/"}></NavLink>
        </div>


      </div>
    </>
  )
}

