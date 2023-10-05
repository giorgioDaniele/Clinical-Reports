import NavigationBar from "./components/generics/NavigationBar.jsx"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import NotFound from "./components/generics/NotFound.jsx"
import {useEffect, useState} from "react"
import Login from "./components/Login.jsx"

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from "./components/home/Home.jsx";
import Editor from "./components/editor/Editor.jsx";
import Portfolio from "./components/portfolio/Portfolio.jsx";
import {
    FORBIDDEN,
    INTERNAL_SERVER_ERROR, netRequest,
    OperationResult,
    User
} from "./utils.js";
import Customizer from "./components/generics/Customizer.jsx";
import Feedback from "./components/generics/Feedback.jsx";


function App() {


    function loginSuccessful (user)  {
        const newUser = new User(user['ID'], user['name'], user['username'])
        setUser(newUser)
        setLoggedIn(true)
    }

    function logout() {

        const URL     = 'http://localhost:3001/api/sessions'
        const OPTIONS = {
            method: 'DELETE',
            credentials: 'include'
        }

        fetch(URL, OPTIONS).then(() => {
            setLoggedIn(false)
            setUser(undefined)
        })

    }

    // USER ACCESS MANAGEMENT
    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser]         = useState(new User(0, '', ''))


    const [websiteTitle, setWebsiteTitle] = useState('')
    // UPLOADING WEBSITE NAME
    const [messageOnEdited, setMessageOnEdited] = useState(undefined)
    const [operationResult, setOperationResult] = useState(new OperationResult(undefined, undefined))

    useEffect(() => {

        const URL     = `http://localhost:3001/api/website-name`
        const OPTIONS = {}

        function onSuccess (networkResult) {
            setWebsiteTitle(networkResult['payload']['text'])
        }
        function onFailure (networkResult) {
            setOperationResult(new OperationResult(networkResult['exitStatusCode'], networkResult['payload']['error']))
        }
        function onError (error) {
            setOperationResult(new OperationResult(INTERNAL_SERVER_ERROR, error))
        }
        netRequest(URL, OPTIONS, onSuccess, onFailure, onError, () => {}, () => {})

    }, [])

    const handleSubmit = (event) => {

        ////////////////////////////////////////////////////////////////////////////
        event.preventDefault() // AVOID BROWSER BEHAVIOR
        ////////////////////////////////////////////////////////////////////////////

        let body  = {
            text: websiteTitle
        }

        const URL     = `http://localhost:3001/api/website-name`
        const OPTIONS = {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        }

        function onSuccess (networkResult) {
            setMessageOnEdited(`Website has been edited successfully successfully!`)
        }
        function onFailure (networkResult) {
            setOperationResult(new OperationResult(networkResult['exitStatusCode'], networkResult['payload']['error']))
        }
        function onError   (error) {
            setOperationResult(new OperationResult(INTERNAL_SERVER_ERROR, error))
        }
        netRequest(URL, OPTIONS, onSuccess, onFailure, onError, () => {}, () => {})
    }

    return (
        <div>
            <BrowserRouter>
                <NavigationBar user={user} logout={logout} title={websiteTitle}/>
                <Routes>
                    <Route path='/' element={ <Home loggedIn={loggedIn} user={user}/>}/>
                    <Route path='/login' element={loggedIn?
                        <Navigate replace to='/' /> : <Login loginSuccessful={loginSuccessful}/>}/>
                    <Route path='/new' element={<Editor user={user} mode={'NEW DOCUMENT'}/>}/>
                    <Route path='/portfolio' element={<Portfolio user={user} loggedIn={loggedIn}/>}/>
                    <Route path='/edit/:id' element={<Editor user={user} mode={'EDIT DOCUMENT'}/>}/>
                    <Route path={'/customize'} element={<Customizer
                        setWebsiteTitle={setWebsiteTitle} websiteTitle={websiteTitle} handleSubmit={handleSubmit}/>}/>
                    <Route path='/*' element={<NotFound/>}/>
                </Routes>
                <Feedback
                    title={'Something went wrong'}
                    isVisible={operationResult['exitStatusCode'] === INTERNAL_SERVER_ERROR}
                    message={operationResult['message']}
                    makeDisappear={() => setOperationResult(new OperationResult(undefined, undefined))}
                    previousView={''} buttonMessage={'Back to Home'}/>
                <Feedback
                    title={'Something went wrong'}
                    isVisible={operationResult['exitStatusCode'] === FORBIDDEN}
                    message={operationResult['message']}
                    makeDisappear={() => setOperationResult(new OperationResult(undefined, undefined))}
                    previousView={''} buttonMessage={'Back to Home'}/>
                <Feedback
                    isVisible={!!messageOnEdited}
                    title={messageOnEdited ? 'SUCCESS' : 'ERROR'}
                    makeDisappear={() => setMessageOnEdited(undefined)}
                    previousView={''} message={`Website has been edited successfully!`} buttonMessage={'Back to Home'}/>
            </BrowserRouter>
        </div>
    )
}


export default App
