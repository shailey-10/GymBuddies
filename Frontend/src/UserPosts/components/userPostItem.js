import React, {useState, useContext} from "react";
import Card from "../../shared/components/UIElements/card";
import './userPostItem.css';
import Button from "../../shared/components/FormElements/button";
import Modal from "../../shared/components/UIElements/modal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/errorModal";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";

const UserPostItem = props => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext);
    const[showConfirmModal, setShowConfirmModal] = useState(false);
    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    }
    const cancelDeleteHandler = (event) => {
        event.preventDefault();
    setShowConfirmModal(false)};

    const confirmDeleteHandler =  async (event) => {
        event.preventDefault();
        setShowConfirmModal(false);
       try {await sendRequest(`http://localhost:5000/api/posts/${props.id}`, 'DELETE', null, {Authorization: 'Bearer ' + auth.token})
    props.onDelete(props.id);
    }
       catch{

       }
        
    }
    return ( <React.Fragment>
        <ErrorModal error = {error} onClear = {clearError} />
        <Modal show = {showConfirmModal} onCancel = {cancelDeleteHandler} header = "Are  you sure?" footerClass= "place-item__modal-action" footer = {
            <React.Fragment>
                <Button inverse onClick = {cancelDeleteHandler}>CANCEL</Button>
                <Button onClick = {confirmDeleteHandler} delete>DELETE</Button>
            </React.Fragment>
        }>
            <p>Do you want to proceed and delete this post? Please note this can't undone</p>
        </Modal>
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
        <div className="place-item__actions">
           {auth.isLoggedIn && auth.userId == props.creatorId && <Button to = {`/post/${props.id}`}>EDIT</Button>}
            {auth.isLoggedIn && auth.userId == props.creatorId &&<Button danger onClick = {showDeleteWarningHandler}> DELETE</Button>}
        </div>
        </Card>
    </li>
    </React.Fragment>)
};

export default UserPostItem;