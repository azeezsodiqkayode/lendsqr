
jest.useFakeTimers()
const supertest = require('supertest')
const app = require('./index')

const testUser = {email: 'info@smmsolutions247.com',
                  firstname: 'sodiq',
                  surname: 'Azeez',
                  phone: '09075455343',
                  password: '1234567890'}

describe("user successfully created", () =>{

  it('responds with status 200', () => {

		 supertest(app).post('/api/v1/user/create').send(testUser).end((err,res)=>{
       expect(res.status).toEqual(200)
     })
	});
});

const testLogin = {email: 'info@smmsolutions247.com',
                    password: '1234567890'
                  }

describe("successfully log in", () =>{

  it('responds with status 200', () => {

      supertest(app).post('/api/v1/login').send(testLogin).end((err,res)=>{
        expect(res.status).toEqual(200)
      })
  });
});
