//Components
import AuthContainer from '../auth/AuthContainer'

//Auth0
import { useAuth0 } from '@auth0/auth0-react'

function AuthPage() {

  //Auth0
  const {isAuthenticated} = useAuth0()

  return (
    <div className='flex justify-center items-center flex-col h-screen w-full'>
        <AuthContainer/>
    </div>
  )
}

export default AuthPage