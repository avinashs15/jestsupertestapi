const app = 'https://order-pizza-api.herokuapp.com' // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
let accessToken = "";
const userDetails = {
  "username": "test",
  "password": "test"
}

describe("API Test Pizza Order application", function(){
  beforeAll(async done =>{
    request.post('/api/auth')
    .send(userDetails)
    .end(function(err, res) {
      accessToken = res.body.access_token;
      if (err) throw err;
      done();
    });
  });

  
  it('Gets All the pizza orders', async done => {
    // Sends GET Request to /test endpoint
    let response = await request.get('/api/orders')
    .send("Authorization", "Bearer " + accessToken)        
    expect(response.status).toBe(200);
    done();
  });

  it('Add the pizza orders', async done => {
    let order = {
      "Crust": "Thick",
      "Flavor": "JestChicken",
      "Size": "M",
      "Table_No": 3310
    };
    let response = await request.post('/api/orders')
    .set("Authorization", "Bearer " + accessToken)
    .set('Accept', /application\/json/)
    .send(order)
    expect(response.body.Order_ID).toBeDefined();
    done();
  });

  it('Delete the pizza order', async done => {
    let createdID = null
    let order = {
      "Crust": "Thin",
      "Flavor": "DeleteJestPepperoni",
      "Size": "M",
      "Table_No": 7320
    };
    let response = await request.post('/api/orders')
    .set("Authorization", "Bearer " + accessToken)
    .set('Accept', /application\/json/)
    .send(order)
    //await new Promise((r) => setTimeout(r, 2000))
    createdID = response.body.Order_ID
    expect(response.body.Order_ID).toBeDefined()
  
    let responseDelete = await request.delete('/api/orders/' + createdID)
    .send("Authorization", "Bearer " + accessToken)    
    expect(responseDelete.body.message).toContain("Order deleted")
    done();
  }, 10000);
})