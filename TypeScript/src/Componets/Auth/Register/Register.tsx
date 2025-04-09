import { Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Register.css";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
import {VITE_API_URL, citiesKazahstan} from "../../../App.tsx";


export default function Register(){
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // const VITE_API_URL= `https://media-vcft.onrender.com`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!name || !email || !password || !city) {
      toast.error("Please provide all fields!");
      return;
    }
    setLoading(true); // 🔐 блокировка
    try {
      const formData = new FormData();
      // @ts-ignore
      formData.append("image", image);

      const uploadRes = await axios.post(`${VITE_API_URL}/api/upload`, formData);

      const imageUrl = uploadRes.data.imageUrl;

      const postRes = await axios.post(
        `${VITE_API_URL}/register`,
        { name, imageUrl, email, password, city }
      );

      if (postRes.status === 201) {
        navigate("/login");
        toast.success("Вы успешно зарегистрировались!");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="centerForm">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="title">REGISTRATION</h1>

      <form onSubmit={handleSubmit} className="contact-form row">
        <div className="form-field col-lg-6">
          <label htmlFor="name">Name</label>
          <input name="name" id="name" className="form-control" type="text" value={name}
                 onChange={(e) => setName(e.target.value)}/>
        </div>

        <div className="form-field col-lg-6">
          <label htmlFor="email">Username</label>
          <input name="email" id="email" className="form-control" type="text" value={email}
                 onChange={(e) => setEmail(e.target.value)}/>
        </div>

        <div className="form-field col-lg-6">
          <label htmlFor="city">City</label>
          <select
            name="city"
            id="city"
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="" disabled>Select a city</option>
            {citiesKazahstan.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>


        <div className="form-field col-lg-6">
          <label htmlFor="ava">Avatar</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />

        </div>

        <div className="form-field col-lg-6">
          <label htmlFor="password">Password</label>
          <input name="password" id="password" className="form-control" type="password" value={password}
                 onChange={(e) => setPassword(e.target.value)}/>
        </div>

        <div className="form-field col-lg-6">
          <label htmlFor="confirm_password">Confirm password</label>
          <input name="confirm_password" id="confirm_password" className="form-control" type="password"
                 value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
        </div>

        <div className="form-field col-lg-12">
          <input className="btn btn-primary submit-btn" type="submit" value="Submit"/>
        </div>
      </form>
      <p>If you have an account, <Link to="/login">Click here</Link>.</p>
    </div>
  );
}