import { NavLink } from 'react-router-dom';
import "./leviblock.css";
import { CgProfile } from "react-icons/cg";
import { BiDockTop } from "react-icons/bi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaPhotoVideo, FaUserFriends } from "react-icons/fa";
import { MdOutlineLibraryMusic, MdOutlineBookmarks } from "react-icons/md";
import type { GetProp, MenuProps } from 'antd';
import { Menu } from 'antd';
import { ReactNode } from 'react';

type MenuItem = GetProp<MenuProps, 'items'>[number];

const menuLinks: { key: string, label: string, path: string, icon: ReactNode }[] = [
  { key: 'profile', label: 'Profile', path: '/profile', icon: <CgProfile className="LeviBlock_ItemesSIze" /> },
  { key: 'posts', label: 'Posts', path: '/', icon: <BiDockTop className="LeviBlock_ItemesSIze" /> },
  { key: 'friends', label: 'Users', path: '/friends', icon: <FaUserFriends className="LeviBlock_ItemesSIze" /> },
  { key: 'chats', label: 'Chat', path: '/chats', icon: <IoChatbubbleEllipsesOutline className="LeviBlock_ItemesSIze" /> },
  { key: 'video', label: 'Video', path: '/Music', icon: <FaPhotoVideo className="LeviBlock_ItemesSIze" /> },
  { key: 'music', label: 'Music', path: '/Music', icon: <MdOutlineLibraryMusic className="LeviBlock_ItemesSIze" /> },
  { key: 'bookmarks', label: 'Bookmarks', path: '/bookmarks', icon: <MdOutlineBookmarks className="LeviBlock_ItemesSIze" /> }
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
            theme='light'
            defaultOpenKeys={['sub1']}
            className = "LeviBlock_ItemesSIze"
            style={{ width: 170 }}
            mode="inline"
            items={items}
        />
      </div>
  );
}
