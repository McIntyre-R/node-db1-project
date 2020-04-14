import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Card, Button, CardTitle, CardText } from 'reactstrap';

function App() {
  const [customers, setCustomers] = useState([])


  useEffect(() => {
    getCustomers()
  },[])


  const getCustomers = () => {
    axios.get('http://localhost:5000/api/customers')
    .then( res => {
     
      setCustomers(res.data.data)
    })
    .catch(err => {
      console.log(err)
    })
  }


  const deleteIt = (id) => {
    axios.delete(`http://localhost:5000/api/customers/${id}`)
    .then( res => getCustomers())
    .catch( err => console.log(err))
  }

  return (
    <div className='width'>
      {customers.map(customer => {
      return(
      <Card body>
        <CardTitle>{customer.company_name}</CardTitle>
        <CardText>{customer.contact_name}, {customer.contact_title}</CardText>
        <Button onClick={() => deleteIt(customer.customer_id)}>Delete</Button>
      </Card>

      )})}
    </div>
  );
}

export default App;