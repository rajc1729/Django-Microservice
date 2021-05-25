import Link from "next/link";
import styles from "../styles/components/header.module.scss";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { getCookie } from "../service/cookie";
import { useRouter } from "next/router";
import { signOut } from "../service/auth";

const Header: React.SFC<{}> = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("access_token");

    const role = getCookie("role");

    if (role == "employer") {
      setRole("employer");
    } else if (role == "employee") {
      setRole("employee");
    }
    setAccessToken(token);
  }, []);

  const handleHomeClick = () => {
    router.push(`/${role}`);
  };

  const handleLogout = () => {
    signOut();
    router.push(`/`);
  };

  return (
    <>
      <header>
        <nav className={styles.nav}>
          <div className={styles.nav_elm}>
            <div className={styles.nav_elm_left}>
              <h1>
                <Link href={{ pathname: "/" }}>
                  <a>Coding </a>
                </Link>
              </h1>
            </div>
            <div className={styles.nav_elm_right}>
              {!accessToken ? (
                <button className={styles.admin_button}>
                  <Link href={{ pathname: "/login" }}>
                    <a title="login">Login</a>
                  </Link>
                </button>
              ) : (
                <button
                  onClick={handleHomeClick}
                  className={styles.admin_button}
                >
                  <a title="home">Home</a>
                </button>
              )}
              {!accessToken ? (
                <Link href={{ pathname: "/signup" }}>
                  <button className={styles.bold}>
                    <a title="signup"> Sign Up </a>
                  </button>
                </Link>
              ) : (
                <button onClick={handleLogout} className={styles.bold}>
                  <a title="logout"> Logout </a>
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
