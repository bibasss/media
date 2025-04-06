import axios from 'axios'
import { jwtDecode } from "jwt-decode";
// const VITE_API_URL = "https://mern-4-z7n4.onrender.com"
// const ws = new WebSocket("wss://mern-4-z7n4.onrender.com");

const VITE_API_URL= `http://localhost:5555`;

export const checkToken = () => {
  const user = JSON.parse(localStorage.getItem("user") as string);
  if (user && user.token) {
    const decodedToken = jwtDecode(user.token);
    if (decodedToken) {
      // @ts-ignore
      if (decodedToken.exp > Date.now() / 1000) {
        return { valid: true, message: "Token is valid" };
      } else {
        return { valid: false, message: "Token has expired" };
      }
    } else {
      return { valid: false, message: "Invalid token" };
    }
  } else {
    return { valid: false, message: "Что бы перейди в этот раздел нужно войти в свой аккаунт" };
  }
}


export const doLogin = async(email: string, password: string) => {
  console.log(email + " " + password);
  try{
    const response = await axios.post(`${VITE_API_URL}/login`,
      {
        email: email,
        password: password
      }
    );

    const user = response.data;
    localStorage.setItem("user", JSON.stringify(response.data));
    return {success: true, data: user};


  }catch(err: any){
    console.log(err.response.data.message)
    return {success: false};
  }
}

// export const createPost = async (imageUrl: string, post_text: string, username: string,user_ava: string ) => {
//   try {
//     await axios.post(
//       `${VITE_API_URL}/create_post`,
//       { post_text, imageUrl, username, user_ava },
//
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//
//     return { success: true };
//   } catch (error) {
//     console.error('Registration error: ' + error);
//     return { success: false };
//   }
// };

export const getAllUsers = async () => {
  try{
    const response =  await axios.get(`${VITE_API_URL}/users`);
    return {success: true, data: response.data}
  }catch(er: any){
    return {success: false, data: er.response.data.message};
  }
}


export const getMessage = async () => {
  try{
    const response =  await axios.get(`${VITE_API_URL}/write_messega`);
    return {success: true, data: response.data}
  }catch(er: any){
    return {success: false, data: er.response.data.message};
  }
}

export const getAllPosts = async () => {
  try{
    const response =  await axios.get(`${VITE_API_URL}/posts`);
    return {success: true, data: response.data}
  }catch(er: any){
    return {success: false, data: er.response.data.message};
  }
}


// export const RequestToFriends = async (user_id, UserLocation, userAva, userName, sender_id) => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const token = user.token;
//
//     await axios.post(
//       'http://localhost:5555/request_to_friends',
//       {
//         user_id,
//         UserLocation,
//         userAva,
//         userName,
//         sender_id
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );
//
//     return { success: true };
//   } catch (error) {
//     console.error('Registration error: ' + error);
//     return { success: false };
//   }
// };

// export const CheckFriendRequest = async (user_id, sender_id) => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const token = user.token;
//
//     const response = await axios.get(
//       `http://localhost:5555/check_friend_request?user_id=${user_id}&sender_id=${sender_id}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );
//
//     return response.data.exists; // true или false
//   } catch (error) {
//     console.error("Ошибка при проверке запроса:", error);
//     return false;
//   }
// };
//
//
// export const CancelFriendRequest = async (user_id, sender_id) => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const token = user.token;
//
//     await axios.delete(
//       `http://localhost:5555/cancel_friend_request?user_id=${user_id}&sender_id=${sender_id}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );
//
//     return { success: true };
//   } catch (error) {
//     console.error("Ошибка при отмене запроса:", error);
//     return { success: false };
//   }
// };
