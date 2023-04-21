import { useEffect } from 'react'
import useState from 'react-usestateref'
//import { ThemeContext } from '../../../context/ThemeContext'
//import useState from 'react-usestateref'
import { Link } from 'react-router-dom'
import style from './ExploreSingle.module.scss'
import Close from './assets/close.svg'
import Happy from './assets/happy.svg'
import { CircularProgress } from '@material-ui/core'
import { shortenAddress } from '../../../utils/formatting'
import user from './assets/usericon.svg'
import Web3 from 'web3'
import contracts from '../../../web3-Service/contractAddress'
import marketPlaceAbi from '../../../smart_contracts/erc721Market.json'
import erc721Abi from '../../../smart_contracts/erc721Mintable.json'
import erc1155MintableAbi from "../../../smart_contracts/erc1155Mintable.json"
import erc1155Marketplace from "../../../smart_contracts/erc1155Market.json"
import NumberInput from '../../../components/Inputs/NumberInput'
import globals from '../../../utils/globalVariables'
import { motion } from 'framer-motion'


declare const window: any

const BuyModal = (props: any) => {
  //const [err, setErr] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line
  const [userWallet, setUserWallet] = useState<any>(
    localStorage.getItem('currentAccount'),
  )
  // const [themeState] = useContext<any>(ThemeContext)
  // const dark = themeState.dark
  // const [msg, setMsg] = useState({
  //   sMsg: '',
  //   eMsg: '',
  // })
  const [completed, setCompleted] = useState(false)
  const [validated, setValidated] = useState(false)
  const [userInput, setUserInput, userInputRef] = useState<any>({
    quantity: '',
  })
  const [errorMsg, setErrorMsg] = useState('')
  //const tokens = [{ value: '1', text: 'eth' }]
  // erc721 addresses
  const [erc721MintableAddress, setErc721MintableAddress] = useState<any>('')
  const [erc721MarketplaceAddress, setErc721MarketplaceAddress] = useState<any>('')
  // erc 1155 addresses
  const [erc1155MintableAddress, setErc1155MintableAddress] = useState<any>('')
  const [erc1155MarketplaceAddress, setErc1155MarketplaceAddress] = useState<any>('')
  const [chainId, setChainId, chainIdRef] = useState<string>()
  useEffect(() => {
    //const wallet_address = localStorage.getItem('currentAccount')
    const currentChain = localStorage.getItem('chain')
    const itemChain = props?.nftDetails?.chain
    if (currentChain === '0x1') {
      // setChain('rinkeby')
      setChainId('eth')
      setErc721MintableAddress(contracts.erc721MintableAddress)
      setErc721MarketplaceAddress(contracts.erc721MarketplaceAddress)
      setErc1155MintableAddress(contracts.erc1155MintableAdddress)
      setErc1155MarketplaceAddress(contracts.erc1155MarketplaceAddress)
    }
    if (currentChain === '0x38') {
      // setChain('bsc testnet')
      setChainId('bsc')
      setErc721MintableAddress(contracts.BSC_erc721MintableAddress)
      setErc721MarketplaceAddress(contracts.BSC_erc721MarketplaceAddress)
      setErc1155MintableAddress(contracts.BSC_erc1155MintableAdddress)
      setErc1155MarketplaceAddress(contracts.BSC_erc1155MarketplaceAdddress)
    }
  }, [])

  const inputHandler = async (event: any) => {
    setValidated(false)
    const { name, value } = event.target
    let letters = /[a-zA-Z]/
    let specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/
    let dots = value.match(/\./g)
    if (letters.test(value) || specialChars.test(value) || dots?.length >= 2 || value > props?.nftDetails?.number_of_copies || value === '' || value < 1) {
      // console.log(value)
      // console.log(props?.nftDetails?.number_of_copies)
      setValidated(false)
    } else {
      setUserInput({
        ...userInput,
        [event.target.name]: parseInt(value),
      })
      setValidated(true)
    }
    if (userInputRef.current.quantity !== '') {
      setValidated(true)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    const inputQuantity = parseInt(userInputRef.current.quantity)
    const itemQuantity = parseInt(props?.nftDetails?.number_of_copies)
    // if (userInputRef.current.quantity > '' && inputQuantity <= itemQuantity) {
    // contract functionality
    //const chain = 'rinkeby'
    // const erc721MintableAddress = contracts.erc721MintableAddress
    // const erc721MarketplaceAddress = contracts.erc721MarketplaceAddress

    //const erc721MintableAddress = contracts.erc721MintableAddress // process.env.REACT_APP_ERC721_CONTRACT
    //const contract_address = '0xb6b043610655a356A433aBc0c6BAE46e0AA5C230' //process.env.REACT_APP_MARKETPLACE_CONTRACT
    // const erc1155Mintable_address = contracts.erc1155MintableAdddress
    // const erc1155MarketplaceAddress = contracts.erc1155MarketplaceAddress

    // contract function
    //const marketplace_address = process.env.REACT_APP_MARKETPLACE_CONTRACT
    let marketPlaceContract
    let erc721Contract
    let erc1155Contract
    let web3: any
    if (window.ethereum && userWallet) {

      web3 = new Web3(window.ethereum)

      erc721Contract = new web3.eth.Contract(
        erc721Abi,
        props.nftDetails.collection_address || erc721MintableAddress,
      )

      marketPlaceContract = new web3.eth.Contract(
        marketPlaceAbi,
        erc721MarketplaceAddress,
      )

      console.log(props.nftDetails, 'helllo')

      if (props.nftDetails.is_lazy_mint) {
        try {
          const getnftnonce = await fetch(
            `${globals.baseURL}/collectibles/nft/${props.nftDetails._id}/get-collectible-nonce`,
          )
          const nonceData = await getnftnonce.json()
          const mintingCharge = await erc721Contract.methods
            .mintingCharge()
            .call()

          const totalAmt =
            parseInt(props.nftDetails.price, 10) + parseInt(mintingCharge, 10)
          console.log(totalAmt)

          console.log(
            props.nftDetails.wallet_address,
            0,
            props.nftDetails.file,
            nonceData.data.nonce,
            parseInt(props.nftDetails.price),
            props.nftDetails.signature,
            userWallet,
          )
          console.log(erc721Contract)
          const tx = await erc721Contract.methods
            .lazyMint(
              props.nftDetails.wallet_address,
              0,
              props.nftDetails.file,
              nonceData.data.nonce,
              props.nftDetails.price.toString(),
              //web3.utils.toWei(props.nftDetails.price.toString(), 'ether'),
              props.nftDetails.signature,
            )
            .send({ from: userWallet, value: totalAmt.toString() })

          console.log(tx)
          let events = tx.events
          const token_id = events.Transfer[0].returnValues.tokenId

          const updatableData = {
            token_id,
            file: props.nftDetails.file,
            wallet_address: props.nftDetails.wallet_address,
            collection_address: props.nftDetails.collection_address,
            chain_id: chainId,
            type: 'mint',
            transaction_hash: events.Transfer[0].transactionHash,
            on_sale: false,
          }

          const collectible = await fetch(
            `${globals.baseURL}/collectibles/update-collectible`,
            {
              method: 'PUT',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify(updatableData),
            },
          )

          const res = await collectible.json()
          console.log(res)

          const buyData = {
            buyer: events.Transfer[1].returnValues.to,
            wallet_address: props.nftDetails.wallet_address,
            token_id,
            collection_address: props.nftDetails.collection_address,
            chain_id: chainId,
            price: props.nftDetails.price,
            transaction_hash: events.Transfer[1].transactionHash,
          }

          const buy = await fetch(
            `${globals.baseURL}/collectibles/buy`,
            {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify(buyData),
            },
          )

          const data = await buy.json()
          console.log(data)
          setIsLoading(false)
          setCompleted(true)
        } catch (error) {
          console.log(error)
          setIsLoading(false)
        }
      } else if (!props?.nftDetails?.is_multiple) {
        console.log('hello', props.nft, props.nftDetails)
        try {
          const itemDetail = await marketPlaceContract.methods
            .auctions(
              props.nftDetails.collection_address,
              parseInt(props.nftDetails.token_id),
            )
            .call()

          console.log(itemDetail)
          const buyItem = await marketPlaceContract.methods
            .buy(props.nftDetails.token_id, props.nftDetails.collection_address)
            .send({ from: userWallet, value: props.nftDetails.price })
          console.log(buyItem)
          const transactionHash = buyItem.transactionHash

          const itemObj = {
            wallet_address:
              props?.nft?.owner_of || props?.nftDetails?.wallet_address,
            collection_address:
              props?.nft?.token_address ||
              props?.nftDetails?.collection_address,
            buyer: userWallet,
            chain: chainId,
            transaction_hash: transactionHash,
            price: props?.nft?.amount || props?.nftDetails?.price,
            token_id: props?.nft?.token_id || props?.nftDetails?.token_id,
          }

          const buy = await fetch(
            `${globals.baseURL}/collectibles/buy`,
            {
              method: 'POST',
              body: JSON.stringify(itemObj),
              headers: {
                'content-type': 'application/json',
              },
            },
          )

          const response = await buy.json()
          console.log(response)

          //API funtionality
          // const itemObj = {
          //   wallet_address: props.nft.owner_of || props.nftDetails.wallet_address,
          //   collection_address:
          //     props.nft.token_address || props.nftDetails.collection_address,
          //   buyer: userWallet,
          //   chain: 'rinkeby',
          //   transaction_hash: transactionHash,
          //   price: props.nft.amount || 0.00001,
          //   token_id: props.nft.token_id || props.nftDetails.token_id,
          // }

          // const buyItemReq = await publicRequest.post(
          //   `/collectibles/buy`,
          //   itemObj,
          // )
          // console.log(buyItemReq)
          setIsLoading(false)
          setCompleted(true)
        } catch (err) {
          console.log(err)
          setIsLoading(false)
        }
      }
      else if (props?.nftDetails?.is_multiple) {
        erc1155Contract = new web3.eth.Contract(erc1155MintableAbi, erc1155MarketplaceAddress);
        marketPlaceContract = new web3.eth.Contract(erc1155Marketplace, erc1155MarketplaceAddress);

        const buyDetails = await marketPlaceContract.methods._auctions(props?.nftDetails?.collection_address, props?.nftDetails?.token_id, props?.nftDetails?.owner ? props?.nftDetails?.owner : props?.nftDetails?.wallet_address).call()
        let totalPrice

        console.log(buyDetails, userInput.quantity, 'got details')
        if (userInput.quantity) {
          totalPrice = parseInt(buyDetails.price, 10) * parseInt(userInput.quantity)
        }

        console.log(props?.nftDetails?.collection_address, parseInt(props?.nftDetails?.token_id), props?.nftDetails?.owner ? props?.nftDetails?.owner : props?.nftDetails?.wallet_address, parseInt(userInput.quantity), totalPrice)

        const buy = await marketPlaceContract.methods.buy(props?.nftDetails?.collection_address, parseInt(props?.nftDetails?.token_id), props?.nftDetails?.owner ? props?.nftDetails?.owner : props?.nftDetails?.wallet_address, parseInt(userInput.quantity))
          .send({ from: userWallet, value: totalPrice?.toString() })

        console.log(buy)

        const transactionHash = buy.transactionHash

        const itemObj = {
          wallet_address:
            props?.nftDetails?.owner,
          collection_address:
            props?.nft?.token_address ||
            props?.nftDetails?.collection_address,
          buyer: userWallet,
          chain_id: chainId,
          transaction_hash: transactionHash,
          price: props?.nft?.amount || props?.nftDetails?.price,
          token_id: props?.nft?.token_id || props?.nftDetails?.token_id,
          quantity: userInput.quantity
        }

        const buyApi = await fetch(
          `${globals.baseURL}/collectibles/buy-multiple`,
          {
            method: 'POST',
            body: JSON.stringify(itemObj),
            headers: {
              'content-type': 'application/json',
            },
          },
        )

        const response = await buyApi.json()
        console.log(response)

        setIsLoading(false)
        setCompleted(true)
      }
      setIsLoading(false)

    } else {
      setIsLoading(false)
    }
    // } else {
    //   setErrorMsg('Please enter appropriate quantity')
    //   setIsLoading(false)
    // }
  }

  return (
    <div className={style.bm}>
      <div className={style.bmContent}>
        <div
          className={`${style.overlay} animate__animated animate__fadeIn `}
        ></div>
        <div className={style.modalContainer}>
          {!completed && (
            <motion.form
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {
                  opacity: 0,
                  scale: 0.7,
                },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.1,
                    //delay: 0.3,
                    scale: {
                      duration: .01,
                    },
                  },
                },
              }}
              className={`${style.modal}  `}
              onSubmit={handleSubmit}
            >
              <div className={style.modalTop}>
                <h1>Checkout</h1>
                <p className={style.mText}>
                  Please, review your purchase of
                  <span
                    // className={`${
                    //   dark === 'true' ? 'yellowMain' : 'blueLight'
                    // }`}
                    className="blueTxt"
                  >
                    <strong> {' ' + props.nftDetails?.title} </strong>
                  </span>{' '}
                  from
                  <span className="blueTxt">
                    <strong>
                      {' ' +
                        shortenAddress(
                          props.nft?.owner_of ||
                          props.nftDetails?.wallet_address,
                        ) || ''}{' '}
                    </strong>
                  </span>
                </p>
                <img src={Close} alt="close" onClick={props.handleClose} />
              </div>
              <div className={style.modalBody2}>
                <div className={style.addrBox}>
                  <img src={user} alt="user" />
                  {shortenAddress(userWallet) || ''}

                  <div className={style.connectedBox}>
                    <p>Connected</p>
                  </div>
                </div>
              </div>
              <div className={style.pricesBx}>
                <div className={style.pbItem}>
                  <p>Service pay </p>
                  <p>0.001 {props.nftDetails?.chain === "eth" ? 'ETH' : props.nftDetails?.chain === "bsc" ? 'BNB' : ''}</p>
                </div>
                <div className={style.pbItem}>
                  <p>Amount </p>
                  <p>
                    {Web3.utils.fromWei(props.nftDetails?.price.toString(), 'ether') || ''}{' '}
                    {props.nftDetails?.chain === "eth" ? 'ETH' : props.nftDetails?.chain === "bsc" ? 'BNB' : ''}
                  </p>
                </div>
                {props?.nftDetails?.is_multiple && (
                  <div className={style.fieldBx}>
                    <p>Quantity</p>
                    <br />
                    <NumberInput
                      inputName="quantity"
                      holder="Enter quantity"
                      min="1"
                      max={props?.nftDetails?.number_of_copies}
                      inputHandler={inputHandler}
                    // value={userInput.bid}
                    />
                  </div>)}
                {/* <div className={style.pbItem}>
                  <p>Total </p>
                  <div className={style.pbBlue}>
                    <p>xx ETH</p>
                  </div>
                </div> */}
              </div>
              <div className={style.modalBtns2}>
                {props?.nftDetails?.is_multiple ? (
                  <button
                    type="submit"
                    className={style.btn1}
                    disabled={isLoading || !validated}

                  >
                    {!isLoading ? (
                      'Purchase'
                    ) : (
                      <CircularProgress color="inherit" size="20px" />
                    )}
                  </button>) : (
                  <button
                    type="submit"
                    className={style.btn1}
                    disabled={isLoading}

                  >
                    {!isLoading ? (
                      'Purchase'
                    ) : (
                      <CircularProgress color="inherit" size="20px" />
                    )}
                  </button>
                )}

                <button className={style.btn2} onClick={props.handleClose}>
                  {' '}
                  Cancel
                </button>
              </div>
              {errorMsg && <p>{errorMsg}</p>}
            </motion.form>
          )}
          {completed && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {
                  opacity: 0,
                  scale: 0.7,
                },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.1,
                    //delay: 0.3,
                    scale: {
                      duration: .01,
                    },
                  },
                },
              }}
              className={`${style.modal} `}
            >
              <div className={style.modalTop}>
                <h1>Congratulations</h1>
                <p className={style.mText}>
                  You have successfully purchased{' '}
                  <strong> {' ' + props.nftDetails?.title} </strong>, you can
                  now view on your profile
                </p>
                <img src={Close} alt="close" onClick={props.handleClose} />
              </div>
              <div className={style.modalBody2}>
                <div className={style.successImg}>
                  <img src={Happy} alt="success" />
                </div>
              </div>
              <Link to="/profile" className={style.modalBtnSingle}>
                <button>View Profile</button>
              </Link>
            </motion.div>
          )}
          {/* )} */}
        </div>
      </div>
    </div>
  )
}

export default BuyModal
