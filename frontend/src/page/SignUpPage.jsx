import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/borderAnimated.Component";
import {
  LockIcon,
  MailIcon,
  UserIcon,
  LoaderIcon,
  MessageCircleIcon,
} from "lucide-react";
import { Link } from "react-router";
// import index from "../index.css";

function SignUpPage() {
  const [formData, setFormsData] = useState({
    fullName: "",
    username: "",
    password: "",
    email: "",
  });
  const { signUp, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp(formData);
  };
  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* LEFT SIDE - FORM */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30 ">
              <div className="w-full max-w-md">
                {/*HEADING TEXT*/}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Create Account
                  </h2>
                  <p className="text-slate-400">SignUp for new Account</p>
                </div>
                {/*FORM*/}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/*FULLNAME */}
                  <div>
                    <label className="auth-input-label">Full Name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />

                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormsData({
                            ...formData,
                            fullName: e.target.value,
                          })
                        }
                        className="input"
                        placeholder="Sumit sen"
                      />
                    </div>
                  </div>
                  {/*EMAIL INPUT */}
                  <div>
                    <label className="auth-input-label">E-MAIL</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />

                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormsData({ ...formData, email: e.target.value })
                        }
                        className="input"
                        placeholder="Sumit@gmail.com"
                      />
                    </div>
                  </div>
                  {/*PASSWORD INPUT */}
                  <div>
                    <label className="auth-input-label">PASSWORD</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />

                      <input
                        type="text"
                        value={formData.password}
                        onChange={(e) =>
                          setFormsData({
                            ...formData,
                            password: e.target.value,
                          })
                        }
                        className="input"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>
                  {/* SUBMIT BUTTON */}
                  <button
                    className="auth-btn"
                    type="submit"
                    disabled={isSigningUp}
                  >
                    {isSigningUp ? (
                      <LoaderIcon className="w-full flex h-5 animate-spin text-center" />
                    ) : (
                      "CREATE ACCOUNT"
                    )}
                  </button>
                </form>
                {/* */}
                <div className="mt-6 text-center">
                  <Link to={"/login"} className="auth-link">
                    Already have an account? Log In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default SignUpPage;
