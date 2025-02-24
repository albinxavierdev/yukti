import { login, signup } from './actions'

export default function LoginPage() {
  return (

    <form className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
  <label 
    htmlFor="email" 
    className="block text-sm font-medium text-gray-700 mb-2"
  >
    Email:
  </label>
  <input 
    id="email" 
    name="email" 
    type="email" 
    required
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-black" 
  />

  <label 
    htmlFor="password" 
    className="block text-sm font-medium text-gray-700 mb-2"
  >
    Password:
  </label>
  <input 
    id="password" 
    name="password" 
    type="password" 
    required
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 text-black"
  />

  <div className="flex gap-4">
    <button 
      formAction={login}
      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
    >
      Log in
    </button>

    <button 
      formAction={signup}
      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
    >
      Sign up
    </button>
  </div>
</form>

    // <form>
    //   <label htmlFor="email">Email:</label>
    //   <input id="email" name="email" type="email" required />
    //   <label htmlFor="password">Password:</label>
    //   <input id="password" name="password" type="password" required />
    //   <button formAction={login}>Log in</button>
    //   <button formAction={signup}>Sign up</button>
    // </form>



  )
}

