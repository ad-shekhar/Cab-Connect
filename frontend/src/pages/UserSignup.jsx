import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useContext(UserDataContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const newUser = {
        fullname: {
          firstname: firstName,
          lastname: lastName
        },
        email,
        password
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      )

      if (response.status === 201) {
        const { user, token } = response.data
        setUser(user)
        localStorage.setItem('token', token)
        navigate('/home')
        resetForm()
      }
    } catch (err) {
      handleSubmissionError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
  }

  const handleSubmissionError = (error) => {
    if (error.response) {
      // Server responded with error status (4xx/5xx)
      setError(error.response.data.message || 'Registration failed. Please try again.')
    } else if (error.request) {
      // No response received
      setError('Network error. Please check your internet connection.')
    } else {
      // Other errors
      setError('An unexpected error occurred. Please try again later.')
    }
  }

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img 
          className="w-16 mb-10" 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" 
          alt="Logo" 
        />

        {error && (
          <div className="mb-4 p-3 text-red-600 bg-red-100 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-medium mb-2">What's your name</h3>
          <div className="flex gap-4 mb-7">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isSubmitting}
            />
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            required
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="password"
            minLength="6"
            disabled={isSubmitting}
          />

          <button
            type="submit"
            className={`bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#333]'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>

      <div>
        <p className="text-[10px] leading-tight">
          This site is protected by reCAPTCHA and the{' '}
          <a href="#" className="underline">Google Privacy Policy</a> and{' '}
          <a href="#" className="underline">Terms of Service</a> apply.
        </p>
      </div>
    </div>
  )
}

export default UserSignup