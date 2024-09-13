// components/ImageDropzone.js
"use client"
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ImageDropzone = () => {
  const [osImages, setOsImages] = useState([]);
  const [odImages, setOdImages] = useState([]);

  // Drop function for OS
  const onDropOs = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7),
    }));
    setOsImages((prev) => [...prev, ...newImages]);
  };

  // Drop function for OD
  const onDropOd = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7),
    }));
    setOdImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id, type) => {
    if (type === 'os') {
      setOsImages((prev) => prev.filter((image) => image.id !== id));
    } else {
      setOdImages((prev) => prev.filter((image) => image.id !== id));
    }
  };

  const { getRootProps: getRootPropsOs, getInputProps: getInputPropsOs } = useDropzone({
    onDrop: onDropOs,
    accept: 'image/*',
    multiple: true,
  });

  const { getRootProps: getRootPropsOd, getInputProps: getInputPropsOd } = useDropzone({
    onDrop: onDropOd,
    accept: 'image/*',
    multiple: true,
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Upload Eye Images
      </Typography>

      {/* Left and Right Eye Sections */}
      <Grid container spacing={4}>
        {/* Left Eye (OS) Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Left Eye (OS)
          </Typography>

          <Box
            {...getRootPropsOs()}
            sx={{
              border: '2px dashed #90caf9',
              padding: 4,
              borderRadius: 2,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: '#e3f2fd',
              '&:hover': { bgcolor: '#bbdefb' },
            }}
          >
            <input {...getInputPropsOs()} />
            <Typography variant="body1" color="primary">
              Drag & drop left eye images here, or click to select files
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mt: 4 }}>
            {osImages.map((img) => (
              <Grid item xs={12} sm={6} key={img.id}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 3,
                  }}
                >
                  <img
                    src={img.preview}
                    alt="uploaded preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <IconButton
                    onClick={() => removeImage(img.id, 'os')}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: '#fff',
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right Eye (OD) Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Right Eye (OD)
          </Typography>

          <Box
            {...getRootPropsOd()}
            sx={{
              border: '2px dashed #ffcc80',
              padding: 4,
              borderRadius: 2,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: '#fff3e0',
              '&:hover': { bgcolor: '#ffe0b2' },
            }}
          >
            <input {...getInputPropsOd()} />
            <Typography variant="body1" color="primary">
              Drag & drop right eye images here, or click to select files
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mt: 4 }}>
            {odImages.map((img) => (
              <Grid item xs={12} sm={6} key={img.id}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 3,
                  }}
                >
                  <img
                    src={img.preview}
                    alt="uploaded preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <IconButton
                    onClick={() => removeImage(img.id, 'od')}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: '#fff',
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageDropzone;
