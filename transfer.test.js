jest.useFakeTimers()
const supertest = require('supertest')
const app = require('./index')

const testDetails = {senderPhone: '08174261011',
                  receiverPhone: '08131826967',
                  amount: '1000',
                  }

describe("Funds successfully transferred", () =>{

  it('responds with status 200', () => {

		 supertest(app).post('/api/v1/transfer/initiate').send(testDetails).end((err,res)=>{
       expect(res.status).toBe(200)
     })
	});
});