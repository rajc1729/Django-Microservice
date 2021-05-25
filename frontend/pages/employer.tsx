import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "../components/header";
import { EmployeeModel } from "../models/types";
import { apiCall } from "../service/common";
const DynamicMap = dynamic(() => import("../components/DynamicMap"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export const useInterval = (callback, delay) => {
  const savedCallback = useRef(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const Employer: React.SFC<{}> = () => {
  const [data, setData] = useState(null);
  const [APIError, setAPIError] = useState(null);
  const [socketMessages, setSocketMessages] = useState(null);
  const webSocket = useRef(null);

  const getSocketToken = async () => {
    const res = await apiCall({
      method: "GET",
      url: "/details/websocket",
    });

    if (res == "404" || res == "401" || res == "500") {
      // if API doen't return 404 or 500 this will be rendered
      switch (res) {
        case "404":
          setAPIError(404);
          break;

        case "500":
          setAPIError(500);
          break;

        case "401":
          setAPIError(401);
          break;

        default:
          break;
      }
    } else {
      setData(res);
    }
  };

  useEffect(() => {
    getSocketToken();
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }
    webSocket.current = new WebSocket(
      `ws://localhost:7000/liveEmployeeV1?employer_name=${data.company_name}&token=${data.websocket_token}`
    );
    webSocket.current.onmessage = (message) => {
      const obj = JSON.parse(message.data);
      //   console.log(obj);
      setSocketMessages(obj);
    };
    return () => webSocket.current.close();
  }, [data]);

  useInterval(async () => {
    if (webSocket) {
      webSocket.current.send("data");
    }
  }, 1000 * 5);

  return (
    <>
      <Header />
      <div style={{ width: "100%", height: "100%", marginTop: "60px" }}>
        {socketMessages && <DynamicMap data={socketMessages.data} />}
      </div>
    </>
  );
};

export default Employer;
