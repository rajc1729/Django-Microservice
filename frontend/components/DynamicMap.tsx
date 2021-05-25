import ReactMapGL, { Layer, Marker, Popup } from "react-map-gl";
import { useRef, useState, useEffect } from "react";
import { EmployeeModel } from "../models/types";

export interface DynamicMapProps {
  data: Array<EmployeeModel>;
}

const DynamicMap: React.SFC<DynamicMapProps> = ({ data }) => {
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 2,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [employeeSelected, setEmployeeSelected] = useState(null);
  const mounted = useRef(false);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  const prevLength = usePrevious(data.length) as Number;

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      //update
      if (data.length > prevLength) {
        new Audio("/notify.mp3").play();
      }
    }
  });

  const handelClick = (event, employee) => {
    event.preventDefault();
    setEmployeeSelected(employee);
    console.log(employee);
  };

  const handelCancel = () => {
    setEmployeeSelected(null);
  };

  useEffect(() => {
    const listner = (event) => {
      if (event.key === "Escape") {
        setEmployeeSelected(null);
      }
    };
    window.addEventListener("keydown", listner);

    return () => {
      window.removeEventListener("keydown", listner);
    };
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={(viewport) => setViewport(viewport)}
      mapboxApiAccessToken={
        process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_ACCESS_TOKEN
      }
      mapStyle="mapbox://styles/mapbox/dark-v10"
    >
      {/* <Layer
        id="sectionTextLayer"
        type="symbol"
        paint={{
          "text-color": "#FFFFF",
          "text-halo-blur": 10,
          "text-halo-color": "#FFFFF",
          "text-halo-width": 10,
          "text-opacity": 1,
        }}
        layout={{
          "icon-image": "harbor-15",
          "icon-allow-overlap": true,
          "text-field": "Put the text in here",
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 11,
          "text-transform": "uppercase",
          "text-letter-spacing": 0.05,
          "text-offset": [0, 1.5],
        }}
      ></Layer> */}
      {data.map((user) => {
        return (
          <Marker
            key={user._id}
            latitude={user.latitude}
            longitude={user.longitude}
          >
            <button
              onClick={(event) => {
                handelClick(event, user);
              }}
              style={{ width: "50px", height: "50px" }}
            >
              <EmployeeSVG />
            </button>
          </Marker>
        );
      })}
      {employeeSelected && (
        <Popup
          latitude={employeeSelected.latitude}
          longitude={employeeSelected.longitude}
          onClose={handelCancel}
        >
          <div>
            <h4>
              Name:{" "}
              {`${employeeSelected.first_name} ${employeeSelected.last_name}`}
            </h4>
            <h5>Email: {employeeSelected.email}</h5>
            <h5>Username: {employeeSelected.username}</h5>
            <h5>Address: {employeeSelected.address1}</h5>
            <h5>City: {employeeSelected.city}</h5>
          </div>
        </Popup>
      )}
    </ReactMapGL>
  );
};

const EmployeeSVG: React.SFC<{}> = () => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" width="14" height="24" fill="white" fillOpacity="0.98" />
      <rect x="16" width="6" height="18" fill="white" fillOpacity="0.98" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 0H2V24H16L22 18V0ZM15 23H3V1H21V17H15V23ZM16 18H20.586L16 22.586V18V18ZM13 19H5V20H13V19ZM13 16H5V17H13V16ZM19 14V13H5V14H19ZM19 10H15V11H19V10ZM12.994 11H5.003L5 10.211C4.997 9.491 4.994 8.596 6.314 8.291C7.797 7.95 7.55 7.873 7.472 7.728C6.394 5.74 6.762 4.555 7.077 4.025C7.465 3.374 8.166 3 9 3C9.827 3 10.523 3.368 10.91 4.011C11.455 4.915 11.319 6.233 10.531 7.724C10.426 7.92 10.336 7.979 11.65 8.283C13.005 8.595 13.002 9.495 13 10.219L12.994 11ZM6 10H12C11.993 9.453 11.93 9.374 11.46 9.266C10.605 9.068 9.831 8.89 9.559 8.294C9.417 7.983 9.446 7.634 9.646 7.255C10.256 6.104 10.404 5.109 10.053 4.526C9.777 4.068 9.275 4 9 4C8.52 4 8.143 4.19 7.937 4.537C7.585 5.127 7.736 6.117 8.351 7.251C8.555 7.628 8.587 7.978 8.446 8.29C8.177 8.888 7.41 9.064 6.599 9.252C6.074 9.373 6.006 9.454 6 10V10ZM19 8V7H15V8H19ZM19 4H15V5H19V4Z"
        fill="#9A9797"
      />
    </svg>
  );
};

export default DynamicMap;
