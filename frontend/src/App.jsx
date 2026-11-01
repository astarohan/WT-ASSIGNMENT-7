import {useEffect,useMemo,useState} from 'react';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const blank={name:'',email:'',prn:'',mobile:'',course:'B.Tech',department:'AIML',year:3};
export default function App(){
 const [rows,setRows]=useState([]),[form,setForm]=useState(blank),[edit,setEdit]=useState(null);
 const [search,setSearch]=useState(''),[course,setCourse]=useState(''),[sort,setSort]=useState('newest'),[page,setPage]=useState(1),[pages,setPages]=useState(1);
 const [msg,setMsg]=useState(''),[err,setErr]=useState(''),[loading,setLoading]=useState(false);
 const query=useMemo(()=>new URLSearchParams({search,course,sort,page:String(page),limit:'8'}),[search,course,sort,page]);
 async function load(){setLoading(true);try{const r=await fetch(`${API}/students?${query}`),j=await r.json();if(!r.ok)throw Error(j.message||'Load failed');setRows(j.data);setPages(Math.max(j.pages,1));setErr('');}catch(e){setErr(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[query.toString()]);
 const set=(k,v)=>setForm(f=>({...f,[k]:v}));
 async function submit(e){e.preventDefault();setMsg('');setErr('');try{const r=await fetch(edit?`${API}/students/${edit}`:`${API}/students`,{method:edit?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,year:Number(form.year)})}),j=await r.json();if(!r.ok)throw Error(j.errors?.join(' ')||j.message||'Request failed');setMsg(j.message);setForm(blank);setEdit(null);setPage(1);load()}catch(e){setErr(e.message)}}
 function beginEdit(s){setEdit(s._id);setForm({name:s.name,email:s.email,prn:s.prn,mobile:s.mobile,course:s.course,department:s.department||'',year:s.year||1});window.scrollTo({top:0,behavior:'smooth'})}
 async function remove(id){if(!confirm('Delete this student record?'))return;try{const r=await fetch(`${API}/students/${id}`,{method:'DELETE'}),j=await r.json();if(!r.ok)throw Error(j.message);setMsg(j.message);load()}catch(e){setErr(e.message)}}
 return <main className="wrap"><header><div><small>MIT ACADEMY OF ENGINEERING · WEB TECHNOLOGY</small><h1>Student Management</h1><p>Manage student records with MongoDB</p></div><b>MERN APPLICATION</b></header>
 <div className="stats"><article><small>Records on page</small><strong>{rows.length}</strong></article><article><small>Page</small><strong>{page} / {pages}</strong></article><article><small>Database</small><strong>MongoDB</strong></article></div>
 {msg&&<p className="notice">{msg}</p>}{err&&<p className="error">{err}</p>}
 <section><small>STUDENT DETAILS</small><h2>{edit?'Update student':'Add a student'}</h2><form onSubmit={submit} className="form">
 {['name','email','prn','mobile'].map(k=><label key={k}>{({name:'Full name',email:'Email',prn:'PRN (12 digits)',mobile:'Mobile number'})[k]}<input required value={form[k]} onChange={e=>set(k,e.target.value)} /></label>)}
 <label>Course<select value={form.course} onChange={e=>set('course',e.target.value)}>{['B.Tech','M.Tech','BCA','MCA'].map(x=><option>{x}</option>)}</select></label>
 <label>Department<input value={form.department} onChange={e=>set('department',e.target.value)}/></label>
 <label>Year<select value={form.year} onChange={e=>set('year',e.target.value)}>{[1,2,3,4,5].map(x=><option>{x}</option>)}</select></label>
 <div className="buttons"><button className="primary">{edit?'Save changes':'Add student'}</button>{edit&&<button type="button" onClick={()=>{setEdit(null);setForm(blank)}}>Cancel</button>}</div></form></section>
 <section><div className="heading"><div><small>DATABASE RECORDS</small><h2>Students</h2></div><button onClick={load}>Refresh</button></div>
 <div className="filters"><input placeholder="Search name, email or PRN" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/><select value={course} onChange={e=>{setCourse(e.target.value);setPage(1)}}><option value="">All courses</option>{['B.Tech','M.Tech','BCA','MCA'].map(x=><option>{x}</option>)}</select><select value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name_asc">Name A-Z</option><option value="name_desc">Name Z-A</option></select></div>
 <div className="scroll"><table><thead><tr><th>Student</th><th>PRN</th><th>Course</th><th>Department</th><th>Year</th><th>Actions</th></tr></thead><tbody>{rows.map(s=><tr key={s._id}><td><b>{s.name}</b><small>{s.email}</small></td><td>{s.prn}</td><td>{s.course}</td><td>{s.department}</td><td>{s.year}</td><td><button onClick={()=>beginEdit(s)}>Edit</button> <button className="del" onClick={()=>remove(s._id)}>Delete</button></td></tr>)}{!loading&&!rows.length&&<tr><td colSpan="6">No student records found.</td></tr>}</tbody></table></div>
 <div className="pager"><span>{loading?'Loading…':`Page ${page} of ${pages}`}</span><div><button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</button><button disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>Next</button></div></div></section>
 <footer>Assignment 7 · Rohan Reshi · 202401040034</footer></main>
}
