import React from 'react';
import { Grid, CardMedia } from '@mui/material';

export default function ImageGallery({ images=[] }) {
    if (!images.length) return null;
    return (
        <Grid container spacing={2} sx={{ mt:2 }}>
            {images.map(img=>(
                <Grid item xs={12} sm={6} md={4} key={img.id || img.url}>
                    <CardMedia component="img" image={img.url} sx={{ borderRadius:1 }} />
                </Grid>
            ))}
        </Grid>
    );
}
