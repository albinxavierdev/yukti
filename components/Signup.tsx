// "use client"

// import type React from "react"
// import { useState } from "react"

// interface SignUpProps {
//   onClose: () => void
// }

// export default function SignUp({ onClose }: SignUpProps) {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (password !== confirmPassword) {
//       alert("Passwords don't match!")
//       return
//     }
//     // Here you would typically handle the signup logic
//     console.log("Signup attempt with:", { email, password })
//     // After successful signup, you might want to close the modal
//     // onClose();
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">Sign Up</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div className="flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Sign Up
//             </button>
//             <button type="button" onClick={onClose} className="text-blue-500 hover:text-blue-600 font-semibold">
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

/////------------------????
"use client"

import type React from "react"
import { useState } from "react"
import { supabase } from '../app/backend/supabase'
import { useRouter } from 'next/navigation'

interface SignUpProps {
  onClose: () => void
}

export default function SignUp({ onClose }: SignUpProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("") 
  const router = useRouter()

  // const isValidEmail = (email: string) => {
  //   const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  //   return emailRegex.test(email);
  // }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()

  //   if (!isValidEmail(email)) {
  //     alert("Please enter a valid email address")
  //     return
  //   }

  //   if (password.length < 6) {
  //     alert("Password must be at least 6 characters long")
  //     return
  //   }

  //   if (password !== confirmPassword) {
  //     alert("Passwords don't match!")
  //     return
  //   }

  //   try {
  //     const { data, error } = await supabase.auth.signUp({
  //       email,
  //       password,
  //       options: {
  //         data: {
  //           name: name,
  //         },
  //         emailRedirectTo: `${window.location.origin}/auth/callback`
  //       }
  //     })

  //     if (error) throw error

  //     alert('Signup successful! Please check your email for verification.')
  //     router.refresh()
  //     onClose()
  //   } catch (error) {
  //     alert('Error signing up: ' + error)
  //   }
  // }

  
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  
  //   try {
  //     // First create the auth user with full name
  //     const { data, error } = await supabase.auth.signUp({
  //       email,
  //       password,
  //       options: {
  //         data: {
  //           full_name: name, // Add this explicitly
  //           name: name      // Add this explicitly
  //         }
  //       }
  //     })
  
  //     if (error) throw error
  
  //     // Then create the profile record
  //     if (data.user) {
  //       const { error: profileError } = await supabase
  //         .from('profiles')
  //         .upsert({  // Using upsert to handle both insert/update
  //           id: data.user.id,
  //           name: name,
  //           email: email,
  //           updated_at: new Date().toISOString()
  //         })
  
  //       if (profileError) throw profileError
  //     }
  
  //     // Verify the profile was created
  //     const { data: profile } = await supabase
  //       .from('profiles')
  //       .select('*')
  //       .eq('id', data.user?.id)
  //       .single()
  
  //     console.log('Created profile:', profile)
  
  //     router.refresh()
  //     onClose()
  //   } catch (error) {
  //     console.error('Signup error:', error)
  //     alert('Error signing up: ' + error)
  //   }
  // }
  
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  
  //   try {
  //     const { data, error } = await supabase.auth.signUp({
  //       email,
  //       password,
  //       options: {
  //         data: {
  //           full_name: name,
  //           name: name
  //         }
  //       }
  //     })
  
  //     if (error) throw error
  
  //     if (data.user) {
  //       const { error: profileError } = await supabase
  //         .from('profiles')
  //         .upsert({
  //           id: data.user.id,
  //           name: name,
  //           email: email,
  //           updated_at: new Date().toISOString()
  //         })
  
  //       if (profileError) throw profileError
  
  //       // Automatically sign in after signup
  //       const { error: signInError } = await supabase.auth.signInWithPassword({
  //         email,
  //         password
  //       })
  
  //       if (signInError) throw signInError
  
  //       // Close the modal automatically
  //       onClose()
        
  //       // Refresh the page to update the UI
  //       router.refresh()
  //     }
  //   } catch (error) {
  //     console.error('Signup error:', error)
  //     alert('Error signing up: ' + error)
  //   }
  // }
  
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  
  //   // Add validation
  //   if (password !== confirmPassword) {
  //     alert("Passwords don't match!")
  //     return
  //   }
  
  //   if (password.length < 6) {
  //     alert("Password must be at least 6 characters")
  //     return
  //   }
  
  //   try {
  //     // Create auth user
  //     const { data: authData, error: authError } = await supabase.auth.signUp({
  //       email,
  //       password,
  //       options: {
  //         data: {
  //           full_name: name,
  //           // name: name,
  //           phone_number: phoneNumber
  //         }
  //       }
  //     })
  
  //     if (authError) {
  //       console.log('Auth Error:', authError)
  //       throw authError
  //     }
  
  //     if (!authData.user?.id) {
  //       throw new Error('No user ID returned')
  //     }
  
  //     // Create profile
  //     const { error: profileError } = await supabase
  //       .from('profiles')
  //       .upsert({
  //         id: authData.user.id,
  //         name: name,
  //         email: email,
  //         phone_number: phoneNumber,
  //         updated_at: new Date().toISOString()
  //       })
  
  //     if (profileError) {
  //       console.log('Profile Error:', profileError)
  //       throw profileError
  //     }
  
  //     // Sign in
  //     const { error: signInError } = await supabase.auth.signInWithPassword({
  //       email,
  //       password
  //     })
  
  //     if (signInError) {
  //       console.log('SignIn Error:', signInError)
  //       throw signInError
  //     }
  
  //     // Success path
  //     onClose()
  //     router.refresh()
  
  //   } catch (error) {
  //     onClose()
  //     router.refresh()
  //     console.log('Detailed error:', error)
  //     alert(`Signup done:`)
  //   }
  // }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      // Enhanced auth signup with phone number in metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name: name,
            phone_number: phoneNumber,  // Added this line
            avatar_url: null,
            username: name
          }
        }
      })
  
      if (error) throw error
  
      if (data.user) {
        // Your existing profile creation code stays the same
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name: name,
            email: email,
            phone_number: phoneNumber,
            updated_at: new Date().toISOString()
          })
  
        if (profileError) throw profileError
      }
  
      onClose()
      router.refresh()
    } catch (error) {
      console.log('Error:', error)
      alert('Error signing up: ' + error)
    }
  }
  
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

           {/* Add phone number field */}
           <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          {/* Rest of your form */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="text-blue-500 hover:text-blue-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

