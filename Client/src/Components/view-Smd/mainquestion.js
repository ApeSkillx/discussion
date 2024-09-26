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
import Cookies from 'js-cookie';

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

  const downloadanswer = (e) => {
    Axios({
      url: `/A_download/${e}`,
      method: 'GET',
      responseType: 'blob',
    }).then((resp) => {
      FileDownload(resp.data, 'file.pdf');
    });
  };

  const userData = Cookies.get('auth')
  let auth = ''
  if (userData) {
    const data = userData.split(',')
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

    if (files.size / 1024 > 5120 || files.type.split('/').pop() !== 'pdf') {
      setBthidden(true);
      setError('Please upload file as per the specified criteria');
    } else {
      setError('');
      setBthidden(false);
      setFile(event.target.files[0]);
    }
  };

  /***********************************************/

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
      setError('Please fill in the Body Part');
      setLoading(false);
    } else {
      if (window.confirm('Please click to confirm Comment')) {
        Axios.post('/Answer', data).then((res) => {
          if (res) {
            toast.success('Comment Successful');
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
      FileDownload(resp.data, 'file.pdf');
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
            <button>Ask Question</button>
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
                <small></small>
                <div className="auth-details">
                  <Avatar />
                  <p>{String(detail?.auth).split('@')[0]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id='write-new-answer'>
          <div className={enable ? "icon-reply" : "icon-reply red-colored"} onClick={() => reply()}>
            {enable ? <ReplyAllIcon /> : <CancelIcon />}
            <p>{enable ? "Answer" : "Cancel"}</p>
          </div>
          <div className="answer" hidden={enable}>
            <div className="main-answer">
              <h3>You can Answer</h3>
              <ReactQuill
                theme="snow"
                value={body}
                onChange={handleQuill}
                className="react-quill"
                style={{ height: '200px' }}
              />
            </div>
            <div className="file-attach">
              <h3>Attach file (only PDF with 5 MB)</h3>
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
              {loading ? 'Commenting...' : 'Post Comment'}
            </button>
            {error !== '' && (
              <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>
            )}
          </div>
        </div>
        <div className="all-questions">
          <p>Number of Comments: {answerdata?.length}</p>
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

  // NEED: Replies from database
  const replies = [
    {
      _id: "someId",
      replied_to: "64d0de75d3fd477d8c5bb3db",
      // replied_to: "64c655f8c747dc4a4638aa95",
      body: "This is reply body text",
      auth: "Author of this reply",
      created_at: "2023-07-26T17:49:54.625+00:00",
      replies: [
        // Nested replies for the first reply (if any)
        {
          _id: "nestedReplyId1",
          replied_to: "someId", // ID of the parent reply
          body: "This is a nested reply",
          auth: "Author of the nested reply",
          created_at: "2023-07-26T17:49:54.625+00:00",
          replies: [
            {
              _id: "nestedReplyId11",
              replied_to: "nestedReplyId1", // ID of the parent reply
              body: "This is a nested reply",
              auth: "Author of the nested reply",
              created_at: "2023-07-26T17:49:54.625+00:00",
              replies: [] // More nested replies can be added here
            }
          ] // More nested replies can be added here
        },
        {
          _id: "nestedReplyId1",
          replied_to: "someId", // ID of the parent reply
          body: "This is a nested reply",
          auth: "Author of the nested reply",
          created_at: "2023-07-26T17:49:54.625+00:00",
          replies: [] // More nested replies can be added here
        },
      ],
    },
    {
      _id: "someOtherId",
      replied_to: "64d0de84d3fd477d8c5bb3e3",
      body: "This is another reply",
      auth: "Author of this reply",
      created_at: "2023-07-26T17:49:54.625+00:00",
      replies: [],
    },
  ];

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
      currentUserEmail = userData.split(',')[0];
    }
    else {
      setLoadingReply(false);
      // return Promise.reject('Cannot get userdata from cookies');
      return;
    }

    // NOTE: you might want to convert this to js FormData()
    const data = {
      replied_to: [resp._id],
      body: bodyReply,
      auth: currentUserEmail,
      created_at: new Date(),
      replies: []
    }

    if (!bodyReply) {
      setErrorReply('Please fill in the Body Part');
      setLoadingReply(false);
    } else {
      if (window.confirm('Please click to confirm Reply')) {
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
          {parse(resp.body)}
          <div className="answer-reply-buttons">
            {
              resp.comments.length>=1 &&
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
            <small>on {new Date(resp?.created_at).toLocaleString().replace(/,/g, ' at ')}</small>
            <div className="auth-details">
              <Avatar />
              <p>{String(resp?.auth).split('@')[0]}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        id={"write-reply-to-" + resp._id}
        className={enableReply ? "write-reply-box" : "write-reply-box active"}
      >
        {/* Reply Here :D */}
        <div className="answer">
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
          <div className="file-attach">
            {/* <h3>Attach file (only PDF with 5 MB)</h3>
            <input
              label="File upload"
              type="file"
              name="file"
              onChange={handleReplyFileChange}
              placeholder="Select file..."
            /> */}
          </div>
          <button
            hidden={bthiddenReply}
            onClick={replyToAnswer}
            style={{
              margin: '10px 0',
              maxWidth: 'fit-content',
            }}
          >
            {loadingReply ? 'Replying...' : 'Post Reply'}
          </button>
          {errorReply !== '' && (
            <p style={{ color: 'red', fontSize: '14px' }}>{errorReply}</p>
          )}
        </div>
      </div>
      {resp.comments.length>=1 && 
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
