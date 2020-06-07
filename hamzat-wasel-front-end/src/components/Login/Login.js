import React from 'react';
import axios from 'axios';
import '../../Form.css'
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie';

function Login(){
    const cookies = new Cookies();
    let role='';
    const [state, setState] = React.useState(
        {
            email: '',
            password: '',
            device_name:'web',
            redirect:false,
        });

    const handleChange = ({target}) =>{
        setState({ ...state, [target.name]: target.value });
    };
    //redirect function
    const ProtectedComponent = (data) => {
        if (state.redirect)
        {
            if (data===0)
          {          
            return <Redirect to='/register'  />
          }
          return <div> My Protected Component </div>
        }
  
      }

    const onSubmit = e => {
        e.preventDefault();  
        axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
            axios.post('http://localhost:8000/api/login',state).then(res => {
                //save cookie
                cookies.set('UserData', res.data,{ path: '/' ,expires: new Date(Date.now()+2592000)});
                role=cookies.get('UserData');
                setState({ ...state, redirect:true})
                //console.log(res);

                
                
            }).catch(error => {
                console.log(error.response)
            }); 
        });
    };
     
return (
<React.Fragment>
    {role!==null? ProtectedComponent(0):null}
    <div className="container mb-3">
        <div className="page-content">
		    <div className="form-v7-content">
			        <div className="form-left">
                        <img src="images/login.gif" className="m-lg-5 p-1" alt="login" />
			        </div>
                <form className="form-detail" onSubmit={onSubmit} id="myform">
                    <h3 className="font-weight-bold mb-5 p-2 text-white text-center"
                        style={{backgroundColor: "#24c0d1"}}>Login</h3>
                    <div className="form-row">
                        <label htmlFor="email" > E-mail </label> 
                        <input type="email" name="email" id="your_email" className="input-text"
                               value={state.email} onChange={handleChange}/> 
                    </div>
                    <div className="form-row">
                        <label htmlFor="password" className="font-weight-bold"> Password </label> 
                        <input type="password" name="password" id="password" className="input-text" 
                        value={state.password} onChange={handleChange}/> 
                    </div>
                    <div className="form-row-last">
                        <input type="submit" value="Login" className="login btn font-weight-bold"/>
                    </div>
                </form>
            </div>
	    </div>
    </div>
</React.Fragment>
         );
}


 
export default Login;