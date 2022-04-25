pragma solidity >=0.7.0 <0.9.0;

contract LookupContract {
  mapping(string => uint256) public directory;

  constructor(string memory _name, uint256 _mobile_number) {
    directory[_name] = _mobile_number;
  }

  function set_mobile_number(string memory _name, uint256 _mobile_number) public
  {
    directory[_name] = _mobile_number;
  }

  function get_mobile_number(string memory _name) public view returns (uint256) {
      return directory[_name];
  }
}
