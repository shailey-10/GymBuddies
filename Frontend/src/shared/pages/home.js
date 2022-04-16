import React from 'react';
import Button from '../components/FormElements/button'
import './home.css'
const Home = () => {
    return (
       <div className = "hero">
           <div className = "hero-contents">
               <h1>GymBuddies</h1>
               <h4>Making your Gym Experience Flawless</h4>
               <Button inverse>LOGIN</Button>
           </div>
       </div> 
    );
};

export default Home;