import React, {useContext}  from 'react';

import Input from '../../shared/components/FormElements/input';
import Button from '../../shared/components/FormElements/button';
import { useHistory } from "react-router-dom";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import './placeForm.css';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context'; 
import ErrorModal from '../../shared/components/UIElements/errorModal';
import LoadingSpinner from '../../shared/components/UIElements/loadingSpinner';
import ImageUpload from '../../shared/components/FormElements/imageUpload';


const NewPost = () => {
  const auth = useContext(AuthContext);
  let history = useHistory();  // declare here, inside a React component. 
  const {isLoading, error, sendRequest, clearError} = useHttpClient()
  const [formState, inputHandler] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    image: {
      value: null,
      isValid: false
    }
  }, false)

  const userId = auth.userId;

  const postSubmitHandler = async event => {
      event.preventDefault();
      console.log('clicked')
      console.log(auth.userId);

      try{
        const formData = new FormData();
        formData.append('title', formState.inputs.title.value);
        formData.append('description', formState.inputs.description.value);
        formData.append('image', formState.inputs.image.value);
        await sendRequest('http://localhost:5000/api/posts', 'POST', 
        formData, {Authorization: 'Bearer ' + auth.token}
        

        );
        history.push(`/${userId}/posts`)  // redirect
        
    }catch(err){
    console.log(err);
    }
  }

  return (
    <React.Fragment>
      <ErrorModal error = {error} onClear = {clearError}/>
    <form className="place-form" onSubmit = {postSubmitHandler}>
      {isLoading && <LoadingSpinner as overlay />}
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <ImageUpload id = "image" onInput = {inputHandler}
      errorText = "Please provide an image" />
      <Button type="submit" disabled={!formState.isValid}>
        ADD POST
      </Button>
    </form>
    </React.Fragment>
  );
};

export default NewPost;
