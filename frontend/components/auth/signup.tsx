import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/login.module.scss";
import CustomButton from "../buttons/button";
import { signUpApiCall } from "../../service/auth";
import { getCookie } from "../../service/cookie";
import { registerUser } from "../../models/types";

const SignUp: React.SFC<{}> = () => {
  const router = useRouter();
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    address1: "",
    address2: "",
    city: "",
    country: "",
  });

  const is_admin = () => {
    const role = getCookie("role");

    if (role == "employer") {
      router.push("/employer");
    } else if (role == "employee") {
      router.push("/employee");
    }
  };

  useEffect(() => {
    is_admin();
  }, []);

  const [usernameError, setUserameError] = useState(true);
  const [emailError, setEmailError] = useState(true);
  const [passwordError, setPasswordError] = useState(true);
  const [firstNameError, setFirstNameError] = useState(true);
  const [lastNameError, setLastNameError] = useState(true);
  const [address1Error, setAddress1Error] = useState(true);
  const [address2Error, setAddress2Error] = useState(true);
  const [cityError, setCityError] = useState(true);
  const [countryError, setCountryError] = useState(true);
  const [companyNameError, setCompanyNameError] = useState(true);
  const [confirmPasswordError, setConfirmPasswordError] = useState(true);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [role, setRole] = useState("employer");
  const formRef = useRef(null);
  const [signUpError, setSignUpError] = useState(null);

  const formHandler = (event) => {
    const { name, value } = event.target;
    // console.log(name);
    let tempErrors = errors;
    switch (name) {
      case "username":
        tempErrors.username = value.length < 4 ? "Username is not valid" : "";
        setUserameError(tempErrors.username.length > 0 ? true : false);
        break;
      case "email":
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        tempErrors.email = re.test(value) ? "" : "Email is not valid";
        setEmailError(tempErrors.email.length > 0 ? true : false);
        break;
      case "password1":
        setPasswordValue(value.replace(/\s/g, ""));
        tempErrors.password =
          value.length < 8 ? "Password must be at least 8 characters" : "";
        setPasswordError(tempErrors.password.length > 0 ? true : false);
        tempErrors.confirmPassword =
          confirmPasswordValue === value ? "" : "Passwords do not match";
        setConfirmPasswordError(
          tempErrors.confirmPassword.length > 0 ? true : false
        );
        break;
      case "password2":
        setConfirmPasswordValue(value.replace(/\s/g, ""));
        tempErrors.confirmPassword =
          value === passwordValue ? "" : "Passwords do not match";
        setConfirmPasswordError(
          tempErrors.confirmPassword.length > 0 ? true : false
        );
        break;
      case "first_name":
        tempErrors.first_name =
          value.length < 1 ? "Please enter your first name" : "";
        setFirstNameError(tempErrors.first_name.length > 0 ? true : false);
        break;
      case "last_name":
        tempErrors.last_name =
          value.length < 1 ? "Please enter your last name" : "";
        setLastNameError(tempErrors.last_name.length > 0 ? true : false);
        break;

      case "address1":
        tempErrors.address1 =
          value.length < 1 ? "Please enter your address line 1" : "";
        setAddress1Error(tempErrors.address1.length > 0 ? true : false);
        break;

      case "address2":
        tempErrors.address2 =
          value.length < 1 ? "Please enter your address line 2" : "";
        setAddress2Error(tempErrors.address2.length > 0 ? true : false);
        break;

      case "city":
        tempErrors.city = value.length < 1 ? "Please enter your city" : "";
        setCityError(tempErrors.city.length > 0 ? true : false);
        break;

      case "country":
        tempErrors.country =
          value.length < 1 ? "Please enter your country" : "";
        setCountryError(tempErrors.country.length > 0 ? true : false);
        break;

      case "company_name":
        tempErrors.company_name =
          value.length < 1 ? "Please enter your company name" : "";
        setCompanyNameError(tempErrors.company_name.length > 0 ? true : false);
        break;

      case "type":
        if (value == "employee") {
          setRole("employee");
        } else {
          setRole("employer");
        }
        break;

      default:
        break;
    }
    setErrors(tempErrors);
  };

  const sendRegister = async (event) => {
    event.preventDefault();
    setSignUpError(null);
    const formData = new FormData(formRef.current) as any;
    const userData = Object.fromEntries(formData) as registerUser;
    console.log(userData);

    const res = await signUpApiCall(userData);
    console.log(res);

    if (res.user && res.user.is_employer) {
      router.push("/employer");
    } else if (res.user && res.user.is_employee) {
      router.push("/employee");
    } else if (res.error) {
      console.log(res);
      setSignUpError(res.error);
    }
  };
  return (
    <div>
      <Head>
        <title>SignUp</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className={styles.login_card_container}>
        <h2 className={styles.login_header}>SignUp</h2>

        <div className={styles.form_container}>
          <form className={styles.login_form} ref={formRef}>
            {/*type*/}
            <label>Type</label>
            <br />

            <div>
              <input
                name="type"
                type="radio"
                value="employer"
                className={styles.custom_radio}
                onChange={formHandler}
                checked={role == "employer"}
              />
              <label>
                <span>Employer</span>
              </label>
            </div>

            <div>
              <input
                name="type"
                value="employee"
                type="radio"
                className={styles.custom_radio}
                onChange={formHandler}
                checked={role == "employee"}
              />

              <label>
                <span>Employee</span>
              </label>
            </div>
            <br />
            <br />

            {/* first name*/}
            <label>First Name</label>
            <br />
            <span className={styles.contact_form_error}>
              {errors.first_name}
            </span>
            <input
              name="first_name"
              type="text"
              className={styles.text_input}
              placeholder="First Name"
              onChange={formHandler}
            />

            {/*last name*/}
            <label>Last Name</label>
            <br />
            <span className={styles.contact_form_error}>
              {errors.last_name}
            </span>
            <input
              name="last_name"
              type="text"
              className={styles.text_input}
              placeholder="First Name"
              onChange={formHandler}
            />

            <label>Username</label>
            <br />
            <span className={styles.contact_form_error}>{errors.username}</span>
            <input
              name="username"
              type="text"
              className={styles.text_input}
              placeholder="Username"
              onChange={formHandler}
            />

            {/*email*/}
            <label>Email</label>
            <br />
            <span className={styles.contact_form_error}>{errors.email}</span>
            <div className={styles.input_container}>
              <input
                name="email"
                type="email"
                className={styles.text_input}
                placeholder="Email"
                onChange={formHandler}
              />
            </div>

            {/*password*/}
            <label>Password</label>
            <br />
            <span className={styles.contact_form_error}>{errors.password}</span>
            <div className={styles.input_container}>
              <input
                name="password1"
                type="password"
                value={passwordValue}
                className={styles.text_input}
                placeholder="Password"
                onChange={formHandler}
              />
            </div>

            {/*confirmpassword*/}
            <label> Confirm Password</label>
            <br />
            <span className={styles.contact_form_error}>
              {errors.confirmPassword}
            </span>
            <div className={styles.input_container}>
              <input
                name="password2"
                type="password"
                value={confirmPasswordValue}
                className={styles.text_input}
                placeholder="Password"
                onChange={formHandler}
              />
            </div>

            {/*address1*/}
            <label>Address Line 1</label>
            <br />
            <span className={styles.contact_form_error}>{errors.address1}</span>
            <input
              name="address1"
              type="text"
              className={styles.text_input}
              placeholder="address line 1"
              onChange={formHandler}
            />

            {/*address2*/}
            <label>Address Line 2</label>
            <br />
            <span className={styles.contact_form_error}>{errors.address2}</span>
            <input
              name="address2"
              type="text"
              className={styles.text_input}
              placeholder="address line 2"
              onChange={formHandler}
            />

            {/*city*/}
            <label>City</label>
            <br />
            <span className={styles.contact_form_error}>{errors.city}</span>
            <input
              name="city"
              type="text"
              className={styles.text_input}
              placeholder="city"
              onChange={formHandler}
            />

            {/*country*/}
            <label>Country</label>
            <br />
            <span className={styles.contact_form_error}>{errors.country}</span>
            <input
              name="country"
              type="text"
              className={styles.text_input}
              placeholder="country"
              onChange={formHandler}
            />

            {/*latitude*/}
            <label>Latitude</label>
            <br />
            <input
              name="latitude"
              type="number"
              step="any"
              defaultValue={37.8199}
              className={styles.text_input}
              placeholder="latitide"
              onChange={formHandler}
            />

            {/*longitude*/}
            <label>Longitude</label>
            <br />
            <input
              name="longitude"
              type="number"
              step="any"
              defaultValue={122.4783}
              className={styles.text_input}
              placeholder="longitude"
              onChange={formHandler}
            />

            {/*Company Name*/}
            <label>Company Name</label>
            <br />
            <span className={styles.contact_form_error}>
              {errors.company_name}
            </span>
            <input
              name="company_name"
              type="text"
              className={styles.text_input}
              placeholder="Company Name"
              onChange={formHandler}
            />

            <CustomButton
              fill={true}
              clickAction={(event) => sendRegister(event)}
              disabled={
                usernameError ||
                emailError ||
                passwordError ||
                confirmPasswordError ||
                firstNameError ||
                lastNameError ||
                address1Error ||
                address2Error ||
                cityError ||
                countryError ||
                companyNameError
              }
            >
              Sign up
            </CustomButton>

            {signUpError && (
              <div className={styles.auth_form_error}>
                <span> {signUpError} </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
