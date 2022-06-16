import React from 'react';
import ChatComponent from './ChatComponent';
import './App.css'
import ClientAnalysis from './ComponentAnalysis';
const App = () => {

    return (
        <div className='app'>
            <div className='appHeader' >
                <p className='appHeaderSubTitle'>
                Want me to guess your ideal travel destination?
                </p>
                <p className='appHeaderTitle'>
                Talk to me!
                </p>
            </div>
            <div className='appBody'>
            <div className='projectDescription'>
            <p className='appHeaderSubTitle'>
            This chatbot was created to help guide users to their ideal travel destination! 
            </p>
            <p className='appHeaderSubTitle'>
            It will ask you general things about the destinations qualities and try to guess.
                
            </p>

 
            </div>
            <div className='chatComponent'>
                <ChatComponent />
            </div>
            </div>
        </div>
    );
}

export default App;