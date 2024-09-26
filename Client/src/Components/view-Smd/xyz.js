import React, { useState, useEffect } from 'react'
import Axios from 'axios';


export default function  Home ()
{

    const question_id = '64be01c659426e6720e466fd'

    const [comments, setComments] = useState('');

  useEffect(() => {
    async function getAnswerDetails() {
      await Axios.get(`/Answer-detail/${question_id}`)
        .then((resp) => {
          setComments(resp);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getAnswerDetails();
  }, []);

  const onComment = (newComment)=>{

    const body = newComment.body

    console.log(body)
    
    Axios.post('/Answer', {body,question_id}).then((res) => {
        if (res) {

            console.log(res)
        //   toast.success('Comment Successful');
        //   window.location.reload(false);
        }
      });
        

  }
 

    return(
        <div className="">

        <span className=''>
        React Nested comment
        </span>      
        
        <CommentInput onComment={onComment} />


        <div>
          {
            comments.data?.map((comment)=>
            (
               <CommentItem comment={comment}/>
            )
        
            )

          }
          
                    
        </div>
         </div>
    ) 
}

const CommentItem = ({comment}) =>{

    const [isReplying, setIsReplying]=useState(false)

    const onComment = (newComment)=>{

       const body = newComment.body

       
       
    }

    return (
        <div><span>{comment.body}</span>
       
        {
          isReplying ? (<button onClick={ ()=> setIsReplying(false)}>Cancel</button>) : (<button onClick={ () => setIsReplying(true)}>Reply</button>)
        }
        {
          isReplying &&
          (<CommentInput onComment={onComment}/>)
          }
          {
        // comments.map((comment)=>
        // (
        //    <CommentItem comment={comment}/>
        // )
    
        // )
      }
        </div>

    )
   
}

interface CommentInputProps {
    onComment:(newComment: Comment) => void
  }

const CommentInput = ({onComment}: CommentInputProps) =>{

   
    const [body, setBody] = useState('')

    return(
        <div>
             <input type="" value={body} onChange={event => setBody(event.target.value)} />
        
        <button onClick={()=>{onComment({body: body})}}>Comment</button>

        </div>
       
    )
    
}