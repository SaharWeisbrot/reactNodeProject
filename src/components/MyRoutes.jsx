import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import About from "./About";
import Header from "./Header";
import Footer from "./Footer";
import Contact from "./Contact";
import ArticlePage from "./ArticlePage";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import Login from "./Login";

function MyRoutes() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/page/:id" element={<ArticlePage />} />
        <Route path="/addCategory" element={<AddCategory />} />{" "}
        <Route path="/editCategory/:id" element={<EditCategory />} />
        {/* Add the new route */}
        {/* <Route path='/post/:id' element={<SinglePost />} />
						<Route path='/' element={<MainPage />} />
						<Route path='/newpost' element={<NewPost />} />
						<Route path='/editpost/:id' element={<EditPost />} />
						<Route path='/about' element={<About />} />
						<Route path='/contact' element={<Contacts />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default MyRoutes;
