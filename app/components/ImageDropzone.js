// components/ImageDropzone.js
"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Grid, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ImageDropzone = () => {
  const [osImages, setOsImages] = useState([]);
  const [odImages, setOdImages] = useState([]);
  const [apiResponse, setApiResponse] = useState(null); // State để lưu trữ phản hồi API

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Drop function for OS
  const onDropOs = async (acceptedFiles) => {
    const newImages = await Promise.all(
      acceptedFiles.map(async (file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(7),
        base64: await fileToBase64(file), // convert to base64
        name: file.name,
      }))
    );
    setOsImages((prev) => [...prev, ...newImages]);
  };

  // Drop function for OD
  const onDropOd = async (acceptedFiles) => {
    const newImages = await Promise.all(
      acceptedFiles.map(async (file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(7),
        base64: await fileToBase64(file), // convert to base64
        name: file.name,
      }))
    );
    setOdImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id, type) => {
    if (type === "os") {
      setOsImages((prev) => prev.filter((image) => image.id !== id));
    } else {
      setOdImages((prev) => prev.filter((image) => image.id !== id));
    }
  };

  // Prepare the request body for form submission
  const prepareFormBody = () => {
    const osFormData = osImages.map((img) => ({
      value: img.base64,
      type: "OS",
      name: img.name,
    }));

    const odFormData = odImages.map((img) => ({
      value: img.base64,
      type: "OD",
      name: img.name,
    }));

    return [...osFormData, ...odFormData];
  };

  const generateRandomNumber = () => {
    return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
  };

  // Handle form submission
  const handleSubmit = async () => {
    const formBody = prepareFormBody();
    console.log("Form Body:", formBody);
    const patientID = generateRandomNumber();
    const episodeRecordID = generateRandomNumber();

    try {
      const response = await fetch(
        `http://192.168.1.12:7001/api/v1/pipeline/${patientID}/${episodeRecordID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formBody),
        }
      );

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log("Upload successful!", jsonResponse);
        setApiResponse(jsonResponse.metadata); // Lưu phản hồi từ API vào state (metadata chứa URL hình ảnh)
      } else {
        console.error("Upload failed!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const { getRootProps: getRootPropsOs, getInputProps: getInputPropsOs } =
    useDropzone({
      onDrop: onDropOs,
      accept: "image/*",
      multiple: true,
    });

  const { getRootProps: getRootPropsOd, getInputProps: getInputPropsOd } =
    useDropzone({
      onDrop: onDropOd,
      accept: "image/*",
      multiple: true,
    });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        Upload Eye Images
      </Typography>

      <Grid container spacing={4}>
        {/* Left Eye (OS) Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Left Eye (OS)
          </Typography>

          <Box
            {...getRootPropsOs()}
            sx={{
              border: "2px dashed #90caf9",
              padding: 4,
              borderRadius: 2,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: "#e3f2fd",
              "&:hover": { bgcolor: "#bbdefb" },
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
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 3,
                  }}
                >
                  <img
                    src={img.preview}
                    alt="uploaded preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <IconButton
                    onClick={() => removeImage(img.id, "os")}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "#fff",
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      "&:hover": { bgcolor: "rgba(0, 0, 0, 0.8)" },
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
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Right Eye (OD)
          </Typography>

          <Box
            {...getRootPropsOd()}
            sx={{
              border: "2px dashed #ffcc80",
              padding: 4,
              borderRadius: 2,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: "#fff3e0",
              "&:hover": { bgcolor: "#ffe0b2" },
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
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 3,
                  }}
                >
                  <img
                    src={img.preview}
                    alt="uploaded preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <IconButton
                    onClick={() => removeImage(img.id, "od")}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "#fff",
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      "&:hover": { bgcolor: "rgba(0, 0, 0, 0.8)" },
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

      {/* Submit button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4, display: "block", mx: "auto" }}
        onClick={handleSubmit}
      >
        Submit Images
      </Button>

      {/* Hiển thị hình ảnh từ API nếu có */}
      {apiResponse && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Images from API Response
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {apiResponse.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                {item.OD?.original.url && (
                  <Box>
                    <Typography variant="body1" textAlign="center">OD Image</Typography>
                    <img
                      src={item.OD.original.url}
                      alt="OD from API"
                      style={{
                        width: "300px",
                        height: "auto",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </Box>
                )}
                {item.OS?.original.url && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" textAlign="center">OS Image</Typography>
                    <img
                      src={item.OS.original.url}
                      alt="OS from API"
                      style={{
                        width: "300px",
                        height: "auto",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ImageDropzone;
