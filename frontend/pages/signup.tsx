import SignUp from "../components/auth/signup";
import Header from "../components/header";

export default function SignupPage() {
  return (
    <div>
      <Header />
      <div style={{ marginTop: "100px" }}>
        <SignUp />
      </div>
    </div>
  );
}
