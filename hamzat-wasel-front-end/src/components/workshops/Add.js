import React,{ Component} from 'react';
import axios from 'axios';
import config from '../token/token';
import Cookies from 'universal-cookie';
import AlertSuccess from '../alert/AlertSuccess';
import './form.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';


class Add extends Component {
    constructor(props){
        super(props)

        const cookies = new Cookies();
        const current_user = cookies.get('UserData');
        // console.log(current_user.id);
        
        this.state = {
            title: '',
            description: '',
            start_date: '',
            end_date: '',
            capcity: '',
            workshop_price: '',
            user_id: current_user.id,
            category_id: '',
            categories:[],
            alert_message: '',
            titleError: '',
            descriptionError: '',
        }
    }

    componentDidMount (){ 
        axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
            // console.log(response);
            axios.get('http://localhost:8000/api/categories',config).then(res => {
                // console.log(res.data.data);
                this.setState({ 
                    categories: res.data.data,
                    category_id:res.data.data[0].category_id
                })
                    
            }).catch(error => {
                // console.log(error)
            }); 
        });
    };

    handleChange = ({target}) =>{
        this.setState({ ...this.state, [target.name]: target.value });
        // console.log(target.name);
        // console.log(target.value);
        // console.log(this.state);   
    };

    validate = () => {
        let titleError = '';
        let descriptionError = '';
       
        if (!this.state.title){
            titleError = "Name is required, you have to fill it!";
        }

        if (this.state.title && this.state.title.length < 3){
            titleError = "Name must be at least 3 characters";
        }

        if (!this.state.description){
            descriptionError = "Description is required, you have to fill it!";
        }

        if (this.state.description && this.state.description.length < 10){
            descriptionError = "Description must be at least 10 characters";
        }

        if( titleError || descriptionError){
            this.setState({ 
                titleError, descriptionError
            })
            return false;
        }
        return true;
    }

    onWorkshopAdded = e => {
        e.preventDefault();
        const isValid = this.validate();
        if (isValid) { 
        axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
            // console.log(response);
            axios.post('http://localhost:8000/api/workshops',this.state,config).then(res => {
                // console.log(res.data);
                
                this.setState({alert_message: "success"});
                setTimeout(() => this.setState({alert_message:''}), 2000);
                
            }).catch(error => { 
                this.setState({alert_message: "error"});
                setTimeout(() => this.setState({alert_message:''}), 2000);
                // console.log(error)
            }); 
        });
        this.setState({
            titleError: '',
            descriptionError: '',
        });
    };
}


render() {
    // console.log(this.state);  
    return (     
    <div className="container mt-3">
        {this.state.alert_message === "success" ? 
                <AlertSuccess message="Workshop added successfully" /> : ""}
        <div className="row">
            <div className="col-12">
                <form className="form-info p-3 m-2" onSubmit={this.onSubmit}>
                    <div className="form-row m-1">
                        <label htmlFor="title" className="font-weight-bold mr-2">
                            Name: </label>
                        <input type="text" name="title" className="mr-2 input-description" 
                            value={this.state.title} onChange={this.handleChange}/>
                        <span className="errors">
                            {this.state.titleError}    
                            {this.state.titleError ? (<FontAwesomeIcon className="ml-2" icon={faTimesCircle} />) : ""}
                        </span>
                    </div> 
                    <div className="form-row m-1">
                        <label htmlFor="workshops" className="font-weight-bold mr-2">
                            Description: </label>
                        <input type="text" name="description" className="mr-2 input-description" 
                            value={this.state.description} onChange={this.handleChange}/>
                        <span className="errors">
                            {this.state.descriptionError}    
                            {this.state.descriptionError ? (<FontAwesomeIcon className="ml-2" icon={faTimesCircle} />) : ""}
                        </span>
                    </div> 
                    <div className="form-row m-1">
                        <label htmlFor="start_date" className="font-weight-bold mr-2">
                            Start Date: </label>
                        <input type="datetime-local" name="start_date" className="mr-2 input-date" 
                            value={this.state.start_date} onChange={this.handleChange}/>
                    </div> 
                    <div className="form-row m-1">
                        <label htmlFor="end_date" className="font-weight-bold mr-2">
                            End Date: </label>
                        <input type="datetime-local" name="end_date" value={this.state.end_date}
                            className="mr-2 input-date" onChange={this.handleChange}/>
                    </div> 
                    <div className="form-row m-1">
                        <label htmlFor="capcity" className="font-weight-bold mr-2">
                            Number of attendees: </label>
                        <input type="number" name="capcity" className="mr-2 input-date"
                            value={this.state.capcity} onChange={this.handleChange}/>
                    </div>
                    <div className="form-row m-1">
                        <label htmlFor="workshop_price" className="font-weight-bold mr-2">
                            Price: </label>
                        <input type="number" name="workshop_price" className="mr-2 input-date" 
                            value={this.state.workshop_price} onChange={this.handleChange}/>
                    </div>
                    <div className="form-row m-1">
                        <label htmlFor="workshop_price" className="font-weight-bold mr-2">
                                Category: </label>
                        <select name="category_id" className="form-control" style={{width:"200px"}} 
                            onChange={this.handleChange}>
                            {this.state.categories.map(category => {
                            return (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.category_name}
                                </option>
                            )
                        })
                        }
                        </select>
                    </div> 
                    <div className="form-row-last">
                        <input type="submit" onClick={this.onWorkshopAdded} 
                            className="btn btn-success font-weight-bold" value="Add" />
                    </div>
                </form>
                </div>
            </div>
        </div>
        );
    }
}


export default Add;