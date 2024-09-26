/////////////////////////////////////////////////////////////////////////////////////////////
// Classes and Functions
class QuestionGenerator {
  constructor(votes, answers, views, link, title, tags, date, time) {
    this.votes = votes;
    this.answers = answers;
    this.views = views;
    this.link = link;
    this.title = title;
    this.tags = tags;
    this.date = date;
    this.time = time;
  }

  generateQuestionHTML() {
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('question');

    const questionStats = document.createElement('div');
    questionStats.classList.add('question-stats');

    const votesStat = document.createElement('span');
    votesStat.classList.add('question-stat-item');
    votesStat.innerHTML = `<span class="question-votes">${this.votes}</span> votes`;
    questionStats.appendChild(votesStat);

    const answersStat = document.createElement('span');
    answersStat.classList.add('question-stat-item', 'question-number-of-answers-box');
    answersStat.innerHTML = `<span class="question-number-of-answers">${this.answers}</span> ${(this.answers == 1) ? "answer" : "answers"}`;
    questionStats.appendChild(answersStat);

    const viewsStat = document.createElement('span');
    viewsStat.classList.add('question-stat-item');
    viewsStat.innerHTML = `<span class="question-views">${this.views}</span> views`;
    questionStats.appendChild(viewsStat);

    questionContainer.appendChild(questionStats);

    const questionTitle = document.createElement('div');
    questionTitle.classList.add('question-title');
    questionTitle.innerHTML = `<a href="${this.link}" class="question-title">${this.title}</a>`;
    questionContainer.appendChild(questionTitle);

    const questionFooter = document.createElement('div');
    questionFooter.classList.add('question-footer');

    const questionTags = document.createElement('span');
    questionTags.classList.add('question-tags');

    for (const tag of this.tags) {
      const tagSpan = document.createElement('span');
      tagSpan.classList.add('tag');
      tagSpan.textContent = tag;
      questionTags.appendChild(tagSpan);
    }

    questionFooter.appendChild(questionTags);

    const questionDateTime = document.createElement('span');
    questionDateTime.classList.add('question-date-time');
    questionDateTime.textContent = `asked ${this.date} at ${this.time}`;
    questionFooter.appendChild(questionDateTime);

    questionContainer.appendChild(questionFooter);

    return questionContainer;
  }

  appendToQuestionsBox() {
    const questionsBox = document.querySelector('.questions-box');
    const questionHTML = this.generateQuestionHTML();
    questionsBox.appendChild(questionHTML);
  }
}

class AnswerGenerator {
  constructor(votes, link, title, tags, date, time) {
    this.votes = votes;
    this.link = link;
    this.title = title;
    this.tags = tags;
    this.date = date;
    this.time = time;
  }

  generateAnswerHTML() {
    const answerContainer = document.createElement('div');
    answerContainer.classList.add('answer');

    const answerStats = document.createElement('div');
    answerStats.classList.add('answer-stats');

    const votesStat = document.createElement('span');
    votesStat.classList.add('answer-stat-item');
    votesStat.innerHTML = `<span class="answer-votes">${this.votes}</span> votes`;
    answerStats.appendChild(votesStat);

    answerContainer.appendChild(answerStats);

    const answerTitle = document.createElement('div');
    answerTitle.classList.add('answer-title');
    answerTitle.innerHTML = `<a href="${this.link}" class="answer-title">${this.title}</a>`;
    answerContainer.appendChild(answerTitle);

    const answerFooter = document.createElement('div');
    answerFooter.classList.add('answer-footer');

    const answerTags = document.createElement('span');
    answerTags.classList.add('answer-tags');

    for (const tag of this.tags) {
      const tagSpan = document.createElement('span');
      tagSpan.classList.add('tag');
      tagSpan.textContent = tag;
      answerTags.appendChild(tagSpan);
    }

    answerFooter.appendChild(answerTags);

    const answerDateTime = document.createElement('span');
    answerDateTime.classList.add('answer-date-time');
    answerDateTime.textContent = `answered ${this.date} at ${this.time}`;
    answerFooter.appendChild(answerDateTime);

    answerContainer.appendChild(answerFooter);

    return answerContainer;
  }

  appendToAnswersBox() {
    const answersBox = document.querySelector('.answers-box');
    const answerHTML = this.generateAnswerHTML();
    answersBox.appendChild(answerHTML);
  }
}

class ReplyGenerator {
  constructor(replyType, replyTitle, replierUsername, replierProfilePicture, replyDate, replyTime, replyBody) {
    this.replyType = replyType;
    this.replyTitle = replyTitle;
    this.replierUsername = replierUsername;
    this.replierProfilePicture = replierProfilePicture;
    this.replyDate = replyDate;
    this.replyTime = replyTime;
    this.replyBody = replyBody;
  }

  generateReplyHTML() {
    const replyContainer = document.createElement('div');
    replyContainer.classList.add('reply');

    const replyHeader = document.createElement('div');
    replyHeader.classList.add('reply-header');

    const replyType = document.createElement('span');
    replyType.classList.add('reply-header-item', 'reply-type');
    replyType.textContent = this.replyType;
    replyHeader.appendChild(replyType);

    const expandCollapseIcon = document.createElement('img');
    expandCollapseIcon.classList.add('reply-header-item', 'expand-collapse-icon');
    expandCollapseIcon.src = './res/expand.png';
    expandCollapseIcon.alt = '(Show reply)';
    expandCollapseIcon.addEventListener('click', () => this.toggleReplyBody(expandCollapseIcon));
    replyHeader.appendChild(expandCollapseIcon);

    const replyTitle = document.createElement('a');
    replyTitle.classList.add('reply-header-item', 'reply-title');
    replyTitle.href = '#';
    replyTitle.textContent = this.replyTitle;
    replyHeader.appendChild(replyTitle);

    const replierInfo = document.createElement('span');
    replierInfo.classList.add('reply-header-item', 'replier-info');

    const replierProfilePicture = document.createElement('img');
    replierProfilePicture.classList.add('replier-info-item', 'replier-profile-picture');
    replierProfilePicture.src = this.replierProfilePicture;
    replierInfo.appendChild(replierProfilePicture);

    const replierUsername = document.createElement('a');
    replierUsername.classList.add('replier-info-item', 'replier-user-name');
    replierUsername.href = '#';
    replierUsername.textContent = this.replierUsername;
    replierInfo.appendChild(replierUsername);

    const replyDateTime = document.createElement('span');
    replyDateTime.classList.add('replier-info-item', 'reply-date-time');
    replyDateTime.textContent = this.replyDate + ' at ' + this.replyTime;
    replierInfo.appendChild(replyDateTime);

    replyHeader.appendChild(replierInfo);
    replyContainer.appendChild(replyHeader);

    const replyBody = document.createElement('div');
    replyBody.classList.add('reply-body');
    const lines = this.replyBody.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = document.createElement('span');
      line.textContent = lines[i];
      replyBody.appendChild(line);
    }
    replyContainer.appendChild(replyBody);

    return replyContainer;
  }

  toggleReplyBody(icon) {
    const replyBody = icon.parentNode.parentNode.querySelector('.reply-body');
    replyBody.classList.toggle('active');
  
    if (replyBody.classList.contains('active')) {
      icon.src = './res/collapse.png';
    } else {
      icon.src = './res/expand.png';
    }
  }  

  appendToRepliesBox() {
    const repliesBox = document.querySelector('.replies-box');
    const replyHTML = this.generateReplyHTML();
    repliesBox.appendChild(replyHTML);
  }

  sanitizeHTML(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent;
  }
}

function handleContainerClick(container, itemClass) {
  container.addEventListener('click', (event) => {
    if (event.target.classList.contains(itemClass)) {
      const clickedItem = event.target;
      const clickedItemContainer = document.getElementById(event.target.id + "-container");

      container.querySelectorAll('.' + itemClass).forEach(item => {
        item.classList.remove('active');
        document.getElementById(item.id + "-container").classList.remove('active');
      });

      clickedItem.classList.add('active');
      clickedItemContainer.classList.add('active');
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////
// Setting Menus
const menuBarContainer = document.querySelector('.menu-bar-container');
handleContainerClick(menuBarContainer, 'menu-bar-item');

const activityCategoriesContainer = document.querySelector('.activity-categories-container');
handleContainerClick(activityCategoriesContainer, 'activity-menu');

/////////////////////////////////////////////////////////////////////////////////////////////
// Getting Data

// ek Javascript objects ki array hogi usme se for loop use krke ye sb generate hoga i.e.

// NEED: JSON array of questions by the user from database
// EXAMPLE:
let questions = [
  {
    'votes': 20,
    'answers': 5,
    'views': 100,
    'link': "#",
    'title': "Where is he?",
    'tags': ['Support', 'Serious'],
    'date': '21 May, 2023',
    'time': '13:58'
  },
  {
    'votes': 100,
    'answers': 1,
    'views': 1234501,
    'link': "#",
    'title': "Et tu Brute?",
    'tags': ['Old', 'Firenze'],
    'date': '15 March, 44 BC',
    'time': '13:58'
  },
]

// NEED: JSON array of questions answered by the user from database
// EXAMPLE:
let answers = [
  {
    'votes': 200,
    'link': "#",
    'title': "What is life?",
    'tags': ['Support', 'Serious'],
    'date': '21 May, 2023',
    'time': '14:13'
  },
  {
    'votes': 108,
    'link': "#",
    'title': "Why bats are great?",
    'tags': ['Bats', 'Animals'],
    'date': '21 May, 2023',
    'time': '14:54'
  },
]

// NEED: JSON array of replies to the user from database
// EXAMPLE:
let replies = [
  {
    'type': 'answered',
    'title': 'Et tu Brute?',
    'username': 'Marcus Junius Brutus',
    'profilepicture': './res/pfp.png',
    'date': '15 March, 44 BC',
    'time': '13:59',
    'body': 'Yes,\nme too Caesar!'
  },
  {
    'type': 'comment',
    'title': 'Where is he?',
    'username': 'Clark Kent',
    'profilepicture': './res/pfp.png',
    'date': '21 May, 2023',
    'time': '14:02',
    'body': 'Who?'
  },
  {
    'type': 'answered',
    'title': 'Where is he?',
    'username': 'Alfred Pennyworth',
    'profilepicture': './res/pfp.png',
    'date': '21 May, 2023',
    'time': '14:03',
    'body': 'He is somewhere around the subway'
  }
]

// Total questions, answers, and replies
const questionsCount = questions.length;
const answersCount = answers.length;
const repliesCount = replies.length;

/////////////////////////////////////////////////////////////////////////////////////////////
// Generating menu items

questions.forEach(question => {
  let currentQuestion = new QuestionGenerator(question.votes, question.answers, question.views, question.link, question.title, question.tags, question.date, question.time);
  currentQuestion.appendToQuestionsBox();
});

// Generating answers and appending them to the answer box :)
answers.forEach(answer => {
  let currentAnswer = new AnswerGenerator(answer.votes, answer.link, answer.title, answer.tags, answer.date, answer.time);
  currentAnswer.appendToAnswersBox();
});

// Generating replies and appending them to the replies box :)
replies.forEach(reply => {
  let currentReply = new ReplyGenerator(reply.type, reply.title, reply.username, reply.profilepicture, reply.date, reply.time, reply.body);
  currentReply.appendToRepliesBox();
});

// Generating heading i.e.: x Questions, y Answers, z Replies
document.getElementById('number-of-questions').innerText = `${questionsCount} ${(questionsCount == 1) ? 'Question' : 'Questions'}`;
document.getElementById('number-of-answers').innerText = `${answersCount} ${(answersCount == 1) ? 'Answer' : 'Answers'}`;
document.getElementById('number-of-replies').innerText = `${repliesCount} ${(repliesCount == 1) ? 'Reply' : 'Replies'}`;