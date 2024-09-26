import React, {useState,useEffect} from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // quill css 
import './question.css'
import axios from 'axios'
import Filter from 'bad-words'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js'
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Select from 'react-dropdown-select'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const words = require('./extra-words.json')


const Question = () => {  

  const navigate = useNavigate()

  const userData = Cookies.get('auth')
  let auth =''
  if(userData)
  {
    var bytes  = CryptoJS.AES.decrypt(Cookies.get('auth'), 'secret key 123');
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));    
    auth = data[0]  
  }
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  
  const [title, setTitle] =useState('')
  const [smdid, setSmdid] = useState('')
  const [tempsmdid, setTempsmdid] = useState('') 
  const [institute, setInstitute]= useState([])
  const [Imember, setImember] = useState('')
  const [Imembers, setImembers] = useState('')
  const [sub, setSub] = useState('')
  const [subject, setSubject] = useState([])
  const [subjectid, setSubjectid] = useState([])
  const [smd, setSmd] = useState('')
  const [smd1,setSmd1] = useState('')
  const [groupidd,setGroupidd] = useState('')
  const [body, setBody] = useState('')
  const [file,setFile] = useState('')
  const [user, setUser] = useState('')
  const [members, setMembers]= useState('')
  const [member, setMember] = useState([])
  const [bthidden, setBthidden] = useState(false);
  const [gStatus, setGStatus]= useState(true)
  const [mStatus, setMstatus] = useState(true)
  const handleQuill = (value,editor) => {
      setBody(value) 
      const text = value.replace(/<\/?[^>]+(>|$)/g, ''); // Remove HTML tags
      const words = text.split(/\s+/).filter(word => word.length > 0); 
      if (words.length <151) {
        setBody(value);
      } else {
        // If the limit is exceeded, trim the content
        const trimmedContent = words.slice(0,150).join(' ');
        setBody(trimmedContent);
      }  

    }  

/*********  Words Count for body & title part   ***********/
    var text = body.replace(/<[^>]*>/g,'')
              
    text=text.trim();
    let word = text.split(' ')
   
    let clearList =word.filter((function(elm){
      return elm != '';    }))

      /*Count for Title*/   

    var t_text = title.trim()
    let t_word = t_text.split(' ')
    let t_clearList = t_word.filter((function(element){
      return element != ''
    }))

    let t_char = t_clearList.length
    
    if(t_char)
    {
      const ip = document.getElementById('val')
      const maxString = 25

      ip.addEventListener('keypress', (e)=>{
            if(t_char>maxString)
            {   
              e.target.value = t_clearList.slice(0,25).join(' ')           
              t_char= ''       

              return  
            }             
      })

    }         

    /***************************************/    

  useEffect(()=>{
   /************This is *************/
      
        let userDetails = new Promise (async(resolve,reject)=>{
          const response =  await axios.get(`/main_G/${auth}`)
          resolve(response.data)
        })
        userDetails.then(
            async function(value)
            {     

            if(value.status === 1)
            {              
              const M_Data = await axios.get('/user-group',{params:{id_1:value.Divisionid,id_2:auth}})        
            
              setGroupidd(value)
              setSubjectid(value.Divisionid)                          
              setMembers(M_Data.data.rsp)
              setUser(M_Data.data.resp.name)                                       

            }
            else if(value.status === 2)
            {                  
              const M_Data = await axios.get('/user-group',{params:{id_1:value.Divisionid,id_2:auth}})            
              setGroupidd(value)                                                   
              setMembers(M_Data.data.rsp)
              setUser(M_Data.data.resp.name)              

              const response =  await axios.get('/smd-group',{params:{id_1:value.Smdid}})            
              setSubject(response.data.rsp)
              setSmd(response.data.resp)                
              setTempsmdid(response.data.resp._id)              
              if(response.data.resp.division.length == 0)
              {
                setHSmd(false)
              }                
            }
            else
            {
              const M_Data = await axios.get('/user-group',{params:{id_1:value.Divisionid,id_2:auth}})            
              setGroupidd(value)                                                   
              setMembers(M_Data.data.rsp)
              setUser(M_Data.data.resp.name)
              const Smd_data = await axios.get('/smddetail')
              setSmd(Smd_data.data)

              const Smd_data1 = await axios.get('/smddetail1')
              setSmd1(Smd_data1.data)

            }
      
            },
            function(error)
            {
              console.log(error)
            }
          )

    }, [])    

  
   const handleFileChange = (event) => {                
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
    };  

    const add_question = async(e) => {
      
    e.preventDefault() 
    setLoading(true)

    const filter = new Filter({ replaceRegex:  /[A-Za-z0-9가-힣_]/g })
    filter.addWords(...words)

    const data = new FormData()
      
    data.append('file', file)
    data.append('title',title)
    data.append('body',body)
    data.append('auth',auth)
    data.append('institutes',institute)   
    data.append('Imembers',Imember)
    data.append('Members', member)
    data.append('smdids',smdid)
    data.append('subject',sub)
    
    console.log(title)
    
    if(!title || !body)
      {       
        setError("Something missing");
        setLoading(false);
      }
      else if (filter.isProfane(title) == true)
      {
        setError('You Should Remove bad words from Title');
        setLoading(false);
      }
      else if (filter.isProfane(body) == true)
      {
        setError('You Should Remove bad words from body');
        setLoading(false);
      }      
      else if (t_clearList.length > 25)
      {      
      setError("You Should write only 25 Word in Title");
      setLoading(false);
      }
      else if(clearList.length >150)
      {
        setError("You Should write only 150 Word in Body");
      setLoading(false);
      } 
                          
     
      else
      {
        if(hsubject == false || groupidd.status == 1)
        {
           if(member.length<1)
        {
          setError("Please Select the Group Member");
          setLoading(false);
        } 
        else
        {               
        if(window.confirm('Please confirm for Post'))
        {       
          try {
            axios.post("/Question",data).then(res => {  
                
                  toast.success('Post uploaded sucessfully')
                  navigate('/')
                  setLoading(false)
  
                })
          }
          catch (err) {
            console.log(err)
            setLoading(false);
          }
          
        }
        else 
        {
          setLoading(false);
        }
        }


        }
        else if(hinstitute == false)
        {          
          if(institute.length<1)
          {
            setError("Please Select the Institute");
          setLoading(false);
          }
          else if(Imember.length<1)
          {
            setError("Please Select the Member");
            setLoading(false);
          }
          else
          {
            if(window.confirm('Please confirm for Post'))
        {       
          try {
            axios.post("/Question",data).then(res => {
  
                
                  toast.success('Post uploaded sucessfully')
                  navigate('/')
                  setLoading(false)
  
                })
          }
          catch (err) {
            console.log(err)
            setLoading(false);
          }
          
        }
        else 
        {
          setLoading(false);
        }


          }
          
        }
        else if (hsmd == false)
        {
       
          if(!smdid)
          {
            setError("Please Select the SMD");
            setLoading(false);
          }     
          else
          {
            setError('')
            if(window.confirm('Please confirm for Post'))
        {       
          try {
            axios.post("/Question",data).then(res => {  
                
                  toast.success('Post uploaded sucessfully')
                  navigate('/')
                  setLoading(false)
  
                })
          }
          catch (err) {
            console.log(err)
            setLoading(false);
          }
          
        }
        else 
        {
          setLoading(false);
        }
          }          
        }
        else
        {
          setError("Please Select the Option");
          setLoading(false);          
        }     
   
      }
    }    
   /**************Handle user Regarding the Subjects **************/ 
     
   const groupMember= (e)=>{
        const val = e.target.value       
        if(val == '')
        {
          setGStatus(true)
          setMember([])          
        }
        else if(val == 0)
        {         
          setError(" ");            
          setGStatus(true)
          setSub('')
          setMember([])          
          setMember(subjectid)      
        }
        else if(val == 1)
        {
          setSub(subjectid)
          setError(" "); 
          setMember([])
          setGStatus(false)
        }
       
  }
 
  const handleMember = (e,members,removeOption) =>{   
    let membersEmail = []
    members.filter(function name(obj) {
      membersEmail.push(obj.email);
    })
    setImember(membersEmail)    
   }



   const handleMemberForPrincipelSci = (e,members,removeOption) =>{   
    
    let membersEmail = []
    members.filter(function name(obj) {
      membersEmail.push(obj.email);
    })
    setMember(membersEmail)    
   }

  //  console.log(member,subjectid)
  

   const [selectMember , setSelectMember] = useState('')
 

   const get_Instsitute = (e)=>{   
  const val = e.map((resp)=>(resp._id)) 
  setInstitute(val)
   setImember(val)  
   }    
     
   const Select_Member = (e)=>{

      setSelectMember(e.target.value)

      const Ssubject = e.target.value
      setMember([])
      setImember([])
      setInstitute([])

      if(Ssubject == '')
      {        
        setMember([])
        setImember([])

      }
      else if(Ssubject == 1)
      {      

        let val = []
        for(let i=0;i<subject.length;i++)
        {          
          val.push(subject[i]._id)           
        }
        setSmdid(smdid)       
        setImember(val)        
        setInstitute(val)

      }
      else if(Ssubject == 2)
      {      
        
      }
      else if(Ssubject == 3)
      {
        setImember([])  
        setSmdid('')   
      }

   }

   const [hsubject, setHsubject] = useState(true)
   const [hinstitute, setHInstitute] = useState(true)
   const [hsmd, setHSmd] = useState(true)
   const Select_Type = (e)=>{
    

    
    if(e.target.value == 1)
    {
      setSmdid('')  
      setHsubject(false)
      setHInstitute(true)
      setSubjectid(groupidd.Divisionid)      
    }
    else if(e.target.value == 2)
    { 
      if(hsmd == false)
      {
      setSmdid(tempsmdid)
      setHInstitute(true)
      setHsubject(true)
      setSubjectid('')
      }
      else
      {
        setSmdid(tempsmdid)
        setHInstitute(false)
        setHsubject(true)
        setSubjectid('')
      }
     
    }
    else
    {
      setHInstitute(true)
      setHsubject(true)
      setSmdid('')
      setSubjectid('')
      setImember([])
      setInstitute([])
    }

   }

   const handleSubject = async (e) =>{     
    
    const id = e.target.value 
    
    if(e.target.value == '')
    {    
      setMstatus(true)
    }
    else 
    {             
          const user = await axios.get('/user-group-institute',{params:{id_1:id,id_2:auth}}) 
          setMstatus(false)        
          setInstitute(user.data.resp._id) 
          setImembers(user.data.rsp)
    }
   }  
  
  /*************SMD's and Subject selection for Special Rights****************/ 
 
 const Select_Type1 = (e)=>{
    
  if(e.target.value == 1)
  {
    setHsubject(false)
    setHInstitute(true)
    setHSmd(true)
    setSubjectid(groupidd.Divisionid)
    setSmdid('')  
    setImember([])
    setInstitute([])    
  }
  else if(e.target.value == 2)
  {    
    setHSmd(false)
    setHInstitute(true)
    setHsubject(true)
    setSubjectid('')
  }
  else
  {
    setHInstitute(true)
    setHsubject(true)
    setHSmd(true)
    setSmdid('')
    setSubjectid('')
    setImember([])
    setInstitute([])
  }

 }

 const [selectSmd, setSelectSmd] = useState('')
 const Select_SMD = async(e)=>{ 

    setSmdid('')
    setSubjectid('')
    setImember([])
    setInstitute([])
    setHInstitute(true)    
  setSelectSmd(e.target.value)
    if(e.target.value == 1)
    {
      const inst_data = await axios.get('/institute')
      let smdData = []
      let instData = []
      for(let i=0;i<smd.length;i++)
      {
        smdData.push(smd[i]._id)
      }
    setSmdid(smdData)
     
      for(let i=0;i<inst_data.data.length;i++)
      {
        instData.push(inst_data.data[i]._id)
      }
    setInstitute(instData)
    setImember(instData)      
      
      
    }  
    else if(e.target.value == 2)
    {
      console.log('Multiple SMD Selection')
    }
    else if(e.target.value == 3)
    {
      console.log('Specific SMD Selection')
    }
    else
    {
    setSmdid('')
    setSubjectid('')
    setImember([])
    setInstitute([])
    }

 }

 const get_Smd = async(e)=>{   
  const val = e.map((resp)=>(resp._id))
  let inst =[]
  if(val.length>0)
  {
    
    const int_data = await axios.get(`/Smdid/${val}`)

    for(let i=0;i<int_data.data.length;i++)
    {
      let len = int_data.data[i].division
      
      for(let j=0;j<len.length;j++)
      {
        inst.push(len[j]) 
      }

    }
    setSmdid(val)
    setInstitute(inst)
    setImember(inst)

    }

    else
    {
      setSmdid()
      setInstitute([])
      setImember([])

    }
   }
   
 const handleSmd = async(e)=>{

  setInstitute([])
  setImember([])
  setHInstitute(true)
  setSelectMember('')
  
  if(!e.target.value)
  {
    setHInstitute(true)
  }
  else
  {    
    const response =  await axios.get('/smd-group',{params:{id_1:e.target.value}})            
                setSubject(response.data.rsp)
                setSmdid(e.target.value)                
                setTempsmdid(response.data.resp._id)   
                setHInstitute(false)

  }

 }  

//  console.log('SMD:'+smdid)

//  console.log('Institute:'+institute)

//  console.log('Imember:'+Imember)
  /*****************************************************************************/
   
  return (
   
    <div className='add-question'>
      <div className='add-question-container'>
      <div className='head-title'>
        <h1>Create a Post</h1>
      </div>
      <div className='question-container'>
        <div className='question-options'>
         <div className='question-option'>
          <div className='title'>
            <h3>Title&nbsp;(Max 25 Words Allowed)<sup style={{color: "red"}}>&nbsp;*</sup></h3>
            <small></small>            
          <input type="text" id='val' onPaste={(e)=>{e.preventDefault()}} value={title} onpaste={false}  onChange={(e)=> setTitle(e.target.value)}
           
              placeholder='Add the question title' />
          <p>
              <span dangerouslySetInnerHTML={{__html:t_char}}>
                </span>&nbsp;words
             </p>
          </div>
        </div>
          <div className='question-option'>
          <div className='body'>
            <h3>Body&nbsp;(Max 150 Words Allowed)<sup style={{color: "red"}}>&nbsp;*</sup></h3>
            <small></small>
             <ReactQuill value={body} id='val1'         
      contextMenuHidden={true} onChange={handleQuill} className='react-quill'theme='snow'/>
             <p>
              <span dangerouslySetInnerHTML={{__html:clearList.length}}>
                </span>&nbsp;words
             </p>
             </div>             
        </div>
        <div className='question-option'>
          <div className='group'>
            
            {groupidd.status === 1 ?
            <>
             <h3>
                Your Main Discipline is : {user}
              </h3>           

            </>
            :
            groupidd.status === 2 ?  
            <>
                <h3>
                 Your SMD is : {smd.name}
                </h3>
            </>
            :
            <>            
            <h3>
            Your SMD are: You have rights for all SMD's
                </h3>
            </>
          }             
          </div>
        </div>   

{
  groupidd.status === 1?
  <>
    <div className='question-option'>
          <div className='group'>
            <h3>Member</h3>
           
               <small>Please Select the Member<sup style={{color: "red"}}>&nbsp;*</sup></small>
              
             <select onChange={(e)=>{groupMember(e)}}>
           <option value=''>--Select Group--</option>             
              <option value='0'>To All Discipline Member </option>
              <option value='1'>To Specific Discipline Member</option>
       
                    </select>                      
              
          </div>
        </div>   
    
<Autocomplete      
      hidden={gStatus}
      multiple      
      id="checkboxes-tags-demo"      
      options={members}
      disableCloseOnSelect
      onChange={handleMemberForPrincipelSci}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => (
           
        <li {...props}>
          <Checkbox                        
            icon={icon}           
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
            name={option.email}
          />                  
          {option.name}
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} label="Search Group Member Name" placeholder="Favorites" />
      )}
    />
  </>
  :
  groupidd.status === 2 ?
  <>
  <div className='input-field'>    
    <select name="division" onChange={(e)=>Select_Type(e)} id="smd">
    <option value=''>--Select options--</option> 
    <option value='1'>Discipline</option>                                                        
    <option value='2'>SMD</option>       
    </select>
</div>
 {
  hsubject == false && 
  <>
  <div className='question-option'>
          <div className='group'>
            <h3>Member</h3>
           
               <small>Please Select the Member<sup style={{color: "red"}}>&nbsp;*</sup></small>
              
             <select onChange={(e)=>{groupMember(e)}}>
           <option value=''>--Select Group--</option>             
              <option value='0'>To All Discipline Member</option>
              <option value='1'>To Specific Discipline Member</option>
       
                    </select>                      
              
          </div>
        </div>   
    
<Autocomplete      
      hidden={gStatus}
      multiple      
      id="checkboxes-tags-demo"      
      options={members}
      disableCloseOnSelect
      onChange={handleMemberForPrincipelSci}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => (
           
        <li {...props}>
          <Checkbox                        
            icon={icon}           
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
            name={option.email}
          />                  
          {option.name}
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} label="Search Group Member Name" placeholder="Favorites" />
      )}
    />
  </>

 }


{
  hinstitute == false && hsmd == true &&
  <>  
  <div className='input-field'>    
    <select name="division" onChange={(e)=>Select_Member(e)} id="smd">
    <option value=''>--Select Institute--</option> 
    <option value='1'>All SMD Institutes</option>                                                        
    <option value='2'>Multiple Institutes</option>
    <option value='3'>Specific Institute Member</option>   
    </select>
</div>   

  {  selectMember == 2 &&

  <div className='input-field'>
        <p>Select Institute<sup style={{color: "red"}}>&nbsp;*</sup></p>                           
        <Select        
      name='select'
      options={subject}
      labelField='name'
      valueField='name'                           
       multi                                                                                                                      
      onChange={value =>get_Instsitute(value)                              
        }
      />
        </div> }

    {
       selectMember == 3 &&
        <>
          <div className='input-field'>
         <p>Select Institute<sup style={{color: "red"}}>&nbsp;*</sup></p>
         <select name="division" onChange={(e)=>handleSubject(e)} id="smd">
         <option value=''>--Select Institute--</option> 
         {
           subject.map((data)=>             
               <option value={data._id}>{data.name}</option>
           )
         }                                                      
        
         </select>
           </div>

           <div className='input-field'>     
      <Autocomplete
      hidden={mStatus}     
      multiple      
      id="checkboxes-tags-demo"      
      options={Imembers}
      onChange={handleMember}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => (
           
        <li {...props}>
          <Checkbox                        
            icon={icon}           
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}           
            name={option.email}
          />                  
          {option.name}
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} label="Search Group Member Name" placeholder="Favorites" />
      )}
    />
    </div>

  </>

}
        </>
    }
  </>
  :
  <>
  <div className='input-field'>    
    <select name="division" onChange={(e)=>Select_Type1(e)} id="smd">
    <option value=''>--Select options--</option> 
    <option value='1'>Discipline</option>                                                        
    <option value='2'>SMD</option>       
    </select>
  </div>
  {
  hsubject == false && 
  <>
  <div className='question-option'>
          <div className='group'>
            <h3>Member<sup style={{color: "red"}}>&nbsp;*</sup></h3>
           
               <small>Please Select the Member</small>              
             <select onChange={(e)=>{groupMember(e)}}>
           <option value=''>--Select Group--</option>             
              <option value='0'>To All Discipline Member</option>
              <option value='1'>To Specific Discipline Member</option>       
              </select>          
          </div>
        </div>   
    
      <Autocomplete      
            hidden={gStatus}
            multiple      
            id="checkboxes-tags-demo"      
            options={members}
            disableCloseOnSelect
            onChange={handleMemberForPrincipelSci}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, { selected }) => (
                
              <li {...props}>
                <Checkbox                        
                  icon={icon}           
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                  name={option.email}
                />                  
                {option.name}
              </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField {...params} label="Search Group Member Name" placeholder="Favorites" />
            )}
          />
        </>

    }
    {
        hsmd == false &&
        <>        
        <div className='input-field'>    
          <select name="division" onChange={(e)=>Select_SMD(e)} id="smd">
          <option value=''>--Select --</option> 
          <option value='1'>All SMD's</option>                                                        
          <option value='2'>Multiple SMD's</option>
          <option value='3'>Specific SMD Institute</option>   
          </select>
      </div> 

            {selectSmd == 2 &&

        <div className='input-field'>
            <p>Select SMD<sup style={{color: "red"}}>&nbsp;*</sup></p>                           
            <Select        
          name='select'
          options={smd}
          labelField='name'
          valueField='name'                           
          multi                                                                                                                      
          onChange={value =>get_Smd(value)                              
            }
          />
            </div> }

          {selectSmd == 3 &&
          
          <>
          <div className='input-field'>
          <p>Select SMD<sup style={{color: "red"}}>&nbsp;*</sup></p>
          <select name="division" onChange={(e)=>handleSmd(e)} id="smd">
          <option value=''>--Select SMD--</option> 
          {
            smd1.map((data)=>             
                <option value={data._id}>{data.name}</option>
            )
          }                                                      
         
          </select>
            </div>
            {
  hinstitute == false &&
  <>  
  <div className='input-field'>    
    <select name="division" onChange={(e)=>Select_Member(e)} id="smd">
    <option value=''>--Select Institute--</option> 
    <option value='1'>All SMD Institutes</option>                                                        
    <option value='2'>Multiple Institutes</option>
    <option value='3'>Specific Institute Member</option>   
    </select>
</div>   

  {  selectMember == 2 &&

  <div className='input-field'>
        <p>Select Institute<sup style={{color: "red"}}>&nbsp;*</sup></p>                           
        <Select        
      name='select'
      options={subject}
      labelField='name'
      valueField='name'                           
       multi                                                                                                                      
      onChange={value =>get_Instsitute(value)                              
        }
      />
        </div> }

    {
       selectMember == 3 &&
        <>
          <div className='input-field'>
         <p>Select Institute<sup style={{color: "red"}}>&nbsp;*</sup></p>
         <select name="division" onChange={(e)=>handleSubject(e)} id="smd">
         <option value=''>--Select Institute--</option> 
         {
           subject.map((data)=>             
               <option value={data._id}>{data.name}</option>
           )
         }                                                      
        
         </select>
           </div>

           <div className='input-field'>     
      <Autocomplete
      hidden={mStatus}     
      multiple      
      id="checkboxes-tags-demo"      
      options={Imembers}
      onChange={handleMember}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => (
           
        <li {...props}>
          <Checkbox                        
            icon={icon}           
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}           
            name={option.email}
          />                  
          {option.name}
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} label="Search Group Member Name" placeholder="Favorites" />
      )}
    />
    </div>
  </>
}
        </>
    }

          </>  
          }
                     </>  
        

    }
        </>      

}
        <div className='question-option'>
          <div className='attachment'>
            <h3>Attach file&nbsp;(pdf,jpeg,png,mp4,mp3,mpeg extention file allowed with 10 MB size)</h3>
            <input label="File upload" type="file" name='file' onChange={handleFileChange}
              placeholder="Select file..." />
          </div>
        </div>
        {error !== "" && (
      <p style={{ color: "red", fontSize: "14px"}} >
          {error}
      </p>
      )}    
        </div>
      </div>
      <button hidden={bthidden} className='button' onClick={add_question}>
      {loading ? "Posting..." : "Post"}     
        </button>  
      </div>      
    </div>
  )
}

export default Question

