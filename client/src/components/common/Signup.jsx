// import React from 'react'
// import {SignUp} from '@clerk/clerk-react'
// import './SignUp.css'
// function Signup() {
//   return (
//     <div className='box2'>
//       <SignUp />
//     </div>
//   )
// }

// export default Signup

// import React from 'react'
// import { SignUp } from '@clerk/clerk-react'
// import './SignUp.css'

// function Signup() {
//   return (
//     <div className="signup-container">
//       <div className="signup-wrapper">
//         <div className="signup-content">
//           <div className="signup-logo">
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
//               <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
//               <circle cx="8.5" cy="7" r="4"/>
//               <line x1="20" y1="8" x2="20" y2="14"/>
//               <line x1="23" y1="11" x2="17" y2="11"/>
//             </svg>
//           </div>
//           <h2 className="signup-title">Create Your Account</h2>
//           <p className="signup-subtitle">Join our platform and get started</p>
          
//           <SignUp 
//             appearance={{
//               elements: {
//                 card: 'signup-card',
//                 formButtonPrimary: 'signup-button',
//                 socialButtonsBlockButton: 'social-button',
//                 formFieldLabel: 'form-label',
//                 formFieldInput: 'form-input'
//               }
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Signup

import React from 'react'
import { SignUp } from '@clerk/clerk-react'
import './SignUp.css'

function Signup() {
  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <div className="signup-content">
          <div className="signup-logo">
            {/* Option 1: User Plus Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            
          </div>
          <h2 className="signup-title">Create Your Account</h2>
          <p className="signup-subtitle">Join our platform and get started</p>
          
          <SignUp 
            appearance={{
              elements: {
                card: 'signup-card',
                formButtonPrimary: 'signup-button',
                socialButtonsBlockButton: 'social-button',
                formFieldLabel: 'form-label',
                formFieldInput: 'form-input'
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Signup