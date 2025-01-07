import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

///////  import pages
import First from './pages/first';
import Second from './pages/second';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/First",
    element: <First/>,
  },
  {
    path: "/Second",
    element: <Second/>,
  }
  
]);

////// https://reactrouter.com/en/main/routers/router-provider <-- router

function Frame() {
  return (
    <RouterProvider router={router} />
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Frame />);
