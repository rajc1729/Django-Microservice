import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import Header from "../components/header";
import { EmployeeModel } from "../models/types";
import dynamic from "next/dynamic";
import { apiCall } from "../service/common";
import Employer from "./employer";
const DynamicMap = dynamic(() => import("../components/DynamicMap"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const Employee: React.SFC<{}> = () => {
  const [data, setData] = useState(null);
  const [APIError, setAPIError] = useState(null);

  const getEmployerDetils = async () => {
    const res = await apiCall({
      method: "GET",
      url: "/details/employee/",
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
      const employerInfo = [
        {
          _id: res.user.id,
          first_name: res.employer.user.first_name,
          last_name: res.employer.user.last_name,
          username: res.employer.user.username,
          email: res.employer.user.email,
          address1: res.employer.user.address1,
          address2: res.employer.user.address2,
          city: res.employer.user.city,
          country: res.employer.user.country,
          latitude: res.employer.user.latitude,
          longitude: res.employer.user.longitude,
          company_name: res.employer.company_name,
        },
      ];
      setData(employerInfo);
    }
  };

  useEffect(() => {
    getEmployerDetils();
  }, []);

  return (
    <>
      <Header />
      <div style={{ width: "100%", height: "100%", marginTop: "60px" }}>
        {data && <DynamicMap data={data} />}
      </div>
    </>
  );
};

export default Employee;
