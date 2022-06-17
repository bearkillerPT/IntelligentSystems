import React from 'react';
import ChatComponent from './ChatComponent';
import './App.css'
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
            <p className='projectDescriptionTitle'>
            This chatbot was created to help guide users to their ideal travel destination! 
            </p>
            <p className='projectDescriptionTitle'>
                It will ask you general things about the destinations qualities and try to guess.
                You can see above the filters you have already added!
                
            </p>

            <p className='projectDescriptionTitle'>
                Some Question You Can Ask It:
                
            </p>

            <p className='projectDescriptionSubTitle'>
                    -   "What Do You Mean?" = It will try to explaing the last question
            </p>
            <p className='projectDescriptionSubTitle'>
                    -   "Who are you?" = It will present it self
            </p>
            <p className='projectDescriptionSubTitle'>
                    -   Using words like "show" and "give" will command the bot to show you the results
            </p>
            <p className='projectDescriptionSubTitle'>
                    -   You can answer negatively to any question and it will stop asking you for it!
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