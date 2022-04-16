import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import QRCode from 'qrcode';
import QrReader from 'react-qr-reader';
import Button from "../../shared/components/FormElements/button";
import { NavLink } from "react-router-dom";
import './scanner.css'
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/errorModal";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";


const AdminScannerCheckout = () => {

    const [scanResultCam, setScanResultCam] = useState('');
    const {isLoading, error, sendRequest, clearError } = useHttpClient();
    let history = useHistory();  // declare here, inside a React component. 
    const handleErrorCam = (error) => {
        console.log(error)
    }

    const handleScanCam = (result) => {
        if(result){
        setScanResultCam(result);
        }
    }
    
    const adminCheckout = async event => {
        event.preventDefault();
        
        try{
            const responseData = await sendRequest('http://localhost:5000/api/admin/checkout',
            'DELETE',
            JSON.stringify({
    
                id: scanResultCam
            }),
            {
                'Content-Type': 'application/json'
            }
            );
            console.log(responseData);
            history.push('/admin')  // redirect

    
        }catch(err){
        console.log(err)
       
    
        };
    
      
    
      };


    return(
<React.Fragment>
<ErrorModal error = {error} onClear = {clearError} />
{isLoading && <LoadingSpinner asOverlay />}
<NavLink to = '/admin-add'><Button className = "fullwidth" >Add User</Button></NavLink>
<NavLink to = '/admin-scan'><Button className = "fullwidth" >CheckIn</Button></NavLink>
<div className = "scanner center">
<div  className ="scannerElement">
<QrReader delay={300}
style = {{width: '100%'}}
onError = {handleErrorCam}
onScan = {handleScanCam}
// ref = {(stream) => {videoStream = stream} 
/>
</div>
</div>
<h3>Scanner Reading: {scanResultCam}</h3>
<Button onClick = {adminCheckout}>CheckOut User</Button>
</React.Fragment>)
}

export default AdminScannerCheckout;