// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CrowdFunding {
    IERC20 public token;

    struct Campaign {
        uint256 goal;
        uint256 duration;
        uint256 totalFunds;
        uint256 startTime;
        address creator;
        mapping(address => uint256) contributions;
    }
    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignId;

    // The parameters token is the ERC-20 token a donor can donate with.
    // @param _tokens list of allowed token addresses
    constructor(address _token) {
        token = IERC20(_token);
    }

    /**
     * This function allows anyone to create a campaign of goal amount (in USD)
     * with the time duration of duration (in seconds). As soon as the campaign
     * is created, it is considered to be active. Each campaign must be associated
     * with an id , starting from 1 and increasing one at a time.
     * @notice createCampaign allows anyone to create a campaign
     * @param _goal amount of funds to be raised in USD
     * @param _duration the duration of the campaign in seconds
     */
    function createCampaign(uint256 _goal, uint256 _duration) external {
        require(_goal > 0, "Goal must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        campaignId++;
        campaigns[campaignId].goal = _goal;
        campaigns[campaignId].duration = _duration;
        campaigns[campaignId].totalFunds = 0;
        campaigns[campaignId].startTime = block.timestamp;
        campaigns[campaignId].creator = msg.sender;
    }

    /**
     * This function allows anyone to create a contribution of amount tokens to a
     * campaign specified by the id . This function must revert if the campaign with id does not exist.
     * @dev contribute allows anyone to contribute to a campaign
     * @param _id the id of the campaign
     * @param _amount the amount of tokens to contribute
     */
    function contribute(uint256 _id, uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        Campaign storage campaign = campaigns[_id];
        require(campaign.creator != address(0), "Campaign does not exist");
        require(msg.sender != campaign.creator, "Creator cannot contribute");
        campaign.contributions[msg.sender] += _amount;
        campaign.totalFunds += _amount;
        token.transferFrom(msg.sender, address(this), _amount);
    }

    /**
     * This function allows any donor to cancel their contribution. It should revert
     * if no donations have been made by the caller for the particular campaign.
     * @dev cancelContribution allows anyone to cancel their contribution
     * @param _id the id of the campaign
     */
    function cancelContribution(uint256 _id) external {
        Campaign storage campaign = campaigns[_id];
        require(campaign.contributions[msg.sender] > 0, "No contribution");
        uint256 amount = campaign.contributions[msg.sender];
        campaign.totalFunds -= amount;
        campaign.contributions[msg.sender] = 0;
        token.transfer(msg.sender, amount);
    }

    /**
     * This function allows the creator of the campaign id to collect all the contributions. This
     * function must revert if the duration of the campaign has not passed, or / and the goal has not been met.
     * @notice withdrawFunds allows the creator of the campaign to withdraw the funds
     * @param _id the id of the campaign
     */
    function withdrawFunds(uint256 _id) external {
        Campaign storage campaign = campaigns[_id];
        require(
            block.timestamp >= campaign.startTime + campaign.duration,
            "Campaign is still active"
        );
        require(campaign.totalFunds >= campaign.goal, "Goal not met");
        token.transfer(campaign.creator, campaign.totalFunds);
    }

    /**
     * This allows the donors to get their funds back if the campaign has failed.
     * It should revert if no donations were made to this campaign by the caller.
     * @notice refund allows the contributors to get a refund if the campaign failed
     * @param _id the id of the campaign
     */
    function refund(uint256 _id) external {
        Campaign storage campaign = campaigns[_id];
        require(
            block.timestamp >= campaign.startTime + campaign.duration,
            "Campaign is still active"
        );
        require(campaign.totalFunds < campaign.goal, "Goal met");
        uint256 amount = campaign.contributions[msg.sender];
        require(amount > 0, "No contribution");
        campaign.totalFunds -= amount;
        campaign.contributions[msg.sender] = 0;
        token.transfer(msg.sender, amount);
    }

    /**
     * This function allows anyone to view the contributions made by contributor for the id campaign (in USD).
     * @notice getContribution returns the contribution of a contributor in USD
     * @param _id the id of the campaign
     * @param _contributor the address of the contributor
     */
    function getContribution(
        uint256 _id,
        address _contributor
    ) public view returns (uint256) {
        return campaigns[_id].contributions[_contributor];
    }

    /**
     * This function returns the remaining time, the goal, and the total funds collected (in USD).
     * @notice getCampaign returns details about a campaign
     * @param _id the id of the campaign
     * @return remainingTime the time (in seconds) when the campaign ends
     * @return goal the goal of the campaign (in USD)
     * @return totalFunds total funds (in USD) raised by the campaign
     */
    function getCampaign(uint256 _id) external view returns (uint256 remainingTime, uint256 goal, uint256 totalFunds) {
        Campaign storage campaign = campaigns[_id];
        remainingTime = (campaign.startTime + campaign.duration) - block.timestamp;
        goal = campaign.goal;
        totalFunds = campaign.totalFunds;

        return (remainingTime, goal, totalFunds);
    }
}
