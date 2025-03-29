import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'

const deploySimpleAccountFactory: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const provider = ethers.provider
  const from = await provider.getSigner().getAddress()
  const network = await provider.getNetwork()

  // const entrypoint = await hre.deployments.get('EntryPoint')
  const ret = await hre.deployments.deploy(
    'SimpleAccountFactory', {
      from,
      args: ["0xcfB2F03F531d381e2f2f45D8DBB6474c1843Bd38"],
      gasLimit: 6e6,
      log: true
    })
  console.log('==SimpleAccountFactory addr=', ret.address)
}

export default deploySimpleAccountFactory
deploySimpleAccountFactory.tags = ['deploySimpleAccountFactory'];