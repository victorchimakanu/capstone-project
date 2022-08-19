const {expect} = require('chai'); // pulling expect function out of chai library 
const {ethers} = require('hardhat'); // pulling ethers out of hardhat

const tokens = (n) => {
   return ethers.utils.parseUnits(n.toString() , 'ether')
}

describe ('Exchange', ()=> {
    let deployer, feeAccount, exchange
    const feePercent = 10

    beforeEach(async () => {

    const Exchange = await ethers.getContractFactory('Exchange')
    const Token = await ethers.getContractFactory('Token')

    token1 = await Token.deploy('Dapp University', 'DAPP', '1000000')
       
   accounts = await ethers.getSigners()
   deployer = accounts[0]
   feeAccount = accounts[1]
   user1 = accounts[2]

    let transaction = await token1.connect(deployer).transfer(user1.address, tokens (100))
    await transaction.wait()
    exchange = await Exchange.deploy(feeAccount.address, feePercent)
   
    })

describe ('Deployment', () => {
   
        it ('tracks the fee account', async () => {
   
            expect (await exchange.feeAccount()).to.equal(feeAccount.address)
            
        }) 

        it ('tracks the fee percent', async () => {
   
            expect (await exchange.feePercent()).to.equal(feePercent)
            
        }) 
    })

    describe ('Depositing Tokens', () => {
        let transaction, result 
        let amount = tokens(10)
    
     
        describe ('Success', () => {

            beforeEach(async () => {

                //approve token 
               
                trasnaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await trasnaction.wait ()
                //deposit token
                    trasnaction = await exchange.connect(user1).depositToken(token1.address, amount)
                    result = await trasnaction.wait()
                     })

            it('tracks the token deposit' , async () => {
                expect(await token1.balanceOf(exchange.address)).to.equal(amount)
                expect(await exchange.tokens(token1.address, user1.address)).to.equal(amount)
                expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(amount)
            })

            it ('Emits a Deposit Event', async () => {
                const event = result.events[1]
                expect(event.event).to.equal('Deposit') //checking for event here 
        
                const args = event.args 
                expect(args.token).to.equal(token1.address) //checking the arguments 
                expect(args.user).to.equal(user1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(amount)
        
        
            })
    


        })

        describe ('Failure ' , () => {

        it('fails when no tokens are approved' , async () => {
            //dont approve any tojens before depositing 
            await expect(exchange.connect(user1).depositToken(token1.address, amount)).to.be.reverted

        })



        })
        describe ('Success', () => {


        })

    })

    describe ('Withdrawing Tokens', () => {
        let transaction, result 
        let amount = tokens(10)
    
     
        describe ('Success', () => {

            beforeEach(async () => {

                //deposit token before withdrawing

                //approve token 
               
                trasnaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await trasnaction.wait ()
                //deposit token
                    trasnaction = await exchange.connect(user1).depositToken(token1.address, amount)
                    result = await trasnaction.wait()

                // withdraw tokens
                trasnaction = await exchange.connect(user1).withdrawToken(token1.address, amount)
                result = await trasnaction.wait()

                     })

            it('withdraws token funds' , async () => {
                expect(await token1.balanceOf(exchange.address)).to.equal(0)
                expect(await exchange.tokens(token1.address, user1.address)).to.equal(0)
                expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(0)
            })

            it ('Emits a withdrawal event', async () => {
                const event = result.events[1]
                expect(event.event).to.equal('Withdraw') //checking for event here 
        
                const args = event.args 
                expect(args.token).to.equal(token1.address) //checking the arguments 
                expect(args.user).to.equal(user1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(0)
        
        
            })
    


        })

        describe ('Failure ' , () => {

        it('fails for insufficient balance' , async () => {
            //attempt to withdraw tokens without depositing 
            await expect(exchange.connect(user1).depositToken(token1.address, amount)).to.be.reverted

        })



        })
       
    })

    describe ('Checking Balances', () => {
        let transaction, result 
        let amount = tokens(1)
    
         beforeEach(async () => {

                //approve token 
               
                trasnaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await trasnaction.wait ()
                //deposit token
                    trasnaction = await exchange.connect(user1).depositToken(token1.address, amount)
                    result = await trasnaction.wait()
                     })

            it('returns user balance' , async () => {
                expect(await token1.balanceOf(exchange.address)).to.equal(amount)
      
            })
        })
        })
      
    


 