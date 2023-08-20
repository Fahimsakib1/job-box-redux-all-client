import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import auth from "./firebase/firebase.config";
import { useDispatch, useSelector } from "react-redux";
import { setUser, toggleIsLoading } from "./features/Auth/AuthSlice";





function App() {
  
  const dispatch = useDispatch()
  const {isLoading} = useSelector((state) => state.auth)
  console.log(isLoading);
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user){
        // console.log("User Email:", user.email);
        dispatch(setUser(user.email))
      }
      else{
        dispatch(toggleIsLoading())
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
