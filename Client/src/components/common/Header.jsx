import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from "../../assets/logo4.avif";
import { useClerk, useUser } from '@clerk/clerk-react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'

const Header = () => {
  const { signOut } = useClerk();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);

  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();

  const handleSignOut = async () => {
    console.log("signout called")
    try {
      await signOut();
      setCurrentUser(null);
      localStorage.clear();
      navigate('/');
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <div>
      <nav className="header d-flex justify-content-between align-content-center py-3">
        <div className="d-flex justify-content-center">
          <Link to="/">
            <img src={logo} alt="Blog Logo" width="60px" className="ms-4" />
          </Link>
          <h2 className="ms-3 text-white">VibeScribe</h2> 
        </div>
        <ul className="text-white d-flex justify-content-center list-unstyled">
          {!isSignedIn ? (
            <>
              <li>
                <Link to="signin" className="link me-4">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="signup" className="link me-4">
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <div className="d-flex justify-content-around" style={{ width: "200px" }}>
              <div className="user-button">
                <div style={{ position: "relative" }}>
                  <img src={user.imageUrl} width="40px" className="rounded-circle" alt="User" />
                  <p className="role" style={{ position: "absolute", top: "0px", right: "-20px" }}>
                    {currentUser.role}
                  </p>
                </div>
                <p className="mb-0 user-name">{user.firstName}</p>
              </div>
              <button onClick={handleSignOut} className="signout-btn">
                Signout
              </button>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
