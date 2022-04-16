import React, { useState , useContext} from 'react';
import { useHistory } from "react-router-dom";

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
import './Auth.css';
import { AuthContext } from '../../shared/context/auth-context';
import {useHttpClient} from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/errorModal'
import LoadingSpinner from '../../shared/components/UIElements/loadingSpinner';


const Auth = () => {
    const auth = useContext(AuthContext);
    let history = useHistory();  // declare here, inside a React component. 

    const {isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      regNo: {
        value: '',
        isValid: false
      },
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const authSubmitHandler = async event => {
    event.preventDefault();
    
    try{
        const responseData = await sendRequest('http://localhost:5000/api/users/login',
        'POST',JSON.stringify({

          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
          regNo: formState.inputs.regNo.value
        }),
        {
            'Content-Type': 'application/json'
        }
        );
        
        console.log(responseData);
        auth.login(responseData.userId, responseData.token);

    }catch(err){
    console.log(err)

    };

  

  };


  return (
    <React.Fragment>
        <ErrorModal error = {error} onClear = {clearError} />
    <Card className="authentication">
      <h2>Login Required</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
       
       
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
         LOGIN
        </Button>
      </form>
 
    </Card>
    </React.Fragment>
  );
};

export default Auth;
