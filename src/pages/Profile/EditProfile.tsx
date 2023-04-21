import { useState, useEffect, useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../context/ThemeContext'
import { AuthContext } from '../../context/AuthContext'
import { CircularProgress } from '@material-ui/core'
import style from './Profile.module.scss'
// import Header from '../../components/Header/Header'
import Cover from './assets/cover.svg'
import Avatar from './assets/user3.svg'
import Av2 from './assets/user5.svg'
// import Edit from './assets/edit.svg'
// import Sad from './assets/sad.svg'
// import Arrow from './assets/arrow.svg'
import Arrow2 from './assets/arrowLeft.svg'
import Container from '../../components/Container/Container'
import TextInput from '../../components/Inputs/TextInput'
import TextArea from '../../components/Inputs/TextArea'
import { publicRequest } from '../../utils/requestMethods'
import Verification from './Modals/Verification'
import UpdateComplete from './Modals/UpdateComplete'
import globals from '../../utils/globalVariables'
import EnterOtp from './Modals/EnterOtp'


const EditProfile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [themeState] = useContext<any>(ThemeContext)
  const [showVerify, setShowVerify] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [updated, setUpdated] = useState(false)
  const dark = themeState.dark
  const currentAddress = localStorage.getItem('currentAccount')
  const [authState, setAuthState] = useContext<any>(AuthContext)
  const [user, setUser] = useState<any>()
  //const user = authState.user
  // console.log(authState);
  
  //console.log(user)
  //console.log(localStorage.getItem('user'))

  // const [userInput, setUserInput] = useState<any>({
  //   name: user?.name || '',
  //   email: user?.email || '',
  //   bio: user?.bio || '',
  //   twitterLink: user?.twitter_username || '',
  //   website: user?.custom_url || '',
  // })
  useMemo(()=>setUser(authState.user),[authState])
  const [imageFile, setImageFile] = useState<any>({
    file: '',
    location: '',
  })
  const [coverImage, setCoverImage] = useState<any>({
    file: '',
    location: '',
  })

 

  const [userInput, setUserInput] = useState<any>({
    name: '',
    email: '',
    bio: '',
    twitterLink: '',
    website: '',
  })

  const inputHandler = (event: any) => {
    setUserInput({
      ...userInput,
      [event.target.name]: event.target.value,
    })
  }
  const selectMedia1 = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImage({
        ...coverImage,
        file: e.target.files[0],
      })
      var form_data = new FormData()
      form_data.append('upload', e.target.files[0])
      try {
        const resp = await fetch(
          `${globals.baseURL}/collectibles/upload-image`,
          {
            method: 'POST',
            body: form_data,
            headers:{
              'Authorization':`Bearer ${sessionStorage.getItem('token')}`
            }
          },
        )
        const data = await resp.json()
        //setImageLocation(data.location)
        setCoverImage({
          ...coverImage,
          file: e.target.files[0],
          location: data.location,
        })
        //console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const selectMedia2 = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile({
        ...imageFile,
        file: e.target.files[0],
      })
      var form_data = new FormData()
      form_data.append('upload', e.target.files[0])
      try {
        const resp = await fetch(
          `${globals.baseURL}/collectibles/upload-image`,
          {
            method: 'POST',
            body: form_data,
            headers:{
              'Authorization':`Bearer ${sessionStorage.getItem('token')}`
            }
          },
        )
        const data = await resp.json()
        //setImageLocation(data.location)
        setImageFile({
          ...imageFile,
          file: e.target.files[0],
          location: data.location,
        })
        //console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      //

      // if (imageFile.file) {
      //   const img_data = new FormData()
      //   img_data.append('upload', imageFile.file)
      //   try {
      //     const resp = await fetch(
      //       'https://dev.api.nftytribe.io/api/collectibles/upload-image',
      //       {
      //         method: 'POST',
      //         body: img_data,
      //       },
      //     )
      //     const data = await resp.json()
      //     //setImageLocation(data.location)
      //     setImageFile({
      //       ...imageFile,
      //       location: data.location,
      //     })
      //     console.log('image>>>', data)
      //   } catch (error) {
      //     console.log(error)
      //   }
      // }
      console.log('show location>>', imageFile.location)
      console.log('show userInput', userInput)
      const data = userInput

      // data.cover_image = coverImage.location

      const userData = {
        wallet_address: currentAddress,
        name: userInput.name || user?.name,
        //email: userInput.email || user?.email,
        image: imageFile.location || user?.image,
        cover_image: coverImage.location || user?.cover_image,
        bio: userInput.bio || user?.bio,
        twitter_username: userInput.twitterLink || user?.twitter_username,
        custom_url: userInput.website || user?.custom_url
      }

      const updateUserReq = await publicRequest.post(`/user/update-user`,userData,{headers:{
        'Authorization':`Bearer ${sessionStorage.getItem('token')}`
      }} )

      if (userInput.email) {
        try {
          const updateEmailReq =
            await publicRequest.get(`/user/generate-email-verification-mail?email=${userInput.email}&wallet_address=${currentAddress}`,{headers:{
              'Authorization':`Bearer ${sessionStorage.getItem('token')}`
            }})
          console.log(updateEmailReq)
          setShowOtp(true)
        } catch (err) {
          console.log(err)
        }
      } else {
        setUpdated(true)
      }
      setIsLoading(false)
      // setAuthState({
      //   ...authState,
      //   user: logUserReq.data.data,
      //   isFetching: false,
      //   error: false,
      // })

      setAuthState({
        ...authState,
        user: {
          ...authState.user,
          //
          cover_image: coverImage.location || user?.cover_image,
          image: imageFile.location || user?.image,
          name: userInput.name || user?.name,
          bio: userInput.bio || user?.bio,
          twitter_username: userInput.twitterLink || user?.twitter_username,
          custom_url: userInput.website || user?.custom_url
        },
        isFetching: false,
        error: false,
      })
      if (userInput.email) {
        setAuthState({
          ...authState,
          user: {
            ...authState.user,
            email: userInput.email || user?.email
          },
          isFetching: false,
          error: false,
        })
      }
      console.log("updated user", updateUserReq)
      console.log("updated auth state", authState.user)

    } catch (err) {
      console.log(err)
      setAuthState({
        ...authState,
        isFetching: false,
        error: true,
      })
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setShowVerify(false)
    setUpdated(false)
    setShowOtp(false)
  }

  return (
    <>
      {/* <Header /> */}
      {showVerify &&
        <Verification closeVerify={closeModal} />
      }
      {updated && <UpdateComplete closeModal={closeModal} />}
      {showOtp && <EnterOtp closeModal={closeModal} currentAddress={currentAddress} />}

      <Container>
        <form className={style.container} onSubmit={handleSubmit}>

          <div
            className={`${style.coverBx2} animate__animated animate__fadeInDown `}
          >
            {!coverImage.file && !user?.cover_image && (

              <img className={style.cover} src={Cover} alt="cover" />
            )}
            {!coverImage.file && user?.cover_image && (

              <img className={style.cover} src={user?.cover_image} alt="cover" />
            )}
            {coverImage.file && (
              <img
                className={style.cover}
                src={URL.createObjectURL(coverImage.file)}
                alt="cover"
              //onClick={closeVerify}
              />
            )}

            <div className={style.coverBtns}>
              <Link to="/profile">
                {' '}
                <img src={Arrow2} className={style.arrow} />
              </Link>

              <button className={dark === 'true' ? style.bl : style.bd}>
                Edit cover photo
              </button>
              <div className={style.fileInput1}>
                <input
                  type="file"
                  name="img"
                  onChange={selectMedia1}
                //required
                />
              </div>
            </div>

          </div>
          <div
            className={`${style.content} animate__animated animate__fadeInUp animate__delay-1s `}
          >
            <div className={style.profileInfo}>
              {!imageFile.file && !user?.image && (
                <div className={style.avatar}>
                  <img src={dark === 'true' ? Avatar : Av2} alt="avatar" />
                </div>
              )}
              {!imageFile.file && user?.image && (
                <div className={style.avatar}>
                  <img src={user?.image} alt="avatar" />
                </div>
              )}

              {imageFile?.file && (
                <div className={style.avatar}>
                  <img src={URL.createObjectURL(imageFile.file)} alt="avatar" />
                </div>
              )}

              <div className={style.picBtn}>
                <button>Change Photo</button>
                <div className={style.fileInput2}>
                  <input
                    type="file"
                    name="img"
                    onChange={selectMedia2}
                  //required
                  />
                </div>
              </div>
              {/* <div className={style.title}>
                <h1>Michael Carson</h1>
                <img src={Edit} alt="edit" />
              </div> */}
            </div>
            <div className={style.editBx}>
              <h2>Edit Profile</h2>
              <div>
                <div className={style.inputField}>
                  <p>Username</p>
                  <TextInput
                    type="text"
                    inputName="name"
                    holder={user?.name?user?.name:"Enter username"}
                    inputHandler={inputHandler}
                    value={userInput.name}
                  />
                </div>
                <div className={style.inputField}>
                  <p>Email address</p>
                  <TextInput
                    type="email"
                    inputName="email"
                    holder={user?.email?user?.email:"Enter email e.g youremail@example.com"}
                    inputHandler={inputHandler}
                    value={userInput.email}
                  />
                </div>
                <div className={style.inputField}>
                  <p>Bio</p>
                  <TextArea
                    inputName="bio"
                    type="text"
                    inputHandler={inputHandler}
                    holder={user?.bio?user?.bio:"Tell the world about yourself! It starts here"}
                    value={userInput.bio}
                  />
                </div>
                <div className={style.inputField}>
                  <p>Twitter link</p>
                  <TextInput
                    inputName="twitterLink"
                    type="text"
                    inputHandler={inputHandler}
                    holder=" http://twitter.com/your username"
                    value={userInput.twitterLink}
                  />
                </div>
                <div className={style.inputField}>
                  <p>Website URL</p>

                  <TextInput
                    inputName="website"
                    type="text"
                    inputHandler={inputHandler}
                    holder="Enter your website url e.g http://www.xyz.io"
                    value={userInput.website}
                  />
                </div>
                <div className={`${style.inputField} ${style.mgTop5}  `}>
                  <p>Verification</p>
                  <h4>To get verified and a blue tick</h4>
                  <button disabled type='button' onClick={() => setShowVerify(true)}>Verify</button>
                </div>
                <div className={style.editBtn}>
                  <button
                    type="submit"
                    //onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {!isLoading ? (
                      'Update Profile'
                    ) : (
                      <CircularProgress color="inherit" size="20px" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </>
  )
}

export default EditProfile
