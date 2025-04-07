import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkToken } from "./api.tsx";
import axios from "axios";
import { UsePostStore } from '../Store/usePostStore/usePostStore.ts'
import {VITE_API_URL} from "../../App.tsx";

export default function CreatePost() {
  const navigate = useNavigate();
  const [post_text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const user = JSON.parse(localStorage.getItem("user") as string);
  const token = user?.token;
  const [username, setUsername] = useState();
  const [user_ava, setUser_ava] = useState();
  const [loading, setLoading] = useState(false);
  const { fetchPost } = UsePostStore();



  useEffect(() => {
    const tokenStatus = checkToken();
    if (!tokenStatus.valid) {
      navigate("/login");
    }else{
      setUser_ava(user.ava)
      setUsername(user.username);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!image || !post_text) {
      alert("Please provide all fields!");
      return;
    }
    setLoading(true); // 🔐 блокировка
    try {
      const formData = new FormData();
      formData.append("image", image);

      const uploadRes = await axios.post(`${VITE_API_URL}/api/upload`, formData);

      const imageUrl = uploadRes.data.imageUrl;

      const postRes = await axios.post(
        `${VITE_API_URL}/create_post`,
        { post_text, imageUrl, username, user_ava },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (postRes.status === 201) {
        navigate("/profile");
        fetchPost();
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    } finally {
    setLoading(false);
  }
  };

  return (
    <div className="priends_maincontent">
      <form onSubmit={handleSubmit}>
        <label>
          Post Text:
          <input type="text" value={post_text} onChange={(e) => setText(e.target.value)} />
        </label>

        <br /> <br />

        <label>
          Upload Image:
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        </label>

        <br /> <br />

        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}
