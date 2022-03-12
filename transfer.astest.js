
const supertest = require('supertest')
const app = require('./index')

const testDetails = {senderPhone: '09075455343',
                  receiverPhone: '08131826967',
                  amount: '0',
                  }

describe("Funds successfully transferred", () =>{

  it('responds with status 200', async() => {

		const result = await supertest(app).post('/api/v1/transfer/initiate').send(testDetails)
       expect(result.status).toBe(200)
     })
});
