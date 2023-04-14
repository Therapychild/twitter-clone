// import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const myHandle = "TheraypChild";
const replyDialogContainer = document.getElementById(`reply-dialog-container`);
const replyInput = document.getElementById('reply-dialog-input');
const errorMessage = document.getElementById('error');
let tweetsData = JSON.parse(window.localStorage.getItem("tweetsData"));

// Click Event listener for entire document.
document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    }
    else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.dataset.myReply) {
        handleMyReplyClick(e.target.dataset.myReply);
    }
    else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    }
    else if (e.target.id === 'submit-btn') {
        handleSubmit();
    }
    else if (e.target.id === 'close-dialog-btn') {
        handleCloseDialog();
    }
})

// Event listener for reply input.
replyInput.addEventListener('input', event => {
    if (replyInput.value && !errorMessage.classList.contains('hidden')) {
        errorMessage.classList.add('hidden');
    }
})

// functions called by Event listener. 
function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId;
    })[0]

    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--;
    }
    else {
        targetTweetObj.likes++;
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    setData(tweetsData);
    render();
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId;
    })[0]

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--;
    }
    else {
        targetTweetObj.retweets++;
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    setData(tweetsData);
    render()
}

function handleReplyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

// Stretch Goal 1
// Allow personal replies to each Tweet
let repliedTweet = {}
function handleMyReplyClick(tweetId) {
    // Target the tweet that the reply button belongs to.
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId;
    })[0]

    // Prevent multiple replies from user.
    if (targetTweetObj.isReplied) {
        alert("You have already replied to this tweet!");
        return;
    }
    // Set the isReplied value
    targetTweetObj.isReplied = !targetTweetObj.isReplied;

    // Open the reply modal
    replyDialogContainer.classList.remove('hidden');
    repliedTweet = targetTweetObj;
    setData(tweetsData);
    render();
}

function handleSubmit() {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === repliedTweet.uuid;
    })[0]

    if (replyInput.value) {
        targetTweetObj.replies.unshift({
            handle: myHandle,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value,
        })

        setData(tweetsData);
        handleCloseDialog(false);
    }
    else {
        document.getElementById('error').classList.remove('hidden');
    }
}

function handleCloseDialog(cancel = true) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === repliedTweet.uuid;
    })[0];

    replyDialogContainer.classList.add('hidden');
    replyInput.value = '';

    if (cancel) {
        targetTweetObj.isReplied = !targetTweetObj.isReplied;
    }
    setData(tweetsData);
    repliedTweet = {};

    render()
}

function handleTweetBtnClick(tweetId) {

    const tweetInput = document.getElementById('tweet-input')

    if (tweetInput.value) {
        tweetsData.unshift({
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
        render()
        tweetInput.value = ''
    }
}

// Update data in local storage.
function setData(data) {
    window.localStorage.setItem("tweetsData", JSON.stringify(data));
}


function getFeedHtml() {
    let feedHtml = ``

    tweetsData.forEach(function (tweet) {

        let likeIconClass = ''
        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }

        let retweetIconClass = ''
        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }

        let myReplyIconClass = ''
        if (tweet.isReplied) {
            myReplyIconClass = 'replied'
        }

        let repliesHtml = ''

        if (tweet.replies.length > 0) {
            tweet.replies.forEach(function (reply) {
                repliesHtml += `
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
            })
        }

        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
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
                            
                            <span class="tweet-detail">
                                <i class="fa-solid fa-reply ${myReplyIconClass}"
                                data-my-reply="${tweet.uuid}"
                                ></i>
                            </span>
                            
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>   
            </div>
            `
    })
    return feedHtml
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()
