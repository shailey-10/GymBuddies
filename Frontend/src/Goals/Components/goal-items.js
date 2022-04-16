import React from 'react';
import { Link } from 'react-router-dom';

import './goal-items.css';
import UserList from '../../users/components/UserList';
import Card from '../../shared/components/UIElements/card';
import Avatar from '../../shared/components/UIElements/avatar';

const GoalItem = props => {   

    return (
        <li className = "user-item">
           
            <Card className = "user-item__content">
                <div className ="user-item__image">        
                <Avatar image = {props.image} alt = {props.name}/>
                </div>
                <div className = "user-item__info">
                    <h2>{props.name}</h2>
                </div>
                </Card>

        </li>
    );
};

export default GoalItem;