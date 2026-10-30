import { useState } from 'react'
import Chat from './Components/chat'
import Login from './Components/login'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
 
  return user ? <Chat user_id={user}/> : <Login onLogin={setUser} />
}

export default App
