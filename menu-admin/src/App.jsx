import { Routes, Route } from "react-router-dom";
import './App.css'
import Layout from "./pages/Layout";
import Categories from './pages/Categories';
function App() {


  return (
    <>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Categories/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App
