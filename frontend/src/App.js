import React from "react";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Login from "./pages/Login";
import Messaging from "./pages/Messaging";
import { channelsLoader } from "./pages/NavigationBar";
import io from 'socket.io-client';


const socket = io.connect('http://localhost:8000');
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Login />} />
      <Route path="/messaging/*" element={<Messaging socket={socket}/>} loader={channelsLoader} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
