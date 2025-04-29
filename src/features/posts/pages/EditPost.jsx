import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Button, Alert
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { usePost, useUpdatePost } from '../hooks';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

import CountrySelect from '../../../components/CountrySelect';
import Spinner from '../../../components/Spinner';

const MAX_IMAGES = 5;

export default function EditPost() {
    const { id }    = useParams();
    const navigate  = useNavigate();
    const { data:post, status }  = usePost(id);
    const mut       = useUpdatePost(id);

    /* form state */
    const [title, setTitle]       = useState('');
    const [country, setCountry]   = useState(null);
    const [date, setDate]         = useState(null);
    const [err,  setErr]          = useState('');

    const filesRef = useRef([]);        // new images to upload (File[])

    /* quill setup */
    const { quill, quillRef } = useQuill({ theme:'snow' });

    /* prefill once post is loaded */
    useEffect(()=>{
        if (status!=='success' || !quill) return;
        setTitle(post.title);
        setCountry({ name:post.country, code:'', currency:'' }); // simple stub
        setDate(dayjs(post.visit_date));
        quill.clipboard.dangerouslyPasteHTML(post.content);
    },[status, post, quill]);

    /* image handler (same logic as CreatePost) */
    useEffect(()=>{
        if (!quill) return;
        quill.getModule('toolbar').addHandler('image', ()=>{
            const input=document.createElement('input');
            input.type='file'; input.accept='image/*'; input.click();
            input.onchange = ()=> {
                const file=input.files[0];
                if (!file) return;
                if (filesRef.current.length >= MAX_IMAGES) {
                    setErr(`Maximum ${MAX_IMAGES} images per post`);
                    return;
                }
                filesRef.current.push(file);
                const reader=new FileReader();
                reader.onload=e=>{
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index,'image',e.target.result);
                };
                reader.readAsDataURL(file);
            };
        });
    },[quill]);

    /* submit */
    const handleSubmit = e =>{
        e.preventDefault();
        if (!title || !country || !date) { setErr('All fields required'); return; }

        const fd = new FormData();
        fd.append('title',title);
        fd.append('content', quill.root.innerHTML);
        fd.append('country', country.name);
        fd.append('visitDate', dayjs(date).format('YYYY-MM-DD'));
        filesRef.current.forEach(f=>fd.append('images',f));

        mut.mutate(fd,{
            onSuccess:()=>navigate(`/posts/${id}`),
            onError: e=>setErr(e.response?.data?.error || 'Update failed')
        });
    };

    if (status==='loading') return <Spinner />;
    if (status==='error')   return <Alert severity="error">Post not found</Alert>;

    return (
        <Container sx={{ mt:4 }}>
            <Box sx={{ mb:2 }}>
                <Button component={RouterLink} to={`/posts/${id}`}>← Cancel</Button>
            </Box>

            <Typography variant="h4" gutterBottom>Edit Post</Typography>
            {err && <Alert severity="error" sx={{ mb:2 }}>{err}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display:'grid', gap:2 }}>
                <TextField
                    label="Title"
                    value={title}
                    onChange={e=>setTitle(e.target.value)}
                    required
                />

                <CountrySelect value={country} onChange={setCountry} />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Visit date"
                        value={date}
                        onChange={setDate}
                        format="YYYY-MM-DD"
                    />
                </LocalizationProvider>

                <Box sx={{ border:'1px solid #ccc', borderRadius:1 }}>
                    <div ref={quillRef} style={{ height:300 }}/>
                </Box>

                <Button variant="contained" type="submit" disabled={mut.isLoading}>
                    Save Changes
                </Button>
            </Box>
        </Container>
    );
}