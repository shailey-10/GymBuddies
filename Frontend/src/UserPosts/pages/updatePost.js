import React, {useEffect, useState, useContext} from "react";
import { useParams, useHistory } from "react-router";
import Button from "../../shared/components/FormElements/button";
import Input from "../../shared/components/FormElements/input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import './placeForm.css'
import Card from "../../shared/components/UIElements/card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";
import ErrorModal from "../../shared/components/UIElements/errorModal";

const UpdatePost = () => {
    const auth = useContext(AuthContext)
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPost,setLoadedPost] = useState()
    const postId = useParams().postId;
    const history = useHistory();


     
    const [formState, inputHandler, setFormData] = useForm({
        title : {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false);
    useEffect(() => {
        const fetchPosts = async () => {
            try{
            const responseData = await sendRequest(`http://localhost:5000/api/posts/${postId}`);
            setLoadedPost(responseData.post);
            console.log(loadedPost);
            console.log(responseData.post)
            setFormData({
                title : {
                    value: responseData.post.title,
                    isValid: true
                },
                description: {
                    value: responseData.post.description,
                    isValid: true
                }
            },true
            )
          

        }
        catch (err){

        };
    }
        fetchPosts()
    }, [sendRequest, postId, setFormData])
    
   
    const postUpdateSubmitHandler = async event => {
        event.preventDefault();
        try{ await sendRequest(`http://localhost:5000/api/posts/${postId}`, 'PATCH',
        JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value
        }),{
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
        })
        history.push('/' + auth.userId + '/posts');
    }  catch (err){
             
        }
        
    }
    if(isLoading){
       
        return <div className="center">
                 <LoadingSpinner></LoadingSpinner>
             </div>
     }

    if(!loadedPost && !error){
        return(
            <div className="center">
                <Card><h2>Could not find place</h2></Card>
            </div>
        )
    }

    

return (
    <React.Fragment>
        <ErrorModal error= {error} onClear = {clearError} />
       {!isLoading && loadedPost && <form className = "place-form" onSubmit = {postUpdateSubmitHandler}>
       <Input id = "title"
       element = "input"
       type = "text"
       label = "Title"
       validators = {[VALIDATOR_REQUIRE()]}
       errorText = "Please enter a valid title."
       onInput = {inputHandler}
       initialValue={loadedPost.title}
       initialValid={true} 
       />  
       <Input id = "description"
       element = "textarea"
       label = "Description"
       validators = {[VALIDATOR_MINLENGTH(5)]}
       errorText = "Please enter a valid description (at least 5 characters)."
       onInput = {inputHandler}
       initialValue={loadedPost.description}
       initialValid={true} 
       />  
       <Button type = "submit" disabled = {!formState.isValid}Update Post>Edit Post</Button>
    </form>}
    </React.Fragment>
    )
};

export default UpdatePost;