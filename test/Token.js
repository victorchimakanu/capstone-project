const {expect} = require('chai'); // pulling expect function out of chai library 
const {ethers} = require('hardhat'); // pulling ethers out of hardhat

const tokens = (n) => {
   return ethers.utils.parseUnits(n.toString() , 'ether')
}

describe ('Token', ()=> {
    let token, accounts, deployer , reciever
    

    beforeEach(async () => {
       
    const Token = await ethers.getContractFactory('Token')
    token = await Token.deploy('Dapp University' , 'DAPP' , '1000000')

   accounts = await ethers.getSigners()
   deployer = accounts[0]
   reciever = accounts[1]
    })

describe ('Deployment', () => {
    const name = 'Dapp University'
    const symbol = 'DAPP'
    const decimals = '18'
    const totalSupply = tokens ('1000000')

        it ('has the correct name', async () => {
   
            expect (await token.name()).to.equal(name)
            
        })
        
        it ('has the correct Symbol', async () => {
            
            expect(await token.symbol()).to.equal(symbol)
        
        })
        
         it ('has the correct decimals', async () => {
            
            expect(await token.decimals()).to.equal(decimals)
        
         })
        
         it ('has the correct total supply', async () => {
             expect(await token.totalSupply()).to.equal(totalSupply)
        })

        it ('it assigns total supply to deployer', async () => {
         
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
       })

    })

describe ('Sending Token', () => {
    let amount , transaction, result 

    describe ('Success', () => {
        

    beforeEach (async () => {
        amount = tokens(100)
        transaction = await token.connect(deployer).transfer(reciever.address, amount)
        result = await  transaction.wait()
    })

    it ('Transfers token balances', async () =>{

        // ensure tokens are trasnferred (balance changed) 
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
        expect(await token.balanceOf(reciever.address)).to.equal(amount)
  
    })

    it ('Emits a Transfer Event', async () => {
        const event = result.events[0]
        expect(event.event).to.equal('Transfer') //checking for event here 

        const args = event.args 
        expect(args.from).to.equal(deployer.address) //checking the arguments 
        expect(args.to).to.equal(reciever.address)
        expect(args.value).to.equal(amount)


    })


    })

describe ('Failure', () => {

    it('rejects insufficient balances', async () => {
        // trasnfer more tokens than deployer has - 100M
        const invalidAmount = tokens (100000000)
         await expect(token.connect(deployer).transfer(reciever.address, invalidAmount)).to.be.reverted


    })

    it('rejects invalid reciepient', async () => {
        
        const amount = tokens (100)
         await expect(token.connect(deployer).transfer("0x0000000000000000000000000000000000000000", amount)).to.be.reverted


    })
})


})

})
 