import { useEffect, useState, useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { AuthContext } from '../../context/AuthContext'
import { gsap, Expo } from 'gsap'
import { useNavigate } from 'react-router-dom'
import { publicRequest } from '../../utils/requestMethods'
// import Header from '../../components/Header/Header'
import style from './Collections.module.scss'
import Import from './Import'
import Container from '../../components/Container/Container'
import Upload from './assets/upload.svg'
import CollectionCard from '../../components/Card/CollectionCard'
import UpdatePrompt from '../../components/Modals/UpdatePrompt/UpdatePrompt'

const MyCollectionsFull = () => {
  const [showImport, setShowImport] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [themeState] = useContext<any>(ThemeContext)
  const [authState] = useContext<any>(AuthContext)
  const dark = themeState.dark
  const navigate = useNavigate()
  useEffect(() => {
    window.scrollTo(0, 0)
    console.log("verified?>>", authState.user)

    const heroTitle = document.getElementById('heroTitle')
    const heroText = document.getElementById('heroText')

    const tl = gsap.timeline()
    tl.to(heroTitle, {
      y: 0,
      duration: 1.5,
      ease: Expo.easeInOut,
    })
    tl.to(heroText, {
      y: 0,
      duration: 1.5,
      delay: -1,
      ease: Expo.easeInOut,
    })
  }, [])

  const [collections, setCollections] = useState([])
  useEffect(() => {
    const getCollections = async () => {
      const resp = await publicRequest.get(`/collections`)
      console.log(resp.data.data)
      //setCollections(resp.data.data.splice(0, 9))
      setCollections(resp.data.data)
    }

    getCollections()
  }, [])

  const closeImport = () => {
    setShowImport(false)
  }
  const closePrompt = () => {
    setShowPrompt(false)
  }

  const checkMailStatus = (value: any) => {
    //console.log("verified?>>", authState.user.email_verified)
    const verified = authState.user.email_verified
    if (value === 'create') {
      if (verified === 1) {
        //if mail is verified
        navigate('/createCollectionOptions')
      } else {
        // else
        setShowPrompt(true)
      }
    } else if (value === 'import') {
      if (verified === 1) {
        //if mail is verified
        setShowImport(true)
      } else {
        //else
        setShowPrompt(true)
      }
    }
  }

  return (
    <>
      {/* <Header /> */}
      {showImport && <Import closeImport={closeImport} />}
      {showPrompt && <UpdatePrompt closePrompt={closePrompt} />}
      <Container>
        <div className={style.container}>
          <div className={style.content}>
            <div className={style.top}>
              <h1>
                <span id="heroTitle">My Collections</span>{' '}
              </h1>
              <p>
                <span id="heroText">
                  Create, curate, and manage collections of unique NFTs to share
                  and sell.
                </span>
              </p>
            </div>
            <div className={style.body}>
              <div
                className={`${style.bodyBtns} animate__animated animate__fadeInUp animate__delay-1s`}
              >
                {/* <Link to="/createCollectionOptions"> */}
                {' '}
                <div
                  onClick={() => checkMailStatus("create")}
                  //className={style.bodyBtn}
                  className={`${style.bodyBtn} ${dark === 'true' ? 'yellowBtn' : 'blueBtn'
                    } `}
                >
                  Create collection
                </div>
                {/* </Link> */}

                <div
                  //className={style.bodyBtn2}
                  className={`${style.bodyBtn2} ${dark === 'true' ? 'yellowBtn' : 'blueBtn'
                    }`}
                  //onClick={() => setShowImport(true)}
                  onClick={() => checkMailStatus("import")}
                >
                  {' '}
                  Import collection <img src={Upload} alt="upload" />{' '}
                </div>
              </div>
              <div
                //className={style.collectionsContainer}
                className={`${style.collectionsContainer} animate__animated animate__fadeInUp animate__delay-1s`}
              >
                {!collections
                  ? null
                  : collections.map((collection: any, i) => {
                    return (
                      collection.title && (
                        <CollectionCard nftData={collection} />
                      )
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default MyCollectionsFull
