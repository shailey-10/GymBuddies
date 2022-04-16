import React, { useState , useContext} from 'react';
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import ImageUpload from '../../shared/components/FormElements/imageUpload';
import ErrorModal from '../../shared/components/UIElements/errorModal';
import LoadingSpinner from '../../shared/components/UIElements/loadingSpinner';


import Card from '../../shared/components/UIElements/card';
import Input from '../../shared/components/FormElements/input';
import Button from '../../shared/components/FormElements/button';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
// import './Auth.css';
import { AuthContext } from '../../shared/context/auth-context';
import Modal from '../../shared/components/UIElements/modal';
import {useHttpClient} from '../../shared/hooks/http-hook';


const AdminAdd = () => {
    const auth = useContext(AuthContext);
    let history = useHistory();  // declare here, inside a React component. 
    const {isLoading, error, sendRequest, clearError } = useHttpClient();


  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      },
      name: {
        value: '',
        isValid: false
      },
      regNo: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      }
    },
    false
  );
 

  const authSubmitHandler = async event => {
    event.preventDefault();
    
    try{
      const formData = new FormData();
      formData.append('email', formState.inputs.email.value);
      formData.append('name', formState.inputs.name.value);
      formData.append('password', formState.inputs.password.value);
      formData.append('regNo', formState.inputs.regNo.value);
      formData.append('image', formState.inputs.image.value)
        const responseData = await sendRequest('http://localhost:5000/api/admin/signup',
        'POST',
       formData
        );
        console.log(responseData);
        history.push('/admin')  // redirect

    }catch(err){
    console.log(err)
   

    };

  

  };

  return (
      <React.Fragment>
          <ErrorModal error = {error} onClear = {clearError} />
    <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
      <h2>Login Required</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
       
      <Input
            element="input"
            id="name"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter your name."
            onInput={inputHandler}
          />

          <ImageUpload center id ="image" onInput = {inputHandler} errorText="Please enter a valid description (at least 5 characters)."
 />

          <Input
            element="input"
            id="regNo"
            type="text"
            label="Your Registration Number"
            validators={[VALIDATOR_MINLENGTH(9),VALIDATOR_MAXLENGTH(9)]}
            errorText="Please enter your 9 digit registration number."
            onInput={inputHandler}
          />
      
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid password, at least 5 characters."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
         ADD MEMBER
        </Button>
      </form>
 
    </Card>
    <div style = {{width:"100%"}}>
    <NavLink to = '/admin-scan'><Button className = "fullwidth" >Check In User</Button></NavLink>
    <NavLink to = '/admin-scan'><Button className = "fullwidth" >Check Out User</Button></NavLink>
    </div>
    </React.Fragment>
  );
};

export default AdminAdd;
