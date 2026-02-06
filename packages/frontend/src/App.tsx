import { useState } from 'react'
import './App.css'

function App() {
  const [serverURL, setServerURL] = useState('http://localhost:3001/api/hello');

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => console.log({serverURL})}>
          click to print serverURL into console <br/>
        </button>
        <br/>
        <br/>
        <label>
          ServerURL ändern: {''}
          <input value={serverURL}
          onChange={event => setServerURL(event.target.value)}
          />
        </label>
        </div>
    </>
  )
}

export default App
