import { useState, useEffect } from 'react'
//import { Link } from 'react-router-dom'
import { shortenAddress } from '../../utils/formatting'
//import { publicRequest } from '../../utils/requestMethods'
import { getUsdPrice } from '../../utils/exchangeRate'
//import koala from './assets/kl.png'
import anime from './assets/anime.jpeg'
import dots from './assets/dots.svg'
import like from './assets/like.svg'
import user from './assets/user3.svg'
import arrow from './assets/icon.svg'
import style from './Card.module.scss'
//import Logo from './assets/logo.svg'
import eth from './assets/eth.svg'
import Web3 from 'web3'

const ItemCardFeatured = (data: any) => {
  const [showFull, setShowFull] = useState(false)
  const [usdPrice, setUsdPrice] = useState<any>()
  // const convert = require('crypto-convert')
  // useEffect(() => {
  //   const startConvert = async () => {
  //     if (!convert.isReady) {
  //       await convert.ready()
  //     }
  //   }
  //   startConvert()
  //   const converted = convert.ETH.USD(0.05)
  //   console.log(converted)
  // }, [])

  const getImageUrl = (uri: any) => {
    let url
    if (uri.includes('ipfs/')) {
      // eslint-disable-next-line
      url = 'https://ipfs.io/ipfs/' + `${uri.split('ipfs/')[1]}`
    } else if (data?.nftData?.cardImage.includes('ipfs://')) {
      // eslint-disable-next-line
      url = 'https://ipfs.io/ipfs/' + `${uri.split('ipfs://')[1]}`
    }
    return url
  }
  useEffect(() => {
    // const getUsdPrice = async () => {
    //   try {
    //     const usdPrice = await publicRequest.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
    //     const usdValue = usdPrice.data.ethereum.usd
    //     const ethPrice = Web3.utils.fromWei(data?.nftData?.price.toString(), 'ether')
    //     setUsdPrice(parseFloat(ethPrice) * usdValue)
    //     //console.log(ethPrice)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // getUsdPrice()
    const getUsdPriceValue = async () => {
      if (data?.nftData?.chain === 'eth') {
        const usdPrice = await getUsdPrice("ethereum")
        const price = Web3.utils.fromWei(data?.nftData?.price.toString(), 'ether')
        const convertedPrice = parseFloat(price) * usdPrice.ethereum.usd
        setUsdPrice(convertedPrice)
      }
      if (data?.nftData?.chain === 'bsc') {
        const usdPrice = await getUsdPrice("binancecoin")
        const price = Web3.utils.fromWei(data?.nftData?.price.toString(), 'ether')
        const convertedPrice = parseFloat(price) * usdPrice.binancecoin.usd
        setUsdPrice(convertedPrice)
      }
    }
    getUsdPriceValue()
  }, [])
  return (
    // <Link
    //   //to={`/explore/22/22`}
    //   to={
    //     data?.nftData?.is_lazy_mint
    //       ? `/explore/${data?.nftData?.collection_address}/${data?.nftData?.signature}?lazy_mint=true`
    //       : `/explore/${data?.nftData?.collection_address}/${data?.nftData?.token_id}`
    //   }
    // >
    <div className={style.card2}>
      <div className={style.cardContent}>
        {/* <div className={style.cardImgBx}> */}
        {/* <Link
          //to={`/explore/22/22`}
          to={
            data?.nftData?.is_lazy_mint
              ? `/explore/${data?.nftData?.collection_address}/${data?.nftData?.signature}?lazy_mint=true`
              : `/explore/${data?.nftData?.collection_address}/${data?.nftData?.token_id}`
          }
        > */}
        <div className={style.cardImg3}>
          {/* {data?.nftData?.cardImage !== '' && (
            <img
              //className={style.imgBg}
              src={
                data?.nftData?.cardImage.includes('/ipfs') ||
                data?.nftData?.cardImage.includes('ipfs://')
                  ? `${getImageUrl(data?.nftData?.cardImage)}`
                  : data?.nftData?.cardImage
              }
              alt="item"
            />
          )}
          {data?.nftData?.cardImage === '' && (
            <img
              //className={style.imgBg}
              src={koala}
              alt="item"
            />
          )} */}
          <img src={anime} alt="item" />
        </div>
        <div className={style.cardTop}>
          <img src={dots} alt="options" />
          <img src={like} alt="like" />
        </div>
        {/* </Link> */}
        {!showFull && (
          <div
            //className={style.descBox1}
            className={`${style.descBox1} animate__animated animate__fadeIn `}
          >
            <div className={style.userInfo} onClick={() => setShowFull(true)}>
              <img className={style.userImg} src={user} alt="user" />

              {/* {data.nftData && (
                <p>{shortenAddress(data?.nftData?.wallet_address)}</p>
              )} */}
              <p>0x6aa687f...72ea7a</p>
              <img src={arrow} alt="arrow" />
            </div>
            <div className={style.itemInfo}>
              {/* <p>{data?.nftData?.title}</p> */}
              <p>KakuGen #33</p>
            </div>
          </div>
        )}
        {showFull && (
          <div
            className={`${style.descBox3} animate__animated animate__fadeIn `}
          >
            <div className={style.itemInfo3}>
              <div
                className={style.itemSubtxt}
                onClick={() => setShowFull(false)}
              >
                <h3>{data?.nftData?.title}</h3>
                <div className={style.userBx}>
                  <img className={style.userImg} src={user} alt="user" />

                  {/* {data.nftData && (
                    <p>{shortenAddress(data?.nftData?.wallet_address)}</p>
                  )} */}
                  <p>0x6aa687f...72ea7a</p>
                </div>
              </div>
              {/* <Link
                //to={`/explore/22/22`}
                to={
                  data?.nftData?.is_lazy_mint
                    ? `/explore/${data?.nftData?.collection_address}/${data?.nftData?.signature}?lazy_mint=true`
                    : `/explore/${data?.nftData?.collection_address}/${data?.nftData?.token_id}`
                }
                className={style.buyBtnBg}
              > */}
              {/* {data?.nftData?.marketplace_type === 2 ? (
                <button>Bid</button>
              ) : (
                <button>Buy</button>
              )} */}
              {/* </Link> */}
            </div>
            <div className={style.actionBx2}>
              <div className={style.aBcontent}>
                <div className={style.aleft}>
                  {/* <img src={Logo} alt="logo" /> */}
                  <img src={eth} alt="eth" />

                  {/* <p>
                    {' '}
                    {Web3.utils.fromWei(data?.nftData?.price, 'ether') ||
                      ''}{' '}
                  </p> */}
                  <p>0.1</p>
                </div>
                <div className={style.aright}>
                  {/* <p>$2800 </p> */}
                  <p>${usdPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className={style.aleft}></div>
            </div>
          </div>
        )}
      </div>
    </div>
    // </Link>
  )
}

export default ItemCardFeatured
