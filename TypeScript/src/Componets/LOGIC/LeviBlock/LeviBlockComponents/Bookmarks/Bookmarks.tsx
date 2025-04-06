import  { useEffect } from 'react'
import { checkToken } from '../../../api.tsx'
import './Bookmarks.css'
import { useNavigate } from 'react-router-dom'
import { GoBookmarkSlash } from "react-icons/go";


export default function Bookmarks() {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenStatus = checkToken();
    if (!tokenStatus.valid) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="priends_maincontent">
        <div className="bookmarks_text_noBookmarks">
          There is not bookmarks
        </div>
        <div className="bookmarks_ico_noBookmarks">
          <GoBookmarkSlash />
        </div>
      </div>
    </>
  )
}

