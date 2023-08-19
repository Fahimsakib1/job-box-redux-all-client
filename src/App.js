import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import auth from "./firebase/firebase.config";
import { useDispatch } from "react-redux";
import { setUser } from "./features/Auth/AuthSlice";





function App() {
  
  const dispatch = useDispatch()
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user){
        console.log("User Email:", user.email);
        dispatch(setUser(user.email))
      }
    })
  }, [])
  
  
  return (
    <>
      
      <RouterProvider router={routes} />
      <Toaster></Toaster>
    </>
  );
}

export default App;
