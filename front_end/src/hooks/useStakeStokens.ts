// hooks are basically like components, its different in terms of functionality.
import {useEthers, useContractFunction} from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/DappToken.json"
import networkMapping from "../chain-info/deployments/map.json"
import {constants, utils} from "ethers"
import {Contract} from "@ethersproject/contracts"
import {useState, useEffect} from "react"

export const useStakeTokens = (tokenAddress: string) => {
    const {chainId} = useEthers()
    const {abi} = TokenFarm
    //chainId ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress , tokenFarmInterface)

    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)
    //Aprove and Stake tokens
    const {send: approveErc20Send, state: approveAndStakeErc20State} = useContractFunction(erc20Contract, "approve", {transactionName: "Approve ERC20 transfer"})
    const approveAndStake = (amount: string) => {
        setAmountToStake(parseInt(amount))
        return approveErc20Send(tokenFarmAddress, amount)
    }
    const [state, setState] = useState(approveAndStakeErc20State)
    
    const {send: stakeSend, state: stakeState} = useContractFunction(tokenFarmContract, "stakeTokens", {transactionName:"stake Tokens"})

    const [amountToStake, setAmountToStake] = useState(0)

    useEffect(() => {
        if(approveAndStakeErc20State.status === "Success"){
            //call stake function.
            stakeSend(amountToStake, amountToStake, tokenAddress)
        }
    },[approveAndStakeErc20State, tokenAddress])

    useEffect(() => {
        if(approveAndStakeErc20State.status === "Success")
            setState(stakeState)
        else
            setState(approveAndStakeErc20State)
    }, [approveAndStakeErc20State, stakeState])
    return {approveAndStake, state}
}