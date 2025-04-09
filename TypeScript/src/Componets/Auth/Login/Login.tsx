import { useState, useRef  } from 'react'
import './Login.css'
import { NavLink, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import { doLogin } from '../../LOGIC/api.tsx'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const successToastShown = useRef(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (email === "" || password === "") {
      toast.error("Заполните все поля");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Загрузка...");

    try {
      const { success } = await doLogin(email, password);
      if (success) {
        if (!successToastShown.current) {
          toast.success(`Добро пожаловать ${email}`);
          successToastShown.current = true;
        }
        navigate("/profile");
      } else {
        toast.error("login or password: Incorrect!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Что-то пошло не так.");
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const createPost = async () => {
  //     try {
  //       await axios.post(`${VITE_API_URL}/wake_up`, { some_text });
  //     } catch (error) {
  //       console.error('Failed to create post:', error);
  //     }
  //   };
  //   createPost();
  // }, []);


  return (
      <>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="login-block">
          <div className="login">Login</div>
          <form onSubmit={handleSubmit}>
            <input
                className="Email"
                placeholder=" Username"
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            /><br /><br />
            <input
                className="Password"
                placeholder=" Password"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br /><br />
            <button className="Button" type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
          <div className="login_regiter_text">If you don’t have an account,</div>
          <NavLink className="Button_for_register" to={`/register`}>
            register here.
          </NavLink>
        </div>

        <div className="neveruse">
          <h4>About this project:</h4>
          Used: Node js: Express, React(TSX), Mongodb, Git, Jest, Zustand, Redis, Cloudinary
          <br /><br />
          Front have: Antd, react-icons, react-router-dom, react-hot-toast, socket.io, jwt, axios, react-modal-image,
          dynamic import, useMemo
          <br />
          Backend have: jwt, mongoose, socked.io, multer, cors, cache
          <br /><br />
          login: biba <br />password: frfrBRDBjd121311HHHH21212ejbdd1231d
          <br /><br />
          Goal:<br />
          Tailwind, NextJs, симантик верстка
        </div>
      </>
  );
}
