import {Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import Editor from './components/Editor'

function App() {
 return (

    <div className="h-screen">
      <Routes>

        <Route path='/' element={<Home/>}></Route>
        <Route path="/editor/:roomId" element={<Editor/>}></Route>
      </Routes>


    </div>

  )
}

export default App
