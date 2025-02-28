import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MainPage from "./MainPage";
import About from "./About";
import Header from "./Header";
import Footer from "./Footer";
import Contact from "./Contact";
import ArticlePage from "./ArticlePage";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import Login from "./Login";
import Signup from "./Signup";
import StartersPage from "./StartersPage"; // Import the StartersPage component
import AddStarter from "./AddStarter"; // Import the AddStarter component
import EditStarter from "./EditStarter"; // Import the EditStarter component
import MainDishesPage from "./MainDishesPage"; // Import the MainDishesPage component

function MyRoutes() {
  const location = useLocation(); // Hook to get the current location (URL path)
  const isAuthPage =
    location.pathname === "/" || location.pathname === "/signup"; // Check if the current page is an authentication page (Login or Signup)

  return (
    <>
      {/* Conditionally render the Header component if not on an authentication page */}
      {!isAuthPage && <Header />}

      {/* Main content area with conditional styling for authentication pages */}
      <main className={isAuthPage ? "auth-main" : "main"}>
        {/* Define routes for the application */}
        <Routes>
          <Route path="/" element={<Login />} />{" "}
          {/* Route for the Login page */}
          <Route path="/starters" element={<StartersPage />} />{" "}
          {/* Route for the Starters page */}
          <Route path="/addStarter" element={<AddStarter />} />{" "}
          {/* Route for adding a new starter */}
          <Route path="/mainPage" element={<MainPage />} />{" "}
          {/* Route for the Main page */}
          <Route path="/about" element={<About />} />{" "}
          {/* Route for the About page */}
          <Route path="/contact" element={<Contact />} />{" "}
          {/* Route for the Contact page */}
          <Route path="/page/:id" element={<ArticlePage />} />{" "}
          {/* Route for individual article pages */}
          <Route path="/addCategory" element={<AddCategory />} />{" "}
          {/* Route for adding a new category */}
          <Route path="/editCategory/:id" element={<EditCategory />} />{" "}
          {/* Route for editing a category */}
          <Route path="/editStarter/:id" element={<EditStarter />} />{" "}
          {/* Route for editing a starter */}
          <Route path="/signup" element={<Signup />} />{" "}
          {/* Route for the Signup page */}
          <Route path="/mainDishes" element={<MainDishesPage />} />{" "}
          {/* Route for the Main Dishes page */}
        </Routes>
      </main>

      {/* Conditionally render the Footer component if not on an authentication page */}
      {!isAuthPage && <Footer />}
    </>
  );
}

export default MyRoutes;
