import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style.css';
import './index.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

///////  import pages
import Login from './pages/login.jsx';
import Main from './pages/main.jsx';
import PostDetail from './pages/postDetail.jsx';
import Profile from './pages/profile.jsx';
import RegisterClub from './pages/registerClub.jsx';
import RegisterNonClub from './pages/registerNonClub.jsx';
import SelectRegister from './pages/selectRegister.jsx';

const router = createBrowserRouter([
  { path: "/", element: <App />, },
  { path: "/Login", element: <Login />, },
  { path: "/Main", element: <Main />, },
  { path: "/post", element: <PostDetail />, },
  { path: "/Profile", element: <Profile />, },
  { path: "/RegisterClub", element: <RegisterClub />, },
  { path: "/RegisterNonClub", element: <RegisterNonClub />, },
  { path: "/SelectRegister", element: <SelectRegister />, }

]);

function Frame() {
  return (
    <RouterProvider router={router} />
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Frame />);