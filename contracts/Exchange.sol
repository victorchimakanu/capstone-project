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
    mapping (uint256 => bool) public orderCancelled; // true or false
    mapping(uint256 => bool) public orderFilled;


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
    
    event Cancel(
         uint256 id,
        address user,
        address tokenGet, 
        uint256 amountGet,  
        address tokenGive, 
        uint256 amountGive,
        uint256 timestamp  
    );
    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        address creator,
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

    //INSTANTIATE ORDER 

    orderCount++;
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

function cancelOrder(uint256 _id) public {
    // fetch order
    _Order storage _order = orders[_id];

     //Ensure the caller of the function is the owner of the order 
    require (address(_order.user) == msg.sender);
    
    //order must exist
    require(_order.id == _id);

    //cancel order
    orderCancelled[_id] = true;

    // emit event 
    emit Cancel(  
    _order.id,
    msg.sender,
    _order.tokenGet,
    _order.amountGet,
    _order.tokenGive,
    _order.amountGive,
    block.timestamp);

}

    //EXECUTING ORDERS

    function fillOrder(uint256 _id) public {
        // 1. Must be valid orderId
        require(_id > 0 && _id <= orderCount, "Order does not exist");
        // 2. Order can't be filled
        require(!orderFilled[_id]);
        // 3. Order can't be cancelled
        require(!orderCancelled[_id]);



        //fetch order 
        _Order storage _order = orders[_id];

        // swapping tokens 
        _trade(
        _order.id, 
        _order.user, 
        _order.tokenGet,
        _order.amountGet,
        _order.tokenGive,
        _order.amountGive
        );
         // Mark order as filled
        orderFilled[_order.id] = true;
        
    }
    function _trade(
        uint256 _orderId,
        address _user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive

    
    )internal {

        //fee is paid by the user who filled the order (msg.sender)
        //fee is going to be deducted from _amountGet

        uint256 _feeAmount = (_amountGet * feePercent) / 100;

        //Execute the trade 
        // msg.sender is the user who filled the order, while _user is who created the order
        tokens[_tokenGet][msg.sender] = tokens [_tokenGet][msg.sender] - (_amountGet + _feeAmount);
        tokens[_tokenGet][_user] = tokens[_tokenGet][_user] + _amountGet;

        //charge fees 
        tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount] + _feeAmount; // how we charge the fees 

        tokens[_tokenGive][_user] = tokens [_tokenGive][_user] - _amountGive;
        tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender]+ _amountGive;


        // emit trade event 
        emit Trade (
            _orderId,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            _user,
            block.timestamp
        );

    }

}
   