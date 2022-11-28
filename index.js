import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


//DECLARE TWEETSDATA AS NEW LET SO ADJUSTMENTS CAN BE MADE TO IT
let updatedTweetsData = tweetsData


//IF ANYTHING IN LOCAL STORAGE IT WILL BE CALLED
if (JSON.parse(localStorage.getItem("myTweets"))) {
    updatedTweetsData = JSON.parse(localStorage.getItem("myTweets"))
    } else {
        updatedTweetsData = tweetsData
    }
    
    
//EVENT LISTENERS
document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.id ==='reply-btn'){
        handleReplyTweetBtnClick(e.target.dataset.replytext)
    } 
    else if(e.target.classList.contains('hide-post')) {
        handleHideBtnClick(e.target.dataset.hidetext)
       }
    else if(e.target.id === 'delete-btn'){
        handleDeleteBtnClick(e.target.dataset.deletetext)
    }
})

//CHANGE AMOUNT OF LIKE CLICK, RE-RENDER AND CALL LOCAL STORAGE FUNCTION
function handleLikeClick(tweetId){ 
    const targetTweetObj = updatedTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
    saveLocalStorage()
}

//CHANGE AMOUNT OF RETWEET CLICK, RE-RENDER AND CALL LOCAL STORAGE FUNCTION
function handleRetweetClick(tweetId){
    const targetTweetObj = updatedTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
    saveLocalStorage()
}

//OPENS REPLIES SECTION
function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

//SAVES A NEW TWEET TO ARRAY, RE-RENDERS AND CALLS LOCAL STORAGE FUNCTION
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        updatedTweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        
    saveLocalStorage()
    render()
    tweetInput.value = ''
    }

}

//SAVES A REPLY TO TWEET ARRAY , RE-RENDERS, KEEPS REPLIES SECTION OPEN AND CALLS LOCAL STORAGE FUNCTION
 function handleReplyTweetBtnClick(tweetId){
     const tweetReplyInput = document.getElementById(`tweet-reply-${tweetId}`)
     
     const targetTweetReplyObj = updatedTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
      if(tweetReplyInput.value.length >= 1 ){
           targetTweetReplyObj.replies.push({
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: tweetReplyInput.value,
                canDelete: true,
                replyId: uuidv4()
        })
    }
    
    render()
    saveLocalStorage()
    handleReplyClick(tweetId)
    tweetReplyInput.value = ''
 }
 
//HIDES A TWEET OR REPLY TO A TWEET 
function handleHideBtnClick(tweetId){
     document.getElementById(`reply-${tweetId}`).classList.toggle('hidden')
     
     if (document.getElementById(`hide-${tweetId}`).innerText === 'Hide'){
         document.getElementById(`hide-${tweetId}`).innerText = 'Unhide'
     } else {
         document.getElementById(`hide-${tweetId}`).innerText = 'Hide'
     }
     
     if (!document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')){
         document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
     } 
}  

//DELETE A REPLY
function handleDeleteBtnClick(replyId){
   
    
    document.getElementById(`delete-${replyId}`)
    
    const targetDeleteBtnObj = updatedTweetsData.forEach(function(tweetReply){
       [tweetReply].forEach(function(clicked){
           clicked.replies.forEach(function(select){
               if(select.replyId === replyId){
                   let replies = clicked.replies
                   let position =  clicked.replies.indexOf(select)
                   replies.splice(position, 1)
                   console.log(clicked)
               }
           })
       } )
    })
    
    saveLocalStorage()
    render()
    
}

 
//SETS UP THE LIKE, RETWEET AND REPLIES
function getFeedHtml(){
    let feedHtml = ``
    updatedTweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
               tweet.replies.forEach(function(reply){
                if (reply.canDelete === true){
                    repliesHtml+=`
                        <div class="tweet-reply" id="delete-${reply.replyId}">
                            <div class="tweet-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                <div class="tweet-replies">
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                                <button id="delete-btn" class="delete-btn" data-deleteText=${reply.replyId}>X</button>
                            </div>
                         </div>
                        `
                } else {
                    repliesHtml+=`
                        <div class="tweet-reply">
                            <div class="tweet-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                        </div>
                        `
                }
            }
            )
        }
        
         //SETUP THE FULL FEED TO BE CALLED 
        feedHtml += `
            <div class="tweet" >
                <button class="hide-btn hide-post" id="hide-${tweet.uuid}" data-hidetext="${tweet.uuid}">Hide</button>
                <div class="tweet-inner visible" id='reply-${tweet.uuid}'>
                    <img src="${tweet.profilePic}" class="profile-pic">
                        <div>
                            <div>
                            <p class="handle" id="">${tweet.handle}</p>
                            <p class="tweet-text">${tweet.tweetText}</p>
                            </div>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                    <div class="reply-tweet-text tweet-reply">
                        <img src="images/scrimbalogo.png" class="profile-pic">
                        <textarea placeholder="Have your say!" id="tweet-reply-${tweet.uuid}" class=" tweet-reply-text"></textarea>
                    </div>
                    <button class="reply-btn" id="reply-btn" data-replytext = "${tweet.uuid}">Reply</button>
                </div>   
            </div>
            `
            })
            return feedHtml 
}

//SAVES INPUT TO LOCAL STORAGE
function saveLocalStorage() {
    localStorage.setItem('myTweets', JSON.stringify(updatedTweetsData))
}

//RENDERS THE WHOLE PAGE
function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    
}
render()

