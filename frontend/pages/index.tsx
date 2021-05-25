import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Header from "../components/header";
import styles from "../styles/Home.module.scss";

const Home: React.SFC<{}> = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1>Hello welcome to live location webapp.</h1>
      </div>
    </>
  );
};

export default Home;
