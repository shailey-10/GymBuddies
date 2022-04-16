import React, { useState , useContext} from 'react';
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Button from '../../shared/components/FormElements/button';



const Admin = () => {

    return (
        <React.Fragment>
            <h1 className = "center"> Welcome to the admin dashboard </h1>
            <NavLink to = {'/admin-add'}><Button>Add User</Button></NavLink> 
            <NavLink to = {'/admin-scan'}><Button>Checkin User</Button> </NavLink>
            <NavLink to = {'/admin-checkout'}><Button>Checkout User</Button> </NavLink>
      </React.Fragment>
    );
    
  };




export default Admin;
