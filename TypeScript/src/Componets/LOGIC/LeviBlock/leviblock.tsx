import { NavLink } from 'react-router-dom';
import "./leviblock.css";
import { CgProfile } from "react-icons/cg";
import { BiDockTop } from "react-icons/bi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaRegImage, FaPhotoVideo, FaUserFriends } from "react-icons/fa";
import { MdOutlineLibraryMusic, MdOutlineBookmarks } from "react-icons/md";
import type { GetProp, MenuProps } from 'antd';
import { Menu } from 'antd';
import { ReactNode } from 'react';

type MenuItem = GetProp<MenuProps, 'items'>[number];

const menuLinks: { key: string, label: string, path: string, icon: ReactNode }[] = [
  { key: 'profile', label: 'Profile', path: '/profile', icon: <CgProfile /> },
  { key: 'posts', label: 'Posts', path: '/', icon: <BiDockTop /> },
  { key: 'friends', label: 'Users', path: '/friends', icon: <FaUserFriends /> },
  { key: 'chats', label: 'Chat', path: '/chats', icon: <IoChatbubbleEllipsesOutline /> },
  { key: 'album', label: 'Album', path: '/Music', icon: <FaRegImage /> },
  { key: 'video', label: 'Video', path: '/Music', icon: <FaPhotoVideo /> },
  { key: 'music', label: 'Music', path: '/Music', icon: <MdOutlineLibraryMusic /> },
  { key: 'bookmarks', label: 'Bookmarks', path: '/bookmarks', icon: <MdOutlineBookmarks /> }
];

export default function LeviBlock() {
  const items: MenuItem[] = menuLinks.map(link => ({
    key: link.key,
    label: <NavLink to={link.path}>{link.label}</NavLink>,
    icon: <div className = "LeviBlock_ItemesSIze">{link.icon}</div>
  }));

  return (
      <div className="LeviBlock">
        <Menu
            className = "LeviBlock_ItemesSIze"
            style={{ width: 170}}
            mode="vertical"
            items={items}
        />
      </div>
  );
}
