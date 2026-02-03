import { useContext, useEffect, useState } from 'react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)

  const { isSignedIn, user, isLoaded } = useUser()
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSelectRole(e) {
    setError('')
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    let res = null;
    try {
      if (selectedRole === 'author') {
        res = await axios.post('http://localhost:4000/author-api/author', currentUser)
        let { message, payload } = res.data;
        if (message === 'author') {
          setCurrentUser({ ...currentUser, ...payload })
          localStorage.setItem("currentuser", JSON.stringify(payload))
        } else {
          setError(message);
        }
      }
      if (selectedRole === 'user') {
        res = await axios.post('http://localhost:4000/user-api/user', currentUser)
        let { message, payload } = res.data;
        if (message === 'user') {
          setCurrentUser({ ...currentUser, ...payload })
          localStorage.setItem("currentuser", JSON.stringify(payload))
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (isSignedIn === true) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded])

  useEffect(() => {
    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0) {
      navigate(`/author-profile/${currentUser.email}`);
    }
  }, [currentUser]);

  return (
    <div className='container'>
      {isSignedIn === false && (
        <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <motion.img
          src="https://cdn.logojoy.com/wp-content/uploads/2018/05/30164225/572.png"
          alt="Creative Blogging"
          className="img-fluid mx-auto d-block w-100 mb-4"
          style={{ maxWidth: "600px", borderRadius: "12px" }}
          initial={{ rotate: -5, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        />
      
        <motion.h2
          className="text-center mb-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          style={{ fontWeight: 'bold', fontSize: '2rem', color: '#2c3e50' }}
        >
          Welcome to BlogCraft – Where Ideas Turn Into Impact
        </motion.h2>
      
        <motion.p
          className="lead text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          Dive into a world of creativity, storytelling, and inspiration. BlogCraft is your go-to platform to craft your voice and connect with a global audience.
        </motion.p>
      
        <motion.ul
          className="lead mt-4"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.8 }}
        >
          <li>✍️ Tips for compelling storytelling and content writing</li>
          <li>🌐 Strategies to grow and monetize your blog</li>
          <li>🎨 Design and branding inspiration for creators</li>
          <li>📢 Social media hacks to boost your presence</li>
          <li>📚 Real stories, fresh perspectives, and expert insights</li>
        </motion.ul>
      
        <motion.p
          className="lead mt-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2 }}
        >
          Whether you're just starting or already an avid writer, BlogCraft empowers your journey with tools, knowledge, and a thriving community.
        </motion.p>
      </motion.div>      
      )}

      {isSignedIn === true && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <div className='d-flex justify-content-evenly align-items-center bg-info p-3'>
            <motion.img src={user.imageUrl} width="100px" className='rounded-circle' alt="" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} />
            <motion.p className="display-6" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>{user.firstName}</motion.p>
            <motion.p className="lead" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>{user.emailAddresses[0].emailAddress}</motion.p>
          </div>
          <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>Select role</motion.p>
          {error.length !== 0 && (
            <motion.p className="text-danger fs-5" style={{ fontFamily: "sans-serif" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
              {error}
            </motion.p>
          )}
          <div className='d-flex role-radio py-3 justify-content-center'>
            <motion.div className="form-check me-4" whileHover={{ scale: 1.1 }}>
              <input type="radio" name="role" id="author" value="author" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="author" className="form-check-label">Author</label>
            </motion.div>
            <motion.div className="form-check" whileHover={{ scale: 1.1 }}>
              <input type="radio" name="role" id="user" value="user" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="user" className="form-check-label">User</label>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Home
