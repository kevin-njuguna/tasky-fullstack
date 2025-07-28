import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../store/userStore";

const Protected = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return <>{children}</>;
};

export default Protected;
