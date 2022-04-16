import React from "react";

import Card from "../../shared/components/UIElements/card";
import Button from "../../shared/components/FormElements/button";
import ErrorModal from "../../shared/components/UIElements/errorModal";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";


const UserFeedItem = props => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
   
    return ( <React.Fragment>
        <ErrorModal error = {error} onClear = {clearError} />
        <li className = "place-item__image" id = "post">
        <Card className = "place-item__content">
            {isLoading && <LoadingSpinner asOverlay />}
        <div className = "place-item__image">
        <img src={`http://localhost:5000/${props.image}`} alt={props.description} />
        </div>
        <div className="place-item__info">
            <h4>{props.title}</h4>
            <p>{props.description}</p>
        </div>
        </Card>
    </li>
    </React.Fragment>)

};

export default UserFeedItem;