import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePost } from '../hooks';
import { Container, Box, TextField, Button,
    Typography, Alert } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CountrySelect from '../../../components/CountrySelect';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

export default function CreatePost() {
    const nav  = useNavigate();
    const mut  = useCreatePost();

    const [title,setTitle]       = useState('');
    const [country,setCountry]   = useState(null);
    const [date,setDate]         = useState(null);
    const [err,setErr]           = useState('');
    const filesRef = useRef([]);                        // hold File objects

    // Quill setup
    const { quill, quillRef } = useQuill({ theme:'snow' });
    React.useEffect(()=>{
        if (!quill) return;
        quill.getModule('toolbar').addHandler('image', ()=>{
            const input = document.createElement('input');
            input.type='file'; input.accept='image/*';
            input.click();
            input.onchange = ()=> {
                const file = input.files[0];
                if (!file) return;
                if (filesRef.current.length>=5) {
                    setErr('Max 5 images');
                    return;
                }
                filesRef.current.push(file);
                const reader=new FileReader();
                reader.onload=e=>{
                    const range=quill.getSelection(true);
                    quill.insertEmbed(range.index,'image',e.target.result);
                };
                reader.readAsDataURL(file);
            };
        });
    },[quill]);

    const handleSubmit = e =>{
        e.preventDefault();
        if (!title || !country || !date) { setErr('All fields required'); return;}
        const fd = new FormData();
        fd.append('title',title);
        fd.append('content', quill.root.innerHTML);
        fd.append('country', country.name);
        fd.append('visitDate', dayjs(date).format('YYYY-MM-DD'));
        filesRef.current.forEach(f=>fd.append('images',f));

        mut.mutate(fd,{
            onSuccess:({id})=>nav(`/posts/${id}`),
            onError:e=>setErr(e.response?.data?.error || 'Failed')
        });
    };

    return (
        <Container sx={{ mt:4 }}>
            <Typography variant="h4" gutterBottom>New Post</Typography>
            {err && <Alert severity="error" sx={{ mb:2 }}>{err}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display:'grid', gap:2 }}>
                <TextField label="Title" value={title} onChange={e=>setTitle(e.target.value)} required/>

                <CountrySelect value={country} onChange={setCountry}/>

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
                    Publish
                </Button>
            </Box>
        </Container>
    );
}
