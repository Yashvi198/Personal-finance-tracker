import React, { useState } from 'react';
import './styles.css';
import Input from '../Input';
import Button from '../Button';
import { createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  signInWithPopup } from 'firebase/auth';
import { auth, db, provider } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const SignupSigninComponent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  const signupWithEmail = () => {
    setLoading(true);
    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Password: ", password);
    console.log("Confirm Password: ", confirmPassword);
    //Authenticate the  user, or create a new account using email and password
    if(name!="" && email!="" && password!="" && confirmPassword!=""){
      if(password==confirmPassword){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          console.log("User: ", user);
          toast.success("User Created!");
          setLoading(false);
          setConfirmPassword("");
          setName("");
          setEmail("");
          setPassword("");
          createDoc(user);
          navigate("/dashboard");
          // Create a document with user id as the following id
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
          // ..
        });
      }
      else{
        setLoading(false);
        toast.error("Password and Confirm Password don't match!")
      }
    }
    else{
      setLoading(false);
      toast.error("All fields are mandatory!");
    }
  }

  const loginUsingEmail = () => {
    console.log("Email: ", email);
    console.log("Password", password);
    setLoading(true);
    if(email!="" && password!=""){
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //Signed in
        const user = userCredential.user;
        toast.success("User Logged In!");
        console.log("User logged in!", user);
        setLoading(false);
        navigate("/dashboard");
        //...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        toast.error(errorMessage);
      });
    }
    else{
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

 const createDoc = async(user) => {
    setLoading(true);
    // Make sure that doc with uid doesn't already exist
    // Create a doc
    if(!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if(!userData.exists()){
      try{
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        //toast.success("Doc Created!");
        setLoading(false);
      }
      catch(e){
        toast.error(e.message);
        setLoading(false);
      }
    }
    else{
      //toast.error("Doc already exists!");
      setLoading(false);
    }
  }

  const googleAuth = () => {
    setLoading(true);
    try{
      signInWithPopup(auth, provider)
      .then((result) => {
        //This gives youa Googlle Access Token. You can use it to access the GOOgle API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        //The signed-in user info
        const user = result.user;
        console.log("User: ", user);
        createDoc(user);
        setLoading(false);
        navigate("/dashboard");
        //toast.success("User Authenticated!")
        //IdP data available using getAditionalUserInfo(result)
        //...
      })
      .catch((error) => {
        setLoading(false);
        //handle errors here
        const errorCode = error.code;
        const errorMessage = error. message;
        toast.error(errorMessage);
      });
    }
    catch(e){
      setLoading(false);
      toast.error(e.message);
    }
  }

  return (
    <>
    {loginForm ? (
      <div className='signup-wrapper'>
        <h2 className='title'>
          Login on <span style={{color: "var(--theme)"}}>Financely.</span>
        </h2>
        <form>
          <Input 
            type="email"
            label={"Email"} 
            state={email} 
            setState={setEmail} 
            placeholder={"JohnDoe@gmail.com"}
          />
          <Input 
            type="password"             //firebase automatically ensures that password is of 6 characters atleast
            label={"Password"} 
            state={password} 
            setState={setPassword} 
            placeholder={"Example@123"}
          />
          <Button 
            disabled={loading}
            text={loading ? "Loading..." : "Login Using Email and Password"} 
            onClick={loginUsingEmail}
          />
          <p className='p-login'>or</p>
          <Button 
            onClick={googleAuth}
            text={loading ? "Loading..." : "Login Using Google"} 
            blue={true}
          />
          <p 
            className='p-login' 
            style={{cursor: "pointer"}}
            onClick={() => setLoginForm(!loginForm)}>
            Or Don't Have an Account? Click Here
          </p>
        </form>
      </div> 
      ) : (
      <div className='signup-wrapper'>
        <h2 className='title'>
          Sign Up on <span style={{color: "var(--theme)"}}>Financely.</span>
        </h2>
        <form>
          <Input 
            label={"Full name"} 
            state={name} 
            setState={setName} 
            placeholder={"John Doe"}
          />
          <Input 
            type="email"
            label={"Email"} 
            state={email} 
            setState={setEmail} 
            placeholder={"JohnDoe@gmail.com"}
          />
          <Input 
            type="password"             //firebase automatically ensures that password is of 6 characters atleast
            label={"Password"} 
            state={password} 
            setState={setPassword} 
            placeholder={"Example@123"}
          />
          <Input 
            type="password"
            label={"Confirm Password"} 
            state={confirmPassword} 
            setState={setConfirmPassword} 
            placeholder={"Example@123"}
          />
          <Button 
            disabled={loading}
            text={loading ? "Loading..." : "Signup Using Email and Password"} 
            onClick={signupWithEmail}
          />
          <p className='p-login'>or</p>
          <Button 
            onClick={googleAuth}
            text={loading ? "Loading..." : "Signup Using Google"} 
            blue={true}
          />
          <p 
            className='p-login'
            style={{cursor: "pointer"}}
            onClick={() => setLoginForm(!loginForm)}>
            Or Have an Account Already? Click Here</p>
        </form>
      </div> )
    }
    </>
  )
}

export default SignupSigninComponent;