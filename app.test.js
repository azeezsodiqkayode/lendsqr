
const supertest = require('supertest')
const app = require('./index')

const testUser = {email: 'azeezsodiqkayode@gmail.com',
                  firstname: 'sodiq',
                  surname: 'Azeez',
                  phone: '08131826967',
                  password: '1234567890',
                  }

describe("user successfully created", () =>{

  it('responds with status 200', async() => {

		 const result = await supertest(app).post('/api/v1/user/create').send(testUser)
       expect(result.status).toBe(200)
     })
	});


const testLogin = {email: 'azeezsodiqkayode@gmail.com',
                    password: '1234567890'
                  }

describe("successfully log in", () =>{

  it('responds with status 200', async() => {

     const result = await supertest(app).post('/api/v1/login').send(testLogin)
        expect(result.status).toEqual(200)
      })
  });

const testDetails = {senderPhone: '08131826967',
                      receiverPhone: '08174261011',
                      amount: '0'
                      }

describe("Funds successfully transferred", () =>{

it('responds with status 200', async() => {

const result = await supertest(app).post('/api/v1/transfer/initiate').send(testDetails)
expect(result.status).toBe(200)
})
});

