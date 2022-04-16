import React, {useState, useEffect} from "react";
import { useParams } from "react-router";

import UserFeedList from "../components/feedList";
import QRCode from 'qrcode';
import Button from "../../shared/components/FormElements/button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/errorModal";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";



const Checkin = () => {

    const [imageUrl, setImageUrl] = useState('');
    const [loadedUser, setLoadedUser] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const userId = useParams().userId;
    useEffect(() => {
       const fetchUser = async () => {
           try{
               console.log(userId)
          const responseData = await sendRequest(`http://localhost:5000/api/users/userCheckin/${userId}`);
          setLoadedUser(responseData)
          
        } catch (err){

        }
        console.log(loadedUser)
       };
       fetchUser();

       
    }, [sendRequest, userId])
    
const generateQRCode = async() => {
    try{
          const response = await QRCode.toDataURL(loadedUser.posts.id.toString());
          setImageUrl(response)
          console.log(loadedUser.posts.id)
    }catch (error){
        console.log(error);
    }

}   
    return (
        <React.Fragment>
        <ErrorModal error = {error} onClear = {clearError} />
        {isLoading && (
        <div className = "center">
            <LoadingSpinner />
            </div>
        )}
    { !isLoading && loadedUser && <div><Button onClick = {() => generateQRCode()}>Check In</Button>
    <br /><br /><br />
    {imageUrl ? (<img src={imageUrl} alt="" />) : null}
    </div>}
    </React.Fragment>
    )
};

export default Checkin;