
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/home.js'
import Login from './pages/login.js'
import Explore from './pages/explore.js'
import NoPage from './pages/NoPage.js'
import Signup from "./pages/signup.js";
import Favourites from "./pages/favourites.js";



function App() {
  
  return (

    <div className="bg-transparent ">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="*" element={<NoPage />} />
      {/* Navbar */}
      {/*Trending */}
      {/*Jazz */ }
      {/*Artists */}
      {/*Hits 8 */ }
      {/* Recomended */}
      {/* <div className='h-screen'></div> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
