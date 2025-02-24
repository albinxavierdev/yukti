
// import Image from "next/image";
// // import Login from "./Login";
// const Header = () => {
//   return (
//     <div className="container h-[60px] px-4 lg:h-[80px] lg:px-0">
//       <div className="grid h-full grid-cols-12">
//         <div className="col-span-5"></div>
//         <div className="col-span-2 flex items-center justify-center">
//           <a href="/">
//             <Image
//               unoptimized
//               src="/img/logo_dark.svg"
//               alt="logo"
//               width={60}
//               height={59}
//               className="h-[50px] w-[55px] lg:h-12 lg:w-12"
//             />
//           </a>
//           {/* This is login section */}
//           <div className="absolute top-4 right-4 flex space-x-4">
           
//   <span className="text-blue-600 font-semibold cursor-pointer">Login</span>
//   <span className="text-blue-600 font-semibold cursor-pointer">SignUp</span>
// </div>


//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;


// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Login from "./Login";
// import SignUp from "./Signup";

// function Header() {
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [isSignUpOpen, setIsSignUpOpen] = useState(false);

//   return (
//     <div className="relative container h-[60px] px-4 lg:h-[80px] lg:px-0">
//       <div className="grid h-full grid-cols-12">
//         <div className="col-span-5"></div>
//         <div className="col-span-2 flex items-center justify-center">
//           <a href="/">
//             <Image
//               unoptimized
//               src="/img/logo_dark.svg"
//               alt="logo"
//               width={60}
//               height={59}
//               className="h-[50px] w-[55px] lg:h-12 lg:w-12" />
//           </a>
//         </div>

//         {/* Login & SignUp Buttons */}
//         <div className="absolute top-4 right-4 flex space-x-4">
//           <button
//             onClick={() => setIsLoginOpen(true)}
//             className="text-blue-600 font-semibold cursor-pointer hover:underline"
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setIsSignUpOpen(true)}
//             className="text-blue-600 font-semibold cursor-pointer hover:underline"
//           >
//             SignUp
//           </button>
//         </div>
//       </div>

//       {/* Conditionally render Login & SignUp modals */}
//       {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
//       {isSignUpOpen && <SignUp onClose={() => setIsSignUpOpen(false)} />}
//     </div>
//   );
// }

// export default Header;


//// =====================///
// "use client"
// import { useState, useEffect } from "react"
// import Image from "next/image"
// import Login from "./Login"
// import SignUp from "./Signup"
// import { supabase } from '../utils/supabase'
// import { User } from '@supabase/supabase-js'

// function Header() {
//   const [isLoginOpen, setIsLoginOpen] = useState(false)
//   const [isSignUpOpen, setIsSignUpOpen] = useState(false)
//   const [user, setUser] = useState<User | null>(null)

//   useEffect(() => {
//     // Check for initial session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user ?? null)
//     })

//     // Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null)
//     })

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [])

//   const handleSignOut = async () => {
//     const { error } = await supabase.auth.signOut()
//     if (!error) {
//       setUser(null)
//     }
//   }

//   return (
//     <div className="relative container h-[60px] px-4 lg:h-[80px] lg:px-0">
//       <div className="grid h-full grid-cols-12">
//         <div className="col-span-5"></div>
//         <div className="col-span-2 flex items-center justify-center">
//           <a href="/">
//             <Image
//               unoptimized
//               src="/img/logo_dark.svg"
//               alt="logo"
//               width={60}
//               height={59}
//               className="h-[50px] w-[55px] lg:h-12 lg:w-12"
//             />
//           </a>
//         </div>

//         <div className="absolute top-4 right-4 flex space-x-4">
//           {user ? (
//             <>
//               <span className="text-blue-600 font-semibold">
//                 Welcome, {user.user_metadata.name || user.email}
//               </span>
//               <button
//                 onClick={handleSignOut}
//                 className="text-blue-600 font-semibold cursor-pointer hover:underline"
//               >
//                 Sign Out
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={() => setIsLoginOpen(true)}
//                 className="text-blue-600 font-semibold cursor-pointer hover:underline"
//               >
//                 Login
//               </button>
//               <button
//                 onClick={() => setIsSignUpOpen(true)}
//                 className="text-blue-600 font-semibold cursor-pointer hover:underline"
//               >
//                 SignUp
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
//       {isSignUpOpen && <SignUp onClose={() => setIsSignUpOpen(false)} />}
//     </div>
//   )
// }

// export default Header



////// Auths ---///
"use client"

import {useEffect, useState } from "react"
import Image from "next/image"
import Login from "./Login"
import SignUp from "./Signup"
import { useAuth } from "../app/backend/useAuth"
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabase'
function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const { user } = useAuth()
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single()
        
        console.log('User:', user)
        console.log('Profile:', profile)
        setUserName(profile?.name || user.email)
      }
    }
    
    getUser()
  }, [])

  const router = useRouter() // Add this line inside the component
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push('/')
      router.refresh() // Add refresh for good measure
    }
  }

  return (
    <div className="relative container h-[60px] px-4 lg:h-[80px] lg:px-0">
      <div className="grid h-full grid-cols-12">
        <div className="col-span-5"></div>
        <div className="col-span-2 flex items-center justify-center">
          <a href="/">
            <Image
              unoptimized
              src="/img/logo_dark.svg"
              alt="logo"
              width={60}
              height={59}
              className="h-[50px] w-[55px] lg:h-12 lg:w-12"
            />
          </a>
        </div>

        <div className="absolute top-4 right-4 flex space-x-4">
          {user ? (
            <>
              <span className="text-blue-600 font-semibold">
                Welcome, {user.user_metadata.name || user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
              >
                Login
              </button>
              <button
                onClick={() => setIsSignUpOpen(true)}
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
              >
                SignUp
              </button>
            </>
          )}
        </div>
      </div>

      {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
      {isSignUpOpen && <SignUp onClose={() => setIsSignUpOpen(false)} />}
    </div>
  )
   

}
export default Header
