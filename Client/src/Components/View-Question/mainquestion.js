import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import parse from 'html-react-parser';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import FileDownload from 'js-file-download';
import Axios from 'axios';
import { Document, Page, PDFViewer } from '@react-pdf/renderer';
import Reply from './Reply';
import './index.css';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HistoryIcon from '@mui/icons-material/History';
import { Avatar } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CancelIcon from '@mui/icons-material/Cancel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CryptoJS from 'crypto-js'
import Cookies from 'js-cookie';
import Filter from 'bad-words'
import { Tooltip } from '../sidebar/Tooltip'
const words = require('../Ask-Question/extra-words.json')

const Mainquestion = (details) => {
  const navigate = useNavigate();
  let detail = details.details;
  const question_id = detail._id;

  /**********Comment Fetch through question id***********/

  const [answerdata, setAnswerData] = useState();

  useEffect(() => {
    async function getAnswerDetails() {
      await Axios(`/Answer-detail/${question_id}?`)
        .then((resp) => {
          setAnswerData(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getAnswerDetails();
  }, []);

  /*******************************************************/

  /**********************Answer Attachment download******************************/

  const userData = Cookies.get('auth')
  let auth = ''
  if (userData) {

    var bytes = CryptoJS.AES.decrypt(Cookies.get('auth'), 'secret key 123');
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    auth = data[0]
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState('');
  const [bthidden, setBthidden] = useState(false);
  const handleQuill = (value) => {
    setBody(value);
  };

  /*************code Handle the file uploading file*******************/
  const handleFileChange = (event) => {
    event.preventDefault();

    const files = event.target.files[0];

    const cancelFile = (event) =>{
      setError('');
      setBthidden(false);
      setFile(event.target.files[0]);
    }

    if(files == undefined) {      
      cancelFile(event)
      return
    } 
    else if (files.size / 1024 >10240) {
      setBthidden(true);
      setError('File should be less than 10MB');
    }
    else if(!files.type.split('/').pop().match('jpeg')&&!files.type.split('/').pop().match('pdf')&&!files.type.split('/').pop().match('mp4')&&!files.type.split('/').pop().match('mp3')&&!files.type.split('/').pop().match('mpeg')&&!files.type.split('/').pop().match('png'))
    {
      setBthidden(true);
      setError('Please upload file with parameters');      
    }   
    else {
      cancelFile(event)
    } 

    // if (files.size / 1024 > 5120 || files.type.split('/').pop() !== 'pdf') {
    //   setBthidden(true);
    //   setError('Please upload file as per the specified criteria');
    // } else {
    //   setError('');
    //   setBthidden(false);
    //   setFile(event.target.files[0]);
    // }
  };

  /***********************************************/
  /***********Bad Words****************/

  const filter = new Filter({ replaceRegex: /[A-Za-z0-9가-힣_]/g })
  filter.addWords(...words)
  /************************************/

  /* Handle the answer button for Comment */
  const answer = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    data.append('file', file);
    data.append('body', body);
    data.append('auth', auth);
    data.append('question_id', question_id);

    if (!body) {
      setError('Please fill in the Reply Box');
      setLoading(false);
    }
    else if (filter.isProfane(body) == true) {
      setError('You Should Remove bad words from Reply box');
      setLoading(false);
    }
    else {
      if (window.confirm('Please click to confirm Reply')) {
        Axios.post('/Answer', data).then((res) => {
          if (res) {
            toast.success('Reply Successful');
            window.location.reload(false);
          }
        });
      }
    }
  };

  /***********************************/

  // Reply button code for hide and unhide
  const [enable, setEnable] = useState(true);
  const reply = () => {
    if (enable === true) {
      setEnable(false);
    } else if (enable === false) {
      setEnable(true);
    }
  };

  // Here's the code for downloading Post Attachment
  const download = (e) => {
    Axios({
      url: `/Q_download/${e}`,
      method: 'GET',
      responseType: 'blob',
    }).then((resp) => {

      const file = resp.data.type.split('/')

      FileDownload(resp.data, `file.${file[1]}`);
    });
  };

  /***********************************/
  return (
    <div className="main">
      <div className="main-container">
        <div className="main-top">
          <h2 className="main-question">{detail?.title}</h2>
          <h2 className="main-question"></h2>
          <NavLink to="/add-question">
            <button>Create Post</button>
          </NavLink>
        </div>
        <div className="main-desc">
          <div className="info">
            <p>on {new Date(detail?.created_at).toLocaleString().replace(/,/g, ' at ')}</p>
            {
              detail.file ?
                <a onClick={(e) => download(detail._id)}>
                  <FileDownloadIcon />
                </a>
                :
                <></>

            }


          </div>
        </div>
        <div className="all-questions">
          <div className="all-questions-container">
            <div className="question-answer">
              <p>{parse(detail.body)}</p>

              <div className="author">

                <div className="auth-details view-question-auth-details">
                  <Tooltip text={detail?.auth}>
                    <Avatar />
                    <p className='material-symbols-outlined'>{String(detail?.auth).split('@')[0]}</p>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id='write-new-answer'>
          <div className={enable ? "icon-reply" : "icon-reply red-colored"} onClick={() => reply()}>
            {enable ? <ReplyAllIcon /> : <CancelIcon />}
            <p>{enable ? "Reply" : "Cancel"}</p>
          </div>
          {!enable && <div className="answer" hidden={enable}>
            <div className="main-answer">
              <h3>You can Reply</h3>
              <ReactQuill
                theme="snow"
                value={body}
                onChange={handleQuill}
                className="react-quill"
                style={{ height: '200px' }}
              />
            </div>
            <div className="file-attach">
              <h3>Attach file&nbsp;(pdf,jpeg,png,mp4,mp3,mpeg extention file allowed with 10 MB size)</h3>
              <input
                label="File upload"
                type="file"
                name="file"
                onChange={handleFileChange}
                placeholder="Select file..."
              />
            </div>
            <button
              hidden={bthidden}
              onClick={answer}
              style={{
                margin: '10px 0',
                maxWidth: 'fit-content',
              }}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            {error !== '' && (
              <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>
            )}
          </div>}
        </div>
        <div className="all-questions">
          <p className="number-of-reply-text" style={{ 'font-size': 'medium', 'margin-bottom': '0px' }}>Number of replies: {answerdata?.length}</p>
          <div className="comments-container">
            {answerdata?.map((resp) => (
              <Comment key={resp._id} data={resp} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function Comment(props) {
  const resp = props.data;

  /***********************************/
  // Code for replies
  const [loadingReply, setLoadingReply] = useState(false);
  const [errorReply, setErrorReply] = useState('');
  const [bodyReply, setBodyReply] = useState('');
  const [fileReply, setFileReply] = useState('');

  const [bthiddenReply, setBthiddenReply] = useState(false);

  const handleQuillReply = (value) => {
    setBodyReply(value);
  };

  const [enableReply, setEnableReply] = useState(true);
  function replyToReplyToggle() {
    setEnableReply(!enableReply);
  };

  const [showReplies, setShowReplies] = useState(false);
  function toggleReplies() {
    setShowReplies(!showReplies);
  }

  function handleReplyFileChange() {
    // Handle reply's file change here
  }

  const replyToAnswer = async (e) => {
    e.preventDefault();
    setLoadingReply(true);

    const userData = Cookies.get('auth');
    let currentUserEmail;
    if (userData) {

      var bytes = CryptoJS.AES.decrypt(Cookies.get('auth'), 'secret key 123');
      currentUserEmail = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))[0];
    }
    else {
      setLoadingReply(false);
      // return Promise.reject('Cannot get userdata from cookies');
      return;
    }

    // NOTE: you might want to convert this to js FormData()
    const data = {
      replied_to: [resp._id],
      question_id: resp.question_id,
      body: bodyReply,
      auth: currentUserEmail,
      created_at: new Date(),
      replies: []
    }
    const filter = new Filter({ replaceRegex: /[A-Za-z0-9가-힣_]/g })
    filter.addWords(...words)

    if (!bodyReply) {
      setErrorReply('Please fill in the Reply Box');
      setLoadingReply(false);
    }
    else if (filter.isProfane(bodyReply) == true) {
      setErrorReply('You Should Remove bad words from Reply Box');
      setLoadingReply(false);
    }
    else {
      if (window.confirm('Please click to Reply Reply')) {
        Axios.patch(`/Answer-reply/${resp._id}`, data).then((res) => {
          if (res) {
            toast.success('Reply Successful');
            // setLoadingReply(false);
            window.location.reload(false);
          }
        });
      }
    }
  };

  const downloadanswer = (e) => {
    Axios({
      url: `/A_download/${e}`,
      method: 'GET',
      responseType: 'blob',
    }).then((resp) => {
      const file = resp.data.type.split('/')
      FileDownload(resp.data, `file.${file[1]}`);
    });
  };

  /***********************************/
  return (
    <div className="comment" key={resp._id}>
      <div className="all-questions-container">
        <div className="all-questions-left">
          <div className="all-options">
            <p className="arrow">▲</p>
            <p className="arrow">0</p>
            <p className="arrow">▼</p>
            <BookmarkIcon />
            <HistoryIcon />
          </div>
        </div>
        <div className="question-answer">
          <div className="question-answer-body">
            {parse(resp.body)}
          </div>
          <div className="answer-reply-buttons-and-author">
            <div className="answer-reply-buttons">
              {
                resp.comments.length >= 1 &&
                <small
                  className="answer-reply-button"
                  onClick={() => toggleReplies()}
                >
                  {showReplies ? "Hide replies" : "Show replies"}
                </small>
              }
              <small
                className="answer-reply-button"
                onClick={() => { replyToReplyToggle() }}
              >
                Reply</small>
            </div>
            <div className="author">
              {resp?.file ? (
                <a onClick={(e) => downloadanswer(resp?._id)}>
                  <AttachFileIcon />
                </a>
              ) : (
                <></>
              )}
              <div className="auth-details">
                <Tooltip text={resp?.auth}>
                  <Avatar />
                  <p className='material-symbols-outlined'>{String(resp?.auth).split('@')[0]}</p>
                </Tooltip>
              </div>
              <small>on {new Date(resp?.created_at).toLocaleString().replace(/,/g, ' at ')}</small>
            </div>
          </div>
        </div>
      </div>
      <div
        id={"write-reply-to-" + resp._id}
        className={enableReply ? "write-reply-box" : "write-reply-box active"}
      >
        {/* Reply Here :D */}
        <div className="answer comment-answer">
          <div className="main-answer">
            <h3>You can Reply</h3>
            <ReactQuill
              theme="snow"
              value={bodyReply}
              onChange={handleQuillReply}
              className="react-quill"
              style={{ height: '200px' }}
            />
          </div>
          <button
            hidden={bthiddenReply}
            onClick={replyToAnswer}
            style={{
              margin: '10px 0',
              maxWidth: 'fit-content',
            }}
          >
            {loadingReply ? 'Replying...' : 'Reply'}
          </button>
          {errorReply !== '' && (
            <p style={{ color: 'red', fontSize: '14px' }}>{errorReply}</p>
          )}
        </div>
      </div>
      {resp.comments.length >= 1 &&
        <div
          id={"replies-to-" + resp?._id}
          className={`replies-container ${showReplies ? "active" : ""}`}
        >
          {
            resp.comments.map((reply) => {
              return (
                <Reply
                  key={reply._id}
                  id={reply._id}
                  question_id={resp.question_id}
                  replied_to={reply.replied_to}
                  body={reply.body}
                  auth={reply.auth}
                  replies={reply.replies}
                  created_at={reply.created_at}
                />
              )
            })
          }
        </div>
      }
    </div>
  )
}

export default Mainquestion;
