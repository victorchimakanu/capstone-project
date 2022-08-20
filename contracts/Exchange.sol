// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";


contract Exchange{
    address public feeAccount;
    uint256 public feePercent;
    mapping (address => mapping(address => uint256)) public tokens;
    mapping (uint256 => _Order) public orders;
    uint256 public orderCount;

    //orders mapping 

    event Deposit(
        address token,
        address user, 
         uint256 amount, 
         uint256 balance
    );
         
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event Order(
         uint256 id,
        address user,
        address tokenGet, 
        uint256 amountGet,  
        address tokenGive, 
        uint256 amountGive,
        uint256 timestamp  
    );

    //a way to model the order
    struct _Order {
        //attributes of an order 
        uint256 id; //unique identifier
        address user; //user who made the order 
        address tokenGet; // Address of the token they recieve
        uint256 amountGet; // Amount they recieve 
        address tokenGive;  // Address of token they give 
        uint256 amountGive; // Amount they give 
        uint256 timestamp;   // when order was made 

    }

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

// DEPOSIT AND WITHDRAWN TOKEN
function depositToken(address _token, uint256 _amount) public{
//trasnfer tokens to exchange
 require(Token(_token).transferFrom(msg.sender, address(this), _amount));
//update users balance
tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;
//emit event 
emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);



}

function withdrawToken(address _token, uint256 _amount) public {
    // Ensure user has enough tokens to withdraw 
     require(tokens[_token][msg.sender] >= _amount);
    // Transfer tokens to user 
    Token(_token).transfer(msg.sender, _amount);
    // update user balance 
    tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;
    //emit event
    emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);

}

//check balances
function balanceOf(address _token, address _user)
public 
view
returns (uint256)
{
    return tokens[_token][_user];
}

//MAKE AND CANCEL ORDERS



function makeOrder(
    address _tokenGet,
    uint256 _amountGet, 
    address _tokenGive, 
    uint256 _amountGive) 
public {

    // prevent orders if tokens arent on the exchange 
    require(balanceOf(_tokenGive, msg.sender) >= _amountGive);

//token give (the token they want to spend) - which token, and how much?
//token get (the token they want to recieve) - which token and how much?

    // REQUIRE TOKEN BALANCE 

    //CREATE ORDER 

    orderCount = orderCount + 1;
    orders[orderCount] = _Order(
    orderCount, 
    msg.sender, 
    _tokenGet,
    _amountGet, 
    _tokenGive, 
    _amountGive,  
    block.timestamp 
    ); 

    // EMIT EVENT 
    emit Order(  
    orderCount,
    msg.sender,
    _tokenGet,
    _amountGet,
    _tokenGive,
    _amountGive,
    block.timestamp);
   
    
    
    

}

}
 