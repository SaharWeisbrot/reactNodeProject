// Sahar Weisbroot

import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter for routing functionality
import MyRoutes from "./components/MyRoutes"; // Import the MyRoutes component which defines the application's routes
import "./App.css"; // Import the CSS file for styling the App component

function App() {
  return (
    <div className="App">
      {/* Wrap the application with BrowserRouter to enable routing */}
      <BrowserRouter>
        {/* Render the MyRoutes component, which contains all the routes for the application */}
        <MyRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App; // Export the App component as the default export
