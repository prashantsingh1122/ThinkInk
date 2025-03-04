import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
       