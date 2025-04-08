import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./Componets/Auth/Login/Login.tsx";
import ProtectedLayout from "./Componets/LOGIC/ProtectedLayout.tsx";
import "./App.css"
import React, { Suspense } from "react";
import Profile from './Componets/Profile/Profile.tsx'
import Music from './Componets/Music/Music.tsx'
import Home from './Componets/Main/Home.tsx'
import Friends from './Componets/Friends/Friends.tsx'
import Chats from './Componets/Chats/Chats.tsx'
import Register from './Componets/Auth/Register/Register.tsx'
import CreatePost from './Componets/LOGIC/CreatePost.tsx'
import Chat from './Componets/LOGIC/OpenChat/Chat.tsx'
import CheckProfile from './Componets/LOGIC/CheckProfile/CheckProfile.tsx'
export const VITE_API_URL = `https://media-vcft.onrender.com`;
// delete my project
//bibasss-projects/media-akxg
const Bookmarks = React.lazy(() => import("./Componets/LOGIC/LeviBlock/LeviBlockComponents/Bookmarks/Bookmarks.tsx"));
const Balance = React.lazy(() => import("./Componets/LOGIC/TobeBlock/DrawerComponents/Balance/Balance.tsx"));


export default function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedLayout>
            <Home />
        </ProtectedLayout>
      ),
    },
    {
      path: "/friends",
      element: (
        <ProtectedLayout>
            <Friends />
        </ProtectedLayout>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedLayout>
          <Profile />
        </ProtectedLayout>
      ),
    },
    {
      path: "/friends/chat/:id",
      element: (
        <ProtectedLayout>
            <Chat />
        </ProtectedLayout>
      ),
    },
    {
      path: "/chats",
      element: (
        <ProtectedLayout>
            <Chats />
        </ProtectedLayout>
      ),
    },
    {
      path: "/check_profile/:id",
      element: (
        <ProtectedLayout>
            <CheckProfile />
        </ProtectedLayout>
      ),
    },
    {
      path: "/create_post",
      element: (
        <ProtectedLayout>
            <CreatePost />
        </ProtectedLayout>
      ),
    },
    {
      path: "/bookmarks",
      element: (
        <ProtectedLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Bookmarks />
          </Suspense>
        </ProtectedLayout>
      ),
    },
    {
      path: "/music",
      element: (
        <ProtectedLayout>
          <Music />
        </ProtectedLayout>
      ),
    },
    {
      path: "/balance",
      element: (
        <ProtectedLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Balance />
          </Suspense>
        </ProtectedLayout>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: (
          <Register />
      )
    },
    {
      path: "*",
      element: (
        <ProtectedLayout>
          <Profile />
        </ProtectedLayout>
      ),
    }
  ]);

  return <RouterProvider router={routes} />;
}

//git add TypeScript/*
//git commit -m "Перезаписан проект TypeScript"
//git push origin main
//import  { useEffect } from 'react'
// import { checkToken } from '../../api.tsx'
// import './Chats.css'
// import { useNavigate } from 'react-router-dom'
//
//
// export default function Chats() {
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     const tokenStatus = checkToken();
//     if (!tokenStatus.valid) {
//       navigate("/login");
//     }
//   }, []);
//
//
//
//   return (
//     <>
//       <div className="priends_maincontent"></div>
//     </>
//   )
// }