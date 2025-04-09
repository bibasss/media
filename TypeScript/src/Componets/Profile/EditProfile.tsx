import { useEffect, useState } from "react";
import { checkToken } from "../LOGIC/api.tsx";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import {Button, Segmented} from "antd";

export default function EditProfile() {
    const UserName = "Biba";

    const navigate = useNavigate();
    const [userAva, setUserAva] = useState("https://res.cloudinary.com/dm7cuhmda/image/upload/v1743782772/posts/iisbjwprc8uiajw2gvcv.jpg");
    const [section, setSection] = useState("Profile custom");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") as string);
        const tokenStatus = checkToken();
        if (!tokenStatus.valid) {
            navigate("/login");
        } else {
            setUserAva(user.ava);
        }
    }, []);

    return (
        <div className="edit_profile_fisrt">
            <Segmented
                options={['Profile custom', 'Safety']}
                block
                value={section}
                onChange={(val) => setSection(val as string)}
            />

            {section === "Profile custom" && (
                <>
                    <img src={userAva} alt="avatar" className="edit_profile_edit_ava" />
                    <input className="edit_profile_edit_name" placeholder={`name: ${UserName}`} />
                    <input className="edit_profile_edit_textAboutMe" placeholder="about: Nothing" />
                    <input className="edit_profile_edit_city" placeholder="city: Almaty" />
                    <Button className="edit_profile_edit_password">Edit</Button>
                </>
            )}

            {section === "Safety" && (
                <>
                    Change password
                    <input className="" placeholder="Old password" />
                    <input className="" placeholder="New password" />
                    <Button className="">Edit</Button>
                </>
            )}
        </div>
    );
}
