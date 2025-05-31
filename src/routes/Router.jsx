import { createBrowserRouter, RouterProvider } from "react-router";
import ChatPage from "../pages/ChatPage";
import Register from "../pages/Register";
import Login from "../pages/Login";



const router = createBrowserRouter([
  {
    path:"/", element: <ChatPage/>
  },
  {
    path:"/register", element: <Register/>
  },
  {
    path:"/login", element: <Login/>
  },
]);

function Router() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default Router;
