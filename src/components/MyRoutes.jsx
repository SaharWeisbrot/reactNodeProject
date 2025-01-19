import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import About from "./About";
import Header from "./Header";
import Footer from "./Footer";
import List from "./List";
import Contact from "./Contact";

import ArticlePage from "./ArticlePage";

function MyRoutes() {
  return (
    <>
      <Header />

      <List />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/page/:id" element={<ArticlePage />} />
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
